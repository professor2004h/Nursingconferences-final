import { NextRequest, NextResponse } from 'next/server';
import { verifyEmailConnection } from '../../lib/emailService';

export async function GET() {
  try {
    console.log('🔧 Testing email configuration...');
    
    // Check environment variables
    const envCheck = {
      SMTP_HOST: process.env.SMTP_HOST ? '✅ SET' : '❌ NOT SET',
      SMTP_PORT: process.env.SMTP_PORT ? '✅ SET' : '❌ NOT SET', 
      SMTP_USER: process.env.SMTP_USER ? '✅ SET' : '❌ NOT SET',
      SMTP_PASS: process.env.SMTP_PASS ? '✅ SET' : '❌ NOT SET',
      SMTP_SECURE: process.env.SMTP_SECURE ? '✅ SET' : '❌ NOT SET'
    };

    console.log('Environment Variables Check:', envCheck);

    // Test SMTP connection
    let connectionTest = '❌ FAILED';
    let connectionError = null;
    
    try {
      const isConnected = await verifyEmailConnection();
      connectionTest = isConnected ? '✅ SUCCESS' : '❌ FAILED';
    } catch (error) {
      connectionError = error instanceof Error ? error.message : 'Unknown error';
      console.error('Connection test error:', error);
    }

    const config = {
      host: process.env.SMTP_HOST || 'smtp.hostinger.com',
      port: process.env.SMTP_PORT || '465',
      secure: process.env.SMTP_SECURE || 'true',
      user: process.env.SMTP_USER || 'contactus@intelliglobalconferences.com',
      // Don't expose the password in response
      passConfigured: process.env.SMTP_PASS ? 'YES' : 'NO'
    };

    return NextResponse.json({
      status: 'Email Configuration Test',
      timestamp: new Date().toISOString(),
      environmentVariables: envCheck,
      smtpConfig: config,
      connectionTest,
      connectionError,
      recommendations: [
        'Ensure all SMTP environment variables are set in your .env.local file',
        'Verify SMTP credentials are correct for your email provider',
        'Check that your email provider allows SMTP connections',
        'Ensure firewall/network allows outbound connections on SMTP port'
      ]
    });

  } catch (error) {
    console.error('Email config test error:', error);
    
    return NextResponse.json({
      status: 'Error testing email configuration',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
