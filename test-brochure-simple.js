// Simple test for brochure API endpoints using built-in fetch
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

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    const result = await response.json();
    console.log('Response body:', result);
    
    if (response.ok) {
      console.log('✅ Form submission successful!');
      console.log('Download URL:', result.downloadUrl);
      return result.downloadId;
    } else {
      console.log('❌ Form submission failed:', result.error || result.message);
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
    console.log('Testing URL:', url);
    
    const response = await fetch(url);
    console.log('Response status:', response.status);
    
    const result = await response.json();
    console.log('Response body:', result);
    
    if (response.ok) {
      console.log('✅ Download endpoint successful!');
      console.log('PDF URL:', result.downloadUrl);
    } else {
      console.log('❌ Download endpoint failed:', result.error);
    }
  } catch (error) {
    console.log('❌ Error testing download endpoint:', error.message);
  }
}

async function testEnvironmentVariables() {
  console.log('🧪 Testing environment variables...');
  
  try {
    const response = await fetch('http://localhost:3000/api/brochure/submit', {
      method: 'OPTIONS'
    });
    
    console.log('OPTIONS response status:', response.status);
    console.log('CORS headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      console.log('✅ CORS configuration working');
    } else {
      console.log('❌ CORS configuration issue');
    }
  } catch (error) {
    console.log('❌ Error testing CORS:', error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting brochure API tests...\n');
  
  // Test environment and CORS
  await testEnvironmentVariables();
  console.log('');
  
  // Test form submission
  const downloadId = await testBrochureSubmit();
  console.log('');
  
  // Test download endpoint
  await testBrochureDownload(downloadId);
  console.log('');
  
  console.log('🏁 Tests completed!');
}

// Run tests
runTests().catch(console.error);
