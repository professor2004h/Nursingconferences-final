// Test script for registration form functionality
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testAPI(endpoint, description) {
  try {
    console.log(`\n🧪 Testing ${description}...`);
    const response = await fetch(`${BASE_URL}${endpoint}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ ${description} - SUCCESS`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Data length: ${Array.isArray(data) ? data.length : 'N/A'} items`);
      
      if (Array.isArray(data) && data.length > 0) {
        console.log(`   Sample item keys: ${Object.keys(data[0]).join(', ')}`);
      }
      
      return { success: true, data };
    } else {
      console.log(`❌ ${description} - FAILED`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Error: ${response.statusText}`);
      return { success: false, error: response.statusText };
    }
  } catch (error) {
    console.log(`❌ ${description} - ERROR`);
    console.log(`   Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testRegistrationSubmission() {
  try {
    console.log(`\n🧪 Testing Registration Submission...`);
    
    const testData = {
      title: 'Dr',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '+1234567890',
      country: 'United States',
      abstractCategory: 'Poster',
      fullPostalAddress: '123 Main Street, City, State, 12345',
      selectedRegistration: 'delegate_academia',
      sponsorType: '',
      accommodationType: '',
      numberOfParticipants: 1,
      registrationFee: 899,
      accommodationFee: 0,
      totalPrice: 899,
      pricingPeriod: 'spotRegistration'
    };

    const response = await fetch(`${BASE_URL}/api/registration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    if (response.ok) {
      const result = await response.json();
      console.log(`✅ Registration Submission - SUCCESS`);
      console.log(`   Registration ID: ${result.registrationId}`);
      console.log(`   Status: ${response.status}`);
      return { success: true, data: result };
    } else {
      const error = await response.text();
      console.log(`❌ Registration Submission - FAILED`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Error: ${error}`);
      return { success: false, error };
    }
  } catch (error) {
    console.log(`❌ Registration Submission - ERROR`);
    console.log(`   Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runAllTests() {
  console.log('🚀 Starting Registration Form API Tests...\n');
  console.log('=' .repeat(60));

  const tests = [
    { endpoint: '/api/registration/sponsorship-tiers', description: 'Sponsorship Tiers API' },
    { endpoint: '/api/registration/types', description: 'Registration Types API' },
    { endpoint: '/api/registration/accommodation', description: 'Accommodation Options API' }
  ];

  const results = [];

  // Test all GET endpoints
  for (const test of tests) {
    const result = await testAPI(test.endpoint, test.description);
    results.push({ ...test, result });
  }

  // Test registration submission
  const submissionResult = await testRegistrationSubmission();
  results.push({ endpoint: '/api/registration', description: 'Registration Submission', result: submissionResult });

  // Summary
  console.log('\n' + '=' .repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('=' .repeat(60));

  const successful = results.filter(r => r.result.success).length;
  const total = results.length;

  console.log(`\n✅ Successful: ${successful}/${total}`);
  console.log(`❌ Failed: ${total - successful}/${total}`);

  results.forEach(test => {
    const status = test.result.success ? '✅' : '❌';
    console.log(`${status} ${test.description}`);
  });

  if (successful === total) {
    console.log('\n🎉 ALL TESTS PASSED! Registration form is fully functional.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the errors above.');
  }

  console.log('\n' + '=' .repeat(60));
}

// Run tests
runAllTests().catch(console.error);
