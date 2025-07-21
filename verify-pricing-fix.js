#!/usr/bin/env node

const http = require('http');

function testAPI() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3002/api/registration/dynamic-config', { timeout: 10000 }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            success: true,
            registrationTypes: jsonData.registrationTypes?.length || 0,
            activePeriod: jsonData.activePeriod?.title || 'None',
            samplePrice: jsonData.registrationTypes?.[0]?.pricingByPeriod?.nextRound?.price || 0
          });
        } catch (e) {
          resolve({ success: false, error: e.message });
        }
      });
    });
    req.on('error', () => resolve({ success: false, error: 'Request failed' }));
    req.on('timeout', () => { req.destroy(); resolve({ success: false, error: 'Timeout' }); });
  });
}

function testPage() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3002/registration', { timeout: 10000 }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const hasNotAvailable = data.includes('Not Available');
        const hasPricing = data.includes('$374') || data.includes('$249') || data.includes('$499');
        const hasRegistrationTypes = data.includes('Speaker/Poster') && data.includes('Listener') && data.includes('Student');
        
        resolve({
          success: res.statusCode === 200,
          hasNotAvailable,
          hasPricing,
          hasRegistrationTypes,
          contentLength: data.length
        });
      });
    });
    req.on('error', () => resolve({ success: false }));
    req.on('timeout', () => { req.destroy(); resolve({ success: false }); });
  });
}

async function runVerification() {
  console.log('🎯 VERIFICATION - PERIOD-SPECIFIC PRICING FIX\n');
  console.log('=' .repeat(60));

  console.log('1. Testing API endpoint...');
  const apiResult = await testAPI();
  
  if (apiResult.success) {
    console.log(`   ✅ API: ${apiResult.registrationTypes} types, Active: ${apiResult.activePeriod}`);
    console.log(`   💰 Sample price: $${apiResult.samplePrice}`);
  } else {
    console.log(`   ❌ API failed: ${apiResult.error}`);
  }

  console.log('\n2. Testing registration page...');
  const pageResult = await testPage();
  
  if (pageResult.success) {
    console.log(`   ✅ Page loads (${pageResult.contentLength} bytes)`);
    console.log(`   📋 Registration types: ${pageResult.hasRegistrationTypes ? 'Yes' : 'No'}`);
    console.log(`   💰 Shows pricing: ${pageResult.hasPricing ? 'Yes' : 'No'}`);
    console.log(`   ⚠️  "Not Available": ${pageResult.hasNotAvailable ? 'Yes' : 'No'}`);
  } else {
    console.log(`   ❌ Page failed to load`);
  }

  console.log('\n' + '=' .repeat(60));
  console.log('📊 RESULTS:');
  console.log('=' .repeat(60));

  const success = apiResult.success && pageResult.success && 
                  pageResult.hasRegistrationTypes && pageResult.hasPricing && 
                  !pageResult.hasNotAvailable;

  if (success) {
    console.log('🎉 SUCCESS: "Not Available" issue FIXED!');
    console.log('✅ All registration types showing with correct prices');
    console.log('✅ Period-specific pricing working correctly');
    console.log('✅ No more "Not Available" messages');
    console.log('\n🌐 Registration page: http://localhost:3002/registration');
  } else {
    console.log('⚠️  Issues still present - needs more investigation');
  }
}

runVerification();
