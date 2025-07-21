#!/usr/bin/env node

/**
 * Debug script to check what's happening with the registration page
 */

const http = require('http');

function testAPI() {
  return new Promise((resolve) => {
    console.log('🔍 Testing dynamic config API...');
    
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
          console.log(`📊 Pricing periods: ${jsonData.pricingPeriods?.length || 0}`);
          console.log(`📊 Sponsorship tiers: ${jsonData.sponsorshipTiers?.length || 0}`);
          
          if (jsonData.registrationTypes?.length > 0) {
            console.log('\n📋 Registration Types Found:');
            jsonData.registrationTypes.forEach((type, index) => {
              console.log(`   ${index + 1}. ${type.name} (${type.category}) - Active: ${type.isActive}`);
            });
          }
          
          if (jsonData.error) {
            console.log(`❌ API Error: ${jsonData.error}`);
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

function testRegistrationPage() {
  return new Promise((resolve) => {
    console.log('\n🔍 Testing registration page...');
    
    const req = http.get('http://localhost:3000/registration', { timeout: 10000 }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`✅ Page Status: ${res.statusCode}`);
        console.log(`📄 Content Length: ${data.length} characters`);
        
        // Check for common issues
        if (data.includes('Error')) {
          console.log('❌ Page contains error messages');
        }
        
        if (data.includes('registration')) {
          console.log('✅ Page contains registration content');
        }
        
        if (data.includes('Loading') || data.includes('loading')) {
          console.log('⏳ Page shows loading state');
        }
        
        if (data.length < 1000) {
          console.log('⚠️  Page content seems too short, might be blank');
          console.log(`First 500 chars: ${data.substring(0, 500)}`);
        }
        
        resolve({ status: res.statusCode, length: data.length });
      });
    });

    req.on('error', (err) => {
      console.log(`❌ Page Error: ${err.message}`);
      resolve({ error: err.message });
    });

    req.on('timeout', () => {
      console.log(`⏰ Page Timeout`);
      req.destroy();
      resolve({ error: 'Timeout' });
    });
  });
}

async function debugRegistration() {
  console.log('🐛 DEBUGGING REGISTRATION PAGE ISSUE\n');
  console.log('=' .repeat(50));

  // Test API first
  const apiResult = await testAPI();
  
  // Test page
  const pageResult = await testRegistrationPage();
  
  console.log('\n' + '=' .repeat(50));
  console.log('🔍 DIAGNOSIS:');
  console.log('=' .repeat(50));
  
  if (apiResult.error) {
    console.log('❌ API Issue: The dynamic config API is not responding');
    console.log('   This could cause the registration page to be blank');
    console.log('   Solution: Check Next.js server logs for errors');
  } else if (apiResult.registrationTypes?.length === 0) {
    console.log('❌ Data Issue: No registration types returned from API');
    console.log('   This would cause the registration page to be blank');
    console.log('   Solution: Check Sanity connection and data');
  } else {
    console.log('✅ API is working and returning data');
  }
  
  if (pageResult.error) {
    console.log('❌ Page Issue: Registration page is not loading');
    console.log('   Solution: Check Next.js server status');
  } else if (pageResult.length < 1000) {
    console.log('❌ Content Issue: Page is loading but appears blank/minimal');
    console.log('   This could be a React rendering issue or API data problem');
  } else {
    console.log('✅ Page is loading with content');
  }
  
  console.log('\n💡 NEXT STEPS:');
  if (apiResult.error || pageResult.error) {
    console.log('1. Check if Next.js server is running: npm run dev');
    console.log('2. Check server logs for errors');
    console.log('3. Try restarting the development server');
  } else if (apiResult.registrationTypes?.length === 0) {
    console.log('1. Verify Sanity connection');
    console.log('2. Check if registration types exist in Sanity');
    console.log('3. Run: node test-registration-api.js');
  } else {
    console.log('1. Check browser console for JavaScript errors');
    console.log('2. Check if React components are rendering properly');
    console.log('3. Verify the useDynamicRegistration hook is working');
  }
}

debugRegistration().catch(console.error);
