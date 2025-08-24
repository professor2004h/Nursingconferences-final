require('dotenv').config();

/**
 * Simple Coolify Email Test Script
 * Quick test to verify email delivery in Coolify production environment
 */

async function testCoolifyEmail() {
  console.log('📧 SIMPLE COOLIFY EMAIL TEST');
  console.log('=' .repeat(40));
  
  try {
    // Check if we're in the right environment
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    console.log(`📍 Hostname: ${require('os').hostname()}`);
    
    // Check environment variables
    const requiredVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'];
    const missing = requiredVars.filter(v => !process.env[v]);
    
    if (missing.length > 0) {
      console.log('❌ Missing environment variables:', missing);
      console.log('🔧 Add these to Coolify and redeploy:');
      missing.forEach(v => console.log(`   ${v}=your_value`));
      return false;
    }
    
    console.log('✅ All environment variables are set');
    
    // Import nodemailer
    const nodemailer = require('nodemailer');
    
    // Test multiple SMTP configurations
    const configs = [
      {
        name: 'Primary (Port 465)',
        config: {
          host: process.env.SMTP_HOST,
          port: 465,
          secure: true,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
          tls: { rejectUnauthorized: false }
        }
      },
      {
        name: 'Alternative (Port 587)',
        config: {
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
          }
        }
      },
      {
        name: 'Coolify-Optimized',
        config: {
          host: process.env.SMTP_HOST,
          port: 587,
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
          tls: {
            rejectUnauthorized: false,
            servername: process.env.SMTP_HOST,
            ciphers: 'HIGH:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA'
          },
          connectionTimeout: 30000,
          greetingTimeout: 15000,
          socketTimeout: 30000,
          pool: false,
          maxConnections: 1
        }
      }
    ];
    
    let workingTransporter = null;
    let workingConfigName = null;
    
    // Test each configuration
    for (const { name, config } of configs) {
      console.log(`\n🔍 Testing: ${name}`);
      
      try {
        const transporter = nodemailer.createTransporter(config);
        
        console.log('   🔗 Verifying SMTP connection...');
        await transporter.verify();
        console.log('   ✅ SMTP verification successful!');
        
        workingTransporter = transporter;
        workingConfigName = name;
        break;
        
      } catch (error) {
        console.log(`   ❌ Failed: ${error.message}`);
      }
    }
    
    if (!workingTransporter) {
      console.log('\n❌ ALL SMTP CONFIGURATIONS FAILED!');
      console.log('🔧 Possible issues:');
      console.log('   - SMTP ports blocked by firewall');
      console.log('   - Incorrect credentials');
      console.log('   - Network connectivity issues');
      console.log('   - DNS resolution problems');
      return false;
    }
    
    console.log(`\n✅ Working configuration: ${workingConfigName}`);
    
    // Send test email
    console.log('\n📧 Sending test email...');
    
    const testEmail = {
      from: `"Intelli Global Conferences" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // Send to self
      subject: `Coolify Email Test - ${new Date().toISOString()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); color: white; padding: 20px; text-align: center; border-radius: 8px;">
            <h1>🎉 Coolify Email Test Successful!</h1>
          </div>
          <div style="padding: 20px; background: #f8f9fa; border-radius: 8px; margin-top: 10px;">
            <h2>Test Results</h2>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Environment:</strong> ${process.env.NODE_ENV}</p>
            <p><strong>Working Config:</strong> ${workingConfigName}</p>
            <p><strong>SMTP Host:</strong> ${process.env.SMTP_HOST}</p>
            
            <div style="background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #2d5a2d; margin: 0 0 10px 0;">✅ Email System Status: WORKING</h3>
              <p style="margin: 0; color: #2d5a2d;">
                Your Coolify email system is working correctly!
                Payment receipt emails will be delivered automatically.
              </p>
            </div>
            
            <h3>Next Steps:</h3>
            <ul>
              <li>✅ Email delivery is functional</li>
              <li>✅ SMTP configuration is working</li>
              <li>✅ Ready for production payments</li>
            </ul>
          </div>
        </div>
      `,
      text: `
Coolify Email Test Successful!

Date: ${new Date().toLocaleString()}
Environment: ${process.env.NODE_ENV}
Working Config: ${workingConfigName}
SMTP Host: ${process.env.SMTP_HOST}

✅ Email System Status: WORKING

Your Coolify email system is working correctly!
Payment receipt emails will be delivered automatically.

Next Steps:
✅ Email delivery is functional
✅ SMTP configuration is working
✅ Ready for production payments
      `
    };
    
    const result = await workingTransporter.sendMail(testEmail);
    
    console.log('✅ Test email sent successfully!');
    console.log(`📧 Message ID: ${result.messageId}`);
    console.log(`📧 Response: ${result.response}`);
    
    console.log('\n🎉 COOLIFY EMAIL TEST COMPLETE!');
    console.log('=' .repeat(40));
    console.log('✅ Email system is working in Coolify');
    console.log('✅ Payment receipts will be delivered');
    console.log('✅ Check your email inbox for test message');
    
    return true;
    
  } catch (error) {
    console.error('\n💥 Email test failed:', error.message);
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Check environment variables in Coolify');
    console.log('2. Verify SMTP credentials');
    console.log('3. Check network connectivity');
    console.log('4. Contact Coolify support if needed');
    
    return false;
  }
}

// Run test if called directly
if (require.main === module) {
  testCoolifyEmail()
    .then(success => {
      console.log(`\n🎯 Test result: ${success ? 'SUCCESS' : 'FAILED'}`);
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 Test script failed:', error);
      process.exit(1);
    });
}

module.exports = { testCoolifyEmail };
