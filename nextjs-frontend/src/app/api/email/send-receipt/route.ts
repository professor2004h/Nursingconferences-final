import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/app/sanity/client';

/**
 * Manual Email Receipt Sending API
 * For testing and manual sending of payment receipts
 */

interface SendReceiptRequest {
  registrationId: string;
  paymentData?: {
    transactionId: string;
    orderId: string;
    amount: string;
    currency: string;
    capturedAt: string;
    paymentMethod: string;
  };
  testEmail?: string; // Override recipient email for testing
}

export async function POST(request: NextRequest) {
  try {
    console.log('📧 Manual email receipt sending requested...');
    
    const body: SendReceiptRequest = await request.json();
    const { registrationId, paymentData, testEmail } = body;
    
    if (!registrationId) {
      return NextResponse.json(
        { error: 'Registration ID is required' },
        { status: 400 }
      );
    }
    
    // Fetch registration details from Sanity
    console.log('🔍 Fetching registration details for:', registrationId);
    const registrationDetails = await client.fetch(
      `*[_type == "conferenceRegistration" && registrationId == $registrationId][0]{
        _id,
        registrationId,
        personalDetails,
        selectedRegistrationName,
        sponsorType,
        accommodationType,
        accommodationNights,
        numberOfParticipants,
        pricing,
        paymentStatus,
        paypalTransactionId,
        paypalOrderId,
        paidAmount,
        paidCurrency,
        paymentCapturedAt
      }`,
      { registrationId }
    );

    if (!registrationDetails) {
      console.error('❌ Registration not found:', registrationId);
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      );
    }

    // Use provided payment data or extract from registration
    const finalPaymentData = paymentData || {
      transactionId: registrationDetails.paypalTransactionId || 'TEST123456789',
      orderId: registrationDetails.paypalOrderId || 'ORDER123456789',
      amount: registrationDetails.paidAmount?.toString() || registrationDetails.pricing?.totalPrice?.toString() || '0',
      currency: registrationDetails.paidCurrency || registrationDetails.pricing?.currency || 'USD',
      capturedAt: registrationDetails.paymentCapturedAt || new Date().toISOString(),
      paymentMethod: 'PayPal'
    };

    // Use test email if provided, otherwise use registration email
    const recipientEmail = testEmail || registrationDetails.personalDetails?.email;
    
    if (!recipientEmail) {
      console.error('❌ No email address available for registration:', registrationId);
      return NextResponse.json(
        { error: 'No email address found for this registration' },
        { status: 400 }
      );
    }

    // Prepare email data
    const emailData = {
      registrationData: registrationDetails,
      paymentData: finalPaymentData,
      recipientEmail: recipientEmail
    };

    console.log('📧 Sending payment receipt email using UNIFIED SYSTEM:', {
      registrationId,
      recipient: recipientEmail,
      isTestEmail: !!testEmail,
      transactionId: finalPaymentData.transactionId
    });

    // Import and use the UNIFIED email system
    const { sendPaymentReceiptEmailWithRealData } = await import('../../../utils/paymentReceiptEmailer');

    // Prepare registration data for unified system
    const unifiedRegistrationData = {
      _id: registrationDetails._id,
      registrationId: registrationDetails.registrationId,
      fullName: `${registrationDetails.personalDetails?.title || ''} ${registrationDetails.personalDetails?.firstName || ''} ${registrationDetails.personalDetails?.lastName || ''}`.trim(),
      email: registrationDetails.personalDetails?.email,
      phoneNumber: registrationDetails.personalDetails?.phoneNumber,
      country: registrationDetails.personalDetails?.country,
      address: registrationDetails.personalDetails?.fullPostalAddress,
      registrationType: registrationDetails.selectedRegistrationName || registrationDetails.registrationType || 'regular',
      sponsorType: registrationDetails.sponsorType,
      numberOfParticipants: registrationDetails.numberOfParticipants || 1,
      personalDetails: registrationDetails.personalDetails,
      pricing: registrationDetails.pricing
    };

    // Send email using unified system
    const emailResult = await sendPaymentReceiptEmailWithRealData(
      finalPaymentData,
      unifiedRegistrationData,
      recipientEmail
    );

    if (emailResult.success) {
      console.log('✅ Payment receipt email sent successfully using UNIFIED SYSTEM');
      return NextResponse.json({
        success: true,
        message: 'Payment receipt email sent successfully',
        details: {
          registrationId,
          recipient: recipientEmail,
          transactionId: finalPaymentData.transactionId,
          isTestEmail: !!testEmail,
          timestamp: new Date().toISOString(),
          pdfGenerated: emailResult.pdfGenerated,
          pdfSize: emailResult.pdfSize,
          pdfUploaded: emailResult.pdfUploaded,
          pdfAssetId: emailResult.pdfAssetId,
          messageId: emailResult.messageId
        }
      });
    } else {
      console.error('❌ Failed to send payment receipt email using UNIFIED SYSTEM:', emailResult.error);
      return NextResponse.json(
        {
          error: 'Failed to send payment receipt email',
          details: emailResult.error || 'Email service may not be configured or authentication failed'
        },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('❌ Error in manual email receipt sending:', error);
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
    message: 'Manual email receipt sending endpoint',
    usage: 'POST with registration data to send payment receipt email',
    example: {
      registrationId: 'REG-123456789',
      testEmail: 'test@example.com', // Optional: override recipient
      paymentData: { // Optional: override payment data
        transactionId: 'TXN123456789',
        orderId: 'ORDER123456789',
        amount: '299.00',
        currency: 'USD',
        capturedAt: '2025-08-23T16:30:00.000Z',
        paymentMethod: 'PayPal'
      }
    }
  });
}
