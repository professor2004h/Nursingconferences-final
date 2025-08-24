const nodemailer = require('nodemailer');

/**
 * Final Hostinger SMTP Test with Official Configuration
 * Based on Hostinger documentation and screenshot analysis
 */

async function testHostingerSMTP() {
  console.log('🔧 Final Hostinger SMTP Configuration Test');
  console.log('=' .repeat(60));
  
  // Official Hostinger SMTP settings from documentation
  const smtpConfigs = [
    {
      name: 'Hostinger SSL (Port 465) - Recommended',
      host: 'smtp.hostinger.com',
      port: 465,
      secure: true,
      description: 'Official Hostinger SSL configuration'
    },
    {
      name: 'Hostinger STARTTLS (Port 587) - Alternative',
      host: 'smtp.hostinger.com', 
      port: 587,
      secure: false,
      description: 'Official Hostinger STARTTLS configuration'
    }
  ];
  
  const credentials = [
    {
      name: 'Primary Password',
      password: 'Muni@12345m',
      description: 'Main account password'
    },
    {
      name: 'App-Specific Password',
      password: 'movvod-qerkog-5foJhe',
      description: '2FA app-specific password'
    }
  ];
  
  const emailAccount = 'accounts@intelliglobalconferences.com';
  const testRecipient = 'professor2004h@gmail.com';
  
  console.log(`📧 Testing email account: ${emailAccount}`);
  console.log(`📧 Test recipient: ${testRecipient}`);
  console.log(`🖥️  SMTP Server: smtp.hostinger.com`);
  
  for (const config of smtpConfigs) {
    console.log(`\n🔧 Testing ${config.name}`);
    console.log('-'.repeat(50));
    
    for (const cred of credentials) {
      console.log(`\n🔐 Testing with ${cred.name}: ${cred.description}`);
      
      try {
        // Create transporter with current configuration
        const transporter = nodemailer.createTransport({
          host: config.host,
          port: config.port,
          secure: config.secure,
          auth: {
            user: emailAccount,
            pass: cred.password,
          },
          tls: {
            rejectUnauthorized: false
          },
          connectionTimeout: 30000,
          greetingTimeout: 15000,
          socketTimeout: 30000,
          debug: false,
          logger: false
        });
        
        console.log(`  ✓ Transporter created for ${config.name}`);
        
        // Test connection and authentication
        console.log('  🔍 Testing SMTP connection and authentication...');
        await transporter.verify();
        console.log(`  ✅ SUCCESS! Authentication successful with ${cred.name}!`);
        
        // Send test email
        console.log('  📧 Sending test email...');
        const mailOptions = {
          from: `"Intelli Global Conferences" <${emailAccount}>`,
          to: testRecipient,
          subject: `✅ SMTP Success - ${config.name} - ${cred.name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background-color: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px;">
                <h1>🎉 Hostinger SMTP Working!</h1>
                <p>Email system successfully configured</p>
              </div>
              
              <div style="padding: 20px; background-color: #f9f9f9; margin: 20px 0; border-radius: 8px;">
                <h2>✅ Working Configuration</h2>
                <p><strong>SMTP Server:</strong> ${config.host}</p>
                <p><strong>Port:</strong> ${config.port}</p>
                <p><strong>Security:</strong> ${config.secure ? 'SSL' : 'STARTTLS'}</p>
                <p><strong>Authentication:</strong> ${cred.name}</p>
                <p><strong>Email Account:</strong> ${emailAccount}</p>
                <p><strong>Test Time:</strong> ${new Date().toISOString()}</p>
              </div>
              
              <div style="padding: 20px; background-color: #eff6ff; border-left: 4px solid #3b82f6; margin: 20px 0;">
                <h3>🚀 Next Steps</h3>
                <ul>
                  <li>✅ SMTP configuration confirmed working</li>
                  <li>✅ Update .env.local with working settings</li>
                  <li>✅ Test payment receipt email system</li>
                  <li>✅ Deploy to production</li>
                </ul>
              </div>
              
              <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
                <p>This email confirms that Hostinger SMTP is working correctly.</p>
                <p>Configuration: ${config.name}</p>
                <p>Authentication: ${cred.name}</p>
              </div>
            </div>
          `,
          text: `
Hostinger SMTP Test Successful!

Working Configuration:
- SMTP Server: ${config.host}
- Port: ${config.port}
- Security: ${config.secure ? 'SSL' : 'STARTTLS'}
- Authentication: ${cred.name}
- Email Account: ${emailAccount}
- Test Time: ${new Date().toISOString()}

The email system is now working correctly with Hostinger SMTP.
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
            host: config.host,
            port: config.port,
            secure: config.secure,
            user: emailAccount,
            password: cred.password,
            passwordType: cred.name,
            configName: config.name,
            messageId: result.messageId
          }
        };
        
      } catch (error) {
        console.log(`  ❌ ${config.name} failed with ${cred.name}:`);
        console.log(`     Error: ${error.message}`);
        
        if (error.code === 'EAUTH') {
          console.log(`     🔐 Authentication failed - trying next option...`);
        } else if (error.code === 'ECONNECTION') {
          console.log(`     🌐 Connection failed - check network/firewall`);
        } else if (error.code === 'ETIMEDOUT') {
          console.log(`     ⏰ Connection timeout - server may be busy`);
        } else {
          console.log(`     Code: ${error.code}`);
          console.log(`     Command: ${error.command}`);
        }
      }
    }
  }
  
  console.log('\n❌ All configurations failed');
  return { success: false };
}

async function main() {
  try {
    console.log('🧪 Starting Final Hostinger SMTP Test...\n');
    
    const result = await testHostingerSMTP();
    
    if (result.success) {
      console.log('\n🎉 SUCCESS! Hostinger SMTP is working!');
      console.log('=' .repeat(60));
      console.log(`✅ Working Configuration: ${result.workingConfig.configName}`);
      console.log(`✅ Authentication Method: ${result.workingConfig.passwordType}`);
      console.log(`✅ Message ID: ${result.workingConfig.messageId}`);
      
      console.log('\n📝 .env.local Configuration:');
      console.log(`SMTP_HOST=${result.workingConfig.host}`);
      console.log(`SMTP_PORT=${result.workingConfig.port}`);
      console.log(`SMTP_SECURE=${result.workingConfig.secure}`);
      console.log(`SMTP_USER=${result.workingConfig.user}`);
      console.log(`SMTP_PASS=${result.workingConfig.password}`);
      console.log(`EMAIL_FROM=${result.workingConfig.user}`);
      console.log('EMAIL_FROM_NAME=Intelli Global Conferences');
      
      console.log('\n🚀 Next Steps:');
      console.log('1. ✅ SMTP configuration confirmed working');
      console.log('2. Test the payment receipt email system');
      console.log('3. Check professor2004h@gmail.com for the test email');
      console.log('4. Deploy to production with working configuration');
      
    } else {
      console.log('\n❌ No working configuration found');
      console.log('\n🔍 Troubleshooting Steps:');
      console.log('1. 📧 Verify email account exists in Hostinger hPanel:');
      console.log('   - Login to Hostinger hPanel');
      console.log('   - Go to Emails > Manage Domain');
      console.log('   - Check if accounts@intelliglobalconferences.com exists');
      console.log('   - If not, create the email account');
      
      console.log('\n2. ⚙️  Check email services are enabled:');
      console.log('   - In hPanel, go to Email Services');
      console.log('   - Ensure email services are active');
      
      console.log('\n3. 🌐 Verify domain status:');
      console.log('   - Check if intelliglobalconferences.com is active');
      console.log('   - Ensure domain is not suspended');
      console.log('   - Verify MX records are correctly set');
      
      console.log('\n4. 🔐 Test webmail access:');
      console.log('   - Try logging into https://webmail.hostinger.com');
      console.log('   - Use accounts@intelliglobalconferences.com');
      console.log('   - If webmail fails, email account needs to be created');
      
      console.log('\n5. 📞 Contact Hostinger support if issues persist');
    }
    
  } catch (error) {
    console.error('❌ Test script failed:', error);
  }
}

// Run the test
main();
