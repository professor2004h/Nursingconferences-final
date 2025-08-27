#!/usr/bin/env node

/**
 * SIMPLE TEST EMAIL SENDER
 * Sends test payment receipts to professor2004h@gmail.com using the existing email system
 */

import { sendPaymentReceiptEmailWithRealData } from './src/app/utils/paymentReceiptEmailer.js';

// Test email configuration
const TEST_EMAIL = 'professor2004h@gmail.com';

// Sample test data for PayPal
const paypalTestData = {
  paymentData: {
    transactionId: 'TEST-PAYPAL-' + Date.now(),
    orderId: 'ORDER-PAYPAL-' + Date.now(),
    amount: 749.00,
    currency: 'USD',
    capturedAt: new Date().toISOString(),
    paymentMethod: 'PayPal'
  },
  registrationData: {
    _id: 'test-paypal-reg-' + Date.now(),
    registrationId: 'PAYPAL-TEST-' + Date.now(),
    personalDetails: {
      firstName: 'John',
      lastName: 'Doe',
      email: TEST_EMAIL,
      phoneNumber: '+1-555-0123',
      country: 'United States'
    },
    registrationType: 'regular',
    accommodationType: 'hotel-standard-3nights',
    pricing: {
      registrationFee: 299.00,
      accommodationFee: 450.00,
      totalPrice: 749.00,
      currency: 'USD'
    },
    paymentStatus: 'completed'
  }
};

// Sample test data for Razorpay
const razorpayTestData = {
  paymentData: {
    transactionId: 'pay_test_' + Date.now(),
    orderId: 'order_test_' + Date.now(),
    amount: 55000.00,
    currency: 'INR',
    capturedAt: new Date().toISOString(),
    paymentMethod: 'Razorpay'
  },
  registrationData: {
    _id: 'test-razorpay-reg-' + Date.now(),
    registrationId: 'RAZORPAY-TEST-' + Date.now(),
    personalDetails: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: TEST_EMAIL,
      phoneNumber: '+91-98765-43210',
      country: 'India'
    },
    registrationType: 'regular',
    accommodationType: 'hotel-deluxe-2nights',
    pricing: {
      registrationFee: 22000.00,
      accommodationFee: 33000.00,
      totalPrice: 55000.00,
      currency: 'INR'
    },
    paymentStatus: 'completed'
  }
};

/**
 * Send PayPal test email
 */
