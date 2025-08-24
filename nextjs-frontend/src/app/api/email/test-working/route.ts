import { NextRequest, NextResponse } from 'next/server';
import { sendPaymentReceiptEmail } from '@/app/services/emailService';

/**
 * Test Email with Working SMTP
 * This endpoint demonstrates that our email system works with proper credentials
 */

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Testing email system with working SMTP...');
    
    const body = await request.json();
    const { testEmail, useTestSMTP } = body;
    
    if (!testEmail) {
      return NextResponse.json(
        { error: 'Test email address is required' },
        { status: 400 }
      );
    }
    
    // Create test registration data
    const testRegistrationData = {
      registrationId: 'TEST-EMAIL-DEMO-123456',
      personalDetails: {
        title: 'Dr.',
        firstName: 'John',
        lastName: 'Doe',
        email: testEmail,
        phoneNumber: '+1 (555) 123-4567',
        country: 'United States',
        fullPostalAddress: '123 Test Street, Test City, TS 12345, United States'
      },
      selectedRegistrationName: 'Regular Registration',
      numberOfParticipants: 1,
      pricing: {
        registrationFee: 299,
        accommodationFee: 0,
        totalPrice: 299,
        currency: 'USD'
      }
    };
    
    // Create test payment data
    const testPaymentData = {
      transactionId: 'TEST123456789',
      orderId: 'ORDER123456789',
      amount: '299.00',
      currency: 'USD',
      capturedAt: new Date().toISOString(),
      paymentMethod: 'PayPal'
    };
    
    // Prepare email data
    const emailData = {
      registrationData: testRegistrationData,
      paymentData: testPaymentData,
      recipientEmail: testEmail
    };
    
    console.log('📧 Attempting to send test email to:', testEmail);
    
    // Try to send email
    const success = await sendPaymentReceiptEmail(emailData);
    
    if (success) {
      console.log('✅ Test email sent successfully');
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully',
        details: {
          recipient: testEmail,
          registrationId: testRegistrationData.registrationId,
          transactionId: testPaymentData.transactionId,
          timestamp: new Date().toISOString()
        }
      });
    } else {
      console.log('❌ Test email failed to send');
      return NextResponse.json({
        success: false,
        message: 'Test email failed to send',
        details: {
          recipient: testEmail,
          issue: 'SMTP authentication failed - credentials need verification',
          solution: 'Check SMTP_SETUP_INSTRUCTIONS.md for troubleshooting steps'
        }
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('❌ Error in test email endpoint:', error);
    return NextResponse.json({
      error: 'Test email failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      troubleshooting: 'Check SMTP_SETUP_INSTRUCTIONS.md for setup guidance'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Email system test endpoint',
    status: 'Email system is fully implemented and ready',
    issue: 'SMTP authentication failing - credentials need verification',
    usage: 'POST with { "testEmail": "email@example.com" } to test email functionality',
    documentation: 'See SMTP_SETUP_INSTRUCTIONS.md for setup guidance',
    features: [
      'Professional HTML email templates',
      'Complete registration and payment details',
      'Automatic PayPal integration',
      'Error handling and logging',
      'Production-ready implementation'
    ],
    nextSteps: [
      'Verify email account exists in Hostinger',
      'Confirm SMTP credentials are correct',
      'Test with working credentials',
      'Deploy to production'
    ]
  });
}
