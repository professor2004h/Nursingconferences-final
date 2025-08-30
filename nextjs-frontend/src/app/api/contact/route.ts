import { NextRequest, NextResponse } from 'next/server';
import { getSiteSettings } from '../../getSiteSettings';
import nodemailer from 'nodemailer';

// Contact form data interface
interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

// CORS headers for API routes
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Simplified email sending function for Coolify
async function sendContactEmail(formData: ContactFormData, recipientEmail: string): Promise<boolean> {
  try {
    console.log('📧 [CONTACT] Starting email send process...');
    console.log('📧 [CONTACT] Recipient:', recipientEmail);
    console.log('📧 [CONTACT] From:', formData.email);

    // Validate environment variables
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('❌ [CONTACT] Missing SMTP credentials');
      console.error('❌ [CONTACT] SMTP_USER:', process.env.SMTP_USER ? 'SET' : 'NOT SET');
      console.error('❌ [CONTACT] SMTP_PASS:', process.env.SMTP_PASS ? 'SET' : 'NOT SET');
      return false;
    }

    // Create SMTP configuration - EXACT same as working payment system
    const smtpConfig = {
      host: process.env.SMTP_HOST || 'smtp.hostinger.com',
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: process.env.SMTP_SECURE === 'true' || true,
      auth: {
        user: process.env.SMTP_USER || 'contactus@intelliglobalconferences.com',
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
        servername: process.env.SMTP_HOST || 'smtp.hostinger.com',
        ciphers: 'HIGH:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA'
      },
      connectionTimeout: 60000,
      greetingTimeout: 30000,
      socketTimeout: 60000,
      pool: false,
      maxConnections: 1,
      debug: process.env.NODE_ENV !== 'production',
      logger: process.env.NODE_ENV !== 'production'
    };

    console.log('📧 [CONTACT] SMTP Config:', {
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure,
      user: smtpConfig.auth.user,
      hasPassword: !!smtpConfig.auth.pass
    });

    // Create transporter
    const transporter = nodemailer.createTransporter(smtpConfig);

    // Verify connection with fallback
    try {
      console.log('📧 [CONTACT] Testing SMTP connection...');
      await transporter.verify();
      console.log('✅ [CONTACT] SMTP connection verified');
    } catch (verifyError) {
      console.warn('⚠️ [CONTACT] SMTP verification failed, trying alternative config...');

      // Try alternative configuration for Coolify
      const altConfig = {
        ...smtpConfig,
        port: 587,
        secure: false,
        tls: {
          rejectUnauthorized: false,
          starttls: true,
          servername: process.env.SMTP_HOST || 'smtp.hostinger.com'
        }
      };

      const altTransporter = nodemailer.createTransporter(altConfig);
      try {
        await altTransporter.verify();
        console.log('✅ [CONTACT] Alternative SMTP config verified');
        // Use alternative transporter
        const altResult = await sendEmailWithTransporter(altTransporter, formData, recipientEmail);
        return altResult;
      } catch (altError) {
        console.error('❌ [CONTACT] Both SMTP configs failed:', altError);
        // Continue with original transporter anyway
      }
    }

    // Send email
    const result = await sendEmailWithTransporter(transporter, formData, recipientEmail);
    return result;

  } catch (error) {
    console.error('❌ [CONTACT] Email sending failed:', error);
    return false;
  }
}

