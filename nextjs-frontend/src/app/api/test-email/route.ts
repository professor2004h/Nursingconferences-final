import { NextRequest, NextResponse } from 'next/server';

/**
 * Test Email Configuration API Route
 * Tests SMTP configuration and email sending functionality
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Testing email configuration...');
    
    const body = await request.json();
    const { testEmail } = body;
    
    if (!testEmail) {
      return NextResponse.json(
        { error: 'Missing testEmail parameter' },
        { status: 400 }
      );
    }

    // Check environment variables
    const envCheck = {
      hasSmtpHost: !!process.env.SMTP_HOST,
      hasSmtpUser: !!process.env.SMTP_USER,
      hasSmtpPass: !!process.env.SMTP_PASS,
      hasSanityToken: !!process.env.SANITY_API_TOKEN,
      smtpHost: process.env.SMTP_HOST,
      smtpPort: process.env.SMTP_PORT,
      smtpUser: process.env.SMTP_USER,
      nodeEnv: process.env.NODE_ENV
    };

    console.log('🔧 Environment check:', envCheck);

    // Test the email system
    const { sendPaymentReceiptEmailWithRealData } = await import('../../utils/paymentReceiptEmailer');

    // Create test data
    const testPaymentData = {
      transactionId: 'TEST_' + Date.now(),
      orderId: 'TEST_ORDER_' + Date.now(),
      amount: '99.00',
      currency: 'USD',
      paymentMethod: 'PayPal',
      paymentDate: new Date().toISOString(),
      status: 'COMPLETED',
      capturedAt: new Date().toISOString()
    };

    const testRegistrationData = {
      _id: 'test_registration_id',
      registrationId: 'TEST_REG_' + Date.now(),
      fullName: 'Test User',
      email: testEmail,
      phone: '+1234567890',
      country: 'United States',
      address: '123 Test Street, Test City, TC 12345',
      registrationType: 'Regular Registration',
      numberOfParticipants: '1'
    };

    console.log('📧 Sending test email to:', testEmail);
    
    const emailResult = await sendPaymentReceiptEmailWithRealData(
      testPaymentData,
      testRegistrationData,
      testEmail
    );

    console.log('✅ Test email result:', emailResult);

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      environmentCheck: envCheck,
      emailResult: emailResult,
      testData: {
        paymentData: testPaymentData,
        registrationData: testRegistrationData,
        recipientEmail: testEmail
      }
    });

  } catch (error) {
    console.error('❌ Test email failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Email test endpoint. Use POST with { "testEmail": "your@email.com" }'
  });
}
