import { NextRequest, NextResponse } from 'next/server';
import { getSiteSettings } from '../../getSiteSettings';
import { sendContactFormNotification, verifyEmailConnection, type ContactFormData } from '../../lib/emailService';

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

    // Verify email connection before sending
    const connectionVerified = await verifyEmailConnection();
    if (!connectionVerified) {
      console.warn('⚠️ SMTP connection failed, but continuing with email attempt...');
    }

    // Send email notification to admin
    const emailSent = await sendContactFormNotification(formData, recipientEmail);

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