// Helper function to send email with given transporter
async function sendEmailWithTransporter(transporter: nodemailer.Transporter, formData: ContactFormData, recipientEmail: string): Promise<boolean> {
  try {
    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Contact Form Submission</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ff6b35, #f7931e); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
          .field { margin-bottom: 15px; padding: 10px; background: white; border-radius: 4px; border-left: 4px solid #ff6b35; }
          .label { font-weight: bold; color: #ff6b35; }
          .value { margin-top: 5px; }
          .footer { background: #374151; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📧 New Contact Form Submission</h1>
            <p>Intelli Global Conferences</p>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">👤 Name:</div>
              <div class="value">${formData.name}</div>
            </div>
            <div class="field">
              <div class="label">📧 Email:</div>
              <div class="value">${formData.email}</div>
            </div>
            ${formData.phone ? `
            <div class="field">
              <div class="label">📞 Phone:</div>
              <div class="value">${formData.phone}</div>
            </div>
            ` : ''}
            <div class="field">
              <div class="label">📋 Subject:</div>
              <div class="value">${formData.subject}</div>
            </div>
            <div class="field">
              <div class="label">💬 Message:</div>
              <div class="value">${formData.message.replace(/\n/g, '<br>')}</div>
            </div>
            <div class="field">
              <div class="label">🕒 Submitted:</div>
              <div class="value">${new Date().toLocaleString()}</div>
            </div>
          </div>
          <div class="footer">
            <p>Reply directly to ${formData.email} to respond</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"Intelli Global Conferences" <${process.env.SMTP_USER || 'contactus@intelliglobalconferences.com'}>`,
      to: recipientEmail,
      replyTo: formData.email,
      subject: `🔔 New Contact: ${formData.subject}`,
      html: emailHTML,
      text: `
New Contact Form Submission

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}
Subject: ${formData.subject}

Message:
${formData.message}

Submitted: ${new Date().toLocaleString()}
      `.trim()
    };

    console.log('📧 [CONTACT] Sending email...');
    const result = await transporter.sendMail(mailOptions);

    console.log('✅ [CONTACT] Email sent successfully:', {
      messageId: result.messageId,
      response: result.response
    });

    return true;
  } catch (error) {
    console.error('❌ [CONTACT] Failed to send email:', error);
    return false;
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const formData: ContactFormData = await request.json();
    
    // Validate required fields
    const { name, email, phone, subject, message } = formData;

    if (!name || !email || !phone || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields. Name, email, phone number, subject, and message are required.' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format.' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate phone number format
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{7,20}$/;
    if (!phoneRegex.test(phone.trim())) {
      return NextResponse.json(
        { error: 'Invalid phone number format.' },
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Validate message length
    if (message.trim().length < 10) {
      return NextResponse.json(
        { error: 'Message must be at least 10 characters long.' },
        { status: 400 }
      );
    }
    
    // Get site settings to retrieve the contact email
    const siteSettings = await getSiteSettings();
    const recipientEmail = siteSettings?.contactInfo?.email || 'contactus@intelliglobalconferences.com';
    
    // Log the contact form submission
    console.log('📧 Processing contact form submission...');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Recipient Email:', recipientEmail);
    console.log('Form Data:', {
      name: formData.name,
      email: formData.email,
      phone: formData.phone || 'Not provided',
      subject: formData.subject,
      message: formData.message,
    });

    // Send email notification to admin using simplified function
    console.log('📧 [MAIN] Attempting to send contact form email...');
    const emailSent = await sendContactEmail(formData, recipientEmail);

    if (!emailSent) {
      throw new Error('Failed to send email notification');
    }

    console.log('✅ Contact form email sent successfully');
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you soon!',
      timestamp: new Date().toISOString(),
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('❌ CRITICAL: Contact form error:', error);
    console.error('❌ Error type:', typeof error);
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      code: (error as any)?.code,
      command: (error as any)?.command,
      response: (error as any)?.response
    });

    // Log environment status for debugging
    console.error('❌ Environment check:', {
      SMTP_HOST: process.env.SMTP_HOST ? 'SET' : 'NOT SET',
      SMTP_USER: process.env.SMTP_USER ? 'SET' : 'NOT SET',
      SMTP_PASS: process.env.SMTP_PASS ? 'SET' : 'NOT SET',
      NODE_ENV: process.env.NODE_ENV
    });

    return NextResponse.json(
      {
        error: 'Failed to send message. Please try again later or contact us directly.',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        // Include debugging info for development
        debug: process.env.NODE_ENV !== 'production' ? {
          errorType: typeof error,
          stack: error instanceof Error ? error.stack : undefined,
          envVars: {
            SMTP_HOST: process.env.SMTP_HOST ? 'SET' : 'NOT SET',
            SMTP_USER: process.env.SMTP_USER ? 'SET' : 'NOT SET',
            SMTP_PASS: process.env.SMTP_PASS ? 'SET' : 'NOT SET'
          }
        } : undefined
      },
      { status: 500, headers: corsHeaders }
    );
  }
}



// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to submit contact form.' },
    { status: 405, headers: corsHeaders }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to submit contact form.' },
    { status: 405, headers: corsHeaders }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to submit contact form.' },
    { status: 405, headers: corsHeaders }
  );
}
