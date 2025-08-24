import nodemailer from 'nodemailer';

/**
 * Email Service for sending payment receipts and notifications
 * Uses SMTP configuration for Hostinger email service
 */

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  fromName: string;
}

interface RegistrationData {
  registrationId: string;
  personalDetails: {
    title?: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    country: string;
    fullPostalAddress: string;
  };
  selectedRegistrationName?: string;
  sponsorType?: string;
  accommodationType?: string;
  accommodationNights?: string;
  numberOfParticipants: number;
  pricing: {
    registrationFee: number;
    accommodationFee: number;
    totalPrice: number;
    currency: string;
  };
}

interface PaymentData {
  transactionId: string;
  orderId: string;
  amount: string;
  currency: string;
  capturedAt: string;
  paymentMethod: string;
}

interface EmailData {
  registrationData: RegistrationData;
  paymentData: PaymentData;
  recipientEmail: string;
}

/**
 * Get email configuration from environment variables
 */
function getEmailConfig(): EmailConfig {
  const config = {
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true' || false,
    user: process.env.SMTP_USER || 'accounts@intelliglobalconferences.com',
    pass: process.env.SMTP_PASS || '',
    from: process.env.EMAIL_FROM || 'accounts@intelliglobalconferences.com',
    fromName: process.env.EMAIL_FROM_NAME || 'Intelli Global Conferences'
  };

  if (!config.pass) {
    console.warn('⚠️ SMTP password not configured - email sending will be disabled');
    throw new Error('SMTP password not configured');
  }

  return config;
}

/**
 * Create nodemailer transporter
 */
function createTransporter() {
  const config = getEmailConfig();
  
  console.log('📧 Creating email transporter with config:', {
    host: config.host,
    port: config.port,
    secure: config.secure,
    user: config.user,
    from: config.from
  });

  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
    tls: {
      rejectUnauthorized: false // Allow self-signed certificates
    },
    connectionTimeout: 60000,
    greetingTimeout: 30000,
    socketTimeout: 60000
  });
}

/**
 * Generate HTML email template for payment receipt
 */
