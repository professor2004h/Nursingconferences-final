#!/usr/bin/env node

const http = require('http');

function testRegistrationPage() {
  return new Promise((resolve) => {
    console.log('🔍 Testing registration page HTML...\n');
    
    const req = http.get('http://localhost:3002/registration', { timeout: 15000 }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`✅ Page Status: ${res.statusCode}`);
        
        if (res.statusCode === 200) {
          // Check for key elements in the HTML
          const hasRegistrationTypes = data.includes('Speaker/Poster') || data.includes('registration');
          const hasNotAvailable = data.includes('Not Available');
          const hasPricing = data.includes('$') && (data.includes('299') || data.includes('374') || data.includes('449'));
          
          console.log('\n📊 PAGE CONTENT ANALYSIS:');
          console.log('=' .repeat(50));
          console.log(`Contains registration types: ${hasRegistrationTypes ? 'Yes' : 'No'}`);
          console.log(`Contains "Not Available": ${hasNotAvailable ? 'Yes' : 'No'}`);
          console.log(`Contains pricing ($299, $374, etc.): ${hasPricing ? 'Yes' : 'No'}`);
          
          // Look for specific price patterns
          const priceMatches = data.match(/\$\d+/g);
          if (priceMatches) {
            console.log(`\n💰 PRICES FOUND: ${priceMatches.slice(0, 10).join(', ')}${priceMatches.length > 10 ? '...' : ''}`);
          }
          
          // Check for error messages
          const hasErrors = data.includes('error') || data.includes('Error') || data.includes('failed');
          console.log(`Contains errors: ${hasErrors ? 'Yes' : 'No'}`);
          
          resolve({
            status: res.statusCode,
            hasRegistrationTypes,
            hasNotAvailable,
            hasPricing,
            hasErrors,
            contentLength: data.length
          });
        } else {
          console.log(`❌ HTTP Error: ${res.statusCode}`);
          resolve({ status: res.statusCode, error: true });
        }
      });
    });

    req.on('error', (err) => {
      console.log(`❌ Request Error: ${err.message}`);
      resolve({ error: err.message });
    });

    req.on('timeout', () => {
      console.log(`⏰ Request Timeout`);
      req.destroy();
      resolve({ error: 'Timeout' });
    });
  });
}

async function runTest() {
  console.log('🧪 TESTING REGISTRATION PAGE CONTENT\n');
  
  const result = await testRegistrationPage();
  
  console.log('\n' + '=' .repeat(60));
  console.log('📊 SUMMARY:');
  console.log('=' .repeat(60));
  
  if (result.error) {
    console.log('❌ Page failed to load:', result.error);
  } else if (result.status === 200) {
    if (result.hasPricing && !result.hasNotAvailable) {
      console.log('🎉 SUCCESS: Registration page is showing prices correctly!');
    } else if (result.hasNotAvailable) {
      console.log('⚠️  ISSUE: Page still shows "Not Available" messages');
      console.log('💡 This suggests the frontend fix needs more work');
    } else if (!result.hasPricing) {
      console.log('⚠️  ISSUE: No pricing information found on page');
      console.log('💡 Check if the API data is being processed correctly');
    }
    
    console.log(`\n📄 Page loaded successfully (${result.contentLength} bytes)`);
  } else {
    console.log(`❌ HTTP Error: ${result.status}`);
  }
}

runTest();
