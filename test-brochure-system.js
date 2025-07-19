// Comprehensive test for the brochure download system
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'n3no08m3',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN,
});

async function testSanitySchemas() {
  console.log('🧪 Testing Sanity schemas...');
  
  try {
    // Test brochureSettings schema
    console.log('📄 Testing brochureSettings schema...');
    const brochureSettings = await client.fetch('*[_type == "brochureSettings"]');
    console.log(`✅ Found ${brochureSettings.length} brochure settings documents`);
    
    // Test brochureDownload schema
    console.log('📊 Testing brochureDownload schema...');
    const brochureDownloads = await client.fetch('*[_type == "brochureDownload"]');
    console.log(`✅ Found ${brochureDownloads.length} brochure download documents`);
    
    return true;
  } catch (error) {
    console.error('❌ Sanity schema test failed:', error.message);
    return false;
  }
}

async function testBrochureAPI() {
  console.log('🧪 Testing brochure API endpoints...');
  
  const testData = {
    fullName: 'Test User',
    email: 'test@example.com',
    phone: '+1234567890',
    organization: 'Test Hospital',
    country: 'US',
    professionalTitle: 'Nurse Manager'
  };
  
  try {
    // Test form submission
    console.log('📝 Testing form submission...');
    const submitResponse = await fetch('http://localhost:3000/api/brochure/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });
    
    if (!submitResponse.ok) {
      throw new Error(`Submit API failed: ${submitResponse.status}`);
    }
    
    const submitResult = await submitResponse.json();
    console.log('✅ Form submission successful:', submitResult.message);
    
    // Test download endpoint
    console.log('📥 Testing download endpoint...');
    const downloadResponse = await fetch('http://localhost:3000/api/brochure/download');
    
    if (!downloadResponse.ok) {
      throw new Error(`Download API failed: ${downloadResponse.status}`);
    }
    
    const downloadResult = await downloadResponse.json();
    console.log('✅ Download endpoint successful:', downloadResult.title);
    
    return true;
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    return false;
  }
}

async function testFrontendPage() {
  console.log('🧪 Testing frontend brochure page...');
  
  try {
    const response = await fetch('http://localhost:3000/brochure');
    
    if (!response.ok) {
      throw new Error(`Frontend page failed: ${response.status}`);
    }
    
    const html = await response.text();
    
    // Check for key elements
    const checks = [
      { name: 'Page title', test: html.includes('Download Conference Brochure') },
      { name: 'Form elements', test: html.includes('Full Name') && html.includes('Email Address') },
      { name: 'Country dropdown', test: html.includes('Select your country') },
      { name: 'Submit button', test: html.includes('Submit & Download Brochure') }
    ];
    
    let allPassed = true;
    checks.forEach(check => {
      if (check.test) {
        console.log(`✅ ${check.name} found`);
      } else {
        console.log(`❌ ${check.name} missing`);
        allPassed = false;
      }
    });
    
    return allPassed;
  } catch (error) {
    console.error('❌ Frontend test failed:', error.message);
    return false;
  }
}

async function createTestBrochureSettings() {
  console.log('🧪 Creating test brochure settings...');
  
  try {
    const testSettings = {
      _type: 'brochureSettings',
      title: 'Test Conference Brochure',
      description: 'This is a test brochure for the conference system.',
      active: true,
      downloadCount: 0,
      lastUpdated: new Date().toISOString(),
    };
    
    const result = await client.create(testSettings);
    console.log('✅ Test brochure settings created:', result._id);
    return result._id;
  } catch (error) {
    console.error('❌ Failed to create test settings:', error.message);
    return null;
  }
}

async function runAllTests() {
  console.log('🚀 Starting comprehensive brochure system tests...\n');
  
  const results = {
    schemas: false,
    api: false,
    frontend: false,
    overall: false
  };
  
  // Test 1: Sanity Schemas
  console.log('=== Test 1: Sanity Schemas ===');
  results.schemas = await testSanitySchemas();
  console.log('');
  
  // Create test data if needed
  if (results.schemas) {
    await createTestBrochureSettings();
    console.log('');
  }
  
  // Test 2: API Endpoints
  console.log('=== Test 2: API Endpoints ===');
  results.api = await testBrochureAPI();
  console.log('');
  
  // Test 3: Frontend Page
  console.log('=== Test 3: Frontend Page ===');
  results.frontend = await testFrontendPage();
  console.log('');
  
  // Overall Results
  console.log('=== Test Results Summary ===');
  console.log(`Sanity Schemas: ${results.schemas ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`API Endpoints: ${results.api ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Frontend Page: ${results.frontend ? '✅ PASS' : '❌ FAIL'}`);
  
  results.overall = results.schemas && results.api && results.frontend;
  console.log(`\n🎯 Overall System: ${results.overall ? '✅ PASS' : '❌ FAIL'}`);
  
  if (results.overall) {
    console.log('\n🎉 All tests passed! The brochure system is working correctly.');
    console.log('\n📋 Next Steps:');
    console.log('1. Upload a PDF file in Sanity Studio → Brochure Settings');
    console.log('2. Test the complete download flow on /brochure page');
    console.log('3. Check download submissions in Sanity Studio → Brochure Downloads');
  } else {
    console.log('\n⚠️ Some tests failed. Please check the errors above and fix the issues.');
  }
  
  return results;
}

// Run tests if this script is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { runAllTests, testSanitySchemas, testBrochureAPI, testFrontendPage };
