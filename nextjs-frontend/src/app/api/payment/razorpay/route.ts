import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { client } from '@/app/sanity/client';

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_your_key_id',
  key_secret: process.env.RAZORPAY_SECRET_KEY || 'your_secret_key',
});

export async function POST(request: NextRequest) {
  try {
    console.log('💳 Processing Razorpay payment initialization...');

    const { registrationId } = await request.json();

    if (!registrationId) {
      return NextResponse.json(
        { error: 'Registration ID is required' },
        { status: 400 }
      );
    }

    // Fetch registration details from Sanity
    const registration = await client.fetch(
      `*[_type == "conferenceRegistration" && registrationId == $registrationId][0]{
        _id,
        registrationId,
        personalDetails,
        pricing,
        paymentStatus
      }`,
      { registrationId }
    );

    if (!registration) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      );
    }

    if (registration.paymentStatus === 'completed') {
      return NextResponse.json(
        { error: 'Payment already completed for this registration' },
        { status: 400 }
      );
    }

    // Create Razorpay order
    const orderOptions = {
      amount: Math.round(registration.pricing.totalPrice * 100), // Amount in paise
      currency: registration.pricing.currency || 'USD',
      receipt: `receipt_${registrationId}`,
      notes: {
        registrationId: registration.registrationId,
        customerName: `${registration.personalDetails.firstName} ${registration.personalDetails.lastName}`,
        customerEmail: registration.personalDetails.email,
      },
    };

    console.log('🔄 Creating Razorpay order:', orderOptions);

    const order = await razorpay.orders.create(orderOptions);

    console.log('✅ Razorpay order created:', order.id);

    // Update registration with Razorpay order ID
    await client
      .patch(registration._id)
      .set({
        razorpayOrderId: order.id,
        lastUpdated: new Date().toISOString(),
      })
      .commit();

    // Return order details for frontend
    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      registrationDetails: {
        registrationId: registration.registrationId,
        customerName: `${registration.personalDetails.firstName} ${registration.personalDetails.lastName}`,
        customerEmail: registration.personalDetails.email,
        customerPhone: registration.personalDetails.phoneNumber,
      },
      razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });

  } catch (error) {
    console.error('❌ Razorpay payment initialization error:', error);
    
    return NextResponse.json(
      { 
        error: 'Payment initialization failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

// Handle payment verification
export async function PUT(request: NextRequest) {
  try {
    console.log('🔍 Verifying Razorpay payment...');

    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      registrationId 
    } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !registrationId) {
      return NextResponse.json(
        { error: 'Missing required payment verification parameters' },
        { status: 400 }
      );
    }

    // Verify payment signature
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET_KEY || 'your_secret_key')
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      console.error('❌ Payment signature verification failed');
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      );
    }

    console.log('✅ Payment signature verified successfully');

    // Fetch payment details from Razorpay
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    // Update registration in Sanity
    const registration = await client.fetch(
      `*[_type == "conferenceRegistration" && registrationId == $registrationId][0]`,
      { registrationId }
    );

    if (!registration) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      );
    }

    await client
      .patch(registration._id)
      .set({
        paymentStatus: 'completed',
        paymentId: razorpay_payment_id,
        lastUpdated: new Date().toISOString(),
      })
      .commit();

    console.log('✅ Registration payment status updated to completed');

    return NextResponse.json({
      success: true,
      message: 'Payment verified and registration completed',
      paymentDetails: {
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        amount: Number(payment.amount) / 100, // Convert back to currency units
        currency: payment.currency,
        status: payment.status,
      },
    });

  } catch (error) {
    console.error('❌ Payment verification error:', error);
    
    return NextResponse.json(
      { 
        error: 'Payment verification failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
