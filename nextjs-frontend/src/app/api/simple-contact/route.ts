import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 [SIMPLE] Starting simple contact form...');
    
    // Parse request body
    const body = await request.json();
    console.log('🚀 [SIMPLE] Received data:', body);

    const { name, email, phone, subject, message } = body;

    // Basic validation
    if (!name || !email || !subject || !message) {
      console.log('❌ [SIMPLE] Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Check environment variables
    console.log('🚀 [SIMPLE] Checking environment variables...');
    console.log('🚀 [SIMPLE] SMTP_HOST:', process.env.SMTP_HOST || 'NOT SET');
    console.log('🚀 [SIMPLE] SMTP_PORT:', process.env.SMTP_PORT || 'NOT SET');
    console.log('🚀 [SIMPLE] SMTP_USER:', process.env.SMTP_USER || 'NOT SET');
    console.log('🚀 [SIMPLE] SMTP_PASS:', process.env.SMTP_PASS ? 'SET' : 'NOT SET');

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('❌ [SIMPLE] Missing SMTP credentials');
      return NextResponse.json(
        { error: 'Server configuration error: Missing SMTP credentials' },
        { status: 500, headers: corsHeaders }
      );
    }

    // Create simple SMTP configuration
    const smtpConfig = {
      host: 'smtp.hostinger.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      }
    };

    console.log('🚀 [SIMPLE] Creating transporter...');
    const transporter = nodemailer.createTransporter(smtpConfig);

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
      to: 'contactus@intelliglobalconferences.com',
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      html: emailHTML,
      text: `
Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Subject: ${subject}
Message: ${message}
Submitted: ${new Date().toLocaleString()}
      `
    };

    console.log('🚀 [SIMPLE] Sending email...');
    console.log('🚀 [SIMPLE] Mail options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });

    const result = await transporter.sendMail(mailOptions);
    
    console.log('✅ [SIMPLE] Email sent successfully!');
    console.log('✅ [SIMPLE] Message ID:', result.messageId);

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully!',
      messageId: result.messageId,
      timestamp: new Date().toISOString()
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('❌ [SIMPLE] Error:', error);
    console.error('❌ [SIMPLE] Error type:', typeof error);
    console.error('❌ [SIMPLE] Error message:', error instanceof Error ? error.message : 'Unknown');
    console.error('❌ [SIMPLE] Error stack:', error instanceof Error ? error.stack : 'No stack');

    return NextResponse.json({
      success: false,
      error: 'Failed to send email',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500, headers: corsHeaders });
  }
}
