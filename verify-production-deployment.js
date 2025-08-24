require('dotenv').config();

/**
 * Production Deployment Verification Script
 * Run this script after deploying to Coolify to verify all systems are working
 */

async function verifyProductionDeployment() {
  console.log('🔍 VERIFYING PRODUCTION DEPLOYMENT...');
  console.log('=' .repeat(60));
  
  const results = {
    environmentVariables: false,
    smtpConnection: false,
    emailDelivery: false,
    paypalConfig: false,
    sanityConnection: false,
    overall: false
  };
  
  try {
    // 1. Environment Variables Check
    console.log('\n📋 Step 1: Checking Environment Variables...');
    
    const requiredVars = [
      'SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS',
      'NODE_ENV', 'NEXT_PUBLIC_PAYPAL_CLIENT_ID', 'PAYPAL_CLIENT_SECRET',
      'NEXT_PUBLIC_SANITY_PROJECT_ID', 'SANITY_API_TOKEN'
    ];
    
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length === 0) {
      console.log('✅ All required environment variables are set');
      results.environmentVariables = true;
    } else {
      console.log('❌ Missing environment variables:', missingVars);
      return results;
    }
    
    // 2. SMTP Connection Test
    console.log('\n🔗 Step 2: Testing SMTP Connection...');
    
    const nodemailer = require('nodemailer');
    
    const smtpConfig = {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true' || true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
        ciphers: 'SSLv3'
      },
      connectionTimeout: 30000,
      greetingTimeout: 15000,
      socketTimeout: 30000
    };
    
    try {
      const transporter = nodemailer.createTransporter(smtpConfig);
      await transporter.verify();
      console.log('✅ SMTP connection successful');
      results.smtpConnection = true;
    } catch (smtpError) {
      console.log('❌ SMTP connection failed:', smtpError.message);
      
      // Try alternative configuration
      console.log('🔄 Trying alternative SMTP configuration...');
      const altConfig = { ...smtpConfig, port: 587, secure: false };
      
      try {
        const altTransporter = nodemailer.createTransporter(altConfig);
        await altTransporter.verify();
        console.log('✅ Alternative SMTP connection successful');
        results.smtpConnection = true;
      } catch (altError) {
        console.log('❌ Alternative SMTP also failed:', altError.message);
      }
    }
    
    // 3. Email Delivery Test
    if (results.smtpConnection) {
      console.log('\n📧 Step 3: Testing Email Delivery...');
      
      try {
        const transporter = nodemailer.createTransporter(smtpConfig);
        
        const testEmail = {
          from: `"Intelli Global Conferences" <${process.env.SMTP_USER}>`,
          to: process.env.SMTP_USER, // Send to self
          subject: 'Production Deployment Verification - ' + new Date().toISOString(),
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); color: white; padding: 20px; text-align: center;">
                <h1>🎉 Production Deployment Verified!</h1>
              </div>
              <div style="padding: 20px; background: #f8f9fa;">
                <h2>Deployment Verification Results</h2>
                <p><strong>Verification Date:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>Environment:</strong> ${process.env.NODE_ENV}</p>
                <p><strong>SMTP Host:</strong> ${process.env.SMTP_HOST}</p>
                
                <div style="background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
                  <h3 style="color: #2d5a2d; margin: 0 0 10px 0;">✅ System Status: OPERATIONAL</h3>
                  <p style="margin: 0; color: #2d5a2d;">
                    Production email system is working correctly. Payment receipt emails will be delivered automatically.
                  </p>
                </div>
              </div>
            </div>
          `,
          text: `Production Deployment Verified!\n\nVerification Date: ${new Date().toLocaleString()}\nEnvironment: ${process.env.NODE_ENV}\nSMTP Host: ${process.env.SMTP_HOST}\n\n✅ System Status: OPERATIONAL\n\nProduction email system is working correctly.`
        };
        
        const result = await transporter.sendMail(testEmail);
        console.log('✅ Test email sent successfully');
        console.log(`   Message ID: ${result.messageId}`);
        results.emailDelivery = true;
        
      } catch (emailError) {
        console.log('❌ Email delivery test failed:', emailError.message);
      }
    }
    
    // 4. PayPal Configuration Check
    console.log('\n💳 Step 4: Checking PayPal Configuration...');
    
    if (process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET) {
      console.log('✅ PayPal credentials are configured');
      
      // Test PayPal API connectivity
      try {
        const paypalAuth = Buffer.from(
          `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
        ).toString('base64');
        
        const response = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${paypalAuth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: 'grant_type=client_credentials',
        });
        
        if (response.ok) {
          console.log('✅ PayPal API connection successful');
          results.paypalConfig = true;
        } else {
          console.log('❌ PayPal API connection failed');
        }
      } catch (paypalError) {
        console.log('❌ PayPal API test failed:', paypalError.message);
      }
    } else {
      console.log('❌ PayPal credentials not configured');
    }
    
    // 5. Sanity CMS Connection Check
    console.log('\n🗄️ Step 5: Checking Sanity CMS Connection...');
    
    try {
      const { createClient } = require('@sanity/client');
      
      const sanityClient = createClient({
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
        apiVersion: '2023-05-03',
        useCdn: false,
        token: process.env.SANITY_API_TOKEN,
      });
      
      // Test query
      const testQuery = await sanityClient.fetch('*[_type == "siteSettings"][0]');
      console.log('✅ Sanity CMS connection successful');
      results.sanityConnection = true;
      
    } catch (sanityError) {
      console.log('❌ Sanity CMS connection failed:', sanityError.message);
    }
    
    // 6. Overall Assessment
    console.log('\n📊 DEPLOYMENT VERIFICATION SUMMARY');
    console.log('=' .repeat(60));
    
    const checks = [
      { name: 'Environment Variables', status: results.environmentVariables },
      { name: 'SMTP Connection', status: results.smtpConnection },
      { name: 'Email Delivery', status: results.emailDelivery },
      { name: 'PayPal Configuration', status: results.paypalConfig },
      { name: 'Sanity CMS Connection', status: results.sanityConnection }
    ];
    
    checks.forEach(check => {
      const status = check.status ? '✅ PASS' : '❌ FAIL';
      console.log(`   ${check.name}: ${status}`);
    });
    
    const passedChecks = checks.filter(check => check.status).length;
    const totalChecks = checks.length;
    
    results.overall = passedChecks === totalChecks;
    
    console.log('\n🎯 OVERALL STATUS:');
    if (results.overall) {
      console.log('🎉 ALL SYSTEMS OPERATIONAL - PRODUCTION READY!');
      console.log('✅ Payment receipt emails will be delivered automatically');
      console.log('✅ All integrations are working correctly');
    } else {
      console.log(`⚠️ ${totalChecks - passedChecks} ISSUES DETECTED - REQUIRES ATTENTION`);
      console.log('🔧 Please fix the failed checks before going live');
    }
    
    // 7. Next Steps
    console.log('\n📋 NEXT STEPS:');
    if (results.overall) {
      console.log('1. ✅ System is ready for production use');
      console.log('2. ✅ Monitor email delivery logs');
      console.log('3. ✅ Test with actual payment transactions');
      console.log('4. ✅ Set up monitoring alerts');
    } else {
      console.log('1. 🔧 Fix failed system checks');
      console.log('2. 🔄 Re-run this verification script');
      console.log('3. 📞 Contact support if issues persist');
    }
    
    console.log('\n📧 Email Monitoring Commands:');
    console.log('   grep "payment receipt email" /var/log/application.log');
    console.log('   grep "SMTP.*verif" /var/log/application.log');
    console.log('   grep "Email delivery metrics" /var/log/application.log');
    
  } catch (error) {
    console.error('💥 Verification script failed:', error.message);
    results.overall = false;
  }
  
  return results;
}

// Run verification if called directly
if (require.main === module) {
  verifyProductionDeployment()
    .then(results => {
      process.exit(results.overall ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 Verification failed:', error);
      process.exit(1);
    });
}

module.exports = { verifyProductionDeployment };
