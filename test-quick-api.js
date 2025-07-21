#!/usr/bin/env node

/**
 * Quick test of the simplified API
 */

const http = require('http');

function testQuickAPI() {
  return new Promise((resolve) => {
    console.log('🚀 Testing quick config API...');
    
    const req = http.get('http://localhost:3000/api/registration/quick-config', { timeout: 10000 }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`✅ Status: ${res.statusCode}`);
        
        if (res.statusCode === 200) {
          try {
            const jsonData = JSON.parse(data);
            console.log(`📊 Registration types: ${jsonData.registrationTypes?.length || 0}`);
            console.log(`📅 Active period: ${jsonData.activePeriod?.title || 'None'}`);
            
            if (jsonData.registrationTypes?.length > 0) {
              console.log('\n💰 Current Prices:');
              jsonData.registrationTypes.slice(0, 3).forEach(type => {
                console.log(`   ${type.name}: $${type.currentPrice}`);
              });
            }
            
            resolve(true);
          } catch (e) {
            console.log(`❌ JSON Error: ${e.message}`);
            resolve(false);
          }
        } else {
          console.log(`❌ HTTP Error: ${res.statusCode}`);
          resolve(false);
        }
      });
    });

    req.on('error', (err) => {
      console.log(`❌ Request Error: ${err.message}`);
      resolve(false);
    });

    req.on('timeout', () => {
      console.log(`⏰ Timeout`);
      req.destroy();
      resolve(false);
    });
  });
}

async function runTest() {
  console.log('🧪 TESTING QUICK API\n');
  
  const success = await testQuickAPI();
  
  if (success) {
    console.log('\n🎉 Quick API is working! Registration page should load faster now.');
  } else {
    console.log('\n❌ Quick API failed. Server might still be starting...');
  }
}

runTest();
