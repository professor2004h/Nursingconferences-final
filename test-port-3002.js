#!/usr/bin/env node

const http = require('http');

function testAPI(port, endpoint) {
  return new Promise((resolve) => {
    console.log(`🔍 Testing http://localhost:${port}${endpoint}...`);
    
    const req = http.get(`http://localhost:${port}${endpoint}`, { timeout: 10000 }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`✅ Status: ${res.statusCode}, Length: ${data.length}`);
        
        if (endpoint.includes('dynamic-config') && res.statusCode === 200) {
          try {
            const jsonData = JSON.parse(data);
            console.log(`📊 Registration types: ${jsonData.registrationTypes?.length || 0}`);
            console.log(`📅 Active period: ${jsonData.activePeriod?.title || 'None'}`);
          } catch (e) {
            console.log(`⚠️  JSON parse error: ${e.message}`);
          }
        }
        
        resolve(res.statusCode === 200);
      });
    });

    req.on('error', (err) => {
      console.log(`❌ Error: ${err.message}`);
      resolve(false);
    });

    req.on('timeout', () => {
      console.log(`⏰ Timeout`);
      req.destroy();
      resolve(false);
    });
  });
}

async function runTests() {
  console.log('🧪 TESTING NEXT.JS SERVER ON PORT 3002\n');
  
  const tests = [
    { port: 3002, endpoint: '/api/test' },
    { port: 3002, endpoint: '/api/registration/dynamic-config' },
    { port: 3002, endpoint: '/registration' }
  ];
  
  for (const test of tests) {
    const success = await testAPI(test.port, test.endpoint);
    console.log('');
  }
  
  console.log('🎉 If all tests passed, the registration page should be working on http://localhost:3002/registration');
}

runTests();
