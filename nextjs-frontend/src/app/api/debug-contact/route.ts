import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET() {
  try {
    console.log('🔍 [DEBUG] Starting contact form debug...');
    
    // Check environment variables
    const envStatus = {
      SMTP_HOST: process.env.SMTP_HOST || 'NOT SET',
      SMTP_PORT: process.env.SMTP_PORT || 'NOT SET',
      SMTP_USER: process.env.SMTP_USER || 'NOT SET',
      SMTP_PASS: process.env.SMTP_PASS ? `SET (${process.env.SMTP_PASS.length} chars)` : 'NOT SET',
      SMTP_SECURE: process.env.SMTP_SECURE || 'NOT SET',
      NODE_ENV: process.env.NODE_ENV || 'NOT SET'
    };

    console.log('🔍 [DEBUG] Environment variables:', envStatus);

    // Test basic SMTP configuration
    let smtpTest = 'NOT TESTED';
    let smtpError = null;

    try {
      const smtpConfig = {
        host: process.env.SMTP_HOST || 'smtp.hostinger.com',
        port: parseInt(process.env.SMTP_PORT || '465'),
        secure: true,
        auth: {
          user: process.env.SMTP_USER || 'contactus@intelliglobalconferences.com',
          pass: process.env.SMTP_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
        connectionTimeout: 10000,
        greetingTimeout: 5000,
        socketTimeout: 10000,
      };

      console.log('🔍 [DEBUG] Creating SMTP transporter...');
      const transporter = nodemailer.createTransporter(smtpConfig);
      
      console.log('🔍 [DEBUG] Testing SMTP connection...');
      await transporter.verify();
      smtpTest = 'SUCCESS';
      console.log('✅ [DEBUG] SMTP connection successful');
    } catch (error) {
      smtpTest = 'FAILED';
      smtpError = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ [DEBUG] SMTP test failed:', error);
    }

    return NextResponse.json({
      status: 'Contact Form Debug Report',
      timestamp: new Date().toISOString(),
      environment: envStatus,
      smtpTest: {
        result: smtpTest,
        error: smtpError
      },
      serverInfo: {
        platform: process.platform,
        nodeVersion: process.version,
        environment: process.env.NODE_ENV
      }
    });

  } catch (error) {
    console.error('❌ [DEBUG] Debug endpoint failed:', error);
    return NextResponse.json({
      status: 'Debug Failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    console.log('🔍 [DEBUG] Testing POST request to debug endpoint...');
    
    // Test a simple email send
    const testFormData = {
      name: 'Debug Test',
      email: 'debug@test.com',
      phone: '+1234567890',
      subject: 'Debug Test Email',
      message: 'This is a debug test to verify email functionality.'
    };

    console.log('🔍 [DEBUG] Test form data:', testFormData);

    // Simple SMTP test
    const smtpConfig = {
      host: process.env.SMTP_HOST || 'smtp.hostinger.com',
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: true,
      auth: {
        user: process.env.SMTP_USER || 'contactus@intelliglobalconferences.com',
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      }
    };

    console.log('🔍 [DEBUG] SMTP Config for test:', {
      host: smtpConfig.host,
      port: smtpConfig.port,
      user: smtpConfig.auth.user,
      hasPassword: !!smtpConfig.auth.pass
    });

    const transporter = nodemailer.createTransporter(smtpConfig);
    
    const mailOptions = {
      from: `"Debug Test" <${process.env.SMTP_USER || 'contactus@intelliglobalconferences.com'}>`,
      to: 'contactus@intelliglobalconferences.com',
      subject: '🔍 Debug Test Email',
      text: 'This is a debug test email to verify SMTP functionality.',
      html: '<p>This is a debug test email to verify SMTP functionality.</p>'
    };

    console.log('🔍 [DEBUG] Attempting to send test email...');
    const result = await transporter.sendMail(mailOptions);
    
    console.log('✅ [DEBUG] Test email sent successfully:', result.messageId);

    return NextResponse.json({
      status: 'Debug Email Test Successful',
      messageId: result.messageId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ [DEBUG] Debug email test failed:', error);
    return NextResponse.json({
      status: 'Debug Email Test Failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      details: {
        code: (error as any)?.code,
        command: (error as any)?.command,
        response: (error as any)?.response
      },
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