async function sendPayPalTestEmail() {
  console.log('\n💳 SENDING PAYPAL TEST EMAIL');
  console.log('=' .repeat(50));
  console.log(`📧 Recipient: ${TEST_EMAIL}`);
  console.log(`💰 Amount: ${paypalTestData.paymentData.currency} ${paypalTestData.paymentData.amount}`);
  console.log(`🆔 Transaction ID: ${paypalTestData.paymentData.transactionId}`);
  
  try {
    const result = await sendPaymentReceiptEmailWithRealData(
      paypalTestData.paymentData,
      paypalTestData.registrationData,
      TEST_EMAIL
    );
    
    if (result.success) {
      console.log('✅ PayPal test email sent successfully!');
      console.log(`📧 Message ID: ${result.messageId}`);
      console.log(`📄 PDF Generated: ${result.pdfGenerated ? 'Yes' : 'No'}`);
      console.log(`📤 PDF Uploaded: ${result.pdfUploaded ? 'Yes' : 'No'}`);
      if (result.pdfSize) {
        console.log(`📊 PDF Size: ${(result.pdfSize / 1024).toFixed(2)} KB`);
      }
    } else {
      console.error('❌ PayPal test email failed:', result.error);
    }
    
    return result;
    
  } catch (error) {
    console.error('❌ PayPal test email error:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Send Razorpay test email
 */
async function sendRazorpayTestEmail() {
  console.log('\n💳 SENDING RAZORPAY TEST EMAIL');
  console.log('=' .repeat(50));
  console.log(`📧 Recipient: ${TEST_EMAIL}`);
  console.log(`💰 Amount: ${razorpayTestData.paymentData.currency} ${razorpayTestData.paymentData.amount}`);
  console.log(`🆔 Transaction ID: ${razorpayTestData.paymentData.transactionId}`);
  
  try {
    const result = await sendPaymentReceiptEmailWithRealData(
      razorpayTestData.paymentData,
      razorpayTestData.registrationData,
      TEST_EMAIL
    );
    
    if (result.success) {
      console.log('✅ Razorpay test email sent successfully!');
      console.log(`📧 Message ID: ${result.messageId}`);
      console.log(`📄 PDF Generated: ${result.pdfGenerated ? 'Yes' : 'No'}`);
      console.log(`📤 PDF Uploaded: ${result.pdfUploaded ? 'Yes' : 'No'}`);
      if (result.pdfSize) {
        console.log(`📊 PDF Size: ${(result.pdfSize / 1024).toFixed(2)} KB`);
      }
    } else {
      console.error('❌ Razorpay test email failed:', result.error);
    }
    
    return result;
    
  } catch (error) {
    console.error('❌ Razorpay test email error:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Send both test emails
 */
async function sendAllTestEmails() {
  console.log('🚀 SENDING TEST PAYMENT RECEIPT EMAILS');
  console.log('=' .repeat(80));
  console.log(`📧 Test emails will be sent to: ${TEST_EMAIL}`);
  console.log(`📧 Sender: contactus@intelliglobalconferences.com`);
  console.log('=' .repeat(80));
  
  const results = {
    paypal: null,
    razorpay: null,
    summary: {
      totalEmails: 0,
      successfulEmails: 0,
      failedEmails: 0,
      errors: []
    }
  };
  
  try {
    // Send PayPal test email
    results.paypal = await sendPayPalTestEmail();
    results.summary.totalEmails++;
    
    if (results.paypal.success) {
      results.summary.successfulEmails++;
    } else {
      results.summary.failedEmails++;
      results.summary.errors.push(`PayPal: ${results.paypal.error}`);
    }
    
    // Wait 3 seconds between emails
    console.log('\n⏱️  Waiting 3 seconds before sending next email...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Send Razorpay test email
    results.razorpay = await sendRazorpayTestEmail();
    results.summary.totalEmails++;
    
    if (results.razorpay.success) {
      results.summary.successfulEmails++;
    } else {
      results.summary.failedEmails++;
      results.summary.errors.push(`Razorpay: ${results.razorpay.error}`);
    }
    
    // Print summary
    console.log('\n📊 TEST EMAIL SUMMARY');
    console.log('=' .repeat(50));
    console.log(`📧 Total Emails Sent: ${results.summary.totalEmails}`);
    console.log(`✅ Successful: ${results.summary.successfulEmails}`);
    console.log(`❌ Failed: ${results.summary.failedEmails}`);
    console.log(`📧 Recipient: ${TEST_EMAIL}`);
    
    if (results.summary.errors.length > 0) {
      console.log('\n❌ ERRORS:');
      results.summary.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
    }
    
    if (results.summary.successfulEmails > 0) {
      console.log('\n✅ SUCCESS! Check your email inbox for payment receipts.');
      console.log('📧 Look for emails from: contactus@intelliglobalconferences.com');
      console.log('📄 Each email should contain a PDF receipt attachment.');
    }
    
    console.log('=' .repeat(50));
    
    return results;
    
  } catch (error) {
    console.error('❌ Test email execution failed:', error);
    results.summary.errors.push(`Execution error: ${error.message}`);
    return results;
  }
}

// Export for programmatic use
export {
  sendPayPalTestEmail,
  sendRazorpayTestEmail,
  sendAllTestEmails
};

// Run if called directly
if (process.argv[1] && process.argv[1].includes('send-test-emails.js')) {
  sendAllTestEmails()
    .then(results => {
      const success = results.summary.failedEmails === 0;
      console.log(`\n🎯 FINAL RESULT: ${success ? '✅ ALL EMAILS SENT' : '❌ SOME EMAILS FAILED'}`);
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Test execution failed:', error);
      process.exit(1);
    });
}
