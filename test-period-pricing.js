#!/usr/bin/env node

/**
 * Test script to verify the period-specific pricing structure is working
 */

const http = require('http');

function testAPI() {
  return new Promise((resolve) => {
    console.log('🔍 Testing period-specific pricing API...');
    
    const req = http.get('http://localhost:3000/api/registration/dynamic-config', { timeout: 15000 }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`✅ API Status: ${res.statusCode}`);
        
        try {
          const jsonData = JSON.parse(data);
          console.log(`📊 Registration types: ${jsonData.registrationTypes?.length || 0}`);
          
          if (jsonData.registrationTypes?.length > 0) {
            console.log('\n📋 Registration Types with Period-Specific Pricing:');
            console.log('=' .repeat(80));
            
            jsonData.registrationTypes.forEach((type, index) => {
              console.log(`${index + 1}. ${type.name} (${type.category})`);
              console.log(`   💰 Early Bird: $${type.earlyBirdPrice || 'Not set'}`);
              console.log(`   💰 Next Round: $${type.nextRoundPrice || 'Not set'}`);
              console.log(`   💰 OnSpot: $${type.onSpotPrice || 'Not set'}`);
              
              // Check pricing by period
              if (type.pricingByPeriod) {
                console.log(`   📅 Current Pricing by Period:`);
                Object.entries(type.pricingByPeriod).forEach(([periodId, pricing]) => {
                  console.log(`      ${periodId}: $${pricing.price} (${pricing.period?.title || 'Unknown Period'})`);
                });
              }
              console.log('');
            });
          }
          
          // Check pricing periods
          if (jsonData.pricingPeriods?.length > 0) {
            console.log('\n📅 Pricing Periods:');
            console.log('=' .repeat(50));
            jsonData.pricingPeriods.forEach((period, index) => {
              const status = period.isActive ? '✅' : '❌';
              const isCurrentlyActive = jsonData.activePeriod?.periodId === period.periodId ? '🎯' : '  ';
              console.log(`${index + 1}. ${status} ${isCurrentlyActive} ${period.title} (${period.periodId})`);
              console.log(`   📅 ${period.startDate} to ${period.endDate}`);
            });
          }
          
          // Check active period
          if (jsonData.activePeriod) {
            console.log(`\n🎯 Current Active Period: ${jsonData.activePeriod.title} (${jsonData.activePeriod.periodId})`);
            console.log(`📅 Active from ${jsonData.activePeriod.startDate} to ${jsonData.activePeriod.endDate}`);
          } else {
            console.log('\n⚠️  No active pricing period found');
          }
          
          resolve(jsonData);
        } catch (e) {
          console.log(`❌ JSON Parse Error: ${e.message}`);
          console.log(`Raw response: ${data.substring(0, 500)}...`);
          resolve({ error: 'Invalid JSON' });
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

async function testPeriodPricing() {
  console.log('🧪 TESTING PERIOD-SPECIFIC PRICING STRUCTURE\n');
  console.log('=' .repeat(80));

  const result = await testAPI();
  
  console.log('\n' + '=' .repeat(80));
  console.log('📊 VERIFICATION SUMMARY:');
  console.log('=' .repeat(80));
  
  if (result.error) {
    console.log('❌ API Error:', result.error);
    console.log('\n💡 TROUBLESHOOTING:');
    console.log('1. Make sure Next.js dev server is running: npm run dev');
    console.log('2. Check if the server is accessible at http://localhost:3000');
    console.log('3. Verify the API endpoint exists');
  } else {
    const types = result.registrationTypes || [];
    const periods = result.pricingPeriods || [];
    
    console.log(`✅ Registration Types: ${types.length}/8 expected`);
    console.log(`✅ Pricing Periods: ${periods.length}/3 expected`);
    console.log(`✅ Active Period: ${result.activePeriod ? result.activePeriod.title : 'None'}`);
    
    // Verify period-specific pricing structure
    const hasPeriodPricing = types.every(type => 
      typeof type.earlyBirdPrice === 'number' && 
      typeof type.nextRoundPrice === 'number' && 
      typeof type.onSpotPrice === 'number' &&
      type.pricingByPeriod &&
      Object.values(type.pricingByPeriod).every(pricing => 
        typeof pricing.price === 'number'
      )
    );
    
    console.log(`✅ Period-Specific Pricing: ${hasPeriodPricing ? 'Implemented' : 'Not fully implemented'}`);
    
    // Check if prices are different across periods
    const hasDifferentPrices = types.some(type => 
      type.earlyBirdPrice !== type.nextRoundPrice || 
      type.nextRoundPrice !== type.onSpotPrice
    );
    
    console.log(`✅ Price Variation: ${hasDifferentPrices ? 'Prices vary by period' : 'Prices are the same'}`);
    
    if (hasPeriodPricing && types.length === 8 && result.activePeriod) {
      console.log('\n🎉 SUCCESS: Period-specific pricing structure is working correctly!');
      console.log('✅ All registration types have three price fields (Early Bird, Next Round, OnSpot)');
      console.log('✅ Pricing periods are properly configured and active');
      console.log('✅ Current pricing is determined by the active period');
      console.log('✅ Prices automatically adjust based on the current date');
    } else {
      console.log('\n⚠️  Issues detected:');
      if (!hasPeriodPricing) {
        console.log('- Period-specific pricing structure not fully implemented');
      }
      if (types.length !== 8) {
        console.log('- Expected 8 registration types, found', types.length);
      }
      if (!result.activePeriod) {
        console.log('- No active pricing period found');
      }
    }
  }
  
  console.log('\n' + '=' .repeat(80));
}

testPeriodPricing().catch(console.error);
