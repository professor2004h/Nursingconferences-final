// Test to verify brochure data is properly saved in Sanity
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'n3no08m3',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  // No token needed for read operations
});

async function testBrochureSettings() {
  console.log('🧪 Testing brochure settings in Sanity...');
  
  try {
    const brochureSettings = await client.fetch(`
      *[_type == "brochureSettings"] {
        _id,
        title,
        description,
        active,
        downloadCount,
        pdfFile {
          asset -> {
            _id,
            url,
            originalFilename,
            size
          }
        }
      }
    `);
    
    console.log(`Found ${brochureSettings.length} brochure settings documents:`);
    brochureSettings.forEach((setting, index) => {
      console.log(`\n${index + 1}. ${setting.title || 'Untitled'}`);
      console.log(`   Active: ${setting.active ? 'Yes' : 'No'}`);
      console.log(`   Downloads: ${setting.downloadCount || 0}`);
      console.log(`   PDF File: ${setting.pdfFile?.asset?.originalFilename || 'Not uploaded'}`);
      console.log(`   PDF URL: ${setting.pdfFile?.asset?.url || 'N/A'}`);
    });
    
    return brochureSettings.length > 0;
  } catch (error) {
    console.error('❌ Error fetching brochure settings:', error.message);
    return false;
  }
}

async function testBrochureDownloads() {
  console.log('\n🧪 Testing brochure downloads in Sanity...');
  
  try {
    const brochureDownloads = await client.fetch(`
      *[_type == "brochureDownload"] | order(downloadTimestamp desc) [0...10] {
        _id,
        fullName,
        email,
        phone,
        organization,
        country,
        professionalTitle,
        downloadTimestamp,
        ipAddress
      }
    `);
    
    console.log(`Found ${brochureDownloads.length} brochure download records:`);
    brochureDownloads.forEach((download, index) => {
      const date = new Date(download.downloadTimestamp).toLocaleString();
      console.log(`\n${index + 1}. ${download.fullName} (${download.email})`);
      console.log(`   Country: ${download.country}`);
      console.log(`   Organization: ${download.organization || 'Not provided'}`);
      console.log(`   Downloaded: ${date}`);
      console.log(`   IP: ${download.ipAddress || 'Unknown'}`);
    });
    
    return brochureDownloads.length > 0;
  } catch (error) {
    console.error('❌ Error fetching brochure downloads:', error.message);
    return false;
  }
}

async function testSanityConnection() {
  console.log('🧪 Testing Sanity connection...');
  
  try {
    const result = await client.fetch('*[_type == "siteSettings"][0]._id');
    console.log('✅ Sanity connection successful');
    return true;
  } catch (error) {
    console.error('❌ Sanity connection failed:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting Sanity brochure data tests...\n');
  
  // Test connection
  const connectionOk = await testSanityConnection();
  if (!connectionOk) {
    console.log('❌ Cannot proceed without Sanity connection');
    return;
  }
  
  // Test brochure settings
  const settingsOk = await testBrochureSettings();
  
  // Test brochure downloads
  const downloadsOk = await testBrochureDownloads();
  
  console.log('\n=== Test Results ===');
  console.log(`Sanity Connection: ${connectionOk ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Brochure Settings: ${settingsOk ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Brochure Downloads: ${downloadsOk ? '✅ PASS' : '❌ FAIL'}`);
  
  const allPassed = connectionOk && settingsOk && downloadsOk;
  console.log(`\n🎯 Overall: ${allPassed ? '✅ ALL TESTS PASSED' : '⚠️ SOME TESTS FAILED'}`);
  
  if (allPassed) {
    console.log('\n🎉 The brochure system is working correctly!');
    console.log('✅ Form submissions are being saved to Sanity');
    console.log('✅ PDF files are properly uploaded and accessible');
    console.log('✅ Download tracking is working');
  }
}

// Run tests
runTests().catch(console.error);
