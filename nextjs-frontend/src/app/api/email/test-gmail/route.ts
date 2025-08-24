import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

/**
 * Test Email with Gmail SMTP
 * This tests our email code with Gmail to verify the implementation works
 */

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Testing email with Gmail SMTP...');
    
    // Use Gmail SMTP for testing (requires app password)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your-gmail@gmail.com', // Replace with actual Gmail
        pass: 'your-app-password'     // Replace with actual app password
      }
    });
    
    const body = await request.json();
    const testEmail = body.testEmail || 'professor2004h@gmail.com';
    
    const mailOptions = {
      from: '"Test Sender" <your-gmail@gmail.com>',
      to: testEmail,
      subject: 'Email System Test - Gmail SMTP',
      html: `
        <h2>Email System Test</h2>
        <p>This email was sent using Gmail SMTP to test our email implementation.</p>
        <p><strong>Test Details:</strong></p>
        <ul>
          <li>Service: Gmail SMTP</li>
          <li>To: ${testEmail}</li>
          <li>Timestamp: ${new Date().toISOString()}</li>
        </ul>
        <p>If you receive this, our email code is working correctly!</p>
      `,
      text: `Email System Test - Gmail SMTP. Timestamp: ${new Date().toISOString()}`
    };
    
    const result = await transporter.sendMail(mailOptions);
    
    console.log('✅ Gmail test email sent:', result.messageId);
    
    return NextResponse.json({
      success: true,
      message: 'Gmail test email sent successfully',
      messageId: result.messageId,
      recipient: testEmail
    });
    
  } catch (error) {
    console.error('❌ Gmail test failed:', error);
    return NextResponse.json({
      error: 'Gmail test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      note: 'This endpoint requires valid Gmail credentials to test email functionality'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Gmail SMTP test endpoint',
    note: 'This endpoint is for testing email functionality with Gmail SMTP',
    usage: 'POST with { "testEmail": "email@example.com" }',
    requirements: [
      'Valid Gmail account',
      'App password enabled (not regular password)',
      'Less secure app access enabled (if using regular password)'
    ]
  });
}
