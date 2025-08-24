// Load environment variables
require('dotenv').config();

/**
 * Production Configuration Validation Script
 * Validates that all dynamic data sources are working correctly
 */

async function validateProductionConfig() {
  console.log('🔍 VALIDATING PRODUCTION CONFIGURATION...\n');
  
  let allValid = true;
  const results = [];

  // 1. Validate Environment Variables
  console.log('1️⃣ CHECKING ENVIRONMENT VARIABLES...');
  const requiredEnvVars = [
    'NEXT_PUBLIC_SANITY_PROJECT_ID',
    'NEXT_PUBLIC_SANITY_DATASET', 
    'SANITY_API_TOKEN',
    'NEXT_PUBLIC_PAYPAL_CLIENT_ID',
    'PAYPAL_CLIENT_SECRET',
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_USER',
    'SMTP_PASS'
  ];

  for (const envVar of requiredEnvVars) {
    const value = process.env[envVar];
    const isValid = !!value && value !== 'your_token_here' && value !== 'your_password_here';
    
    console.log(`   ${isValid ? '✅' : '❌'} ${envVar}: ${isValid ? 'SET' : 'MISSING/INVALID'}`);
    
    if (!isValid) {
      allValid = false;
      results.push(`❌ ${envVar} is missing or contains placeholder value`);
    }
  }

  // 2. Test Sanity CMS Connection
  console.log('\n2️⃣ TESTING SANITY CMS CONNECTION...');
  try {
    const { getSiteSettings, getFooterLogo } = require('./nextjs-frontend/src/app/utils/paymentReceiptEmailer');
    
    const siteSettings = await getSiteSettings();
    const footerLogo = await getFooterLogo();
    
    if (siteSettings) {
      console.log('   ✅ Sanity CMS connection successful');
      console.log(`   ✅ Site settings loaded: ${siteSettings._id ? 'YES' : 'NO'}`);
      console.log(`   ✅ Footer logo available: ${footerLogo ? 'YES' : 'NO'}`);
      
      if (footerLogo) {
        console.log(`   📸 Logo URL: ${footerLogo.url}`);
      }
    } else {
      throw new Error('No site settings found');
    }
  } catch (error) {
    console.log(`   ❌ Sanity CMS connection failed: ${error.message}`);
    allValid = false;
    results.push(`❌ Sanity CMS: ${error.message}`);
  }

  // 3. Test PayPal Configuration
  console.log('\n3️⃣ TESTING PAYPAL CONFIGURATION...');
  try {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    const environment = process.env.NEXT_PUBLIC_PAYPAL_ENVIRONMENT || 'production';
    
    // Check if using production credentials (not sandbox)
    const isProduction = environment === 'production';
    const hasValidCredentials = clientId && clientSecret && 
                               !clientId.includes('sandbox') && 
                               !clientId.includes('test');
    
    console.log(`   ${isProduction ? '✅' : '❌'} Environment: ${environment}`);
    console.log(`   ${hasValidCredentials ? '✅' : '❌'} Production credentials: ${hasValidCredentials ? 'YES' : 'NO'}`);
    console.log(`   📝 Client ID: ${clientId ? clientId.substring(0, 10) + '...' : 'MISSING'}`);
    
    if (!isProduction || !hasValidCredentials) {
      allValid = false;
      results.push('❌ PayPal: Not configured for production or using test credentials');
    }
  } catch (error) {
    console.log(`   ❌ PayPal configuration error: ${error.message}`);
    allValid = false;
    results.push(`❌ PayPal: ${error.message}`);
  }

  // 4. Test Email Configuration
  console.log('\n4️⃣ TESTING EMAIL CONFIGURATION...');
  try {
    const { getEmailConfig } = require('./nextjs-frontend/src/app/utils/paymentReceiptEmailer');
    
    const emailConfig = await getEmailConfig();
    
    const isValidEmail = emailConfig.fromEmail && 
                        emailConfig.fromEmail.includes('@intelliglobalconferences.com') &&
                        emailConfig.pass;
    
    console.log(`   ${isValidEmail ? '✅' : '❌'} Email configuration: ${isValidEmail ? 'VALID' : 'INVALID'}`);
    console.log(`   📧 From email: ${emailConfig.fromEmail}`);
    console.log(`   🏠 SMTP host: ${emailConfig.host}`);
    console.log(`   🔌 SMTP port: ${emailConfig.port}`);
    console.log(`   🔐 Password set: ${emailConfig.pass ? 'YES' : 'NO'}`);
    
    if (!isValidEmail) {
      allValid = false;
      results.push('❌ Email: Invalid configuration or missing password');
    }
  } catch (error) {
    console.log(`   ❌ Email configuration error: ${error.message}`);
    allValid = false;
    results.push(`❌ Email: ${error.message}`);
  }

  // 5. Test PDF Generation
  console.log('\n5️⃣ TESTING PDF GENERATION...');
  try {
    const { generateReceiptPDF, getFooterLogo } = require('./nextjs-frontend/src/app/utils/paymentReceiptEmailer');
    
    const footerLogo = await getFooterLogo();
    
    // Test with sample real-looking data
    const testPaymentData = {
      transactionId: 'REAL_TXN_' + Date.now(),
      orderId: 'ORDER_' + Date.now(),
      amount: '299.00',
      currency: 'USD',
      paymentMethod: 'PayPal',
      paymentDate: new Date().toISOString(),
      status: 'COMPLETED'
    };
    
    const testRegistrationData = {
      registrationId: 'REG_' + Date.now(),
      fullName: 'Test Production User',
      email: 'test@example.com',
      phone: '+1-555-0123',
      country: 'United States',
      address: '123 Test Street, Test City, TC 12345',
      registrationType: 'Regular Registration',
      numberOfParticipants: '1'
    };
    
    const pdfBuffer = await generateReceiptPDF(testPaymentData, testRegistrationData, footerLogo);
    
    console.log(`   ✅ PDF generation successful`);
    console.log(`   📄 PDF size: ${pdfBuffer.length} bytes`);
    console.log(`   🖼️ Logo included: ${footerLogo ? 'YES' : 'NO'}`);
    
  } catch (error) {
    console.log(`   ❌ PDF generation failed: ${error.message}`);
    allValid = false;
    results.push(`❌ PDF Generation: ${error.message}`);
  }

  // Final Results
  console.log('\n' + '='.repeat(60));
  console.log('📊 VALIDATION RESULTS');
  console.log('='.repeat(60));
  
  if (allValid) {
    console.log('🎉 ALL CHECKS PASSED! Production configuration is ready.');
    console.log('✅ Dynamic data sources are working correctly');
    console.log('✅ No hardcoded test values detected');
    console.log('✅ Real payment receipts will be sent with live data');
  } else {
    console.log('❌ CONFIGURATION ISSUES FOUND:');
    results.forEach(result => console.log(`   ${result}`));
    console.log('\n🔧 Please fix the issues above before deploying to production.');
  }
  
  console.log('\n📋 NEXT STEPS:');
  console.log('1. Fix any configuration issues listed above');
  console.log('2. Test with a real PayPal payment in production');
  console.log('3. Verify payment receipt emails are sent correctly');
  console.log('4. Monitor application logs for any errors');
  
  return allValid;
}

// Run validation
validateProductionConfig()
  .then(isValid => {
    process.exit(isValid ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 Validation script failed:', error);
    process.exit(1);
  });
