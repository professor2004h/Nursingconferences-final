#!/usr/bin/env node

const http = require('http');

function testAPI() {
  return new Promise((resolve) => {
    console.log('🔍 Testing full API response...\n');
    
    const req = http.get('http://localhost:3001/api/registration/dynamic-config', { timeout: 15000 }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`✅ API Status: ${res.statusCode}\n`);
        
        if (res.statusCode === 200) {
          try {
            const jsonData = JSON.parse(data);
            
            console.log('📊 API RESPONSE STRUCTURE:');
            console.log('=' .repeat(50));
            console.log(`Registration Types: ${jsonData.registrationTypes?.length || 0}`);
            console.log(`Pricing Periods: ${jsonData.pricingPeriods?.length || 0}`);
            console.log(`Sponsorship Tiers: ${jsonData.sponsorshipTiers?.length || 0}`);
            console.log(`Accommodation Options: ${jsonData.accommodationOptions?.length || 0}`);
            console.log(`Active Period: ${jsonData.activePeriod?.title || 'None'}`);
            
            if (jsonData.sponsorshipTiers && jsonData.sponsorshipTiers.length > 0) {
              console.log('\n🏆 SPONSORSHIP TIERS:');
              console.log('=' .repeat(50));
              jsonData.sponsorshipTiers.forEach((tier, index) => {
                console.log(`${index + 1}. ${tier.tierName} (${tier.tierLevel})`);
                console.log(`   Price: $${tier.price}`);
                console.log(`   Active: ${tier.isActive}`);
              });
            }
            
            if (jsonData.accommodationOptions && jsonData.accommodationOptions.length > 0) {
              console.log('\n🏨 ACCOMMODATION OPTIONS:');
              console.log('=' .repeat(50));
              jsonData.accommodationOptions.forEach((hotel, index) => {
                console.log(`${index + 1}. ${hotel.hotelName} (${hotel.hotelCategory})`);
                console.log(`   Rooms: ${hotel.roomOptions?.length || 0} types`);
                console.log(`   Packages: ${hotel.packageOptions?.length || 0} options`);
                console.log(`   Active: ${hotel.isActive}`);
                
                if (hotel.roomOptions && hotel.roomOptions.length > 0) {
                  console.log('   Room Types:');
                  hotel.roomOptions.forEach(room => {
                    console.log(`     - ${room.roomType}: $${room.pricePerNight}/night`);
                  });
                }
              });
            }
            
            resolve({
              success: true,
              registrationTypes: jsonData.registrationTypes?.length || 0,
              sponsorshipTiers: jsonData.sponsorshipTiers?.length || 0,
              accommodationOptions: jsonData.accommodationOptions?.length || 0,
              activePeriod: jsonData.activePeriod?.title || 'None'
            });
          } catch (e) {
            console.log(`❌ JSON Parse Error: ${e.message}`);
            resolve({ success: false, error: e.message });
          }
        } else {
          console.log(`❌ HTTP Error: ${res.statusCode}`);
          resolve({ success: false, error: `HTTP ${res.statusCode}` });
        }
      });
    });

    req.on('error', (err) => {
      console.log(`❌ Request Error: ${err.message}`);
      resolve({ success: false, error: err.message });
    });

    req.on('timeout', () => {
      console.log(`⏰ Request Timeout`);
      req.destroy();
      resolve({ success: false, error: 'Timeout' });
    });
  });
}

async function runTest() {
  const result = await testAPI();
  
  console.log('\n' + '=' .repeat(60));
  console.log('📊 SUMMARY:');
  console.log('=' .repeat(60));
  
  if (result.success) {
    console.log('🎉 API is working correctly!');
    console.log(`✅ Registration Types: ${result.registrationTypes}`);
    console.log(`✅ Sponsorship Tiers: ${result.sponsorshipTiers}`);
    console.log(`✅ Accommodation Options: ${result.accommodationOptions}`);
    console.log(`✅ Active Period: ${result.activePeriod}`);
    
    if (result.sponsorshipTiers === 0) {
      console.log('⚠️  No sponsorship tiers found - check Sanity CMS');
    }
    if (result.accommodationOptions === 0) {
      console.log('⚠️  No accommodation options found - check Sanity CMS');
    }
  } else {
    console.log(`❌ API Error: ${result.error}`);
  }
}

runTest();
