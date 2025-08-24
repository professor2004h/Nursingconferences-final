import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

/**
 * Debug Email API Endpoint
 * Tests basic email functionality with detailed logging
 */

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Starting email debug test...');
    
    // Check environment variables
    const emailConfig = {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
      from: process.env.EMAIL_FROM
    };
    
    console.log('🔍 Email config check:', {
      host: emailConfig.host,
      port: emailConfig.port,
      user: emailConfig.user,
      hasPassword: !!emailConfig.pass,
      from: emailConfig.from
    });
    
    if (!emailConfig.host || !emailConfig.user || !emailConfig.pass) {
      return NextResponse.json({
        error: 'Missing email configuration',
        config: {
          hasHost: !!emailConfig.host,
          hasUser: !!emailConfig.user,
          hasPassword: !!emailConfig.pass
        }
      }, { status: 500 });
    }
    
    // Create transporter
    console.log('🔍 Creating transporter...');
    const transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: parseInt(emailConfig.port || '465'),
      secure: true, // Use SSL
      auth: {
        user: emailConfig.user,
        pass: emailConfig.pass,
      },
      tls: {
        rejectUnauthorized: false
      },
      debug: true,
      logger: true,
      connectionTimeout: 60000,
      greetingTimeout: 30000,
      socketTimeout: 60000
    });
    
    // Test connection
    console.log('🔍 Testing SMTP connection...');
    try {
      await transporter.verify();
      console.log('✅ SMTP connection verified');
    } catch (verifyError) {
      console.error('❌ SMTP connection failed:', verifyError);

      // Detailed error analysis
      const errorDetails = {
        message: verifyError instanceof Error ? verifyError.message : 'Unknown error',
        code: (verifyError as any)?.code,
        command: (verifyError as any)?.command,
        response: (verifyError as any)?.response,
        responseCode: (verifyError as any)?.responseCode,
        stack: verifyError instanceof Error ? verifyError.stack?.substring(0, 500) : undefined
      };

      console.error('❌ Detailed SMTP error:', errorDetails);

      return NextResponse.json({
        error: 'SMTP connection failed',
        details: errorDetails,
        suggestions: [
          'Check if email account exists and is active',
          'Verify username and password are correct',
          'Ensure SMTP is enabled for the account',
          'Try different port (465 for SSL, 587 for STARTTLS)',
          'Check if 2FA is enabled (may need app password)',
          'Verify Hostinger SMTP settings'
        ]
      }, { status: 500 });
    }
    
    // Send test email
    const body = await request.json();
    const testEmail = body.testEmail || 'professor2004h@gmail.com';
    
    console.log('🔍 Sending test email to:', testEmail);
    
    const mailOptions = {
      from: `"Intelli Global Conferences" <${emailConfig.from}>`,
      to: testEmail,
      subject: 'Test Email - Email System Verification',
      html: `
        <h2>Email System Test</h2>
        <p>This is a test email to verify the email system is working correctly.</p>
        <p><strong>Test Details:</strong></p>
        <ul>
          <li>SMTP Host: ${emailConfig.host}</li>
          <li>SMTP Port: ${emailConfig.port}</li>
          <li>From: ${emailConfig.from}</li>
          <li>To: ${testEmail}</li>
          <li>Timestamp: ${new Date().toISOString()}</li>
        </ul>
        <p>If you receive this email, the system is working correctly!</p>
      `,
      text: `Email System Test - This is a test email to verify the email system is working correctly. Timestamp: ${new Date().toISOString()}`
    };
    
    const result = await transporter.sendMail(mailOptions);
    
    console.log('✅ Test email sent successfully:', {
      messageId: result.messageId,
      response: result.response
    });
    
    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      details: {
        messageId: result.messageId,
        recipient: testEmail,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('❌ Email debug test failed:', error);
    return NextResponse.json({
      error: 'Email test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack?.substring(0, 500) : undefined
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Email debug endpoint',
    usage: 'POST with { "testEmail": "email@example.com" } to test email functionality',
    config: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      hasPassword: !!process.env.SMTP_PASS,
      from: process.env.EMAIL_FROM
    }
  });
}
