import nodemailer from 'nodemailer';
import { generateInvoiceHTML } from '../components/InvoiceTemplate';

interface EmailData {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }>;
}

interface InvoiceEmailData {
  invoiceNumber: string;
  date: string;
  company: string;
  contact: string;
  email: string;
  conference: string;
  sponsorshipTier: string;
  amount: number;
  currency: string;
  paymentId: string;
  billingAddress: {
    street: string;
    city: string;
    state?: string;
    postalCode?: string;
    country: string;
  };
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface SponsorshipNotificationData {
  registrationId: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone?: string;
  website?: string;
  companyAddress?: string;
  conferenceName: string;
  tierName: string;
  amount: number;
  isCustomAmount?: boolean;
  customAmount?: number;
  paymentId?: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  specialRequests?: string;
  marketingMaterials?: boolean;
  logoPlacement?: boolean;
  speakingOpportunity?: boolean;
  submittedAt: string;
}

// SMTP Configuration
const SMTP_CONFIG = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports like 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS?.replace(/\s/g, ''), // Remove any spaces from password
  },
  tls: {
    rejectUnauthorized: false // Allow self-signed certificates
  },
  debug: true, // Enable debug logs
  logger: true // Enable logger
};

// Create reusable transporter object using SMTP transport
let transporter: nodemailer.Transporter | null = null;

function createTransporter(): nodemailer.Transporter {
  if (!transporter) {
    console.log('🔧 Creating SMTP transporter with config:', {
      host: SMTP_CONFIG.host,
      port: SMTP_CONFIG.port,
      secure: SMTP_CONFIG.secure,
      user: SMTP_CONFIG.auth.user ? '***configured***' : 'NOT_SET'
    });

    transporter = nodemailer.createTransport(SMTP_CONFIG);
  }
  return transporter;
}

// Verify SMTP connection
export async function verifyEmailConnection(): Promise<boolean> {
  try {
    console.log('🔧 Testing SMTP connection...');
    console.log('SMTP Config:', {
      host: SMTP_CONFIG.host,
      port: SMTP_CONFIG.port,
      secure: SMTP_CONFIG.secure,
      user: SMTP_CONFIG.auth.user,
      passLength: SMTP_CONFIG.auth.pass?.length || 0
    });

    const emailTransporter = createTransporter();
    await emailTransporter.verify();
    console.log('✅ SMTP connection verified successfully');
    return true;
  } catch (error) {
    console.error('❌ SMTP connection failed:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      code: (error as any)?.code,
      command: (error as any)?.command
    });
    return false;
  }
}

// Main email sending function
export async function sendEmail(emailData: EmailData): Promise<boolean> {
  try {
    console.log('📧 Preparing to send email...');
    console.log('From:', emailData.from);
    console.log('To:', emailData.to);
    console.log('Subject:', emailData.subject);

    // Validate required environment variables
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('❌ SMTP credentials not configured');
      console.error('SMTP_USER:', process.env.SMTP_USER ? 'SET' : 'NOT SET');
      console.error('SMTP_PASS:', process.env.SMTP_PASS ? `SET (length: ${process.env.SMTP_PASS.length})` : 'NOT SET');
      return false;
    }

    const emailTransporter = createTransporter();

    // Prepare mail options
    const mailOptions = {
      from: emailData.from || `"Intelli Global Conferences" <${process.env.SMTP_USER}>`,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text,
      replyTo: emailData.replyTo,
      attachments: emailData.attachments,
    };

    // Send email
    const info = await emailTransporter.sendMail(mailOptions);

    console.log('✅ Email sent successfully:', info.messageId);
    console.log('📬 Preview URL:', nodemailer.getTestMessageUrl(info));
    return true;

  } catch (error) {
    console.error('❌ Error sending email:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      code: (error as any)?.code,
      command: (error as any)?.command,
      response: (error as any)?.response
    });
    return false;
  }
}

