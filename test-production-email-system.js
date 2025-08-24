require('dotenv').config();
const nodemailer = require('nodemailer');

/**
 * Comprehensive email system testing for production deployment
 */

async function testProductionEmailSystem() {
  try {
    console.log('🧪 TESTING PRODUCTION EMAIL SYSTEM...\n');
    
    // Test 1: Environment Variables Check
    console.log('📋 Step 1: Checking environment variables...');
    const requiredVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.log('❌ Missing environment variables:', missingVars);
      console.log('🔧 Please ensure these variables are set in your deployment:');
      missingVars.forEach(varName => {
        console.log(`   ${varName}=your_value_here`);
      });
      return;
    }
    
    console.log('✅ All required environment variables are set');
    console.log('📧 SMTP Configuration:');
    console.log(`   Host: ${process.env.SMTP_HOST}`);
    console.log(`   Port: ${process.env.SMTP_PORT}`);
    console.log(`   Secure: ${process.env.SMTP_SECURE}`);
    console.log(`   User: ${process.env.SMTP_USER}`);
    console.log(`   Password: ${process.env.SMTP_PASS ? '***SET***' : '❌ NOT SET'}`);
    
    // Test 2: Primary SMTP Configuration
    console.log('\n🔍 Step 2: Testing primary SMTP configuration...');
    
    const primaryConfig = {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: process.env.SMTP_SECURE === 'true' || true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
        ciphers: 'SSLv3'
      },
      connectionTimeout: 60000,
      greetingTimeout: 30000,
      socketTimeout: 60000,
      debug: true,
      logger: true
    };
    
    let workingTransporter = null;
    
    try {
      const primaryTransporter = nodemailer.createTransport(primaryConfig);
      console.log('🔗 Attempting primary SMTP connection...');
      await primaryTransporter.verify();
      console.log('✅ Primary SMTP configuration successful!');
      workingTransporter = primaryTransporter;
    } catch (primaryError) {
      console.log('❌ Primary SMTP failed:', primaryError.message);
      
      // Test 3: Alternative SMTP Configuration (Port 587)
      console.log('\n🔄 Step 3: Testing alternative SMTP configuration (Port 587)...');
      
      const altConfig = {
        host: process.env.SMTP_HOST,
        port: 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        tls: {
          rejectUnauthorized: false,
          starttls: true
        },
        connectionTimeout: 60000,
        greetingTimeout: 30000,
        socketTimeout: 60000,
        debug: true,
        logger: true
      };
      
      try {
        const altTransporter = nodemailer.createTransport(altConfig);
        console.log('🔗 Attempting alternative SMTP connection...');
        await altTransporter.verify();
        console.log('✅ Alternative SMTP configuration successful!');
        workingTransporter = altTransporter;
      } catch (altError) {
        console.log('❌ Alternative SMTP also failed:', altError.message);
        
        // Test 4: Gmail SMTP as fallback
        console.log('\n🔄 Step 4: Testing Gmail SMTP as fallback...');
        
        const gmailConfig = {
          service: 'gmail',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
          tls: {
            rejectUnauthorized: false
          }
        };
        
        try {
          const gmailTransporter = nodemailer.createTransport(gmailConfig);
          console.log('🔗 Attempting Gmail SMTP connection...');
          await gmailTransporter.verify();
          console.log('✅ Gmail SMTP configuration successful!');
          workingTransporter = gmailTransporter;
        } catch (gmailError) {
          console.log('❌ Gmail SMTP also failed:', gmailError.message);
          console.log('\n💥 All SMTP configurations failed. Please check:');
          console.log('   1. SMTP credentials are correct');
          console.log('   2. Network/firewall allows SMTP connections');
          console.log('   3. Email provider allows app-specific passwords');
          console.log('   4. Server has internet connectivity');
          return;
        }
      }
    }
    
    // Test 5: Send Test Email
    if (workingTransporter) {
      console.log('\n📧 Step 5: Sending test email...');
      
      const testEmail = {
        from: `"Intelli Global Conferences" <${process.env.SMTP_USER}>`,
        to: process.env.SMTP_USER, // Send to self for testing
        subject: 'Production Email System Test - ' + new Date().toISOString(),
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); color: white; padding: 20px; text-align: center;">
              <h1>🎉 Email System Test Successful!</h1>
            </div>
            <div style="padding: 20px; background: #f8f9fa;">
              <h2>Production Email System Verification</h2>
              <p><strong>Test Date:</strong> ${new Date().toLocaleString()}</p>
              <p><strong>Environment:</strong> ${process.env.NODE_ENV || 'development'}</p>
              <p><strong>SMTP Host:</strong> ${process.env.SMTP_HOST}</p>
              <p><strong>SMTP Port:</strong> ${process.env.SMTP_PORT}</p>
              <p><strong>From Email:</strong> ${process.env.SMTP_USER}</p>
              
              <div style="background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3 style="color: #2d5a2d; margin: 0 0 10px 0;">✅ Email System Status: WORKING</h3>
                <p style="margin: 0; color: #2d5a2d;">
                  Your production email system is configured correctly and can send emails successfully.
                  Payment receipt emails should now be delivered to clients automatically.
                </p>
              </div>
              
              <h3>Next Steps:</h3>
              <ul>
                <li>✅ Email delivery system is functional</li>
                <li>✅ SMTP configuration is working</li>
                <li>✅ Ready for production payment receipts</li>
              </ul>
            </div>
          </div>
        `,
        text: `
Production Email System Test Successful!

Test Date: ${new Date().toLocaleString()}
Environment: ${process.env.NODE_ENV || 'development'}
SMTP Host: ${process.env.SMTP_HOST}
SMTP Port: ${process.env.SMTP_PORT}
From Email: ${process.env.SMTP_USER}

✅ Email System Status: WORKING

Your production email system is configured correctly and can send emails successfully.
Payment receipt emails should now be delivered to clients automatically.

Next Steps:
✅ Email delivery system is functional
✅ SMTP configuration is working  
✅ Ready for production payment receipts
        `
      };
      
      try {
        const result = await workingTransporter.sendMail(testEmail);
        console.log('✅ Test email sent successfully!');
        console.log(`   Message ID: ${result.messageId}`);
        console.log(`   Response: ${result.response}`);
        
        console.log('\n🎉 EMAIL SYSTEM TEST COMPLETE!');
        console.log('='.repeat(60));
        console.log('✅ Production email system is working correctly');
        console.log('✅ Payment receipt emails should now be delivered');
        console.log('✅ Check your email inbox for the test message');
        
      } catch (sendError) {
        console.log('❌ Failed to send test email:', sendError.message);
        console.log('🔧 Email sending failed even though SMTP connection was verified');
        console.log('   This might indicate authentication or permission issues');
      }
    }
    
    // Test 6: Production Environment Checks
    console.log('\n🔍 Step 6: Production environment checks...');
    
    console.log('📊 Environment Analysis:');
    console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
    console.log(`   Platform: ${process.platform}`);
    console.log(`   Node Version: ${process.version}`);
    console.log(`   Working Directory: ${process.cwd()}`);
    
    // Check for common production issues
    const productionChecks = [
      {
        name: 'Environment Variables',
        check: () => !!process.env.SMTP_PASS,
        message: 'SMTP_PASS environment variable is set'
      },
      {
        name: 'Node Environment',
        check: () => process.env.NODE_ENV === 'production',
        message: 'NODE_ENV is set to production'
      },
      {
        name: 'SMTP Security',
        check: () => process.env.SMTP_SECURE === 'true',
        message: 'SMTP_SECURE is properly configured'
      }
    ];
    
    console.log('\n📋 Production Readiness Checklist:');
    productionChecks.forEach(check => {
      const status = check.check() ? '✅' : '⚠️';
      console.log(`   ${status} ${check.message}`);
    });
    
    console.log('\n🎯 FINAL RECOMMENDATIONS:');
    console.log('1. ✅ Use the working SMTP configuration in production');
    console.log('2. ✅ Ensure all environment variables are set in Coolify');
    console.log('3. ✅ Monitor email delivery logs in production');
    console.log('4. ✅ Test with actual payment transactions');
    
  } catch (error) {
    console.error('💥 Email system test failed:', error.message);
    console.log('\n🔧 Troubleshooting Steps:');
    console.log('1. Check environment variables are correctly set');
    console.log('2. Verify SMTP credentials with email provider');
    console.log('3. Check network connectivity and firewall settings');
    console.log('4. Ensure email provider allows app-specific passwords');
  }
}

// Run the comprehensive test
testProductionEmailSystem();
