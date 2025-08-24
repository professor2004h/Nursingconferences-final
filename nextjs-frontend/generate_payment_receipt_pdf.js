const nodemailer = require('nodemailer');

/**
 * Generate and Send Payment Receipt PDF
 * Clean, simple design matching the provided image
 * Uses only contactus@intelliglobalconferences.com
 */

async function generateReceiptPDF() {
  // Import jsPDF for Node.js environment
  const { jsPDF } = require('jspdf');
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  // Colors matching the design
  const primaryBlue = [66, 103, 178]; // #4267B2 - Header blue
  const darkGray = [51, 51, 51];      // #333333 - Text
  const lightGray = [102, 102, 102];  // #666666 - Labels
  const white = [255, 255, 255];

  // Header - Blue background
  doc.setFillColor(...primaryBlue);
  doc.rect(0, 0, pageWidth, 50, 'F');

  // Company Name
  doc.setTextColor(...white);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Intelli Global Conferences', 20, 25);

  // Receipt Title
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Registration Receipt', 20, 38);

  // Conference Title
  doc.setTextColor(...darkGray);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('International Nursing Conference 2025', 20, 65);

  let yPos = 85;

  // Payment Information Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryBlue);
  doc.text('Payment Information', 20, yPos);
  yPos += 15;

  // Sample payment data
  const paymentData = {
    transactionId: 'BN23815972597140',
    orderId: 'BTW2281BRG4B674V',
    amount: '299.00',
    paymentMethod: 'PayPal',
    paymentDate: '8/23/2025, 10:00:00 PM',
    status: 'Completed'
  };

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...lightGray);

  // Transaction ID
  doc.text('Transaction ID:', 20, yPos);
  doc.setTextColor(...darkGray);
  doc.text(paymentData.transactionId, 80, yPos);
  yPos += 12;

  // Order ID
  doc.setTextColor(...lightGray);
  doc.text('Order ID:', 20, yPos);
  doc.setTextColor(...darkGray);
  doc.text(paymentData.orderId, 80, yPos);
  yPos += 12;

  // Amount
  doc.setTextColor(...lightGray);
  doc.text('Amount:', 20, yPos);
  doc.setTextColor(...darkGray);
  doc.text(`USD ${paymentData.amount}`, 80, yPos);
  yPos += 12;

  // Payment Method
  doc.setTextColor(...lightGray);
  doc.text('Payment Method:', 20, yPos);
  doc.setTextColor(...darkGray);
  doc.text(paymentData.paymentMethod, 80, yPos);
  yPos += 12;

  // Payment Date
  doc.setTextColor(...lightGray);
  doc.text('Payment Date:', 20, yPos);
  doc.setTextColor(...darkGray);
  doc.text(paymentData.paymentDate, 80, yPos);
  yPos += 12;

  // Status
  doc.setTextColor(...lightGray);
  doc.text('Status:', 20, yPos);
  doc.setTextColor(...darkGray);
  doc.text(paymentData.status, 80, yPos);
  yPos += 25;

  // Registration Details Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryBlue);
  doc.text('Registration Details', 20, yPos);
  yPos += 15;

  // Sample registration data
  const registrationData = {
    registrationId: 'TEMP-REG-MEH4JCK3928-WMQYMPRKUVF7K',
    fullName: 'Dr. Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1234567890',
    country: 'United States',
    address: '123 Main Street, Anytown, ST 12345, United States',
    registrationType: 'Regular Registration',
    numberOfParticipants: '1'
  };

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  // Registration ID
  doc.setTextColor(...lightGray);
  doc.text('Registration ID:', 20, yPos);
  doc.setTextColor(...darkGray);
  doc.text(registrationData.registrationId, 80, yPos);
  yPos += 12;

  // Full Name
  doc.setTextColor(...lightGray);
  doc.text('Full Name:', 20, yPos);
  doc.setTextColor(...darkGray);
  doc.text(registrationData.fullName, 80, yPos);
  yPos += 12;

  // Email
  doc.setTextColor(...lightGray);
  doc.text('Email:', 20, yPos);
  doc.setTextColor(...darkGray);
  doc.text(registrationData.email, 80, yPos);
  yPos += 12;

  // Phone
  doc.setTextColor(...lightGray);
  doc.text('Phone:', 20, yPos);
  doc.setTextColor(...darkGray);
  doc.text(registrationData.phone, 80, yPos);
  yPos += 12;

  // Country
  doc.setTextColor(...lightGray);
  doc.text('Country:', 20, yPos);
  doc.setTextColor(...darkGray);
  doc.text(registrationData.country, 80, yPos);
  yPos += 12;

  // Address
  doc.setTextColor(...lightGray);
  doc.text('Address:', 20, yPos);
  doc.setTextColor(...darkGray);
  doc.text(registrationData.address, 80, yPos);
  yPos += 12;

  // Registration Type
  doc.setTextColor(...lightGray);
  doc.text('Registration Type:', 20, yPos);
  doc.setTextColor(...darkGray);
  doc.text(registrationData.registrationType, 80, yPos);
  yPos += 12;

  // Number of Participants
  doc.setTextColor(...lightGray);
  doc.text('Number of Participants:', 20, yPos);
  doc.setTextColor(...darkGray);
  doc.text(registrationData.numberOfParticipants, 80, yPos);
  yPos += 25;

  // Payment Summary Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryBlue);
  doc.text('Payment Summary', 20, yPos);
  yPos += 15;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  // Registration Fee
  doc.setTextColor(...lightGray);
  doc.text('Registration Fee:', 20, yPos);
  doc.setTextColor(...darkGray);
  doc.text('USD 299', 80, yPos);
  yPos += 12;

  // Total Amount
  doc.setTextColor(...lightGray);
  doc.text('Total Amount:', 20, yPos);
  doc.setTextColor(...darkGray);
  doc.setFont('helvetica', 'bold');
  doc.text('USD 299', 80, yPos);
  yPos += 25;

  // Contact Information Section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryBlue);
  doc.text('Contact Information', 20, yPos);
  yPos += 15;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...darkGray);

  doc.text('Email: contactus@intelliglobalconferences.com', 20, yPos);
  yPos += 10;

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(...lightGray);
  doc.text('© 2025 International Nursing Conference 2025', 20, pageHeight - 20);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, pageHeight - 10);

  // Convert to buffer
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  return pdfBuffer;
}

