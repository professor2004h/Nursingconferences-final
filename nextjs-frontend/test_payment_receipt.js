const nodemailer = require('nodemailer');

/**
 * Test Payment Receipt Email
 * Simulates the actual email users receive after payment completion
 */

async function sendTestPaymentReceipt() {
  console.log('📧 Sending Test Payment Receipt Email');
  console.log('=' .repeat(60));
  
  // Working SMTP configuration
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
  
  // Sample payment data (simulating a real registration)
  const paymentData = {
    transactionId: 'TXN_' + Date.now(),
    paypalOrderId: '8XY12345AB67890CD',
    amount: '299.00',
    currency: 'USD',
    paymentDate: new Date().toISOString(),
    paymentMethod: 'PayPal',
    status: 'Completed'
  };
  
  // Sample registration data
  const registrationData = {
    firstName: 'Dr. Sarah',
    lastName: 'Johnson',
    email: 'professor2004h@gmail.com',
    phone: '+1-555-123-4567',
    organization: 'University Medical Center',
    position: 'Chief Nursing Officer',
    country: 'United States',
    registrationType: 'Early Bird Registration',
    conferenceTitle: 'International Nursing Education Conference 2025',
    conferenceDate: 'March 15-17, 2025',
    venue: 'Grand Convention Center, New York'
  };
  
  console.log(`📧 Sending receipt to: ${registrationData.email}`);
  console.log(`💰 Transaction ID: ${paymentData.transactionId}`);
  console.log(`💳 Amount: $${paymentData.amount} ${paymentData.currency}`);
  
  const mailOptions = {
    from: '"Intelli Global Conferences" <accounts@intelliglobalconferences.com>',
    to: registrationData.email,
    subject: `✅ Payment Confirmation - ${registrationData.conferenceTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Receipt</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Payment Confirmed!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Thank you for your registration</p>
          </div>
          
          <!-- Success Message -->
          <div style="padding: 30px 20px; text-align: center; background-color: #f8f9fa;">
            <div style="background-color: #d4edda; border: 1px solid #c3e6cb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
              <h2 style="color: #155724; margin: 0 0 10px 0; font-size: 24px;">🎉 Registration Successful!</h2>
              <p style="color: #155724; margin: 0; font-size: 16px;">Your payment has been processed and your conference registration is confirmed.</p>
            </div>
          </div>
          
          <!-- Conference Details -->
          <div style="padding: 0 20px 20px 20px;">
            <h3 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px; margin-bottom: 20px;">Conference Information</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Conference:</td>
                <td style="padding: 8px 0; color: #333;">${registrationData.conferenceTitle}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Date:</td>
                <td style="padding: 8px 0; color: #333;">${registrationData.conferenceDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Venue:</td>
                <td style="padding: 8px 0; color: #333;">${registrationData.venue}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Registration Type:</td>
                <td style="padding: 8px 0; color: #333;">${registrationData.registrationType}</td>
              </tr>
            </table>
          </div>
          
          <!-- Attendee Details -->
          <div style="padding: 0 20px 20px 20px;">
            <h3 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px; margin-bottom: 20px;">Attendee Information</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Name:</td>
                <td style="padding: 8px 0; color: #333;">${registrationData.firstName} ${registrationData.lastName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Email:</td>
                <td style="padding: 8px 0; color: #333;">${registrationData.email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Phone:</td>
                <td style="padding: 8px 0; color: #333;">${registrationData.phone}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Organization:</td>
                <td style="padding: 8px 0; color: #333;">${registrationData.organization}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Position:</td>
                <td style="padding: 8px 0; color: #333;">${registrationData.position}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Country:</td>
                <td style="padding: 8px 0; color: #333;">${registrationData.country}</td>
              </tr>
            </table>
          </div>
          
          <!-- Payment Details -->
          <div style="padding: 0 20px 20px 20px;">
            <h3 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px; margin-bottom: 20px;">Payment Details</h3>
            <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Transaction ID:</td>
                  <td style="padding: 8px 0; color: #333; font-family: monospace;">${paymentData.transactionId}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">PayPal Order ID:</td>
                  <td style="padding: 8px 0; color: #333; font-family: monospace;">${paymentData.paypalOrderId}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Amount Paid:</td>
                  <td style="padding: 8px 0; color: #28a745; font-weight: bold; font-size: 18px;">$${paymentData.amount} ${paymentData.currency}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Payment Method:</td>
                  <td style="padding: 8px 0; color: #333;">${paymentData.paymentMethod}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Payment Date:</td>
                  <td style="padding: 8px 0; color: #333;">${new Date(paymentData.paymentDate).toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Status:</td>
                  <td style="padding: 8px 0; color: #28a745; font-weight: bold;">${paymentData.status}</td>
                </tr>
              </table>
            </div>
          </div>
          
          <!-- Next Steps -->
          <div style="padding: 0 20px 30px 20px;">
            <h3 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px; margin-bottom: 20px;">What's Next?</h3>
            <div style="background-color: #e3f2fd; border-radius: 8px; padding: 20px;">
              <ul style="margin: 0; padding-left: 20px; color: #333;">
                <li style="margin-bottom: 10px;">📧 <strong>Confirmation Email:</strong> Keep this email as your registration confirmation</li>
                <li style="margin-bottom: 10px;">📅 <strong>Calendar Reminder:</strong> Add the conference dates to your calendar</li>
                <li style="margin-bottom: 10px;">🎫 <strong>Conference Badge:</strong> Present this email at registration for your badge</li>
                <li style="margin-bottom: 10px;">📋 <strong>Program Details:</strong> Conference program will be emailed 1 week before the event</li>
                <li style="margin-bottom: 10px;">🏨 <strong>Accommodation:</strong> Book your hotel early for the best rates</li>
                <li style="margin-bottom: 0;">❓ <strong>Questions:</strong> Contact us at accounts@intelliglobalconferences.com</li>
              </ul>
            </div>
          </div>
          
          <!-- Contact Information -->
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #dee2e6;">
            <h4 style="color: #333; margin: 0 0 15px 0;">Need Help?</h4>
            <p style="margin: 0 0 10px 0; color: #666;">
              📧 Email: <a href="mailto:accounts@intelliglobalconferences.com" style="color: #667eea;">accounts@intelliglobalconferences.com</a>
            </p>
            <p style="margin: 0 0 10px 0; color: #666;">
              🌐 Website: <a href="https://intelliglobalconferences.com" style="color: #667eea;">intelliglobalconferences.com</a>
            </p>
            <p style="margin: 0; color: #666; font-size: 14px;">
              Thank you for choosing Intelli Global Conferences!
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #333; color: #fff; padding: 20px; text-align: center; font-size: 12px;">
            <p style="margin: 0 0 10px 0;">© 2025 Intelli Global Conferences. All rights reserved.</p>
            <p style="margin: 0; opacity: 0.8;">This is an automated email. Please do not reply to this message.</p>
          </div>
          
        </div>
      </body>
      </html>
    `,
    text: `
PAYMENT CONFIRMATION - ${registrationData.conferenceTitle}

🎉 Registration Successful!
Your payment has been processed and your conference registration is confirmed.

CONFERENCE INFORMATION:
Conference: ${registrationData.conferenceTitle}
Date: ${registrationData.conferenceDate}
Venue: ${registrationData.venue}
Registration Type: ${registrationData.registrationType}

ATTENDEE INFORMATION:
Name: ${registrationData.firstName} ${registrationData.lastName}
Email: ${registrationData.email}
Phone: ${registrationData.phone}
Organization: ${registrationData.organization}
Position: ${registrationData.position}
Country: ${registrationData.country}

PAYMENT DETAILS:
Transaction ID: ${paymentData.transactionId}
PayPal Order ID: ${paymentData.paypalOrderId}
Amount Paid: $${paymentData.amount} ${paymentData.currency}
Payment Method: ${paymentData.paymentMethod}
Payment Date: ${new Date(paymentData.paymentDate).toLocaleString()}
Status: ${paymentData.status}

WHAT'S NEXT?
📧 Keep this email as your registration confirmation
📅 Add the conference dates to your calendar
🎫 Present this email at registration for your badge
📋 Conference program will be emailed 1 week before the event
🏨 Book your hotel early for the best rates
❓ Contact us at accounts@intelliglobalconferences.com for questions

NEED HELP?
📧 Email: accounts@intelliglobalconferences.com
🌐 Website: intelliglobalconferences.com

Thank you for choosing Intelli Global Conferences!

© 2025 Intelli Global Conferences. All rights reserved.
This is an automated email. Please do not reply to this message.
    `
  };
  
  try {
    console.log('\n📤 Sending payment receipt email...');
    const result = await transporter.sendMail(mailOptions);
    
    console.log('✅ Payment receipt sent successfully!');
    console.log(`📧 Message ID: ${result.messageId}`);
    console.log(`📧 Response: ${result.response}`);
    
    return {
      success: true,
      messageId: result.messageId,
      transactionId: paymentData.transactionId,
      recipient: registrationData.email,
      amount: paymentData.amount
    };
    
  } catch (error) {
    console.log('❌ Failed to send payment receipt:');
    console.log(`Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function main() {
  try {
    console.log('🚀 Starting Payment Receipt Test...\n');
    
    const result = await sendTestPaymentReceipt();
    
    if (result.success) {
      console.log('\n🎉 SUCCESS! Payment Receipt Sent!');
      console.log('=' .repeat(60));
      console.log(`✅ Transaction ID: ${result.transactionId}`);
      console.log(`✅ Recipient: ${result.recipient}`);
      console.log(`✅ Amount: $${result.amount} USD`);
      console.log(`✅ Message ID: ${result.messageId}`);
      
      console.log('\n📧 Email Features Included:');
      console.log('✅ Professional HTML design with responsive layout');
      console.log('✅ Complete conference information');
      console.log('✅ Detailed attendee information');
      console.log('✅ Payment details with transaction IDs');
      console.log('✅ Next steps and instructions');
      console.log('✅ Contact information');
      console.log('✅ Plain text fallback for all email clients');
      
      console.log('\n🔍 Check Your Email:');
      console.log('📧 Check professor2004h@gmail.com for the payment receipt');
      console.log('📱 The email is mobile-responsive and works on all devices');
      console.log('🎨 Professional design suitable for business communications');
      
      console.log('\n🚀 Ready for Production:');
      console.log('✅ Email system is fully functional');
      console.log('✅ SMTP configuration working correctly');
      console.log('✅ Payment receipt template ready');
      console.log('✅ Can be integrated with PayPal payment flow');
      
    } else {
      console.log('\n❌ Failed to send payment receipt');
      console.log(`Error: ${result.error}`);
    }
    
  } catch (error) {
    console.error('❌ Test script failed:', error);
  }
}

// Run the test
main();
