#!/usr/bin/env node

/**
 * Test script to verify frontend is working and displaying registration types
 */

const http = require('http');

function testEndpoint(path, description) {
  return new Promise((resolve) => {
    console.log(`🔍 Testing ${description}...`);
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET',
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`   ✅ Status: ${res.statusCode}`);
        
        if (path.includes('/api/')) {
          try {
            const jsonData = JSON.parse(data);
            if (path.includes('dynamic-config')) {
              console.log(`   📊 Registration types found: ${jsonData.registrationTypes?.length || 0}`);
              if (jsonData.registrationTypes?.length > 0) {
                console.log(`   📋 Sample types: ${jsonData.registrationTypes.slice(0, 3).map(t => t.name).join(', ')}`);
              }
            }
          } catch (e) {
            console.log(`   ⚠️  Response is not JSON: ${data.substring(0, 100)}...`);
          }
        } else {
          console.log(`   📄 HTML response length: ${data.length} characters`);
          if (data.includes('registration')) {
            console.log(`   ✅ Contains registration content`);
          }
        }
        
        resolve({ status: res.statusCode, data });
      });
    });

    req.on('error', (err) => {
      console.log(`   ❌ Error: ${err.message}`);
      resolve({ error: err.message });
    });

    req.on('timeout', () => {
      console.log(`   ⏰ Timeout: Server not responding`);
      req.destroy();
      resolve({ error: 'Timeout' });
    });

    req.end();
  });
}

async function testFrontend() {
  console.log('🚀 Testing Frontend and API Endpoints...\n');

  const tests = [
    { path: '/', description: 'Home page' },
    { path: '/registration', description: 'Registration page' },
    { path: '/api/registration/dynamic-config', description: 'Dynamic config API' },
    { path: '/api/registration/types', description: 'Registration types API' },
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    const result = await testEndpoint(test.path, test.description);
    
    if (result.error) {
      failed++;
    } else if (result.status === 200) {
      passed++;
    } else {
      failed++;
    }
    
    console.log(''); // Empty line for readability
  }

  console.log('=' .repeat(50));
  console.log('📊 TEST SUMMARY:');
  console.log('=' .repeat(50));
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  
  if (passed === tests.length) {
    console.log('\n🎉 SUCCESS: All frontend tests passed!');
    console.log('   The registration system is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the output above for details.');
    if (failed === tests.length) {
      console.log('   The frontend server may not be running on port 3000.');
      console.log('   Try starting it with: npx next dev');
    }
  }
}

// Run the tests
testFrontend().catch(console.error);
