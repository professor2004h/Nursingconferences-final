const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'n3no08m3',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: 'skIrRjdaaygkwN7mE9JXLLV8IUPfHl2phKAu0umRR5eCLYuRw4oFi4kXfh3kXa0xxHHJZcv451AY6SFMxGuLWbHUMrPjxppFxA0NAFwgrkEZggVUYPJ3jtKA76br4f07USUJMDOR1JQoS7U0vSsiJzCp8q2CwgAcHiksA7H4FrN04Vh3kC3c'
});

async function fixBrochurePDF() {
  try {
    console.log('🔧 Fixing brochure PDF configuration...\n');

    // Get all documents
    const allDocs = await client.fetch(`*[_type == "brochureSettings"] {
      _id,
      title,
      description,
      pdfFile {
        asset-> {
          _id,
          url,
          originalFilename,
          size,
          mimeType
        }
      },
      downloadCount,
      lastUpdated,
      active
    }`);

    console.log(`Found ${allDocs.length} brochure settings documents:`);
    allDocs.forEach((doc, index) => {
      console.log(`  ${index + 1}. ID: ${doc._id}`);
      console.log(`     PDF: ${doc.pdfFile?.asset?.originalFilename || 'No PDF'}`);
      console.log(`     Downloads: ${doc.downloadCount || 0}`);
      console.log(`     Last Updated: ${doc.lastUpdated}`);
      console.log(`     Active: ${doc.active}`);
      console.log('');
    });

    const singletonDoc = allDocs.find(doc => doc._id === 'brochureSettings');
    const duplicateDocs = allDocs.filter(doc => doc._id !== 'brochureSettings');

    if (!singletonDoc) {
      console.log('❌ No singleton document found with ID "brochureSettings"');
      return;
    }

    console.log('📋 Current singleton document:');
    console.log(`  PDF: ${singletonDoc.pdfFile?.asset?.originalFilename || 'No PDF'}`);
    console.log(`  Downloads: ${singletonDoc.downloadCount || 0}`);
    console.log(`  Last Updated: ${singletonDoc.lastUpdated}`);

    // Ask which document has the correct/newest brochure
    console.log('\n🤔 Which document has the NEWEST/CORRECT brochure you want to use?');
    duplicateDocs.forEach((doc, index) => {
      console.log(`  ${index + 1}. ${doc._id}`);
      console.log(`     PDF: ${doc.pdfFile?.asset?.originalFilename || 'No PDF'}`);
      console.log(`     Downloads: ${doc.downloadCount || 0}`);
      console.log(`     Last Updated: ${doc.lastUpdated}`);
    });

    // For now, let's assume the document with the most recent update has the correct PDF
    const mostRecentDoc = duplicateDocs.reduce((latest, current) => {
      return new Date(current.lastUpdated) > new Date(latest.lastUpdated) ? current : latest;
    }, duplicateDocs[0]);

    if (mostRecentDoc && mostRecentDoc.pdfFile?.asset) {
      console.log(`\n🔄 Using most recent document: ${mostRecentDoc._id}`);
      console.log(`   PDF: ${mostRecentDoc.pdfFile.asset.originalFilename}`);
      console.log(`   Updated: ${mostRecentDoc.lastUpdated}`);

      // Update the singleton document
      const updateData = {
        pdfFile: mostRecentDoc.pdfFile,
        downloadCount: (mostRecentDoc.downloadCount || 0) + (singletonDoc.downloadCount || 0),
        lastUpdated: new Date().toISOString(),
        active: true
      };

      console.log('\n🔄 Updating singleton document...');
      const result = await client
        .patch('brochureSettings')
        .set(updateData)
        .commit();

      console.log('✅ Successfully updated singleton document');
      console.log(`New PDF: ${mostRecentDoc.pdfFile.asset.originalFilename}`);
      console.log(`Combined downloads: ${updateData.downloadCount}`);

      // Delete duplicate documents
      console.log('\n🗑️ Cleaning up duplicate documents...');
      for (const doc of duplicateDocs) {
        try {
          await client.delete(doc._id);
          console.log(`✅ Deleted: ${doc._id}`);
        } catch (error) {
          console.error(`❌ Failed to delete ${doc._id}:`, error);
        }
      }

      console.log('\n🎉 Brochure PDF fix completed!');
      console.log('The singleton document now has the newest PDF and duplicates have been removed.');
      console.log('\n🔄 Testing the API endpoint...');

      // Test the API endpoint
      try {
        const fetch = require('node-fetch');
        const response = await fetch('http://localhost:3000/api/brochure/download');
        const apiResult = await response.json();

        if (apiResult.success) {
          console.log('✅ API now returns:');
          console.log(`  Filename: ${apiResult.filename}`);
          console.log(`  Title: ${apiResult.title}`);
        } else {
          console.log('❌ API Error:', apiResult.error);
        }
      } catch (apiError) {
        console.log('⚠️ Could not test API (install node-fetch if needed)');
      }

    } else {
      console.log('\n⚠️ No valid PDF found in duplicate documents');
      console.log('Manual intervention may be required');
    }

  } catch (error) {
    console.error('❌ Error fixing brochure PDF:', error);
  }
}

fixBrochurePDF();
