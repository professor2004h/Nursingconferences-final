const nodemailer = require('nodemailer');

/**
 * Test 2FA Password Options for Hostinger SMTP
 * Tests both primary password and app-specific password
 */

async function test2FAPasswords() {
  console.log('🔐 Testing 2FA Password Options for Hostinger SMTP');
  console.log('=' .repeat(60));
  
  const smtpServer = 'smtp.hostinger.com'; // Confirmed from Hostinger screenshots
  const senderEmail = 'accounts@intelliglobalconferences.com';
  const receiverEmail = 'professor2004h@gmail.com';
  
  // Password options to test
  const passwordOptions = [
    {
      name: 'Primary Password',
      password: 'Muni@12345m',
      description: 'Original account password'
    },
    {
      name: 'App-Specific Password',
      password: 'movvod-qerkog-5foJhe',
      description: '2FA app-specific password'
    }
  ];
  
  // SMTP configurations to test
  const smtpConfigs = [
    { port: 465, secure: true, name: 'SSL Port 465' },
    { port: 587, secure: false, name: 'STARTTLS Port 587' }
  ];
  
  console.log(`📧 Testing email: ${senderEmail}`);
  console.log(`📧 Target recipient: ${receiverEmail}`);
  console.log(`🖥️  SMTP Server: ${smtpServer}`);
  
  for (const passwordOption of passwordOptions) {
    console.log(`\n🔐 Testing ${passwordOption.name}: ${passwordOption.description}`);
    console.log('-'.repeat(50));
    
    for (const config of smtpConfigs) {
      console.log(`\n📧 Testing ${passwordOption.name} with ${config.name}...`);
      
      try {
        // Create transporter
        const transporter = nodemailer.createTransport({
          host: smtpServer,
          port: config.port,
          secure: config.secure,
          auth: {
            user: senderEmail,
            pass: passwordOption.password,
          },
          tls: {
            rejectUnauthorized: false
          },
          connectionTimeout: 30000,
          greetingTimeout: 15000,
          socketTimeout: 30000,
          debug: false, // Reduce noise
          logger: false
        });
        
        console.log(`  ✓ Transporter created for ${config.name}`);
        
        // Test connection and authentication
        console.log('  🔍 Testing connection and authentication...');
        await transporter.verify();
        console.log(`  ✅ Authentication successful with ${passwordOption.name}!`);
        
        // Send test email
        console.log('  📧 Sending test email...');
        const mailOptions = {
          from: `"Intelli Global Conferences" <${senderEmail}>`,
          to: receiverEmail,
          subject: `✅ 2FA Test Success - ${passwordOption.name} - ${config.name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background-color: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px;">
                <h1>🎉 Email System Working!</h1>
                <p>2FA Configuration Test Successful</p>
              </div>
              
              <div style="padding: 20px; background-color: #f9f9f9; margin: 20px 0; border-radius: 8px;">
                <h2>✅ Test Results</h2>
                <p><strong>Password Type:</strong> ${passwordOption.name}</p>
                <p><strong>Description:</strong> ${passwordOption.description}</p>
                <p><strong>SMTP Configuration:</strong> ${config.name}</p>
                <p><strong>Server:</strong> ${smtpServer}:${config.port}</p>
                <p><strong>Security:</strong> ${config.secure ? 'SSL' : 'STARTTLS'}</p>
                <p><strong>Authentication:</strong> ✅ Successful</p>
                <p><strong>Test Time:</strong> ${new Date().toISOString()}</p>
              </div>
              
              <div style="padding: 20px; background-color: #eff6ff; border-left: 4px solid #3b82f6; margin: 20px 0;">
                <h3>🚀 Next Steps</h3>
                <ul>
                  <li>Update .env.local with working configuration</li>
                  <li>Test payment receipt email system</li>
                  <li>Deploy to production</li>
                </ul>
              </div>
              
              <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
                <p>This email confirms that the SMTP configuration is working correctly with 2FA.</p>
                <p>Email sent from: ${senderEmail}</p>
              </div>
            </div>
          `,
          text: `
2FA Email Test Successful!

Password Type: ${passwordOption.name}
Configuration: ${config.name}
Server: ${smtpServer}:${config.port}
Security: ${config.secure ? 'SSL' : 'STARTTLS'}
Authentication: Successful
Test Time: ${new Date().toISOString()}

The email system is now working correctly with 2FA enabled.
          `
        };
        
        const result = await transporter.sendMail(mailOptions);
        console.log(`  ✅ Email sent successfully!`);
        console.log(`  📧 Message ID: ${result.messageId}`);
        console.log(`  📧 Response: ${result.response}`);
        
        // Return successful configuration
        return {
          success: true,
          workingConfig: {
            passwordType: passwordOption.name,
            password: passwordOption.password,
            smtpConfig: config,
            messageId: result.messageId
          }
        };
        
      } catch (error) {
        console.log(`  ❌ ${config.name} failed with ${passwordOption.name}:`);
        console.log(`     Error: ${error.message}`);
        
        if (error.code === 'EAUTH') {
          console.log(`     🔐 Authentication failed - trying next option...`);
        } else {
          console.log(`     Code: ${error.code}`);
          console.log(`     Command: ${error.command}`);
        }
      }
    }
  }
  
  console.log('\n❌ All password and configuration combinations failed');
  return { success: false };
}

async function main() {
  try {
    console.log('🧪 Starting 2FA Password Test...\n');
    
    const result = await test2FAPasswords();
    
    if (result.success) {
      console.log('\n🎉 SUCCESS! Email system is working!');
      console.log('=' .repeat(50));
      console.log(`✅ Working Password: ${result.workingConfig.passwordType}`);
      console.log(`✅ Working Configuration: ${result.workingConfig.smtpConfig.name}`);
      console.log(`✅ Message ID: ${result.workingConfig.messageId}`);
      
      console.log('\n📝 Configuration to use in .env.local:');
      console.log('SMTP_HOST=smtp.hostinger.com');
      console.log(`SMTP_PORT=${result.workingConfig.smtpConfig.port}`);
      console.log(`SMTP_SECURE=${result.workingConfig.smtpConfig.secure}`);
      console.log('SMTP_USER=accounts@intelliglobalconferences.com');
      console.log(`SMTP_PASS=${result.workingConfig.password}`);
      console.log('EMAIL_FROM=accounts@intelliglobalconferences.com');
      console.log('EMAIL_FROM_NAME=Intelli Global Conferences');
      
      console.log('\n🚀 Next Steps:');
      console.log('1. Update .env.local with the working configuration above');
      console.log('2. Test the payment receipt email system');
      console.log('3. Check professor2004h@gmail.com for the test email');
      
    } else {
      console.log('\n❌ No working configuration found');
      console.log('💡 Troubleshooting suggestions:');
      console.log('1. Verify 2FA is properly enabled');
      console.log('2. Check if app-specific password is correctly generated');
      console.log('3. Ensure email account is active and not suspended');
      console.log('4. Contact Hostinger support for assistance');
    }
    
  } catch (error) {
    console.error('❌ Test script failed:', error);
  }
}

// Run the test
main();
