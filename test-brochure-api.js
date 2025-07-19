// Test script for brochure API endpoints
const fetch = require('node-fetch');

const API_BASE = 'http://localhost:3000/api/brochure';

// Test data
const testFormData = {
  fullName: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1234567890',
  organization: 'Test Hospital',
  country: 'US',
  professionalTitle: 'Nurse Manager'
};

async function testBrochureSubmit() {
  console.log('🧪 Testing brochure form submission...');
  
  try {
    const response = await fetch(`${API_BASE}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testFormData),
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Form submission successful!');
      console.log('Response:', result);
      return result.downloadId;
    } else {
      console.log('❌ Form submission failed:', result.error);
      return null;
    }
  } catch (error) {
    console.log('❌ Error testing form submission:', error.message);
    return null;
  }
}

async function testBrochureDownload(downloadId) {
  console.log('🧪 Testing brochure download...');
  
  try {
    const url = downloadId ? `${API_BASE}/download?downloadId=${downloadId}` : `${API_BASE}/download`;
    const response = await fetch(url);
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Download endpoint successful!');
      console.log('Response:', result);
    } else {
      console.log('❌ Download endpoint failed:', result.error);
    }
  } catch (error) {
    console.log('❌ Error testing download endpoint:', error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting brochure API tests...\n');
  
  // Test form submission
  const downloadId = await testBrochureSubmit();
  console.log('');
  
  // Test download endpoint
  await testBrochureDownload(downloadId);
  console.log('');
  
  console.log('🏁 Tests completed!');
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testBrochureSubmit, testBrochureDownload };
