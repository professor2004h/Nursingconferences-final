import { NextRequest, NextResponse } from 'next/server';
import { sendContactFormNotification } from '../../lib/emailService';
import { getSiteSettings } from '../../getSiteSettings';

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Testing email sending functionality...');
    
    // Get site settings for recipient email
    const siteSettings = await getSiteSettings();
    const recipientEmail = siteSettings?.contactInfo?.email || 'contactus@intelliglobalconferences.com';
    
    // Create test form data
    const testFormData = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '+1234567890',
      subject: 'Email System Test',
      message: 'This is a test message to verify that the email system is working correctly. If you receive this email, the contact form is functioning properly.'
    };

    console.log('📧 Sending test email to:', recipientEmail);
    console.log('📧 Test form data:', testFormData);

    // Send the test email
    const emailSent = await sendContactFormNotification(testFormData, recipientEmail);

    if (emailSent) {
      console.log('✅ Test email sent successfully');
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully!',
        recipientEmail,
        testData: testFormData,
        timestamp: new Date().toISOString()
      });
    } else {
      console.log('❌ Test email failed to send');
      return NextResponse.json({
        success: false,
        message: 'Failed to send test email',
        recipientEmail,
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Error in test email endpoint:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST method to send a test email',
    endpoint: '/api/test-send-email',
    method: 'POST'
  });
}
