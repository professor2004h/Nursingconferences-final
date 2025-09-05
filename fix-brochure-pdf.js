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
    
    // Get both documents
    const duplicateDoc = await client.fetch(`*[_type == "brochureSettings" && _id == "18bb6df5-1be3-46f5-964f-aea8b78fd61e"][0] {
      _id,
      title,
      description,
      pdfFile,
      downloadCount,
      lastUpdated
    }`);
    
    const singletonDoc = await client.fetch(`*[_type == "brochureSettings" && _id == "brochureSettings"][0] {
      _id,
      title,
      description,
      pdfFile,
      downloadCount,
      lastUpdated
    }`);
    
    if (!duplicateDoc || !singletonDoc) {
      console.log('❌ Could not find both documents');
      return;
    }
    
    console.log('📋 Current state:');
    console.log(`Duplicate doc PDF: ${duplicateDoc.pdfFile?.asset?.originalFilename || 'No PDF'}`);
    console.log(`Singleton doc PDF: ${singletonDoc.pdfFile?.asset?.originalFilename || 'No PDF'}`);
    console.log(`Duplicate downloads: ${duplicateDoc.downloadCount || 0}`);
    console.log(`Singleton downloads: ${singletonDoc.downloadCount || 0}`);
    
    // Check if the duplicate has the correct brochure PDF
    if (duplicateDoc.pdfFile && duplicateDoc.pdfFile.asset) {
      console.log('\n🔄 Updating singleton document with correct PDF...');
      
      // Update the singleton document with the correct PDF and download count
      const updateData = {
        pdfFile: duplicateDoc.pdfFile,
        downloadCount: (duplicateDoc.downloadCount || 0) + (singletonDoc.downloadCount || 0),
        lastUpdated: new Date().toISOString()
      };
      
      const result = await client
        .patch('brochureSettings')
        .set(updateData)
        .commit();
      
      console.log('✅ Successfully updated singleton document');
      console.log(`New PDF: ${duplicateDoc.pdfFile.asset.originalFilename}`);
      console.log(`Combined downloads: ${updateData.downloadCount}`);
      
      // Now delete the duplicate document
      console.log('\n🗑️ Deleting duplicate document...');
      await client.delete(duplicateDoc._id);
      console.log('✅ Successfully deleted duplicate document');
      
      console.log('\n🎉 Brochure PDF fix completed!');
      console.log('The singleton document now has the correct PDF and the duplicate has been removed.');
      
    } else {
      console.log('\n⚠️ Duplicate document does not have a valid PDF file');
      console.log('Manual intervention may be required');
    }
    
  } catch (error) {
    console.error('❌ Error fixing brochure PDF:', error);
  }
}

fixBrochurePDF();
