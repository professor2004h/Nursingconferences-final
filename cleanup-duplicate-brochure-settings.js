const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'n3no08m3',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: 'skIrRjdaaygkwN7mE9JXLLV8IUPfHl2phKAu0umRR5eCLYuRw4oFi4kXfh3kXa0xxHHJZcv451AY6SFMxGuLWbHUMrPjxppFxA0NAFwgrkEZggVUYPJ3jtKA76br4f07USUJMDOR1JQoS7U0vSsiJzCp8q2CwgAcHiksA7H4FrN04Vh3kC3c'
});

async function cleanupDuplicateBrochureSettings() {
  try {
    console.log('🔍 Checking for duplicate brochure settings...\n');
    
    // Get all brochure settings documents
    const allSettings = await client.fetch(`*[_type == "brochureSettings"] {
      _id,
      title,
      active,
      downloadCount,
      lastUpdated,
      pdfFile {
        asset-> {
          originalFilename
        }
      }
    }`);
    
    console.log(`Found ${allSettings.length} brochure settings documents:`);
    allSettings.forEach((setting, index) => {
      console.log(`  ${index + 1}. ID: ${setting._id}`);
      console.log(`     Title: ${setting.title}`);
      console.log(`     PDF: ${setting.pdfFile?.asset?.originalFilename || 'No PDF'}`);
      console.log(`     Downloads: ${setting.downloadCount || 0}`);
      console.log(`     Last Updated: ${setting.lastUpdated}`);
      console.log('');
    });
    
    if (allSettings.length <= 1) {
      console.log('✅ No duplicate documents found. Only one brochure settings document exists.');
      return;
    }
    
    // Find the singleton document (should be kept)
    const singletonDoc = allSettings.find(doc => doc._id === 'brochureSettings');
    const duplicateDocs = allSettings.filter(doc => doc._id !== 'brochureSettings');
    
    if (!singletonDoc) {
      console.log('⚠️ Warning: No singleton document found with ID "brochureSettings"');
      console.log('Manual intervention may be required.');
      return;
    }
    
    console.log('📋 Singleton document (will be kept):');
    console.log(`  ID: ${singletonDoc._id}`);
    console.log(`  PDF: ${singletonDoc.pdfFile?.asset?.originalFilename || 'No PDF'}`);
    
    console.log('\n🗑️ Duplicate documents (will be removed):');
    duplicateDocs.forEach((doc, index) => {
      console.log(`  ${index + 1}. ID: ${doc._id}`);
      console.log(`     PDF: ${doc.pdfFile?.asset?.originalFilename || 'No PDF'}`);
      console.log(`     Downloads: ${doc.downloadCount || 0}`);
    });
    
    // Ask for confirmation (in a real scenario, you'd want user input)
    console.log('\n⚠️ IMPORTANT: This will permanently delete the duplicate documents.');
    console.log('The singleton document with ID "brochureSettings" will be preserved.');
    console.log('If you want to proceed, uncomment the deletion code below and run again.\n');
    
    // Uncomment the following lines to actually perform the deletion:
    /*
    console.log('🗑️ Deleting duplicate documents...');
    for (const doc of duplicateDocs) {
      try {
        await client.delete(doc._id);
        console.log(`✅ Deleted document: ${doc._id}`);
      } catch (error) {
        console.error(`❌ Failed to delete document ${doc._id}:`, error);
      }
    }
    console.log('\n✅ Cleanup completed!');
    */
    
    console.log('💡 To actually delete the duplicates, uncomment the deletion code in this script.');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  }
}

cleanupDuplicateBrochureSettings();
