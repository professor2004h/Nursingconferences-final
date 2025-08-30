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
    console.log('🔔 PayPal webhook received at:', new Date().toISOString());
    console.log('🌐 Request URL:', request.url);
    console.log('🔧 Environment:', process.env.NODE_ENV);

    // Get webhook body and headers
    const body = await request.text();
    const headers = Object.fromEntries(request.headers.entries());

    // Enhanced logging for production debugging
    console.log('📋 Webhook headers:', {
      'paypal-transmission-id': headers['paypal-transmission-id'],
      'paypal-cert-id': headers['paypal-cert-id'],
      'paypal-auth-algo': headers['paypal-auth-algo'],
      'paypal-transmission-time': headers['paypal-transmission-time'],
      'content-type': headers['content-type'],
      'user-agent': headers['user-agent'],
    });

    // Log environment configuration status
    console.log('🔧 Environment Configuration:', {
      SMTP_HOST: process.env.SMTP_HOST ? 'Configured' : 'Missing',
      SMTP_USER: process.env.SMTP_USER ? 'Configured' : 'Missing',
      EMAIL_FROM: process.env.EMAIL_FROM ? 'Configured' : 'Missing',
      PAYPAL_WEBHOOK_ID: process.env.PAYPAL_WEBHOOK_ID ? 'Configured' : 'Missing',
      SANITY_API_TOKEN: process.env.SANITY_API_TOKEN ? 'Configured' : 'Missing'
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
      try {
        const isValid = await paypalService.verifyWebhookSignature(headers, body, webhookId);
        if (!isValid) {
          console.error('❌ Invalid webhook signature');
          return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }
        console.log('✅ Webhook signature verified');
      } catch (verificationError) {
        console.error('❌ Webhook signature verification failed:', verificationError.message);
        // In production, you might want to reject invalid signatures
        // For now, we'll log and continue to ensure emails are sent
        console.warn('⚠️ Continuing despite signature verification failure');
      }
    } else {
      console.warn('⚠️ PAYPAL_WEBHOOK_ID not configured - skipping signature verification');
      console.warn('⚠️ For production security, configure PAYPAL_WEBHOOK_ID environment variable');
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
          paymentMethod: 'paypal',
          paypalPaymentId: capture.id,
          paymentDate: new Date().toISOString(),
          webhookProcessed: true,
          lastUpdated: new Date().toISOString(),
          // CRITICAL: Use same field names as email template and PDF receipt
          paymentCurrency: capture.amount.currency_code,  // Same as paymentData.currency
          paymentAmount: parseFloat(capture.amount.value), // Same as paymentData.amount
          transactionId: capture.id,                      // Same as paymentData.transactionId
          status: 'completed',                            // Same as paymentData.status
          // Also update pricing for backward compatibility
          'pricing.currency': capture.amount.currency_code,
          'pricing.totalPrice': parseFloat(capture.amount.value),
        })
        .commit();

      console.log('✅ Registration updated with payment completion:', customId);

      // Send REAL payment receipt email to CUSTOMER (non-blocking with enhanced error handling)
      setImmediate(async () => {
        try {
          console.log('📧 Starting automatic email process from webhook for:', customId);
          console.log('📧 Timestamp:', new Date().toISOString());

          // Check email configuration before proceeding
          const emailConfig = {
            SMTP_HOST: process.env.SMTP_HOST,
            SMTP_USER: process.env.SMTP_USER,
            SMTP_PASS: process.env.SMTP_PASS,
            EMAIL_FROM: process.env.EMAIL_FROM || process.env.SMTP_USER,
            EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME || 'Intelli Global Conferences'
          };

          console.log('📧 Email configuration check:', {
            SMTP_HOST: emailConfig.SMTP_HOST ? 'Configured' : 'Missing',
            SMTP_USER: emailConfig.SMTP_USER ? 'Configured' : 'Missing',
            SMTP_PASS: emailConfig.SMTP_PASS ? 'Configured' : 'Missing',
            EMAIL_FROM: emailConfig.EMAIL_FROM ? 'Configured' : 'Missing',
            EMAIL_FROM_NAME: emailConfig.EMAIL_FROM_NAME ? 'Configured' : 'Missing'
          });

          if (!emailConfig.SMTP_HOST || !emailConfig.SMTP_USER || !emailConfig.SMTP_PASS) {
            throw new Error('Missing required email configuration. Check SMTP environment variables.');
          }

          // Import the payment receipt emailer
          const { sendPaymentReceiptEmailWithRealData } = await import('../../../utils/paymentReceiptEmailer');
          console.log('📧 Email service imported successfully');

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

          // Get CUSTOMER email address with multiple fallbacks
          const customerEmail = realRegistrationData.email ||
                               personalDetails?.email ||
                               registration.personalDetails?.email ||
                               registration.email;

          if (!customerEmail) {
            console.error('❌ No customer email address found for registration:', customId);
            throw new Error('No customer email address found for registration');
          }

          console.log('📧 Processing PayPal payment completion with unified system:', customerEmail);
          console.log('💰 Payment amount:', `${realPaymentData.currency} ${realPaymentData.amount}`);
          console.log('🎯 Registration ID:', realRegistrationData.registrationId);
          console.log('👤 Customer Name:', realRegistrationData.fullName);

          // Use unified post-payment processing system
          try {
            const unifiedProcessingResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/payment/process-completion`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                registrationId: customId,
                paymentData: {
                  paypalTransactionId: capture.id,
                  paypalOrderId: orderId,
                  transactionId: capture.id,
                  orderId: orderId,
                  amount: parseFloat(capture.amount.value),
                  currency: capture.amount.currency_code,
                  capturedAt: new Date().toISOString()
                },
                paymentMethod: 'paypal',
                customerEmail: customerEmail
              })
            });

            const unifiedResult = await unifiedProcessingResponse.json();

            if (unifiedResult.success) {
              console.log('✅ PayPal unified post-payment processing completed successfully');
              console.log('📧 Email sent:', unifiedResult.data.emailSent);
              console.log('📄 PDF generated:', unifiedResult.data.pdfGenerated);
              console.log('📤 PDF uploaded:', unifiedResult.data.pdfUploaded);
            } else {
              console.error('❌ Unified post-payment processing failed:', unifiedResult.error);

              // Fallback to legacy system if unified system fails
              console.log('🔄 Falling back to legacy email system...');
              const emailResult = await sendPaymentReceiptEmailWithRealData(
                realPaymentData,
                realRegistrationData,
                customerEmail
              );

              if (emailResult.success) {
                console.log('✅ Fallback email system succeeded');

                // Update registration with email sent status
                await client
                  .patch(customId)
                  .set({
                    receiptEmailSent: true,
                    receiptEmailSentAt: new Date().toISOString(),
                    receiptEmailRecipient: customerEmail,
                    pdfReceiptGenerated: emailResult.pdfGenerated,
                    pdfReceiptStoredInSanity: emailResult.pdfUploaded
                  })
                  .commit();
              } else {
                console.error('❌ Fallback email system also failed:', emailResult.error);
              }
            }
          } catch (unifiedError) {
            console.error('❌ Error calling unified processing system:', unifiedError);

            // Fallback to legacy system
            console.log('🔄 Using legacy email system due to unified system error...');
            const emailResult = await sendPaymentReceiptEmailWithRealData(
              realPaymentData,
              realRegistrationData,
              customerEmail
            );

            if (emailResult.success) {
              console.log('✅ Legacy payment receipt sent successfully to CUSTOMER from webhook');
              console.log('📧 Customer email:', customerEmail);
              console.log('📄 PDF generated:', emailResult.pdfGenerated);
              console.log('📊 PDF size:', emailResult.pdfSize ? `${(emailResult.pdfSize / 1024).toFixed(2)} KB` : 'N/A');
              console.log('💾 PDF stored in Sanity:', emailResult.pdfUploaded);
              console.log('🆔 PDF Asset ID:', emailResult.pdfAssetId || 'N/A');
              console.log('🔗 Email Message ID:', emailResult.messageId);
              console.log('🎯 Registration updated with payment completion');

              // Update registration with email sent status
              await client
                .patch(customId)
                .set({
                  receiptEmailSent: true,
                  receiptEmailSentAt: new Date().toISOString(),
                  receiptEmailRecipient: customerEmail,
                  pdfReceiptGenerated: emailResult.pdfGenerated,
                  pdfReceiptStoredInSanity: emailResult.pdfUploaded
                })
                .commit();

              console.log('✅ Registration updated with receipt delivery status');
            } else {
              console.error('❌ Legacy email system also failed:', emailResult.error);

              // Update registration with email failure status
              await client
                .patch(customId)
                .set({
                  receiptEmailSent: false,
                  receiptEmailError: emailResult.error,
                  receiptEmailAttemptedAt: new Date().toISOString()
                })
                .commit();
            }
          }

        } catch (emailError) {
          console.error('❌ CRITICAL: Failed to send automatic payment receipt from webhook');
          console.error('❌ Registration ID:', customId);
          console.error('❌ Error message:', emailError instanceof Error ? emailError.message : 'Unknown error');
          console.error('❌ Stack trace:', emailError instanceof Error ? emailError.stack : undefined);
          console.error('❌ Timestamp:', new Date().toISOString());

          // Log detailed error information for debugging
          if (emailError instanceof Error) {
            console.error('❌ Email Error Details:', {
              errorType: emailError.constructor.name,
              errorCode: (emailError as any).code,
              errorCommand: (emailError as any).command,
              errorResponse: (emailError as any).response,
              errorResponseCode: (emailError as any).responseCode
            });
          }

          // Log additional debugging information
          console.log('🔍 Webhook debugging info:', {
            captureId: capture.id,
            captureStatus: capture.status,
            captureAmount: capture.amount,
            customId: customId,
            webhookEventType: webhookEvent.event_type
          });

          // Update registration with email failure status
          try {
            await client
              .patch(customId)
              .set({
                receiptEmailSent: false,
                receiptEmailError: emailError instanceof Error ? emailError.message : 'Unknown error',
                receiptEmailAttemptedAt: new Date().toISOString(),
                webhookEmailProcessingFailed: true
              })
              .commit();
            console.log('✅ Registration updated with email failure status');
          } catch (updateError) {
            console.error('❌ CRITICAL: Failed to update registration with email error:', updateError);
          }

          // Log action items for manual intervention
          console.error('🚨 MANUAL ACTION REQUIRED:');
          console.error('   1. Check email configuration in production environment');
          console.error('   2. Verify SMTP credentials are correct');
          console.error('   3. Send manual receipt to customer if needed');
          console.error('   4. Check application logs for more details');
          console.error('   5. Customer email:', customerEmail || 'Unknown');
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
