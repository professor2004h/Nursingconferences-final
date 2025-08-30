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





export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  console.log('🚀 [CONTACT] POST request received');

  try {
    console.log('🚀 [CONTACT] Step 1: Parsing request body...');

    // Parse the request body
    const formData: ContactFormData = await request.json();
    console.log('🚀 [CONTACT] Step 2: Request body parsed successfully');

    // Validate required fields
    const { name, email, phone, subject, message } = formData;
    console.log('🚀 [CONTACT] Step 3: Extracted form fields');

    if (!name || !email || !subject || !message) {
      console.log('❌ [CONTACT] Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields. Name, email, subject, and message are required.' },
        { status: 400, headers: corsHeaders }
      );
    }

    console.log('🚀 [CONTACT] Step 4: Basic validation passed');

    // Use hardcoded recipient email to avoid any dependencies
    const recipientEmail = 'contactus@intelliglobalconferences.com';
    console.log('🚀 [CONTACT] Step 5: Recipient email set:', recipientEmail);

    // Log environment variables
    console.log('🚀 [CONTACT] Step 6: Environment check:', {
      SMTP_HOST: process.env.SMTP_HOST || 'NOT SET',
      SMTP_PORT: process.env.SMTP_PORT || 'NOT SET',
      SMTP_USER: process.env.SMTP_USER || 'NOT SET',
      SMTP_PASS: process.env.SMTP_PASS ? 'SET' : 'NOT SET',
      NODE_ENV: process.env.NODE_ENV || 'NOT SET'
    });

    // Check if required environment variables are set
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('❌ [CONTACT] Missing SMTP credentials');
      return NextResponse.json(
        { error: 'Server configuration error: Missing SMTP credentials' },
        { status: 500, headers: corsHeaders }
      );
    }

    console.log('🚀 [CONTACT] Step 7: Environment variables validated');

    // Create SMTP configuration - EXACT same as payment system
    const smtpConfig = {
      host: process.env.SMTP_HOST || 'smtp.hostinger.com',
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: process.env.SMTP_SECURE === 'true' || true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      }
    };

    console.log('🚀 [CONTACT] Step 8: SMTP config created:', {
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure,
      user: smtpConfig.auth.user,
      hasPassword: !!smtpConfig.auth.pass
    });

    // Create transporter
    console.log('🚀 [CONTACT] Step 9: Creating nodemailer transporter...');
    const transporter = nodemailer.createTransporter(smtpConfig);
    console.log('🚀 [CONTACT] Step 10: Transporter created successfully');

    // Simple email content
    const emailHTML = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
      <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
    `;

    const mailOptions = {
      from: `"Contact Form" <${process.env.SMTP_USER}>`,
      to: recipientEmail,
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      html: emailHTML,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\nSubject: ${subject}\nMessage: ${message}\nSubmitted: ${new Date().toLocaleString()}`
    };

    console.log('🚀 [CONTACT] Step 11: Mail options prepared:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });

    console.log('🚀 [CONTACT] Step 12: Attempting to send email...');
    const result = await transporter.sendMail(mailOptions);

    console.log('✅ [CONTACT] Step 13: Email sent successfully!');
    console.log('✅ [CONTACT] Message ID:', result.messageId);

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you soon!',
      messageId: result.messageId,
      timestamp: new Date().toISOString(),
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('❌ [CONTACT] CRITICAL ERROR occurred at step:', error);
    console.error('❌ [CONTACT] Error type:', typeof error);
    console.error('❌ [CONTACT] Error message:', error instanceof Error ? error.message : 'Unknown');
    console.error('❌ [CONTACT] Error stack:', error instanceof Error ? error.stack : 'No stack');
    console.error('❌ [CONTACT] Error code:', (error as any)?.code);
    console.error('❌ [CONTACT] Error command:', (error as any)?.command);
    console.error('❌ [CONTACT] Error response:', (error as any)?.response);

    return NextResponse.json(
      {
        error: 'Failed to send message. Please try again later or contact us directly.',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        errorCode: (error as any)?.code,
        errorCommand: (error as any)?.command
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
