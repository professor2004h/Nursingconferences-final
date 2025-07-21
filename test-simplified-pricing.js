#!/usr/bin/env node

/**
 * Test script to verify the simplified pricing structure is working
 */

const http = require('http');

function testAPI() {
  return new Promise((resolve) => {
    console.log('🔍 Testing simplified pricing API...');
    
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
            console.log('\n📋 Registration Types with Simplified Pricing:');
            console.log('=' .repeat(60));
            
            jsonData.registrationTypes.forEach((type, index) => {
              console.log(`${index + 1}. ${type.name} (${type.category})`);
              console.log(`   💰 Base Price: $${type.price || 'Not set'}`);
              
              // Check pricing by period
              if (type.pricingByPeriod) {
                console.log(`   📅 Pricing by Period:`);
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
            console.log('=' .repeat(40));
            jsonData.pricingPeriods.forEach((period, index) => {
              const status = period.isActive ? '✅' : '❌';
              console.log(`${index + 1}. ${status} ${period.title} (${period.periodId})`);
              console.log(`   📅 ${period.startDate} to ${period.endDate}`);
            });
          }
          
          // Check active period
          if (jsonData.activePeriod) {
            console.log(`\n🎯 Current Active Period: ${jsonData.activePeriod.title} (${jsonData.activePeriod.periodId})`);
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

async function testSimplifiedPricing() {
  console.log('🧪 TESTING SIMPLIFIED PRICING STRUCTURE\n');
  console.log('=' .repeat(60));

  const result = await testAPI();
  
  console.log('\n' + '=' .repeat(60));
  console.log('📊 VERIFICATION SUMMARY:');
  console.log('=' .repeat(60));
  
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
    console.log(`✅ Active Period: ${result.activePeriod ? 'Found' : 'None'}`);
    
    // Verify simplified pricing structure
    const hasSimplifiedPricing = types.every(type => 
      typeof type.price === 'number' && 
      type.pricingByPeriod &&
      Object.values(type.pricingByPeriod).every(pricing => 
        typeof pricing.price === 'number'
      )
    );
    
    console.log(`✅ Simplified Pricing: ${hasSimplifiedPricing ? 'Implemented' : 'Not fully implemented'}`);
    
    if (hasSimplifiedPricing && types.length === 8) {
      console.log('\n🎉 SUCCESS: Simplified pricing structure is working correctly!');
      console.log('✅ All registration types have single price fields');
      console.log('✅ Pricing periods are managed separately');
      console.log('✅ No more academia/business price complexity');
    } else {
      console.log('\n⚠️  Issues detected:');
      if (!hasSimplifiedPricing) {
        console.log('- Pricing structure not fully simplified');
      }
      if (types.length !== 8) {
        console.log('- Expected 8 registration types, found', types.length);
      }
    }
  }
  
  console.log('\n' + '=' .repeat(60));
}

testSimplifiedPricing().catch(console.error);
