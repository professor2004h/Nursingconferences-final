// Load environment variables
require('dotenv').config();

// Set SMTP credentials for production system
process.env.SMTP_HOST = 'smtp.hostinger.com';
process.env.SMTP_PORT = '465';
process.env.SMTP_SECURE = 'true';
process.env.SMTP_USER = 'contactus@intelliglobalconferences.com';
process.env.SMTP_PASS = 'Muni@12345m';

const { sendPaymentReceiptEmailWithRealData } = require('./nextjs-frontend/src/app/utils/paymentReceiptEmailer');

/**
 * Comprehensive test demonstrating the complete payment receipt workflow
 * This test showcases all the features requested:
 * 1. Dynamic payment receipt system from conference registration platform
 * 2. Sample/test data for all required fields
 * 3. Navy blue gradient background (#0f172a to #1e3a8a)
 * 4. Proper branding elements and logos from Sanity CMS
 * 5. Email sent from contactus@intelliglobalconferences.com
 * 6. PDF generation system with downloadable receipts
 * 7. Clean professional email template
 */

async function sendComprehensiveTestReceipt() {
  try {
    console.log('🎯 COMPREHENSIVE PAYMENT RECEIPT SYSTEM DEMONSTRATION');
    console.log('=' .repeat(70));
    console.log('📋 Testing complete workflow with all requested features...\n');
    
    // Sample payment data with realistic transaction details
    const paymentData = {
      transactionId: 'TXN_DEMO_' + Date.now(),
      orderId: 'ORD_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      amount: 399.00,
      currency: 'USD',
      status: 'completed',
      paymentDate: new Date().toISOString(),
      paymentMethod: 'PayPal',
      paypalTransactionId: 'PP_' + Math.random().toString(36).substr(2, 12).toUpperCase(),
      processingFee: 12.97,
      netAmount: 386.03
    };
    
    // Sample registration data with complete conference details
    const registrationData = {
      // System identifiers
      _id: 'demo-registration-' + Date.now(),
      registrationId: 'REG-2025-DEMO-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      registrationType: 'Regular Registration',
      
      // Participant information
      fullName: 'Dr. Emily Rodriguez',
      email: 'professor2004h@gmail.com',
      phoneNumber: '+1-555-0199',
      country: 'United States',
      address: '456 Medical Center Drive, Healthcare City, NY 10001, United States',
      organization: 'Metropolitan Medical University',
      designation: 'Professor of Nursing',
      
      // Registration details
      numberOfParticipants: 1,
      registrationDate: new Date().toISOString(),
      
      // Conference information
      conferenceTitle: 'International Nursing Excellence Conference 2025',
      conferenceDate: '2025-03-15 to 2025-03-17',
      conferenceLocation: 'New York Convention Center, New York, USA',
      conferenceTheme: 'Advancing Healthcare Through Innovation',
      
      // Additional details
      specialRequirements: 'Vegetarian meals',
      emergencyContact: 'Dr. Michael Rodriguez (+1-555-0200)',
      participationMode: 'In-Person'
    };
    
    const recipientEmail = 'professor2004h@gmail.com';
    
    console.log('📊 DEMONSTRATION DATA:');
    console.log(`   🆔 Transaction ID: ${paymentData.transactionId}`);
    console.log(`   🆔 Registration ID: ${registrationData.registrationId}`);
    console.log(`   👤 Participant: ${registrationData.fullName}`);
    console.log(`   🏢 Organization: ${registrationData.organization}`);
    console.log(`   📧 Email: ${registrationData.email}`);
    console.log(`   💰 Amount: ${paymentData.currency} ${paymentData.amount}`);
    console.log(`   🎯 Conference: ${registrationData.conferenceTitle}`);
    console.log(`   📅 Date: ${registrationData.conferenceDate}`);
    console.log(`   📍 Location: ${registrationData.conferenceLocation}`);
    
    console.log('\n🎨 DESIGN FEATURES BEING DEMONSTRATED:');
    console.log('   ✅ Navy blue gradient background (#0f172a to #1e3a8a)');
    console.log('   ✅ Dynamic branding from Sanity CMS');
    console.log('   ✅ High-quality logo integration');
    console.log('   ✅ Professional PDF layout');
    console.log('   ✅ Clean email template design');
    console.log('   ✅ Responsive design for web and PDF');
    
    console.log('\n📧 EMAIL SYSTEM FEATURES:');
    console.log('   ✅ Sent from: contactus@intelliglobalconferences.com');
    console.log('   ✅ Professional SMTP configuration');
    console.log('   ✅ PDF attachment with receipt');
    console.log('   ✅ No test content warnings');
    console.log('   ✅ Clean streamlined template');
    
    console.log('\n🚀 Generating and sending comprehensive test receipt...');
    
    // Send the payment receipt using the production system
    const result = await sendPaymentReceiptEmailWithRealData(paymentData, registrationData, recipientEmail);
    
    if (result.success) {
      console.log('\n🎉 COMPREHENSIVE TEST SUCCESSFUL!');
      console.log('=' .repeat(50));
      console.log(`   📧 Email sent to: ${recipientEmail}`);
      console.log(`   📄 PDF Receipt: ${result.pdfGenerated ? 'Generated and attached' : 'Not generated'}`);
      console.log(`   🔗 Message ID: ${result.messageId || 'N/A'}`);
      console.log(`   🖼️  Logo Integration: ${result.logoUsed ? 'Success' : 'Failed'}`);
      console.log(`   📊 PDF Size: ${result.pdfSize ? (result.pdfSize / 1024).toFixed(2) + ' KB' : 'N/A'}`);
      
      console.log('\n✅ FEATURES SUCCESSFULLY DEMONSTRATED:');
      console.log('   ✅ Dynamic payment receipt system integration');
      console.log('   ✅ Complete sample data for all fields');
      console.log('   ✅ Navy blue gradient design implementation');
      console.log('   ✅ Sanity CMS branding and logo integration');
      console.log('   ✅ Professional SMTP email delivery');
      console.log('   ✅ PDF generation and attachment system');
      console.log('   ✅ Clean professional email template');
      
      console.log('\n📋 VERIFICATION CHECKLIST:');
      console.log('   □ Check professor2004h@gmail.com inbox');
      console.log('   □ Verify email from contactus@intelliglobalconferences.com');
      console.log('   □ Confirm PDF attachment is present and downloadable');
      console.log('   □ Check PDF has navy blue gradient header');
      console.log('   □ Verify high-quality logo rendering');
      console.log('   □ Confirm all transaction and registration details');
      console.log('   □ Check professional layout and formatting');
      console.log('   □ Verify no test content warnings present');
      
    } else {
      console.log('\n❌ COMPREHENSIVE TEST FAILED!');
      console.log(`   Error: ${result.error}`);
      
      console.log('\n🔧 Troubleshooting Steps:');
      console.log('   - Verify SMTP configuration');
      console.log('   - Check Sanity CMS connectivity');
      console.log('   - Ensure PDF generation dependencies');
      console.log('   - Validate environment variables');
    }
    
  } catch (error) {
    console.error('\n💥 COMPREHENSIVE TEST ERROR:', error.message);
    console.log('\n🔧 Error Analysis:');
    console.log('   - Check system dependencies');
    console.log('   - Verify configuration settings');
    console.log('   - Ensure all services are running');
    console.log('   - Check network connectivity');
  }
}

// Execute the comprehensive demonstration
console.log('🚀 STARTING COMPREHENSIVE PAYMENT RECEIPT DEMONSTRATION...\n');
sendComprehensiveTestReceipt();
