const nodemailer = require('nodemailer');

/**
 * Test Corrected SMTP Configuration
 * Using actual mailbox (contact@) for authentication
 * While sending from alias (accounts@)
 */

async function testCorrectedSMTP() {
  console.log('🔧 Testing Corrected SMTP Configuration');
  console.log('=' .repeat(60));
  console.log('Issue: accounts@ is an alias of contactus@');
  console.log('Solution: Authenticate with contactus@, send from accounts@\n');
  
  const smtpUser = 'contactus@intelliglobalconferences.com';  // Actual mailbox for auth
  const emailFrom = 'accounts@intelliglobalconferences.com'; // Alias for sending
  const password = 'Muni@12345m';
  const testRecipient = 'professor2004h@gmail.com';
  
  console.log(`🔐 SMTP Authentication: ${smtpUser}`);
  console.log(`📧 Email From Address: ${emailFrom}`);
  console.log(`📧 Test Recipient: ${testRecipient}`);
  
  try {
    // Create transporter with actual mailbox for authentication
    const transporter = nodemailer.createTransport({
      host: 'smtp.hostinger.com',
      port: 465,
      secure: true,
      auth: {
        user: smtpUser,        // Use actual mailbox for authentication
        pass: password,
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
    
    console.log('\n✓ SMTP transporter created');
    console.log('🔍 Testing authentication with actual mailbox...');
    
    // Test authentication
    await transporter.verify();
    console.log('✅ SMTP authentication successful!');
    
    // Send test email using alias as sender
    console.log('\n📧 Sending test email...');
    const mailOptions = {
      from: `"Intelli Global Conferences" <${emailFrom}>`, // Use alias as sender
      to: testRecipient,
      subject: '✅ SMTP Fixed - Alias Configuration Working',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px;">
            <h1>🎉 SMTP Configuration Fixed!</h1>
            <p>Email alias issue resolved successfully</p>
          </div>
          
          <div style="padding: 20px; background-color: #f9f9f9; margin: 20px 0; border-radius: 8px;">
            <h2>✅ Working Configuration</h2>
            <p><strong>SMTP Authentication:</strong> ${smtpUser}</p>
            <p><strong>Email From Address:</strong> ${emailFrom}</p>
            <p><strong>SMTP Server:</strong> smtp.hostinger.com</p>
            <p><strong>Port:</strong> 465 (SSL)</p>
            <p><strong>Test Time:</strong> ${new Date().toISOString()}</p>
          </div>
          
          <div style="padding: 20px; background-color: #eff6ff; border-left: 4px solid #3b82f6; margin: 20px 0;">
            <h3>🔧 Solution Applied</h3>
            <ul>
              <li>✅ Use actual mailbox (contactus@) for SMTP authentication</li>
              <li>✅ Send emails from alias (accounts@) address</li>
              <li>✅ Recipients see emails from accounts@intelliglobalconferences.com</li>
              <li>✅ Replies go to the alias (forwarded to contactus@)</li>
            </ul>
          </div>
          
          <div style="padding: 20px; background-color: #fef3c7; border-left: 4px solid #f59e0b; margin: 20px 0;">
            <h3>📝 Key Learning</h3>
            <p><strong>Email aliases cannot authenticate via SMTP</strong> - only actual mailboxes can. This is why the authentication was failing.</p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
            <p>This email confirms that the SMTP alias configuration is working correctly.</p>
            <p>Authentication: ${smtpUser} | Sender: ${emailFrom}</p>
          </div>
        </div>
      `,
      text: `
SMTP Configuration Fixed!

Working Configuration:
- SMTP Authentication: ${smtpUser}
- Email From Address: ${emailFrom}
- SMTP Server: smtp.hostinger.com
- Port: 465 (SSL)
- Test Time: ${new Date().toISOString()}

Solution Applied:
✅ Use actual mailbox (contactus@) for SMTP authentication
✅ Send emails from alias (accounts@) address
✅ Recipients see emails from accounts@intelliglobalconferences.com
✅ Replies go to the alias (forwarded to contactus@)

Key Learning: Email aliases cannot authenticate via SMTP - only actual mailboxes can.
      `
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully!');
    console.log(`📧 Message ID: ${result.messageId}`);
    console.log(`📧 Response: ${result.response}`);
    
    return {
      success: true,
      messageId: result.messageId,
      configuration: {
        smtpUser,
        emailFrom,
        host: 'smtp.hostinger.com',
        port: 465,
        secure: true
      }
    };
    
  } catch (error) {
    console.log('❌ SMTP test failed:');
    console.log(`Error: ${error.message}`);
    
    if (error.code === 'EAUTH') {
      console.log('\n🔍 Authentication still failing...');
      console.log('Possible causes:');
      console.log('1. Password incorrect for contactus@intelliglobalconferences.com');
      console.log('2. contactus@ mailbox may also not exist');
      console.log('3. Email services disabled for contactus@ account');
    }
    
    return { success: false, error: error.message };
  }
}

async function main() {
  try {
    console.log('🚀 Starting Corrected SMTP Test...\n');
    
    const result = await testCorrectedSMTP();
    
    if (result.success) {
      console.log('\n🎉 SUCCESS! SMTP Configuration Fixed!');
      console.log('=' .repeat(60));
      console.log('✅ Authentication working with actual mailbox');
      console.log('✅ Sending working with alias address');
      console.log(`✅ Message ID: ${result.messageId}`);
      
      console.log('\n📝 Final .env.local Configuration:');
      console.log('SMTP_HOST=smtp.hostinger.com');
      console.log('SMTP_PORT=465');
      console.log('SMTP_SECURE=true');
      console.log('SMTP_USER=contactus@intelliglobalconferences.com');
      console.log('SMTP_PASS=Muni@12345m');
      console.log('EMAIL_FROM=accounts@intelliglobalconferences.com');
      console.log('EMAIL_FROM_NAME=Intelli Global Conferences');
      
      console.log('\n🚀 Next Steps:');
      console.log('1. ✅ SMTP configuration is now working');
      console.log('2. Test the payment receipt email system');
      console.log('3. Check professor2004h@gmail.com for the test email');
      console.log('4. Deploy to production with working configuration');
      
    } else {
      console.log('\n❌ SMTP test still failing');
      console.log('Additional troubleshooting may be needed');
      console.log('Check if contactus@intelliglobalconferences.com mailbox exists and is active');
    }
    
  } catch (error) {
    console.error('❌ Test script failed:', error);
  }
}

// Run the test
main();
