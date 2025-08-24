// Load environment variables
require('dotenv').config();

// Set SMTP credentials directly for testing
process.env.SMTP_HOST = 'smtp.hostinger.com';
process.env.SMTP_PORT = '465';
process.env.SMTP_SECURE = 'true';
process.env.SMTP_USER = 'contactus@intelliglobalconferences.com';
process.env.SMTP_PASS = 'Muni@12345m';

const { sendPaymentReceiptEmail } = require('./nextjs-frontend/src/app/utils/paymentReceiptEmailer');

// Sample payment data
const paymentData = {
  transactionId: 'BN238159725971407',
  orderId: 'BTW2281BRG4B675B',
  amount: '299.00',
  currency: 'USD',
  paymentMethod: 'PayPal',
  paymentDate: new Date().toLocaleString(),
  status: 'Completed'
};

// Sample registration data
const registrationData = {
  registrationId: 'TEMP-REG-MFH4JCK3928-WMQYMPRKUVF7R',
  fullName: 'Test User Streamlined Layout',
  email: 'professor2004h@gmail.com',
  phone: '+1-555-0123',
  country: 'United States',
  address: '123 Test Street, Test City, TC 12345',
  registrationType: 'Regular Registration',
  numberOfParticipants: '1'
};

// Send final receipt with STREAMLINED layout - enlarged logo, no payment summary
async function sendFinalReceipt() {
  try {
    console.log('🚀 Sending payment receipt with STREAMLINED layout - enlarged logo, clean content...');
    
    const result = await sendPaymentReceiptEmail(
      paymentData,
      registrationData,
      'professor2004h@gmail.com'
    );
    
    if (result.success) {
      console.log('✅ Receipt sent successfully!');
      console.log('📧 Message ID:', result.messageId);
      console.log('🖼️ Logo used:', result.logoUsed);
      console.log('📄 PDF generated:', result.pdfGenerated);
      if (result.pdfGenerated) {
        console.log('📊 PDF size:', result.pdfSize, 'bytes');
      }
    } else {
      console.error('❌ Failed to send receipt:', result.error);
    }
  } catch (error) {
    console.error('❌ Error sending final receipt:', error);
  }
}

sendFinalReceipt();