function generateReceiptEmailHTML(data: EmailData): string {
  const { registrationData, paymentData } = data;
  const fullName = `${registrationData.personalDetails.title || ''} ${registrationData.personalDetails.firstName} ${registrationData.personalDetails.lastName}`.trim();
  const paymentDate = new Date(paymentData.capturedAt).toLocaleString();

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Receipt - International Nursing Conference 2025</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
        }
        .container {
            background-color: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            background-color: #1e40af;
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .header p {
            margin: 5px 0 0 0;
            opacity: 0.9;
        }
        .content {
            padding: 30px 20px;
        }
        .success-badge {
            background-color: #10b981;
            color: white;
            padding: 10px 20px;
            border-radius: 6px;
            text-align: center;
            margin-bottom: 30px;
            font-weight: bold;
        }
        .section {
            margin-bottom: 30px;
        }
        .section h3 {
            color: #1e40af;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 10px;
            margin-bottom: 15px;
        }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 15px;
        }
        .info-item {
            margin-bottom: 8px;
        }
        .info-label {
            font-weight: bold;
            color: #374151;
        }
        .info-value {
            color: #6b7280;
            font-family: monospace;
        }
        .payment-summary {
            background-color: #f3f4f6;
            padding: 20px;
            border-radius: 6px;
            margin-top: 20px;
        }
        .total-row {
            border-top: 2px solid #d1d5db;
            padding-top: 10px;
            margin-top: 10px;
            font-weight: bold;
            font-size: 16px;
        }
        .contact-info {
            background-color: #eff6ff;
            padding: 20px;
            border-radius: 6px;
            border-left: 4px solid #3b82f6;
        }
        .footer {
            text-align: center;
            padding: 20px;
            background-color: #f9fafb;
            color: #6b7280;
            font-size: 12px;
        }
        @media (max-width: 600px) {
            .info-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Intelli Global Conferences</h1>
            <p>Payment Receipt - International Nursing Conference 2025</p>
        </div>
        
        <div class="content">
            <div class="success-badge">
                ✅ Payment Confirmed - Registration Successful!
            </div>
            
            <!-- Payment Information -->
            <div class="section">
                <h3>Payment Information</h3>
                <div class="info-grid">
                    <div>
                        <div class="info-item">
                            <span class="info-label">Transaction ID:</span><br>
                            <span class="info-value">${paymentData.transactionId}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Order ID:</span><br>
                            <span class="info-value">${paymentData.orderId}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Payment Method:</span><br>
                            <span class="info-value">${paymentData.paymentMethod}</span>
                        </div>
                    </div>
                    <div>
                        <div class="info-item">
                            <span class="info-label">Amount:</span><br>
                            <span class="info-value">${paymentData.currency} ${paymentData.amount}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Payment Date:</span><br>
                            <span class="info-value">${paymentDate}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Status:</span><br>
                            <span class="info-value" style="color: #10b981; font-weight: bold;">Completed</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Registration Details -->
            <div class="section">
                <h3>Registration Details</h3>
                <div class="info-item">
                    <span class="info-label">Registration ID:</span><br>
                    <span class="info-value">${registrationData.registrationId}</span>
                </div>
                
                <h4 style="margin-top: 20px; margin-bottom: 10px; color: #374151;">Personal Information</h4>
                <div class="info-grid">
                    <div>
                        <div class="info-item">
                            <span class="info-label">Full Name:</span><br>
                            <span class="info-value">${fullName}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Email:</span><br>
                            <span class="info-value">${registrationData.personalDetails.email}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Phone:</span><br>
                            <span class="info-value">${registrationData.personalDetails.phoneNumber}</span>
                        </div>
                    </div>
                    <div>
                        <div class="info-item">
                            <span class="info-label">Country:</span><br>
                            <span class="info-value">${registrationData.personalDetails.country}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Address:</span><br>
                            <span class="info-value">${registrationData.personalDetails.fullPostalAddress}</span>
                        </div>
                    </div>
                </div>
                
                <h4 style="margin-top: 20px; margin-bottom: 10px; color: #374151;">Registration Information</h4>
                <div class="info-grid">
                    <div>
                        ${registrationData.selectedRegistrationName ? `
                        <div class="info-item">
                            <span class="info-label">Registration Type:</span><br>
                            <span class="info-value">${registrationData.selectedRegistrationName}</span>
                        </div>
                        ` : ''}
                        ${registrationData.sponsorType ? `
                        <div class="info-item">
                            <span class="info-label">Sponsorship Type:</span><br>
                            <span class="info-value">${registrationData.sponsorType}</span>
                        </div>
                        ` : ''}
                        <div class="info-item">
                            <span class="info-label">Number of Participants:</span><br>
                            <span class="info-value">${registrationData.numberOfParticipants}</span>
                        </div>
                    </div>
                    <div>
                        ${registrationData.accommodationType ? `
                        <div class="info-item">
                            <span class="info-label">Accommodation:</span><br>
                            <span class="info-value">${registrationData.accommodationType}</span>
                        </div>
                        ` : ''}
                        ${registrationData.accommodationNights ? `
                        <div class="info-item">
                            <span class="info-label">Accommodation Nights:</span><br>
                            <span class="info-value">${registrationData.accommodationNights}</span>
                        </div>
                        ` : ''}
                    </div>
                </div>
            </div>
            
            <!-- Payment Summary -->
            <div class="section">
                <h3>Payment Summary</h3>
                <div class="payment-summary">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span>Registration Fee:</span>
                        <span>${registrationData.pricing.currency} ${registrationData.pricing.registrationFee}</span>
                    </div>
                    ${registrationData.pricing.accommodationFee > 0 ? `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span>Accommodation Fee:</span>
                        <span>${registrationData.pricing.currency} ${registrationData.pricing.accommodationFee}</span>
                    </div>
                    ` : ''}
                    <div class="total-row" style="display: flex; justify-content: space-between;">
                        <span>Total Amount:</span>
                        <span>${registrationData.pricing.currency} ${registrationData.pricing.totalPrice}</span>
                    </div>
                </div>
            </div>
            
            <!-- What's Next -->
            <div class="section">
                <h3>What's Next?</h3>
                <ul style="color: #374151; padding-left: 20px;">
                    <li>Your registration certificate will be sent via email within 24 hours</li>
                    <li>Conference materials and schedule will be shared closer to the event date</li>
                    <li>For any queries, please contact us using the information below</li>
                </ul>
            </div>
            
            <!-- Contact Information -->
            <div class="contact-info">
                <h4 style="margin-top: 0; color: #1e40af;">Contact Information</h4>
                <p style="margin: 5px 0;"><strong>Email:</strong> accounts@intelliglobalconferences.com</p>
                <p style="margin: 5px 0;"><strong>Phone:</strong> +1 (470) 916-6880</p>
                <p style="margin: 5px 0;"><strong>WhatsApp:</strong> +1 (470) 916-6880</p>
            </div>
        </div>
        
        <div class="footer">
            <p>Thank you for registering for the International Nursing Conference 2025</p>
            <p>This is an automated email. Please do not reply to this message.</p>
            <p>Generated on: ${new Date().toLocaleString()}</p>
        </div>
    </div>
</body>
</html>
  `;
}

/**
 * Send payment receipt email
 */
export async function sendPaymentReceiptEmail(data: EmailData): Promise<boolean> {
  try {
    console.log('📧 Preparing to send payment receipt email to:', data.recipientEmail);

    // Check if email is configured
    try {
      const config = getEmailConfig();
    } catch (configError) {
      console.warn('⚠️ Email not configured, skipping email sending:', configError);
      return false;
    }

    const transporter = createTransporter();
    const config = getEmailConfig();
    
    // Generate email content
    const htmlContent = generateReceiptEmailHTML(data);
    const subject = `Payment Receipt - Registration Confirmed (${data.registrationData.registrationId})`;
    
    // Email options
    const mailOptions = {
      from: `"${config.fromName}" <${config.from}>`,
      to: data.recipientEmail,
      subject: subject,
      html: htmlContent,
      text: `Payment Receipt - Registration Confirmed\n\nTransaction ID: ${data.paymentData.transactionId}\nRegistration ID: ${data.registrationData.registrationId}\nAmount: ${data.paymentData.currency} ${data.paymentData.amount}\n\nThank you for registering for the International Nursing Conference 2025!`
    };
    
    console.log('📧 Sending email with options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });
    
    // Send email
    const result = await transporter.sendMail(mailOptions);
    
    console.log('✅ Payment receipt email sent successfully:', {
      messageId: result.messageId,
      recipient: data.recipientEmail,
      registrationId: data.registrationData.registrationId
    });
    
    return true;
    
  } catch (error) {
    console.error('❌ Error sending payment receipt email:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      recipient: data.recipientEmail,
      registrationId: data.registrationData.registrationId
    });
    
    return false;
  }
}

/**
 * Send test email to verify email system
 */
export async function sendTestEmail(testEmail: string): Promise<boolean> {
  const testData: EmailData = {
    registrationData: {
      registrationId: 'TEST-REG-123456789',
      personalDetails: {
        title: 'Dr.',
        firstName: 'John',
        lastName: 'Doe',
        email: testEmail,
        phoneNumber: '+1234567890',
        country: 'United States',
        fullPostalAddress: '123 Test Street, Test City, TS 12345, United States'
      },
      selectedRegistrationName: 'Regular Registration',
      numberOfParticipants: 1,
      pricing: {
        registrationFee: 299,
        accommodationFee: 0,
        totalPrice: 299,
        currency: 'USD'
      }
    },
    paymentData: {
      transactionId: 'TEST123456789',
      orderId: 'ORDER123456789',
      amount: '299.00',
      currency: 'USD',
      capturedAt: new Date().toISOString(),
      paymentMethod: 'PayPal'
    },
    recipientEmail: testEmail
  };
  
  return await sendPaymentReceiptEmail(testData);
}
