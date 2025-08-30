import { NextRequest, NextResponse } from 'next/server';
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

// EXACT COPY of working payment receipt email system for contact form
async function sendContactEmail(formData: ContactFormData, recipientEmail: string): Promise<boolean> {
  try {
    console.log('📧 [CONTACT] Starting contact email using EXACT payment system pattern...');

    // EXACT SMTP configuration from working payment receipt system
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
      connectionTimeout: 60000, // 60 seconds
      greetingTimeout: 30000,   // 30 seconds
      socketTimeout: 60000,     // 60 seconds
      pool: false,              // Disable connection pooling for Coolify
      maxConnections: 1,        // Single connection for container environments
      debug: process.env.NODE_ENV !== 'production', // Enable debug in development
      logger: process.env.NODE_ENV !== 'production'  // Enable logging in development
    };

    console.log('📧 [CONTACT] SMTP Configuration:', {
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure,
      user: smtpConfig.auth.user,
      hasPassword: !!smtpConfig.auth.pass,
      environment: process.env.NODE_ENV
    });

    // Create transporter - EXACT same as payment system
    const transporter = nodemailer.createTransporter(smtpConfig);

    // Email content
    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Form Submission</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #ff6b35, #f7931e); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0;">📧 New Contact Form Submission</h1>
            <p style="margin: 5px 0 0 0;">Intelli Global Conferences</p>
          </div>

          <div style="background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb;">
            <div style="margin-bottom: 15px; padding: 10px; background: white; border-radius: 4px; border-left: 4px solid #ff6b35;">
              <strong style="color: #ff6b35;">👤 Name:</strong><br>
              ${formData.name}
            </div>

            <div style="margin-bottom: 15px; padding: 10px; background: white; border-radius: 4px; border-left: 4px solid #ff6b35;">
              <strong style="color: #ff6b35;">📧 Email:</strong><br>
              ${formData.email}
            </div>

            ${formData.phone ? `
            <div style="margin-bottom: 15px; padding: 10px; background: white; border-radius: 4px; border-left: 4px solid #ff6b35;">
              <strong style="color: #ff6b35;">📞 Phone:</strong><br>
              ${formData.phone}
            </div>
            ` : ''}

            <div style="margin-bottom: 15px; padding: 10px; background: white; border-radius: 4px; border-left: 4px solid #ff6b35;">
              <strong style="color: #ff6b35;">📋 Subject:</strong><br>
              ${formData.subject}
            </div>

            <div style="margin-bottom: 15px; padding: 10px; background: white; border-radius: 4px; border-left: 4px solid #ff6b35;">
              <strong style="color: #ff6b35;">💬 Message:</strong><br>
              ${formData.message.replace(/\n/g, '<br>')}
            </div>

            <div style="margin-bottom: 15px; padding: 10px; background: white; border-radius: 4px; border-left: 4px solid #ff6b35;">
              <strong style="color: #ff6b35;">🕒 Submitted:</strong><br>
              ${new Date().toLocaleString()}
            </div>
          </div>

          <div style="background: #374151; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px;">
            <p style="margin: 0;">Reply directly to ${formData.email} to respond</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // EXACT mailOptions pattern from payment system
    const mailOptions = {
      from: `"Intelli Global Conferences" <${process.env.SMTP_USER || 'contactus@intelliglobalconferences.com'}>`,
      to: recipientEmail,
      replyTo: formData.email,
      subject: `🔔 New Contact Form: ${formData.subject}`,
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

---
Reply directly to ${formData.email} to respond to this inquiry.
      `.trim()
    };

    console.log('📧 [CONTACT] Sending email with exact payment system pattern...');

    // EXACT sendMail pattern from payment system
    const result = await transporter.sendMail(mailOptions);

    console.log('✅ [CONTACT] Email sent successfully:', {
      messageId: result.messageId,
      response: result.response
    });

    return true;

  } catch (error) {
    console.error('❌ [CONTACT] Email sending failed:', error);
    console.error('❌ [CONTACT] Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      code: (error as any)?.code,
      command: (error as any)?.command,
      response: (error as any)?.response
    });
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
    
    // Use hardcoded recipient email to avoid Sanity dependency issues
    const recipientEmail = 'contactus@intelliglobalconferences.com';
    
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
