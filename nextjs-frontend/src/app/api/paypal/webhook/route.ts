/**
 * PayPal Webhook Handler
 * Handles PayPal webhook events for production payment processing
 * ⚠️ PRODUCTION: Processes real payment notifications
 */

import { NextRequest, NextResponse } from 'next/server';
import { paypalService } from '@/app/services/paypalService';
import { client } from '@/app/sanity/client';

// PayPal webhook events we handle
const HANDLED_EVENTS = [
  'PAYMENT.CAPTURE.COMPLETED',
  'PAYMENT.CAPTURE.DENIED',
  'PAYMENT.CAPTURE.PENDING',
  'PAYMENT.CAPTURE.REFUNDED',
  'CHECKOUT.ORDER.APPROVED',
  'CHECKOUT.ORDER.COMPLETED',
];

export async function POST(request: NextRequest) {
  try {
    console.log('🔔 PayPal webhook received');

    // Get webhook body and headers
    const body = await request.text();
    const headers = Object.fromEntries(request.headers.entries());

    // Log webhook for debugging (be careful with sensitive data)
    console.log('📋 Webhook headers:', {
      'paypal-transmission-id': headers['paypal-transmission-id'],
      'paypal-cert-id': headers['paypal-cert-id'],
      'paypal-auth-algo': headers['paypal-auth-algo'],
      'paypal-transmission-time': headers['paypal-transmission-time'],
    });

    // Parse webhook event
    let webhookEvent;
    try {
      webhookEvent = JSON.parse(body);
    } catch (error) {
      console.error('❌ Invalid webhook JSON:', error);
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    console.log('🔔 Webhook event:', {
      id: webhookEvent.id,
      event_type: webhookEvent.event_type,
      resource_type: webhookEvent.resource_type,
    });

    // Verify webhook signature (CRITICAL for production security)
    const webhookId = process.env.PAYPAL_WEBHOOK_ID;
    if (webhookId) {
      const isValid = await paypalService.verifyWebhookSignature(headers, body, webhookId);
      if (!isValid) {
        console.error('❌ Invalid webhook signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
      console.log('✅ Webhook signature verified');
    } else {
      console.warn('⚠️ PAYPAL_WEBHOOK_ID not configured - skipping signature verification');
    }

    // Handle different webhook events
    switch (webhookEvent.event_type) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        await handlePaymentCaptureCompleted(webhookEvent);
        break;

      case 'PAYMENT.CAPTURE.DENIED':
        await handlePaymentCaptureDenied(webhookEvent);
        break;

      case 'PAYMENT.CAPTURE.PENDING':
        await handlePaymentCapturePending(webhookEvent);
        break;

      case 'PAYMENT.CAPTURE.REFUNDED':
        await handlePaymentCaptureRefunded(webhookEvent);
        break;

      case 'CHECKOUT.ORDER.APPROVED':
        await handleOrderApproved(webhookEvent);
        break;

      case 'CHECKOUT.ORDER.COMPLETED':
        await handleOrderCompleted(webhookEvent);
        break;

      default:
        console.log(`ℹ️ Unhandled webhook event: ${webhookEvent.event_type}`);
    }

    return NextResponse.json({ success: true, event_type: webhookEvent.event_type });

  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

/**
 * Handle successful payment capture
 */
async function handlePaymentCaptureCompleted(webhookEvent: any) {
  try {
    const capture = webhookEvent.resource;
    const customId = capture.custom_id; // This should be our registration ID
    
    console.log('✅ Payment capture completed:', {
      captureId: capture.id,
      amount: capture.amount.value,
      currency: capture.amount.currency_code,
      customId,
    });

    if (customId) {
      // Update registration status in Sanity
      await client
        .patch(customId)
        .set({
          paymentStatus: 'completed',
          paymentId: capture.id,
          paymentMethod: 'paypal',
          paymentAmount: parseFloat(capture.amount.value),
          paymentCurrency: capture.amount.currency_code,
          paymentDate: new Date().toISOString(),
          webhookProcessed: true,
        })
        .commit();

      console.log('✅ Registration updated with payment completion:', customId);
    }
  } catch (error) {
    console.error('❌ Error handling payment capture completed:', error);
  }
}

/**
 * Handle denied payment capture
 */
async function handlePaymentCaptureDenied(webhookEvent: any) {
  try {
    const capture = webhookEvent.resource;
    const customId = capture.custom_id;
    
    console.log('❌ Payment capture denied:', {
      captureId: capture.id,
      customId,
      reason: capture.status_details?.reason,
    });

    if (customId) {
      await client
        .patch(customId)
        .set({
          paymentStatus: 'failed',
          paymentFailureReason: capture.status_details?.reason || 'Payment denied',
          webhookProcessed: true,
        })
        .commit();

      console.log('✅ Registration updated with payment failure:', customId);
    }
  } catch (error) {
    console.error('❌ Error handling payment capture denied:', error);
  }
}

/**
 * Handle pending payment capture
 */
async function handlePaymentCapturePending(webhookEvent: any) {
  try {
    const capture = webhookEvent.resource;
    const customId = capture.custom_id;
    
    console.log('⏳ Payment capture pending:', {
      captureId: capture.id,
      customId,
      reason: capture.status_details?.reason,
    });

    if (customId) {
      await client
        .patch(customId)
        .set({
          paymentStatus: 'pending',
          paymentPendingReason: capture.status_details?.reason || 'Payment pending',
          webhookProcessed: true,
        })
        .commit();

      console.log('✅ Registration updated with payment pending:', customId);
    }
  } catch (error) {
    console.error('❌ Error handling payment capture pending:', error);
  }
}

/**
 * Handle payment refund
 */
async function handlePaymentCaptureRefunded(webhookEvent: any) {
  try {
    const refund = webhookEvent.resource;
    const customId = refund.custom_id;
    
    console.log('💰 Payment refunded:', {
      refundId: refund.id,
      amount: refund.amount.value,
      currency: refund.amount.currency_code,
      customId,
    });

    if (customId) {
      await client
        .patch(customId)
        .set({
          paymentStatus: 'refunded',
          refundId: refund.id,
          refundAmount: parseFloat(refund.amount.value),
          refundDate: new Date().toISOString(),
          webhookProcessed: true,
        })
        .commit();

      console.log('✅ Registration updated with refund:', customId);
    }
  } catch (error) {
    console.error('❌ Error handling payment refund:', error);
  }
}

/**
 * Handle order approved
 */
async function handleOrderApproved(webhookEvent: any) {
  try {
    const order = webhookEvent.resource;
    const customId = order.purchase_units?.[0]?.custom_id;
    
    console.log('👍 Order approved:', {
      orderId: order.id,
      customId,
    });

    if (customId) {
      await client
        .patch(customId)
        .set({
          paymentStatus: 'approved',
          paypalOrderId: order.id,
          webhookProcessed: true,
        })
        .commit();

      console.log('✅ Registration updated with order approval:', customId);
    }
  } catch (error) {
    console.error('❌ Error handling order approved:', error);
  }
}

/**
 * Handle order completed
 */
async function handleOrderCompleted(webhookEvent: any) {
  try {
    const order = webhookEvent.resource;
    const customId = order.purchase_units?.[0]?.custom_id;
    
    console.log('🎉 Order completed:', {
      orderId: order.id,
      customId,
    });

    if (customId) {
      await client
        .patch(customId)
        .set({
          orderStatus: 'completed',
          paypalOrderId: order.id,
          webhookProcessed: true,
        })
        .commit();

      console.log('✅ Registration updated with order completion:', customId);
    }
  } catch (error) {
    console.error('❌ Error handling order completed:', error);
  }
}
