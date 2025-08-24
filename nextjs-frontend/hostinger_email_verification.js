/**
 * Hostinger Email Account Verification Script
 * Based on comprehensive web research and official documentation
 */

const nodemailer = require('nodemailer');

async function verifyHostingerEmailAccount() {
  console.log('🔍 Hostinger Email Account Verification');
  console.log('=' .repeat(60));
  console.log('Based on comprehensive web research findings\n');
  
  const emailAccount = 'accounts@intelliglobalconferences.com';
  const password = 'Muni@12345m';
  
  console.log(`📧 Testing email account: ${emailAccount}`);
  console.log(`🔐 Using password: ${password}`);
  
  // Test SMTP with official Hostinger settings
  console.log('\n🧪 Testing SMTP Authentication...');
  console.log('-'.repeat(50));
  
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.hostinger.com',
      port: 465,
      secure: true,
      auth: {
        user: emailAccount,
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
    
    console.log('✓ SMTP transporter created');
    console.log('🔍 Testing authentication...');
    
    await transporter.verify();
    console.log('✅ SUCCESS! SMTP authentication successful!');
    console.log('🎉 Email account exists and SMTP is working!');
    
    return { success: true, message: 'Email account verified and SMTP working' };
    
  } catch (error) {
    console.log('❌ SMTP authentication failed');
    console.log(`Error: ${error.message}`);
    
    if (error.message.includes('535 5.7.8 Error: authentication failed')) {
      console.log('\n🔍 DIAGNOSIS: Email account does not exist');
      console.log('This is the most common cause based on research');
      return { success: false, diagnosis: 'account_not_exists' };
    }
    
    return { success: false, diagnosis: 'other_error', error: error.message };
  }
}

async function main() {
  console.log('🚀 Starting Hostinger Email Verification...\n');
  
  const result = await verifyHostingerEmailAccount();
  
  if (result.success) {
    console.log('\n🎉 VERIFICATION SUCCESSFUL!');
    console.log('=' .repeat(60));
    console.log('✅ Email account exists and is properly configured');
    console.log('✅ SMTP authentication is working');
    console.log('✅ Ready to send emails via SMTP');
    
    console.log('\n📝 Working Configuration:');
    console.log('SMTP_HOST=smtp.hostinger.com');
    console.log('SMTP_PORT=465');
    console.log('SMTP_SECURE=true');
    console.log('SMTP_USER=accounts@intelliglobalconferences.com');
    console.log('SMTP_PASS=Muni@12345m');
    console.log('EMAIL_FROM=accounts@intelliglobalconferences.com');
    console.log('EMAIL_FROM_NAME=Intelli Global Conferences');
    
  } else if (result.diagnosis === 'account_not_exists') {
    console.log('\n❌ VERIFICATION FAILED: Email Account Does Not Exist');
    console.log('=' .repeat(60));
    
    console.log('\n🔧 SOLUTION: Create Email Account in Hostinger hPanel');
    console.log('Based on official Hostinger documentation:');
    console.log('');
    console.log('1. 🌐 Login to Hostinger hPanel');
    console.log('   URL: https://hpanel.hostinger.com');
    console.log('');
    console.log('2. 📧 Navigate to Email Management');
    console.log('   - Click "Emails" in the top menu');
    console.log('   - Click "Manage" next to intelliglobalconferences.com');
    console.log('');
    console.log('3. 📬 Create Email Account');
    console.log('   - Click "Mailboxes" in the sidebar');
    console.log('   - Click "Create a mailbox" button');
    console.log('   - Email name: accounts');
    console.log('   - Password: Muni@12345m');
    console.log('   - Click "Create"');
    console.log('');
    console.log('4. ✅ Verify Account Creation');
    console.log('   - Test webmail login: https://mail.hostinger.com');
    console.log('   - Username: accounts@intelliglobalconferences.com');
    console.log('   - Password: Muni@12345m');
    console.log('   - If login succeeds, SMTP will work');
    console.log('');
    console.log('5. 🔄 Re-run this verification script');
    
    console.log('\n📋 Email Account Requirements (from Hostinger docs):');
    console.log('- Name: 1-50 characters long');
    console.log('- Allowed: letters (a-z), numbers (0-9), periods (.)');
    console.log('- Not allowed: &, =, _, \', -, +, ,, <, >, multiple periods');
    
    console.log('\n⚙️  Alternative: Check Email Service Status');
    console.log('If account exists but SMTP fails:');
    console.log('1. In hPanel → Emails → Mailboxes');
    console.log('2. Find accounts@intelliglobalconferences.com');
    console.log('3. Click options (⋮) → Settings');
    console.log('4. Ensure all services are enabled:');
    console.log('   ✅ Email account enabled');
    console.log('   ✅ Access enabled');
    console.log('   ✅ Sending enabled');
    console.log('   ✅ Receiving enabled');
    
  } else {
    console.log('\n❌ VERIFICATION FAILED: Other Error');
    console.log('=' .repeat(60));
    console.log(`Error: ${result.error}`);
    
    console.log('\n🔍 Additional Troubleshooting Steps:');
    console.log('1. Check Hostinger service status: https://statuspage.hostinger.com');
    console.log('2. Verify domain intelliglobalconferences.com is active');
    console.log('3. Ensure email services are included in hosting plan');
    console.log('4. Contact Hostinger support if issues persist');
  }
  
  console.log('\n📚 Research Sources:');
  console.log('- Hostinger Official Documentation');
  console.log('- SMTP Authentication Error Analysis');
  console.log('- Email Account Creation Requirements');
  console.log('- Service Status Management Options');
}

// Run the verification
main().catch(console.error);