async function sendReceiptEmail() {
  console.log('📧 Generating and Sending Payment Receipt PDF');
  console.log('=' .repeat(60));

  // Working SMTP configuration - using only contactus@
  const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: {
      user: 'contactus@intelliglobalconferences.com',
      pass: 'Muni@12345m',
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('📄 Generating PDF receipt...');
    const pdfBuffer = await generateReceiptPDF();
    console.log('✅ PDF generated successfully');

    const recipient = 'professor2004h@gmail.com';
    const transactionId = 'BN23815972597140';

    console.log(`📧 Sending receipt to: ${recipient}`);

    const mailOptions = {
      from: '"Intelli Global Conferences" <contactus@intelliglobalconferences.com>',
      to: recipient,
      subject: '✅ Payment Receipt - International Nursing Conference 2025',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #4267B2 0%, #5a7bc8 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px;">
            <h1 style="margin: 0; font-size: 24px;">Payment Receipt</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">International Nursing Conference 2025</p>
          </div>
          
          <div style="padding: 30px 20px; text-align: center; background-color: #f8f9fa; margin: 20px 0; border-radius: 8px;">
            <h2 style="color: #28a745; margin: 0 0 10px 0;">✅ Payment Confirmed</h2>
            <p style="color: #333; margin: 0; font-size: 16px;">Your registration payment has been successfully processed.</p>
            <p style="color: #666; margin: 10px 0 0 0; font-size: 14px;">Transaction ID: ${transactionId}</p>
          </div>
          
          <div style="padding: 20px; background-color: #e3f2fd; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1976d2; margin: 0 0 15px 0;">📎 Receipt Attached</h3>
            <p style="color: #333; margin: 0 0 10px 0;">Your detailed payment receipt is attached as a PDF file.</p>
            <p style="color: #666; margin: 0; font-size: 14px;">Please save this receipt for your records.</p>
          </div>
          
          <div style="padding: 20px; background-color: #fff3cd; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #856404; margin: 0 0 15px 0;">📋 Next Steps</h3>
            <ul style="color: #333; margin: 0; padding-left: 20px;">
              <li>Keep this receipt for your records</li>
              <li>Conference details will be sent closer to the event date</li>
              <li>Contact us if you have any questions</li>
            </ul>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #666; border-top: 1px solid #dee2e6;">
            <p style="margin: 0 0 10px 0;">
              📧 <strong>Contact:</strong> contactus@intelliglobalconferences.com
            </p>
            <p style="margin: 0; font-size: 12px;">
              Thank you for registering with Intelli Global Conferences!
            </p>
          </div>
        </div>
      `,
      text: `
Payment Receipt - International Nursing Conference 2025

✅ Payment Confirmed
Your registration payment has been successfully processed.
Transaction ID: ${transactionId}

📎 Receipt Attached
Your detailed payment receipt is attached as a PDF file.
Please save this receipt for your records.

📋 Next Steps:
- Keep this receipt for your records
- Conference details will be sent closer to the event date
- Contact us if you have any questions

📧 Contact: contactus@intelliglobalconferences.com

Thank you for registering with Intelli Global Conferences!
      `,
      attachments: [
        {
          filename: `Payment_Receipt_${transactionId}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    };

    const result = await transporter.sendMail(mailOptions);
    
    console.log('✅ Receipt email sent successfully!');
    console.log(`📧 Message ID: ${result.messageId}`);
    console.log(`📧 Response: ${result.response}`);
    
    return {
      success: true,
      messageId: result.messageId,
      transactionId,
      recipient,
      pdfSize: pdfBuffer.length
    };

  } catch (error) {
    console.log('❌ Failed to send receipt email:');
    console.log(`Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function main() {
  try {
    console.log('🚀 Starting Payment Receipt PDF Test...\n');
    
    const result = await sendReceiptEmail();
    
    if (result.success) {
      console.log('\n🎉 SUCCESS! Payment Receipt PDF Sent!');
      console.log('=' .repeat(60));
      console.log(`✅ Transaction ID: ${result.transactionId}`);
      console.log(`✅ Recipient: ${result.recipient}`);
      console.log(`✅ PDF Size: ${(result.pdfSize / 1024).toFixed(2)} KB`);
      console.log(`✅ Message ID: ${result.messageId}`);
      
      console.log('\n📄 PDF Features:');
      console.log('✅ Clean, simple design matching your image');
      console.log('✅ Professional blue header with white text');
      console.log('✅ Complete payment information section');
      console.log('✅ Detailed registration details');
      console.log('✅ Payment summary with amounts');
      console.log('✅ Contact information');
      console.log('✅ Downloadable PDF attachment');
      
      console.log('\n📧 Email Features:');
      console.log('✅ Uses only contactus@intelliglobalconferences.com');
      console.log('✅ Clean HTML email with PDF attachment');
      console.log('✅ Professional design and messaging');
      console.log('✅ Clear next steps for the user');
      
      console.log('\n🔍 Check Your Email:');
      console.log('📧 Check professor2004h@gmail.com for the receipt');
      console.log('📎 Download and view the PDF attachment');
      console.log('🎨 PDF matches the design from your image');
      
    } else {
      console.log('\n❌ Failed to send receipt');
      console.log(`Error: ${result.error}`);
    }
    
  } catch (error) {
    console.error('❌ Test script failed:', error);
  }
}

// Run the test
main();
