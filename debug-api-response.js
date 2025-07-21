#!/usr/bin/env node

const http = require('http');

function testAPI() {
  return new Promise((resolve) => {
    console.log('🔍 Testing dynamic-config API response...\n');
    
    const req = http.get('http://localhost:3000/api/registration/dynamic-config', { timeout: 15000 }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`✅ API Status: ${res.statusCode}`);
        
        try {
          const jsonData = JSON.parse(data);
          
          console.log('\n📊 API RESPONSE STRUCTURE:');
          console.log('=' .repeat(50));
          console.log(`Registration Types: ${jsonData.registrationTypes?.length || 0}`);
          console.log(`Pricing Periods: ${jsonData.pricingPeriods?.length || 0}`);
          console.log(`Active Period: ${jsonData.activePeriod?.title || 'None'}`);
          
          if (jsonData.registrationTypes?.length > 0) {
            console.log('\n🎯 FIRST REGISTRATION TYPE DETAILS:');
            console.log('=' .repeat(50));
            const firstType = jsonData.registrationTypes[0];
            console.log(`Name: ${firstType.name}`);
            console.log(`Category: ${firstType.category}`);
            console.log(`Early Bird Price: $${firstType.earlyBirdPrice}`);
            console.log(`Next Round Price: $${firstType.nextRoundPrice}`);
            console.log(`OnSpot Price: $${firstType.onSpotPrice}`);
            console.log(`Is Active: ${firstType.isActive}`);
            
            console.log('\n📅 PRICING BY PERIOD:');
            if (firstType.pricingByPeriod) {
              Object.entries(firstType.pricingByPeriod).forEach(([periodId, pricing]) => {
                console.log(`   ${periodId}: $${pricing.price} (${pricing.period?.title || 'Unknown'})`);
              });
            } else {
              console.log('   ❌ No pricingByPeriod found!');
            }
          }
          
          console.log('\n🔍 ALL REGISTRATION TYPES:');
          console.log('=' .repeat(60));
          jsonData.registrationTypes?.forEach((type, index) => {
            console.log(`${index + 1}. ${type.name} (${type.category})`);
            console.log(`   Active: ${type.isActive}, Early: $${type.earlyBirdPrice}, Next: $${type.nextRoundPrice}, OnSpot: $${type.onSpotPrice}`);
            
            // Check if pricingByPeriod exists and has data
            const hasPricingByPeriod = type.pricingByPeriod && Object.keys(type.pricingByPeriod).length > 0;
            console.log(`   PricingByPeriod: ${hasPricingByPeriod ? 'Yes' : 'No'}`);
          });
          
          resolve(jsonData);
        } catch (e) {
          console.log(`❌ JSON Parse Error: ${e.message}`);
          console.log(`Raw response (first 500 chars): ${data.substring(0, 500)}...`);
          resolve(null);
        }
      });
    });

    req.on('error', (err) => {
      console.log(`❌ Request Error: ${err.message}`);
      resolve(null);
    });

    req.on('timeout', () => {
      console.log(`⏰ Request Timeout`);
      req.destroy();
      resolve(null);
    });
  });
}

testAPI().then(result => {
  if (result) {
    console.log('\n✅ API is returning data. If registration page shows "Not Available", the issue is in the frontend components.');
  } else {
    console.log('\n❌ API is not returning valid data. This could be the cause of "Not Available" messages.');
  }
});
