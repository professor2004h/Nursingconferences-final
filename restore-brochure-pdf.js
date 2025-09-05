const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'n3no08m3',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: 'skIrRjdaaygkwN7mE9JXLLV8IUPfHl2phKAu0umRR5eCLYuRw4oFi4kXfh3kXa0xxHHJZcv451AY6SFMxGuLWbHUMrPjxppFxA0NAFwgrkEZggVUYPJ3jtKA76br4f07USUJMDOR1JQoS7U0vSsiJzCp8q2CwgAcHiksA7H4FrN04Vh3kC3c'
});

async function restoreBrochurePDF() {
  try {
    console.log('🔧 Restoring brochure PDF...\n');
    
    // Get all PDF assets
    const allPDFs = await client.fetch(`*[_type == "sanity.fileAsset" && mimeType == "application/pdf"] | order(_createdAt desc) [0...20] {
      _id,
      originalFilename,
      url,
      size,
      mimeType,
      _createdAt
    }`);

    // Filter out receipts manually
    const brochurePDFs = allPDFs.filter(pdf =>
      !pdf.originalFilename.toLowerCase().includes('receipt_')
    );
    
    console.log('📄 Recent brochure PDFs (excluding receipts):');
    brochurePDFs.forEach((pdf, index) => {
      console.log(`  ${index + 1}. ${pdf.originalFilename}`);
      console.log(`     Created: ${new Date(pdf._createdAt).toLocaleString()}`);
      console.log(`     Size: ${(pdf.size / 1024 / 1024).toFixed(2)} MB`);
      console.log(`     Asset ID: ${pdf._id}`);
      console.log('');
    });
    
    // Let's manually select the "Global summit on Nursing Education and Healthcare.pdf"
    // which is the main conference brochure
    let selectedPDF = brochurePDFs.find(pdf =>
      pdf.originalFilename.includes('Global summit on Nursing Education and Healthcare')
    );

    // If not found, try other brochure candidates
    if (!selectedPDF) {
      const brochureCandidates = brochurePDFs.filter(pdf =>
        pdf.originalFilename.toLowerCase().includes('global') ||
        pdf.originalFilename.toLowerCase().includes('summit') ||
        pdf.originalFilename.toLowerCase().includes('nursing') ||
        pdf.originalFilename.toLowerCase().includes('healthcare') ||
        pdf.originalFilename.toLowerCase().includes('brochure') ||
        pdf.originalFilename.toLowerCase().includes('phase')
      );

      console.log('🎯 Brochure candidates:');
      brochureCandidates.forEach((pdf, index) => {
        console.log(`  ${index + 1}. ${pdf.originalFilename} (${new Date(pdf._createdAt).toLocaleDateString()})`);
      });

      selectedPDF = brochureCandidates[0];
    }

    // If still not found, use the most recent PDF
    if (!selectedPDF) {
      selectedPDF = brochurePDFs[0];
    }
    
    if (!selectedPDF) {
      console.log('❌ No suitable PDF found!');
      return;
    }
    
    console.log(`\n🔄 Selected PDF: ${selectedPDF.originalFilename}`);
    console.log(`   Asset ID: ${selectedPDF._id}`);
    console.log(`   Size: ${(selectedPDF.size / 1024 / 1024).toFixed(2)} MB`);
    
    // Update the brochure settings with the selected PDF
    const updateData = {
      pdfFile: {
        _type: 'file',
        asset: {
          _type: 'reference',
          _ref: selectedPDF._id
        }
      },
      lastUpdated: new Date().toISOString(),
      active: true
    };
    
    console.log('\n🔄 Updating brochure settings...');
    const result = await client
      .patch('brochureSettings')
      .set(updateData)
      .commit();
    
    console.log('✅ Successfully updated brochure settings!');
    console.log(`   New PDF: ${selectedPDF.originalFilename}`);
    
    // Verify the update
    console.log('\n🔍 Verifying update...');
    const updatedSettings = await client.fetch(`*[_type == "brochureSettings" && _id == "brochureSettings"][0] {
      _id,
      title,
      pdfFile {
        asset-> {
          _id,
          originalFilename,
          url,
          size
        }
      },
      active,
      lastUpdated
    }`);
    
    if (updatedSettings && updatedSettings.pdfFile?.asset) {
      console.log('✅ Verification successful:');
      console.log(`   PDF: ${updatedSettings.pdfFile.asset.originalFilename}`);
      console.log(`   URL: ${updatedSettings.pdfFile.asset.url}`);
      console.log(`   Size: ${(updatedSettings.pdfFile.asset.size / 1024 / 1024).toFixed(2)} MB`);
      console.log(`   Active: ${updatedSettings.active}`);
      
      // Test the API endpoint
      console.log('\n🌐 Testing API endpoint...');
      try {
        const fetch = require('node-fetch');
        const response = await fetch('http://localhost:3000/api/brochure/download');
        const apiResult = await response.json();
        
        if (apiResult.success) {
          console.log('✅ API now returns:');
          console.log(`   Filename: ${apiResult.filename}`);
          console.log(`   Size: ${(apiResult.size / 1024 / 1024).toFixed(2)} MB`);
          console.log(`   Title: ${apiResult.title}`);
          
          console.log('\n🎉 SUCCESS! The brochure has been restored and the API is working!');
          console.log('🌐 You can now visit http://localhost:3000/brochure to see the updated brochure.');
        } else {
          console.log('❌ API Error:', apiResult.error);
        }
      } catch (apiError) {
        console.log('⚠️ Could not test API (install node-fetch if needed)');
        console.log('🌐 Please manually test: http://localhost:3000/api/brochure/download');
      }
      
    } else {
      console.log('❌ Verification failed - PDF not properly set');
    }
    
  } catch (error) {
    console.error('❌ Error restoring brochure PDF:', error);
  }
}

restoreBrochurePDF();
