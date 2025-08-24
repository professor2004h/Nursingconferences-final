import { NextRequest, NextResponse } from 'next/server';
import { sendTestEmail } from '@/app/services/emailService';

/**
 * Test Email API Endpoint
 * Sends a test payment receipt email to verify email system functionality
 */

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Testing email system...');
    
    const body = await request.json();
    const { testEmail } = body;
    
    if (!testEmail) {
      return NextResponse.json(
        { error: 'Test email address is required' },
        { status: 400 }
      );
    }
    
    console.log('📧 Sending test email to:', testEmail);
    
    // Send test email
    const success = await sendTestEmail(testEmail);
    
    if (success) {
      console.log('✅ Test email sent successfully');
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully',
        recipient: testEmail,
        timestamp: new Date().toISOString()
      });
    } else {
      console.error('❌ Test email failed to send');
      return NextResponse.json(
        { 
          error: 'Failed to send test email',
          recipient: testEmail 
        },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('❌ Error in test email API:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Email test endpoint',
    usage: 'POST with { "testEmail": "email@example.com" } to send test email',
    example: {
      testEmail: 'professor2004h@gmail.com'
    }
  });
}
