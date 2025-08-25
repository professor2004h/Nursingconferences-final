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

      // Send REAL payment receipt email (non-blocking with enhanced error handling)
      setImmediate(async () => {
        try {
          console.log('📧 Sending REAL payment receipt from webhook for:', customId);

          // Import the payment receipt emailer
          const { sendPaymentReceiptEmailWithRealData } = await import('../../../utils/paymentReceiptEmailer');

          // Fetch complete registration data from Sanity with retry logic
          let registration = null;
          let retryCount = 0;
          const maxRetries = 3;

          while (!registration && retryCount < maxRetries) {
            try {
              registration = await client.fetch(
                `*[_type == "conferenceRegistration" && _id == $registrationId][0]{
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
                  registrationDate,
                  paypalOrderId,
                  paymentId,
                  paymentAmount,
                  paymentCurrency
                }`,
                { registrationId: customId }
              );

              if (registration) {
                console.log('✅ Registration data fetched successfully');
                break;
              }
            } catch (fetchError) {
              console.warn(`⚠️ Retry ${retryCount + 1}/${maxRetries} failed:`, fetchError.message);
            }

            retryCount++;
            if (retryCount < maxRetries) {
              // Exponential backoff: 1s, 2s, 4s
              await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
            }
          }

          if (!registration) {
            throw new Error(`Registration not found after ${maxRetries} retries: ${customId}`);
          }

          // Prepare REAL payment data from webhook
          const realPaymentData = {
            transactionId: capture.id,
            orderId: webhookEvent.resource.supplementary_data?.related_ids?.order_id || capture.supplementary_data?.related_ids?.order_id || 'N/A',
            amount: parseFloat(capture.amount.value),
            currency: capture.amount.currency_code,
            paymentMethod: 'PayPal',
            paymentDate: new Date().toISOString(),
            status: capture.status === 'COMPLETED' ? 'Completed' : capture.status,
            capturedAt: new Date().toISOString(),
            paypalCaptureId: capture.id,
            paypalStatus: capture.status
          };

          // Prepare enhanced registration data with proper field mapping
          const personalDetails = registration.personalDetails || {};
          const realRegistrationData = {
            _id: registration._id, // Required for PDF storage
            registrationId: registration.registrationId || registration._id,

            // Personal details with fallback handling
            fullName: personalDetails.firstName && personalDetails.lastName
              ? `${personalDetails.title || ''} ${personalDetails.firstName} ${personalDetails.lastName}`.trim()
              : registration.fullName || 'N/A',
            email: personalDetails.email || registration.email,
            phoneNumber: personalDetails.phoneNumber || registration.phoneNumber,
            phone: personalDetails.phoneNumber || registration.phoneNumber,
            country: personalDetails.country || registration.country,
            address: personalDetails.fullPostalAddress || registration.address,

            // Registration details
            registrationType: registration.selectedRegistrationName || registration.registrationType || 'Regular Registration',
            sponsorType: registration.sponsorType,
            numberOfParticipants: registration.numberOfParticipants || 1,

            // Accommodation details
            accommodationType: registration.accommodationType,
            accommodationNights: registration.accommodationNights,

            // Pricing information
            pricing: registration.pricing,

            // Conference details
            conferenceTitle: 'International Nursing Conference 2025',
            conferenceDate: '2025-03-15 to 2025-03-17',
            conferenceLocation: 'New York Convention Center, New York, USA',

            // Additional fields for PDF storage
            personalDetails: registration.personalDetails
          };

          // Get recipient email with fallback
          const recipientEmail = realRegistrationData.email || personalDetails.email;

          if (!recipientEmail) {
            throw new Error('No email address found for registration');
          }

          console.log('📧 Sending payment receipt to:', recipientEmail);
          console.log('💰 Payment amount:', `${realPaymentData.currency} ${realPaymentData.amount}`);

          const emailResult = await sendPaymentReceiptEmailWithRealData(
            realPaymentData,
            realRegistrationData,
            recipientEmail
          );

          if (emailResult.success) {
            console.log('✅ REAL payment receipt email sent from webhook:', {
              registrationId: customId,
              recipient: recipientEmail,
              messageId: emailResult.messageId,
              pdfGenerated: emailResult.pdfGenerated,
              pdfUploaded: emailResult.pdfUploaded
            });
          } else {
            console.error('❌ Failed to send payment receipt email:', emailResult.error);
          }

        } catch (emailError) {
          console.error('⚠️ Failed to send REAL payment receipt from webhook:', {
            error: emailError instanceof Error ? emailError.message : 'Unknown error',
            stack: emailError instanceof Error ? emailError.stack : undefined,
            registrationId: customId,
            timestamp: new Date().toISOString()
          });

          // Log additional debugging information
          console.log('🔍 Webhook debugging info:', {
            captureId: capture.id,
            captureStatus: capture.status,
            captureAmount: capture.amount,
            customId: customId,
            webhookEventType: webhookEvent.event_type
          });
        }
      });
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
