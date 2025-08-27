import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { client } from '@/app/sanity/client';

/**
 * Razorpay Payment Verification API
 * Verifies Razorpay payment signature and processes successful payments
 */

interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  registrationId: string;
  amount: number;
  currency: string;
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔷 Razorpay payment verification requested...');
    
    const body: VerifyPaymentRequest = await request.json();
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      registrationId,
      amount,
      currency 
    } = body;
    
    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !registrationId) {
      console.error('❌ Missing required fields for payment verification');
      return NextResponse.json(
        { error: 'Missing required payment verification fields' },
        { status: 400 }
      );
    }
    
    console.log('🔷 Verifying payment:', {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      registrationId,
      amount,
      currency
    });
    
    // Verify payment signature
    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'onO6rsu0Bg20oIgjUygqJTEl';
    const body_to_verify = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body_to_verify.toString())
      .digest('hex');
    
    const isSignatureValid = expectedSignature === razorpay_signature;
    
    if (!isSignatureValid) {
      console.error('❌ Invalid Razorpay payment signature');
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }
    
    console.log('✅ Razorpay payment signature verified successfully');
    
    // Find and update registration in Sanity with payment details
    try {
      // First, find the registration by registrationId
      const registration = await client.fetch(
        `*[_type == "conferenceRegistration" && registrationId == $regId][0]{
          _id,
          registrationId,
          personalDetails,
          paymentStatus
        }`,
        { regId: registrationId }
      );

      if (!registration) {
        console.error('❌ Registration not found for ID:', registrationId);
        return NextResponse.json(
          { error: 'Registration not found' },
          { status: 404 }
        );
      }

      if (registration.paymentStatus === 'completed') {
        console.log('⚠️ Payment already completed for registration:', registrationId);
        return NextResponse.json(
          { error: 'Payment already completed for this registration' },
          { status: 400 }
        );
      }

      const updateResult = await client
        .patch(registration._id)
        .set({
          paymentStatus: 'completed',
          paymentMethod: 'razorpay',
          paymentId: razorpay_payment_id,
          paymentOrderId: razorpay_order_id,
          paymentSignature: razorpay_signature,
          paymentAmount: amount,
          paymentCurrency: currency,
          paymentDate: new Date().toISOString(),
          paymentCapturedAt: new Date().toISOString(),
          razorpayPaymentData: {
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            signature: razorpay_signature,
            amount,
            currency,
            verifiedAt: new Date().toISOString()
          }
        })
        .commit();
        
      console.log('✅ Registration updated with Razorpay payment details:', updateResult._id);
      
    } catch (sanityError) {
      console.error('❌ Failed to update registration in Sanity:', sanityError);
      // Continue processing even if Sanity update fails
    }
    
    // Trigger receipt email system (same as PayPal)
    try {
      console.log('📧 Triggering receipt email system for Razorpay payment...');
      
      // Import the unified email system
      const { sendPaymentReceiptEmailWithRealData } = await import('../../../utils/paymentReceiptEmailer');
      
      // Get registration details from Sanity (use the same registration we found earlier)
      const registrationForEmail = await client.fetch(`
        *[_type == "conferenceRegistration" && registrationId == $regId][0] {
          _id,
          registrationId,
          personalDetails,
          selectedRegistrationName,
          sponsorType,
          registrationType,
          accommodationType,
          accommodationNights,
          numberOfParticipants,
          pricing
        }
      `, { regId: registrationId });

      if (!registrationForEmail) {
        console.error('❌ Registration not found for receipt email:', registrationId);
        throw new Error('Registration not found');
      }
      
      // Prepare payment data for receipt system
      const paymentData = {
        transactionId: razorpay_payment_id,
        orderId: razorpay_order_id,
        amount: amount.toString(),
        currency: currency,
        status: 'completed',
        paymentDate: new Date().toISOString(),
        paymentMethod: 'Razorpay',
        capturedAt: new Date().toISOString(),
        razorpayPaymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
        razorpaySignature: razorpay_signature
      };
      
      // Prepare registration data for receipt system
      const registrationData = {
        _id: registrationForEmail._id,
        registrationId: registrationForEmail.registrationId,
        fullName: `${registrationForEmail.personalDetails?.title || 'Dr.'} ${registrationForEmail.personalDetails?.firstName || ''} ${registrationForEmail.personalDetails?.lastName || ''}`.trim(),
        email: registrationForEmail.personalDetails?.email,
        phoneNumber: registrationForEmail.personalDetails?.phoneNumber,
        country: registrationForEmail.personalDetails?.country,
        address: registrationForEmail.personalDetails?.fullPostalAddress,
        registrationType: registrationForEmail.selectedRegistrationName || registrationForEmail.registrationType || 'regular',
        sponsorType: registrationForEmail.sponsorType,
        numberOfParticipants: registrationForEmail.numberOfParticipants || 1,
        accommodationType: registrationForEmail.accommodationType,
        accommodationNights: registrationForEmail.accommodationNights,
        personalDetails: registrationForEmail.personalDetails,
        pricing: registrationForEmail.pricing
      };

      const customerEmail = registrationForEmail.personalDetails?.email;
      
      if (customerEmail) {
        console.log('📧 Sending Razorpay payment receipt to customer:', customerEmail);
        
        const emailResult = await sendPaymentReceiptEmailWithRealData(
          paymentData,
          registrationData,
          customerEmail
        );
        
        if (emailResult.success) {
          console.log('✅ Razorpay payment receipt sent successfully');
          
          // Update registration with receipt status
          await client
            .patch(registrationId)
            .set({
              receiptEmailSent: true,
              receiptEmailSentAt: new Date().toISOString(),
              receiptEmailRecipient: customerEmail,
              pdfReceiptGenerated: emailResult.pdfGenerated,
              pdfReceiptStoredInSanity: emailResult.pdfUploaded,
              webhookProcessed: true
            })
            .commit();
            
        } else {
          console.error('❌ Failed to send Razorpay payment receipt:', emailResult.error);
        }
      } else {
        console.error('❌ No customer email found for receipt delivery');
      }
      
    } catch (emailError) {
      console.error('❌ Receipt email system error:', emailError);
      // Don't fail the payment verification due to email issues
    }
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      paymentDetails: {
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        amount,
        currency,
        registrationId,
        verifiedAt: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('❌ Razorpay payment verification failed:', error);
    
    return NextResponse.json(
      { 
        error: 'Payment verification failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Razorpay payment verification endpoint',
    usage: 'POST with payment verification data',
    example: {
      razorpay_order_id: 'order_xxxxxxxxxxxxx',
      razorpay_payment_id: 'pay_xxxxxxxxxxxxx',
      razorpay_signature: 'signature_string',
      registrationId: 'REG-123456789',
      amount: 399,
      currency: 'USD'
    }
  });
}
