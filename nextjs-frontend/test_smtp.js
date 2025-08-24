const nodemailer = require('nodemailer');

/**
 * SMTP Test Script for Hostinger
 * Tests the provided SMTP credentials directly
 */

async function testHostingerSMTP() {
  console.log('🧪 SMTP Test Script for Hostinger');
  console.log('=' .repeat(50));
  
  const smtpServer = 'smtp.hostinger.com';
  const senderEmail = 'accounts@intelliglobalconferences.com';
  const password = 'Muni@12345m';
  const receiverEmail = 'professor2004h@gmail.com';
  
  console.log('🔍 Testing Hostinger SMTP Configuration...');
  console.log(`Server: ${smtpServer}`);
  console.log(`Sender: ${senderEmail}`);
  console.log(`Receiver: ${receiverEmail}`);
  
  // Test different port configurations
  const configurations = [
    { port: 465, secure: true, name: 'SSL Port 465' },
    { port: 587, secure: false, name: 'STARTTLS Port 587' },
    { port: 25, secure: false, name: 'Plain Port 25' }
  ];
  
  for (const config of configurations) {
    console.log(`\n📧 Testing ${config.name}...`);
    
    try {
      // Create transporter
      const transporter = nodemailer.createTransport({
        host: smtpServer,
        port: config.port,
        secure: config.secure,
        auth: {
          user: senderEmail,
          pass: password,
        },
        tls: {
          rejectUnauthorized: false
        },
        connectionTimeout: 30000,
        greetingTimeout: 15000,
        socketTimeout: 30000,
        debug: true,
        logger: true
      });
      
      console.log(`  ✓ Transporter created for ${config.name}`);
      
      // Test connection
      console.log('  🔍 Testing connection...');
      await transporter.verify();
      console.log(`  ✅ Connection verified for ${config.name}`);
      
      // Send test email
      console.log('  📧 Sending test email...');
      const mailOptions = {
        from: `"Intelli Global Conferences" <${senderEmail}>`,
        to: receiverEmail,
        subject: `SMTP Test - ${config.name}`,
        html: `
          <h2>SMTP Test Email</h2>
          <p>This email was sent to test the Hostinger SMTP configuration.</p>
          <p><strong>Configuration Details:</strong></p>
          <ul>
            <li>Server: ${smtpServer}</li>
            <li>Port: ${config.port}</li>
            <li>Security: ${config.secure ? 'SSL' : 'STARTTLS'}</li>
            <li>From: ${senderEmail}</li>
            <li>To: ${receiverEmail}</li>
            <li>Timestamp: ${new Date().toISOString()}</li>
          </ul>
          <p>✅ If you receive this email, the SMTP configuration is working!</p>
        `,
        text: `SMTP Test Email - ${config.name}. Timestamp: ${new Date().toISOString()}`
      };
      
      const result = await transporter.sendMail(mailOptions);
      console.log(`  ✅ Email sent successfully via ${config.name}`);
      console.log(`  📧 Message ID: ${result.messageId}`);
      console.log(`  📧 Response: ${result.response}`);
      
      return { success: true, config: config.name, messageId: result.messageId };
      
    } catch (error) {
      console.log(`  ❌ ${config.name} failed:`);
      console.log(`     Error: ${error.message}`);
      console.log(`     Code: ${error.code}`);
      console.log(`     Command: ${error.command}`);
      console.log(`     Response: ${error.response}`);
    }
  }
  
  console.log('\n❌ All SMTP configurations failed');
  return { success: false };
}

async function testBasicConnection() {
  console.log('\n🔍 Testing basic connection to Hostinger SMTP...');
  
  const smtpServer = 'smtp.hostinger.com';
  const ports = [25, 587, 465];
  
  for (const port of ports) {
    try {
      console.log(`  Testing port ${port}...`);
      
      const transporter = nodemailer.createTransport({
        host: smtpServer,
        port: port,
        secure: port === 465,
        connectionTimeout: 10000,
        greetingTimeout: 5000,
        socketTimeout: 10000
      });
      
      await transporter.verify();
      console.log(`  ✓ Successfully connected to ${smtpServer}:${port}`);
      
    } catch (error) {
      console.log(`  ❌ Port ${port} failed: ${error.message}`);
    }
  }
}

async function main() {
  try {
    // Test basic connection first
    await testBasicConnection();
    
    // Test full SMTP with authentication
    const result = await testHostingerSMTP();
    
    if (result.success) {
      console.log('\n🎉 SMTP test completed successfully!');
      console.log(`✅ Working configuration: ${result.config}`);
      console.log(`📧 Message ID: ${result.messageId}`);
    } else {
      console.log('\n💡 Troubleshooting Suggestions:');
      console.log('1. Verify the email account exists in Hostinger control panel');
      console.log('2. Check if SMTP is enabled for the account');
      console.log('3. Confirm the password is correct');
      console.log('4. Check if 2FA is enabled (may need app password)');
      console.log('5. Try creating the email account if it doesn\'t exist');
      console.log('6. Contact Hostinger support for SMTP configuration');
      console.log('7. Check Hostinger documentation for correct SMTP settings');
    }
    
  } catch (error) {
    console.error('❌ Test script failed:', error);
  }
}

// Run the test
main();
