const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'zt8218vh',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: 'skJo4iwMzLtavnRYqibHHTzDqOJc5UJTQE9JCv066MM6vWDFE6XEZBnV2XZTzbxE8BKTawmfQhPE2ZPwrLNP7CokAwUlJN5VeQWLuUiLFeZQfyiXeDdkAShynpyk1v4jWmcNAZDvph2QCuCFcJko5q0XAf123nDHp9VF4oRr7NnJh1NkEa6V'
});

async function checkPDFAssets() {
  try {
    console.log('🔍 Checking for PDF assets in Sanity...\n');
    
    // Get all PDF file assets
    const pdfAssets = await client.fetch(`*[_type == "sanity.fileAsset" && mimeType == "application/pdf"] | order(_createdAt desc) {
      _id,
      originalFilename,
      url,
      size,
      mimeType,
      _createdAt,
      _updatedAt
    }`);
    
    console.log(`Found ${pdfAssets.length} PDF assets:`);
    pdfAssets.forEach((asset, index) => {
      console.log(`\n📄 PDF ${index + 1}:`);
      console.log(`  ID: ${asset._id}`);
      console.log(`  Filename: ${asset.originalFilename}`);
      console.log(`  URL: ${asset.url}`);
      console.log(`  Size: ${asset.size} bytes`);
      console.log(`  Created: ${asset._createdAt}`);
      console.log(`  Updated: ${asset._updatedAt}`);
    });
    
    if (pdfAssets.length > 0) {
      console.log('\n🔧 Available PDFs to restore:');
      pdfAssets.forEach((asset, index) => {
        console.log(`  ${index + 1}. ${asset.originalFilename} (${new Date(asset._createdAt).toLocaleDateString()})`);
      });
      
      // Show the most recent PDF
      const mostRecent = pdfAssets[0];
      console.log(`\n📋 Most recent PDF: ${mostRecent.originalFilename}`);
      console.log(`   Created: ${mostRecent._createdAt}`);
      console.log(`   Asset ID: ${mostRecent._id}`);
      
      console.log('\n💡 To restore a PDF to the brochure settings, you can:');
      console.log('1. Go to Sanity Studio and manually select the PDF');
      console.log('2. Or use the restore script (if we create one)');
    } else {
      console.log('\n❌ No PDF assets found in Sanity!');
      console.log('You need to upload a PDF file first.');
    }
    
  } catch (error) {
    console.error('❌ Error checking PDF assets:', error);
  }
}

checkPDFAssets();
