import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/app/sanity/client';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    console.log('🔔 Received Razorpay webhook...');

    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      console.error('❌ Missing webhook signature');
      return NextResponse.json(
        { error: 'Missing webhook signature' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'your_webhook_secret';
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');

    if (expectedSignature !== signature) {
      console.error('❌ Webhook signature verification failed');
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 400 }
      );
    }

    console.log('✅ Webhook signature verified');

    const event = JSON.parse(body);
    const { event: eventType, payload } = event;

    console.log('📨 Webhook event type:', eventType);

    switch (eventType) {
      case 'payment.captured':
        await handlePaymentCaptured(payload.payment.entity);
        break;
      
      case 'payment.failed':
        await handlePaymentFailed(payload.payment.entity);
        break;
      
      case 'order.paid':
        await handleOrderPaid(payload.order.entity);
        break;
      
      default:
        console.log('ℹ️ Unhandled webhook event type:', eventType);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    
    return NextResponse.json(
      { 
        error: 'Webhook processing failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

async function handlePaymentCaptured(payment: any) {
  try {
    console.log('💰 Processing payment captured:', payment.id);

    const orderId = payment.order_id;
    const paymentId = payment.id;
    const amount = payment.amount / 100; // Convert from paise to currency units

    // Find registration by Razorpay order ID
    const registration = await client.fetch(
      `*[_type == "conferenceRegistration" && razorpayOrderId == $orderId][0]`,
      { orderId }
    );

    if (!registration) {
      console.error('❌ Registration not found for order:', orderId);
      return;
    }

    // Update registration status
    await client
      .patch(registration._id)
      .set({
        paymentStatus: 'completed',
        paymentMethod: 'razorpay',
        paymentId: paymentId,
        lastUpdated: new Date().toISOString(),
        // CRITICAL: Use same field names as email template and PDF receipt
        paymentCurrency: 'INR',                  // Razorpay is typically INR
        paymentAmount: amount,                   // Same as paymentData.amount
        transactionId: paymentId,                // Same as paymentData.transactionId
        status: 'completed',                     // Same as paymentData.status
        // Also update pricing for backward compatibility
        'pricing.currency': 'INR',
        'pricing.totalPrice': amount,
      })
      .commit();

    console.log('✅ Registration payment status updated to completed:', registration.registrationId);

    // Here you could also:
    // - Send confirmation email
    // - Generate registration certificate
    // - Update inventory/capacity
    // - Trigger other business logic

  } catch (error) {
    console.error('❌ Error handling payment captured:', error);
  }
}

async function handlePaymentFailed(payment: any) {
  try {
    console.log('❌ Processing payment failed:', payment.id);

    const orderId = payment.order_id;
    const paymentId = payment.id;

    // Find registration by Razorpay order ID
    const registration = await client.fetch(
      `*[_type == "conferenceRegistration" && razorpayOrderId == $orderId][0]`,
      { orderId }
    );

    if (!registration) {
      console.error('❌ Registration not found for order:', orderId);
      return;
    }

    // Update registration status
    await client
      .patch(registration._id)
      .set({
        paymentStatus: 'failed',
        paymentId: paymentId,
        lastUpdated: new Date().toISOString(),
        notes: `Payment failed: ${payment.error_description || 'Unknown error'}`,
      })
      .commit();

    console.log('❌ Registration payment status updated to failed:', registration.registrationId);

    // Here you could also:
    // - Send failure notification email
    // - Log the failure reason
    // - Trigger retry logic
    // - Release reserved capacity

  } catch (error) {
    console.error('❌ Error handling payment failed:', error);
  }
}

async function handleOrderPaid(order: any) {
  try {
    console.log('✅ Processing order paid:', order.id);

    const orderId = order.id;
    const amount = order.amount / 100; // Convert from paise to currency units

    // Find registration by Razorpay order ID
    const registration = await client.fetch(
      `*[_type == "conferenceRegistration" && razorpayOrderId == $orderId][0]`,
      { orderId }
    );

    if (!registration) {
      console.error('❌ Registration not found for order:', orderId);
      return;
    }

    // Ensure payment status is completed
    if (registration.paymentStatus !== 'completed') {
      await client
        .patch(registration._id)
        .set({
          paymentStatus: 'completed',
          lastUpdated: new Date().toISOString(),
        })
        .commit();

      console.log('✅ Registration payment status confirmed as completed:', registration.registrationId);
    }

    // Here you could also:
    // - Generate final confirmation
    // - Update analytics
    // - Trigger post-payment workflows

  } catch (error) {
    console.error('❌ Error handling order paid:', error);
  }
}
