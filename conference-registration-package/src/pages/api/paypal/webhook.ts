// =============================================================================
// PAYPAL WEBHOOK API ROUTE
// =============================================================================

import { NextApiRequest, NextApiResponse } from 'next';
import { paypalConfig, getPayPalApiUrl, webhookEvents } from '@/lib/config/paypal';
import crypto from 'crypto';

interface PayPalWebhookEvent {
  id: string;
  event_type: string;
  event_version: string;
  create_time: string;
  resource_type: string;
  resource_version: string;
  resource: any;
  summary: string;
}

// Verify PayPal webhook signature
async function verifyWebhookSignature(
  headers: any,
  body: string,
  webhookId: string
): Promise<boolean> {
  try {
    // Get required headers
    const authAlgo = headers['paypal-auth-algo'];
    const transmission_id = headers['paypal-transmission-id'];
    const cert_id = headers['paypal-cert-id'];
    const transmission_sig = headers['paypal-transmission-sig'];
    const transmission_time = headers['paypal-transmission-time'];

    if (!authAlgo || !transmission_id || !cert_id || !transmission_sig || !transmission_time) {
      console.error('❌ Missing required webhook headers');
      return false;
    }

    // Get PayPal access token
    const auth = Buffer.from(`${paypalConfig.clientId}:${paypalConfig.clientSecret}`).toString('base64');
    
    const tokenResponse = await fetch(`${getPayPalApiUrl()}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!tokenResponse.ok) {
      console.error('❌ Failed to get PayPal access token for webhook verification');
      return false;
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Verify webhook signature
    const verificationData = {
      auth_algo: authAlgo,
      cert_id: cert_id,
      transmission_id: transmission_id,
      transmission_sig: transmission_sig,
      transmission_time: transmission_time,
      webhook_id: webhookId,
      webhook_event: JSON.parse(body),
    };

    const verifyResponse = await fetch(`${getPayPalApiUrl()}/v1/notifications/verify-webhook-signature`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(verificationData),
    });

    if (!verifyResponse.ok) {
      console.error('❌ Webhook signature verification failed:', verifyResponse.status);
      return false;
    }

    const verifyData = await verifyResponse.json();
    return verifyData.verification_status === 'SUCCESS';
  } catch (error) {
    console.error('❌ Error verifying webhook signature:', error);
    return false;
  }
}

// Handle payment capture completed
async function handlePaymentCaptureCompleted(webhookEvent: PayPalWebhookEvent) {
  try {
    const capture = webhookEvent.resource;
    const customId = capture.custom_id;
    
    console.log('✅ Payment capture completed:', {
      captureId: capture.id,
      customId,
      amount: capture.amount.value,
      currency: capture.amount.currency_code,
    });

    if (customId) {
      // TODO: Update registration status in your database
      // Example implementation:
      /*
      await database.registration.update({
        where: { id: customId },
        data: {
          paymentStatus: 'completed',
          paymentId: capture.id,
          paymentMethod: 'paypal',
          paymentAmount: parseFloat(capture.amount.value),
          paymentCurrency: capture.amount.currency_code,
          paymentDate: new Date().toISOString(),
          status: 'confirmed',
          webhookProcessed: true,
        },
      });
      */

      console.log('📝 Registration updated with payment completion:', customId);
    }
  } catch (error) {
    console.error('❌ Error handling payment capture completed:', error);
  }
}

// Handle payment capture denied
async function handlePaymentCaptureDenied(webhookEvent: PayPalWebhookEvent) {
  try {
    const capture = webhookEvent.resource;
    const customId = capture.custom_id;
    
    console.log('❌ Payment capture denied:', {
      captureId: capture.id,
      customId,
      reason: capture.status_details?.reason,
    });

    if (customId) {
      // TODO: Update registration status in your database
      // Example implementation:
      /*
      await database.registration.update({
        where: { id: customId },
        data: {
          paymentStatus: 'failed',
          paymentFailureReason: capture.status_details?.reason || 'Payment denied',
          webhookProcessed: true,
        },
      });
      */

      console.log('📝 Registration updated with payment denial:', customId);
    }
  } catch (error) {
    console.error('❌ Error handling payment capture denied:', error);
  }
}

// Handle payment capture pending
async function handlePaymentCapturePending(webhookEvent: PayPalWebhookEvent) {
  try {
    const capture = webhookEvent.resource;
    const customId = capture.custom_id;
    
    console.log('⏳ Payment capture pending:', {
      captureId: capture.id,
      customId,
      reason: capture.status_details?.reason,
    });

    if (customId) {
      // TODO: Update registration status in your database
      // Example implementation:
      /*
      await database.registration.update({
        where: { id: customId },
        data: {
          paymentStatus: 'pending',
          paymentPendingReason: capture.status_details?.reason || 'Payment pending',
          webhookProcessed: true,
        },
      });
      */

      console.log('📝 Registration updated with payment pending:', customId);
    }
  } catch (error) {
    console.error('❌ Error handling payment capture pending:', error);
  }
}

// Handle order approved
async function handleOrderApproved(webhookEvent: PayPalWebhookEvent) {
  try {
    const order = webhookEvent.resource;
    console.log('✅ Order approved:', order.id);
    
    // Optional: Update registration status to indicate approval
    // This is usually handled by the capture event instead
  } catch (error) {
    console.error('❌ Error handling order approved:', error);
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    const body = JSON.stringify(req.body);
    const webhookEvent: PayPalWebhookEvent = req.body;

    console.log('📨 Received PayPal webhook:', {
      eventType: webhookEvent.event_type,
      eventId: webhookEvent.id,
      resourceType: webhookEvent.resource_type,
    });

    // Verify webhook signature (optional but recommended for production)
    if (paypalConfig.webhookId && paypalConfig.webhookId !== 'YOUR_PAYPAL_WEBHOOK_ID_HERE') {
      const isValid = await verifyWebhookSignature(req.headers, body, paypalConfig.webhookId);
      if (!isValid) {
        console.error('❌ Invalid webhook signature');
        return res.status(401).json({ 
          success: false, 
          error: 'Invalid webhook signature' 
        });
      }
    }

    // Check if this is a supported event type
    if (!webhookEvents.includes(webhookEvent.event_type)) {
      console.log(`ℹ️ Unhandled webhook event: ${webhookEvent.event_type}`);
      return res.status(200).json({ 
        success: true, 
        message: 'Event type not handled',
        event_type: webhookEvent.event_type 
      });
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

      case 'CHECKOUT.ORDER.APPROVED':
        await handleOrderApproved(webhookEvent);
        break;

      default:
        console.log(`ℹ️ Unhandled webhook event: ${webhookEvent.event_type}`);
    }

    return res.status(200).json({ 
      success: true, 
      event_type: webhookEvent.event_type,
      message: 'Webhook processed successfully'
    });

  } catch (error) {
    console.error('❌ PayPal webhook error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