// Send contact form notification to admin
export async function sendContactFormNotification(
  formData: ContactFormData,
  adminEmail: string = 'contactus@intelliglobalconferences.com'
): Promise<boolean> {
  try {
    console.log('📧 Sending contact form notification to admin...');

    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Form Submission</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ea580c, #f97316); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #374151; }
          .value { background: white; padding: 10px; border-radius: 4px; border: 1px solid #d1d5db; }
          .message-box { background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #ea580c; }
          .footer { background: #374151; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; }
          .urgent { background: #fef3c7; border: 1px solid #f59e0b; padding: 10px; border-radius: 4px; margin-bottom: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 24px;">🔔 New Contact Form Submission</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">EventNext - Intelli Global Conferences</p>
          </div>

          <div class="content">
            <div class="urgent">
              <strong>⚡ Action Required:</strong> A new contact form submission has been received and requires your attention.
            </div>

            <div class="field">
              <div class="label">👤 Contact Person:</div>
              <div class="value">${formData.name}</div>
            </div>

            <div class="field">
              <div class="label">📧 Email Address:</div>
              <div class="value">
                <a href="mailto:${formData.email}" style="color: #ea580c; text-decoration: none;">
                  ${formData.email}
                </a>
              </div>
            </div>

            ${formData.phone ? `
            <div class="field">
              <div class="label">📱 Phone Number:</div>
              <div class="value">
                <a href="tel:${formData.phone}" style="color: #ea580c; text-decoration: none;">
                  ${formData.phone}
                </a>
              </div>
            </div>
            ` : ''}

            <div class="field">
              <div class="label">📋 Subject:</div>
              <div class="value">${formData.subject}</div>
            </div>

            <div class="field">
              <div class="label">💬 Message:</div>
              <div class="message-box">${formData.message.replace(/\n/g, '<br>')}</div>
            </div>

            <div class="field">
              <div class="label">🕒 Submitted At:</div>
              <div class="value">${new Date().toLocaleString()}</div>
            </div>
          </div>

          <div class="footer">
            <p style="margin: 0;">EventNext Contact Form System</p>
            <p style="margin: 5px 0 0 0;">Please reply directly to ${formData.email} to respond to this inquiry.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailText = `
      NEW CONTACT FORM SUBMISSION

      Contact Person: ${formData.name}
      Email: ${formData.email}
      Phone: ${formData.phone || 'Not provided'}
      Subject: ${formData.subject}

      Message:
      ${formData.message}

      Submitted At: ${new Date().toLocaleString()}

      ---
      Please reply directly to ${formData.email} to respond to this inquiry.
      EventNext Contact Form System
    `;

    const emailData: EmailData = {
      to: adminEmail,
      subject: `🔔 New Contact Form: ${formData.subject}`,
      html: emailHTML,
      text: emailText,
      replyTo: formData.email,
      from: `"EventNext Contact Form" <${process.env.SMTP_USER}>`,
    };

    return await sendEmail(emailData);

  } catch (error) {
    console.error('❌ Error sending contact form notification:', error);
    return false;
  }
}

// Send sponsorship registration notification to admin
export async function sendSponsorshipNotification(
  sponsorData: SponsorshipNotificationData,
  adminEmail: string = 'contactus@intelliglobalconferences.com'
): Promise<boolean> {
  try {
    console.log('📧 Sending sponsorship notification to admin...');

    const statusColor = sponsorData.paymentStatus === 'completed' ? '#10b981' :
                       sponsorData.paymentStatus === 'failed' ? '#ef4444' : '#f59e0b';
    const statusIcon = sponsorData.paymentStatus === 'completed' ? '✅' :
                      sponsorData.paymentStatus === 'failed' ? '❌' : '⏳';

    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Sponsorship Registration</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 700px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ea580c, #f97316); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
          .section { margin-bottom: 20px; }
          .field { margin-bottom: 12px; }
          .label { font-weight: bold; color: #374151; display: inline-block; min-width: 140px; }
          .value { background: white; padding: 8px 12px; border-radius: 4px; border: 1px solid #d1d5db; display: inline-block; min-width: 200px; }
          .status-badge { padding: 6px 12px; border-radius: 20px; color: white; font-weight: bold; display: inline-block; }
          .amount { font-size: 18px; font-weight: bold; color: #ea580c; }
          .footer { background: #374151; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; }
          .urgent { background: #fef3c7; border: 1px solid #f59e0b; padding: 10px; border-radius: 4px; margin-bottom: 15px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
          @media (max-width: 600px) { .grid { grid-template-columns: 1fr; } }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 24px;">💼 New Sponsorship Registration</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">EventNext - Intelli Global Conferences</p>
          </div>

          <div class="content">
            <div class="urgent">
              <strong>🎉 New Sponsor Alert:</strong> A new sponsorship registration has been received!
            </div>

            <div class="section">
              <h3 style="color: #ea580c; border-bottom: 2px solid #ea580c; padding-bottom: 5px;">📋 Registration Details</h3>
              <div class="field">
                <span class="label">Registration ID:</span>
                <span class="value" style="font-family: monospace; font-weight: bold;">${sponsorData.registrationId}</span>
              </div>
              <div class="field">
                <span class="label">Payment Status:</span>
                <span class="status-badge" style="background-color: ${statusColor};">
                  ${statusIcon} ${sponsorData.paymentStatus.toUpperCase()}
                </span>
              </div>
              ${sponsorData.paymentId ? `
              <div class="field">
                <span class="label">Payment ID:</span>
                <span class="value" style="font-family: monospace;">${sponsorData.paymentId}</span>
              </div>
              ` : ''}
            </div>

            <div class="section">
              <h3 style="color: #ea580c; border-bottom: 2px solid #ea580c; padding-bottom: 5px;">🏢 Company Information</h3>
              <div class="grid">
                <div>
                  <div class="field">
                    <span class="label">Company:</span>
                    <span class="value">${sponsorData.companyName}</span>
                  </div>
                  <div class="field">
                    <span class="label">Contact Person:</span>
                    <span class="value">${sponsorData.contactPerson}</span>
                  </div>
                  <div class="field">
                    <span class="label">Email:</span>
                    <span class="value">
                      <a href="mailto:${sponsorData.email}" style="color: #ea580c; text-decoration: none;">
                        ${sponsorData.email}
                      </a>
                    </span>
                  </div>
                </div>
                <div>
                  ${sponsorData.phone ? `
                  <div class="field">
                    <span class="label">Phone:</span>
                    <span class="value">
                      <a href="tel:${sponsorData.phone}" style="color: #ea580c; text-decoration: none;">
                        ${sponsorData.phone}
                      </a>
                    </span>
                  </div>
                  ` : ''}
                  ${sponsorData.website ? `
                  <div class="field">
                    <span class="label">Website:</span>
                    <span class="value">
                      <a href="${sponsorData.website}" target="_blank" style="color: #ea580c; text-decoration: none;">
                        ${sponsorData.website}
                      </a>
                    </span>
                  </div>
                  ` : ''}
                </div>
              </div>
              ${sponsorData.companyAddress ? `
              <div class="field">
                <span class="label">Address:</span>
                <span class="value">${sponsorData.companyAddress}</span>
              </div>
              ` : ''}
            </div>

            <div class="section">
              <h3 style="color: #ea580c; border-bottom: 2px solid #ea580c; padding-bottom: 5px;">🎯 Sponsorship Details</h3>
              <div class="field">
                <span class="label">Conference:</span>
                <span class="value" style="font-weight: bold;">${sponsorData.conferenceName}</span>
              </div>
              <div class="field">
                <span class="label">Sponsorship Option:</span>
                <span class="value" style="font-weight: bold; color: #ea580c;">
                  ${sponsorData.tierName}
                  ${sponsorData.isCustomAmount ? '<span style="background-color: #fed7aa; color: #ea580c; padding: 2px 6px; border-radius: 12px; font-size: 10px; margin-left: 8px;">CUSTOM</span>' : ''}
                </span>
              </div>
              <div class="field">
                <span class="label">Amount:</span>
                <span class="value amount">$${sponsorData.amount.toLocaleString()}</span>
              </div>
            </div>

            ${(sponsorData.specialRequests || sponsorData.marketingMaterials || sponsorData.logoPlacement || sponsorData.speakingOpportunity) ? `
            <div class="section">
              <h3 style="color: #ea580c; border-bottom: 2px solid #ea580c; padding-bottom: 5px;">📝 Additional Information</h3>
              ${sponsorData.specialRequests ? `
              <div class="field">
                <span class="label">Special Requests:</span>
                <div style="background: white; padding: 10px; border-radius: 4px; border: 1px solid #d1d5db; margin-top: 5px;">
                  ${sponsorData.specialRequests.replace(/\n/g, '<br>')}
                </div>
              </div>
              ` : ''}
              <div class="field">
                <span class="label">Additional Services:</span>
                <div style="background: white; padding: 10px; border-radius: 4px; border: 1px solid #d1d5db; margin-top: 5px;">
                  ${sponsorData.marketingMaterials ? '✅ Marketing Materials<br>' : ''}
                  ${sponsorData.logoPlacement ? '✅ Logo Placement<br>' : ''}
                  ${sponsorData.speakingOpportunity ? '✅ Speaking Opportunity<br>' : ''}
                  ${(!sponsorData.marketingMaterials && !sponsorData.logoPlacement && !sponsorData.speakingOpportunity) ? 'None selected' : ''}
                </div>
              </div>
            </div>
            ` : ''}

            ${sponsorData.isCustomAmount ? `
            <div style="background-color: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="color: #92400e; margin: 0 0 10px 0; font-size: 14px;">📞 Custom Sponsorship Package</h4>
              <p style="color: #92400e; margin: 0; font-size: 13px;">
                Our admin team will contact you within 24 hours to discuss and customize your sponsorship package benefits based on your investment level of <strong>$${sponsorData.amount.toLocaleString()}</strong>.
              </p>
            </div>
            ` : ''}

            <div class="field">
              <span class="label">Submitted At:</span>
              <span class="value">${new Date(sponsorData.submittedAt).toLocaleString()}</span>
            </div>
          </div>

          <div class="footer">
            <p style="margin: 0;">EventNext Sponsorship Management System</p>
            <p style="margin: 5px 0 0 0;">Contact ${sponsorData.email} for any follow-up communications.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailText = `
      NEW SPONSORSHIP REGISTRATION

      Registration ID: ${sponsorData.registrationId}
      Payment Status: ${sponsorData.paymentStatus.toUpperCase()}
      ${sponsorData.paymentId ? `Payment ID: ${sponsorData.paymentId}` : ''}

      COMPANY INFORMATION:
      Company: ${sponsorData.companyName}
      Contact Person: ${sponsorData.contactPerson}
      Email: ${sponsorData.email}
      Phone: ${sponsorData.phone || 'Not provided'}
      Website: ${sponsorData.website || 'Not provided'}
      Address: ${sponsorData.companyAddress || 'Not provided'}

      SPONSORSHIP DETAILS:
      Conference: ${sponsorData.conferenceName}
      Tier: ${sponsorData.tierName}
      Amount: $${sponsorData.amount.toLocaleString()}

      ADDITIONAL INFORMATION:
      Special Requests: ${sponsorData.specialRequests || 'None'}
      Marketing Materials: ${sponsorData.marketingMaterials ? 'Yes' : 'No'}
      Logo Placement: ${sponsorData.logoPlacement ? 'Yes' : 'No'}
      Speaking Opportunity: ${sponsorData.speakingOpportunity ? 'Yes' : 'No'}

      Submitted At: ${new Date(sponsorData.submittedAt).toLocaleString()}

      ---
      EventNext Sponsorship Management System
      Contact ${sponsorData.email} for any follow-up communications.
    `;

    const emailData: EmailData = {
      to: adminEmail,
      subject: `💼 New Sponsorship: ${sponsorData.companyName} - ${sponsorData.conferenceName} (${statusIcon} ${sponsorData.paymentStatus.toUpperCase()})`,
      html: emailHTML,
      text: emailText,
      replyTo: sponsorData.email,
      from: `"EventNext Sponsorship" <${process.env.SMTP_USER}>`,
    };

    return await sendEmail(emailData);

  } catch (error) {
    console.error('❌ Error sending sponsorship notification:', error);
    return false;
  }
}

// Send invoice email
export async function sendInvoiceEmail(
  invoiceData: InvoiceEmailData,
  siteSettings: any
): Promise<boolean> {
  try {
    const adminEmail = siteSettings?.adminSettings?.adminEmail || 'contactus@intelliglobalconferences.com';
    const emailSubject = siteSettings?.adminSettings?.invoiceEmailSubject || 'Your Sponsorship Invoice';
    
    // Generate email template
    let emailTemplate = siteSettings?.adminSettings?.invoiceEmailTemplate || `
Dear {{contactName}},

Thank you for your sponsorship of {{conferenceName}}. Please find your invoice attached below.

We appreciate your support and look forward to a successful partnership.

Best regards,
The Conference Team
    `;

    // Replace placeholders
    emailTemplate = emailTemplate
      .replace(/{{contactName}}/g, invoiceData.contact)
      .replace(/{{companyName}}/g, invoiceData.company)
      .replace(/{{conferenceName}}/g, invoiceData.conference)
      .replace(/{{amount}}/g, `${invoiceData.currency} ${invoiceData.amount}`);

    // Generate invoice HTML
    const invoiceHTML = generateInvoiceHTML(invoiceData, siteSettings);
    
    // Combine email template with invoice
    const fullEmailHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <h2 style="color: #1f2937; margin-bottom: 15px;">${emailSubject}</h2>
          <div style="white-space: pre-line; line-height: 1.6; color: #374151;">
            ${emailTemplate}
          </div>
        </div>
        
        <div style="border-top: 2px solid #e5e7eb; padding-top: 30px;">
          <h3 style="color: #1f2937; margin-bottom: 20px;">Invoice Details</h3>
          ${invoiceHTML}
        </div>
      </div>
    `;

    const emailData: EmailData = {
      from: adminEmail,
      to: invoiceData.email,
      subject: `${emailSubject} - ${invoiceData.conference}`,
      html: fullEmailHTML,
    };

    return await sendEmail(emailData);
    
  } catch (error) {
    console.error('Error sending invoice email:', error);
    return false;
  }
}

// Send payment confirmation email
export async function sendPaymentConfirmationEmail(
  registrationData: any,
  paymentData: any,
  siteSettings: any
): Promise<boolean> {
  try {
    const adminEmail = siteSettings?.adminSettings?.adminEmail || 'contactus@intelliglobalconferences.com';
    
    let confirmationTemplate = siteSettings?.adminSettings?.paymentConfirmationTemplate || `
Dear {{contactName}},

Your payment of $${paymentData.amount} for {{conferenceName}} sponsorship has been confirmed.

Payment Details:
- Transaction ID: {{paymentId}}
- Amount: $${paymentData.amount}
- Date: {{paymentDate}}

Thank you for your support!

Best regards,
The Conference Team
    `;

    // Replace placeholders
    confirmationTemplate = confirmationTemplate
      .replace(/{{contactName}}/g, `${registrationData.contactPerson.firstName} ${registrationData.contactPerson.lastName}`)
      .replace(/{{companyName}}/g, registrationData.companyDetails.companyName)
      .replace(/{{conferenceName}}/g, registrationData.conference.title)
      .replace(/{{amount}}/g, paymentData.amount.toString())
      .replace(/{{paymentId}}/g, paymentData.paymentId)
      .replace(/{{paymentDate}}/g, new Date().toLocaleDateString());

    const emailHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #ecfdf5; border: 1px solid #10b981; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #065f46; margin-bottom: 15px;">✅ Payment Confirmed</h2>
          <div style="white-space: pre-line; line-height: 1.6; color: #047857;">
            ${confirmationTemplate}
          </div>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; font-size: 14px; color: #6b7280;">
          <p><strong>Next Steps:</strong></p>
          <ul>
            <li>You will receive a detailed invoice within the next few minutes</li>
            <li>Our team will contact you within 24-48 hours to discuss sponsorship benefits</li>
            <li>We'll work with you to maximize your sponsorship impact</li>
          </ul>
        </div>
      </div>
    `;

    const emailData: EmailData = {
      from: adminEmail,
      to: registrationData.contactPerson.email,
      subject: `Payment Confirmed - ${registrationData.conference.title} Sponsorship`,
      html: emailHTML,
    };

    return await sendEmail(emailData);
    
  } catch (error) {
    console.error('Error sending payment confirmation email:', error);
    return false;
  }
}

// Send admin notification email
export async function sendAdminNotificationEmail(
  registrationData: any,
  paymentData: any,
  siteSettings: any
): Promise<boolean> {
  try {
    const adminEmail = siteSettings?.adminSettings?.adminEmail || 'contactus@intelliglobalconferences.com';
    
    const notificationHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1f2937;">🎉 New Sponsorship Registration</h2>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Registration Details</h3>
          <p><strong>Registration ID:</strong> ${registrationData.registrationId}</p>
          <p><strong>Company:</strong> ${registrationData.companyDetails.companyName}</p>
          <p><strong>Contact:</strong> ${registrationData.contactPerson.firstName} ${registrationData.contactPerson.lastName}</p>
          <p><strong>Email:</strong> ${registrationData.contactPerson.email}</p>
          <p><strong>Conference:</strong> ${registrationData.conference.title}</p>
          <p><strong>Sponsorship Tier:</strong> ${registrationData.sponsorshipTier.name}</p>
          <p><strong>Amount:</strong> $${paymentData.amount}</p>
          <p><strong>Payment ID:</strong> ${paymentData.paymentId}</p>
        </div>
        
        <div style="background-color: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px;">
          <p style="color: #92400e; margin: 0;"><strong>Action Required:</strong> Please follow up with the sponsor within 24-48 hours to discuss benefits and logistics.</p>
        </div>
      </div>
    `;

    const emailData: EmailData = {
      from: adminEmail,
      to: adminEmail,
      subject: `New Sponsorship Registration - ${registrationData.companyDetails.companyName}`,
      html: notificationHTML,
    };

    return await sendEmail(emailData);
    
  } catch (error) {
    console.error('Error sending admin notification email:', error);
    return false;
  }
}

// Validate email configuration
export function validateEmailConfig(): boolean {
  if (process.env.NODE_ENV === 'production') {
    return !!(SMTP_CONFIG.auth.user && SMTP_CONFIG.auth.pass);
  }
  // In development, we simulate email sending
  return true;
}

// Get email service status
export function getEmailServiceStatus(): string {
  if (process.env.NODE_ENV === 'development') {
    return 'Simulated (Development Mode)';
  }
  
  if (validateEmailConfig()) {
    return 'Configured';
  }
  
  return 'Not Configured';
}
