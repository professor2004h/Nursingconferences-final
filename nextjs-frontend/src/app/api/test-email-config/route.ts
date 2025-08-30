import { NextRequest, NextResponse } from 'next/server';
import { verifyEmailConnection } from '../../lib/emailService';

export async function GET() {
  try {
    console.log('🔧 Testing email configuration...');

    // Check environment variables with actual values (for debugging)
    const envCheck = {
      SMTP_HOST: process.env.SMTP_HOST ? `✅ SET (${process.env.SMTP_HOST})` : '❌ NOT SET',
      SMTP_PORT: process.env.SMTP_PORT ? `✅ SET (${process.env.SMTP_PORT})` : '❌ NOT SET',
      SMTP_USER: process.env.SMTP_USER ? `✅ SET (${process.env.SMTP_USER})` : '❌ NOT SET',
      SMTP_PASS: process.env.SMTP_PASS ? `✅ SET (${process.env.SMTP_PASS.length} chars)` : '❌ NOT SET',
      SMTP_SECURE: process.env.SMTP_SECURE ? `✅ SET (${process.env.SMTP_SECURE})` : '❌ NOT SET',
      NODE_ENV: process.env.NODE_ENV || 'undefined'
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
      passConfigured: process.env.SMTP_PASS ? 'YES' : 'NO',
      environment: process.env.NODE_ENV
    };

    return NextResponse.json({
      status: 'Email Configuration Test',
      timestamp: new Date().toISOString(),
      environmentVariables: envCheck,
      smtpConfig: config,
      connectionTest,
      connectionError,
      serverInfo: {
        platform: process.platform,
        nodeVersion: process.version,
        environment: process.env.NODE_ENV
      },
      recommendations: [
        'Ensure all SMTP environment variables are set on your deployment platform',
        'Verify SMTP credentials are correct for your email provider',
        'Check that your email provider allows SMTP connections',
        'Ensure firewall/network allows outbound connections on SMTP port',
        'For production: Check deployment platform environment variable settings'
      ]
    });

  } catch (error) {
    console.error('Email config test error:', error);

    return NextResponse.json({
      status: 'Error testing email configuration',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
