import { NextRequest, NextResponse } from 'next/server';
import { sendPaymentReceiptEmail } from '@/app/services/emailService';
import { createClient } from '@sanity/client';

/**
 * PayPal Capture Order API Route - Production Version
 * Captures a PayPal order for live payments using production credentials
 */

// Sanity client configuration for reading registration data
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'zt8218vh',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

// Write client for updating registration records
const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'zt8218vh',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

interface CaptureOrderRequest {
  orderId: string;
  registrationId: string;
}

/**
 * Get PayPal Access Token for Production
 */
async function getPayPalAccessToken(): Promise<string | null> {
  try {
    // Use server-side environment variables for API calls
    const clientId = process.env.PAYPAL_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.error('❌ Missing PayPal production credentials for capture:', {
        hasClientId: !!clientId,
        hasClientSecret: !!clientSecret,
        clientIdSource: process.env.PAYPAL_CLIENT_ID ? 'PAYPAL_CLIENT_ID' : 'NEXT_PUBLIC_PAYPAL_CLIENT_ID'
      });
      return null;
    }

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    console.log('🔐 Requesting PayPal production access token for capture...');
    const response = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${auth}`,
      },
      body: 'grant_type=client_credentials',
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Failed to get PayPal production access token:', data);
      return null;
    }

    console.log('✅ PayPal production access token obtained for capture');
    return data.access_token;
  } catch (error) {
    console.error('❌ Error getting PayPal production access token:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('💰 PayPal Capture Order API called - Starting payment capture process...');
    console.log('🔧 Environment:', process.env.NODE_ENV);
    console.log('📧 SMTP Configuration Check:', {
      hasHost: !!process.env.SMTP_HOST,
      hasUser: !!process.env.SMTP_USER,
      hasPass: !!process.env.SMTP_PASS,
      hasSanityToken: !!process.env.SANITY_API_TOKEN
    });

    const body: CaptureOrderRequest = await request.json();
    const { orderId, registrationId } = body;

    console.log('📋 PayPal capture request data:', {
      orderId,
      registrationId,
      timestamp: new Date().toISOString()
    });

    // Validate request data
    if (!orderId || !registrationId) {
      return NextResponse.json(
        { error: 'Missing required fields: orderId, registrationId' },
        { status: 400 }
      );
    }

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Failed to authenticate with PayPal' },
        { status: 500 }
      );
    }

    console.log('📦 Capturing PayPal order:', orderId);

    // Capture the PayPal order
    const response = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'PayPal-Request-Id': `${registrationId}-capture-${Date.now()}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('❌ PayPal order capture failed:', result);
      return NextResponse.json(
        { error: 'Failed to capture PayPal payment', details: result },
        { status: response.status }
      );
    }

    // Extract transaction details
    const capture = result.purchase_units?.[0]?.payments?.captures?.[0];
    const transactionId = capture?.id;
    const amount = capture?.amount?.value;
    const currency = capture?.amount?.currency_code;
    const status = capture?.status;

    console.log('✅ PayPal production payment captured successfully:', {
      orderId,
      transactionId,
      amount,
      currency,
      status
    });

    // Update registration status in database (optional)
    try {
      await updateRegistrationPaymentStatus(registrationId, {
        orderId,
        transactionId,
        amount: parseFloat(amount || '0'),
        currency,
        status: 'completed',
        paymentMethod: 'paypal',
        capturedAt: new Date().toISOString(),
      });
    } catch (dbError) {
      console.error('⚠️ Failed to update registration payment status:', dbError);
      // Don't fail the request if database update fails
    }

    // AUTOMATIC PDF GENERATION, EMAIL SENDING, AND SANITY STORAGE
    // Process immediately after successful payment capture (synchronous execution)
    let registration = null; // Declare outside try block for error handling access

    try {
      console.log('🚀 Starting automatic post-payment processing for registration:', registrationId);
      console.log('📧 Initiating automatic PDF generation, email delivery, and Sanity storage...');

      // Import the updated payment receipt emailer
      const { sendPaymentReceiptEmailWithRealData } = await import('../../../utils/paymentReceiptEmailer');

      // Fetch registration data from Sanity with retry logic and complete field structure
      let retryCount = 0;
      const maxRetries = 3;

      while (!registration && retryCount < maxRetries) {
        try {
          console.log(`🔍 Searching for registration with registrationId: ${registrationId} (attempt ${retryCount + 1}/${maxRetries})`);

          // FIXED: Query by registrationId field, not _id field
          // The registrationId field contains the PayPal Order ID after payment initiation
          registration = await client.fetch(
            `*[_type == "conferenceRegistration" && registrationId == $registrationId][0]{
              _id,
              registrationId,
              firstName,
              lastName,
              email,
              phoneNumber,
              country,
              address,
              registrationType,
              personalDetails,
              pricing,
              paymentStatus,
              registrationDate,
              pdfReceipt,
              paypalOrderId
            }`,
            { registrationId }
          );

          if (registration) {
            console.log('✅ Registration found successfully:', {
              _id: registration._id,
              registrationId: registration.registrationId,
              email: registration.email || registration.personalDetails?.email,
              paypalOrderId: registration.paypalOrderId
            });
          } else {
            retryCount++;
            console.log(`⚠️ Registration not found with registrationId: ${registrationId}, retry ${retryCount}/${maxRetries}...`);

            // Debug: Check if there are any registrations with similar IDs
            const debugResults = await client.fetch(
              `*[_type == "conferenceRegistration" && (registrationId match "*${registrationId.slice(-8)}*" || paypalOrderId == $registrationId)][0...3]{
                _id,
                registrationId,
                paypalOrderId,
                personalDetails.email
              }`,
              { registrationId }
            );
            console.log('🔍 Debug: Similar registrations found:', debugResults);

            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount)); // Exponential backoff
          }
        } catch (fetchError) {
          retryCount++;
          console.error(`❌ Error fetching registration (attempt ${retryCount}):`, fetchError);
          if (retryCount >= maxRetries) throw fetchError;
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }
      }

      if (!registration) {
        throw new Error(`Registration not found after ${maxRetries} attempts: ${registrationId}`);
      }

      console.log('✅ Registration data retrieved successfully');
      console.log('📋 Registration fields:', {
        _id: registration._id,
        registrationId: registration.registrationId,
        email: registration.email || registration.personalDetails?.email,
        hasPersonalDetails: !!registration.personalDetails
      });

      // Prepare REAL payment data from PayPal response
      const realPaymentData = {
        transactionId: transactionId || capture?.id || 'N/A',
        orderId: orderId || result.id || 'N/A',
        amount: amount || capture?.amount?.value || '0',
        currency: currency || capture?.amount?.currency_code || 'USD',
        paymentMethod: 'PayPal',
        paymentDate: new Date().toISOString(),
        status: status || capture?.status || 'COMPLETED',
        capturedAt: new Date().toISOString(),
        paypalOrderId: result.id,
        paypalCaptureId: capture?.id,
        paypalStatus: capture?.status
      };

      // Prepare registration data with correct structure for email system
      const realRegistrationData = {
        _id: registration._id, // CRITICAL: Required for PDF storage
        registrationId: registration.registrationId || registration._id,
        fullName: `${registration.firstName || registration.personalDetails?.firstName || ''} ${registration.lastName || registration.personalDetails?.lastName || ''}`.trim(),
        email: registration.email || registration.personalDetails?.email,
        phone: registration.phoneNumber || registration.personalDetails?.phoneNumber || 'N/A',
        country: registration.country || registration.personalDetails?.country || 'N/A',
        address: registration.address || registration.personalDetails?.fullPostalAddress || 'N/A',
        registrationType: registration.registrationType || 'Regular Registration',
        numberOfParticipants: '1',
        // Include original registration object for fallback
        originalRegistration: registration
      };

      console.log('📋 Prepared registration data:', {
        _id: realRegistrationData._id,
        registrationId: realRegistrationData.registrationId,
        email: realRegistrationData.email,
        fullName: realRegistrationData.fullName
      });

      // Use the correct email field
      const recipientEmail = realRegistrationData.email;

      if (!recipientEmail) {
        throw new Error('No email address found for registration');
      }

      console.log('📧 Automatically sending payment receipt to:', recipientEmail);
      console.log('📋 Payment data for email:', {
        transactionId: realPaymentData.transactionId,
        amount: realPaymentData.amount,
        currency: realPaymentData.currency,
        paymentMethod: realPaymentData.paymentMethod
      });
      console.log('📋 Registration data for email:', {
        _id: realRegistrationData._id,
        registrationId: realRegistrationData.registrationId,
        fullName: realRegistrationData.fullName,
        email: realRegistrationData.email
      });

      // EXECUTE AUTOMATIC PROCESSING: PDF Generation + Email Delivery + Sanity Storage
      console.log('🚀 Calling sendPaymentReceiptEmailWithRealData...');
      const emailResult = await sendPaymentReceiptEmailWithRealData(
        realPaymentData,
        realRegistrationData,
        recipientEmail
      );
      console.log('📧 Email processing result:', emailResult);

      console.log('✅ AUTOMATIC post-payment processing completed successfully:', {
        registrationId,
        transactionId,
        recipientEmail,
        pdfGenerated: emailResult.pdfGenerated,
        pdfUploaded: emailResult.pdfUploaded,
        emailSent: emailResult.success,
        deliveryTime: new Date().toISOString(),
        environment: process.env.NODE_ENV
      });

      // Update registration record to mark automatic processing as completed
      try {
        await writeClient
          .patch(registration._id)
          .set({
            automaticProcessingCompleted: true,
            automaticProcessingCompletedAt: new Date().toISOString(),
            receiptEmailSentAutomatically: emailResult.success,
            pdfReceiptGeneratedAutomatically: emailResult.pdfGenerated,
            pdfReceiptStoredAutomatically: emailResult.pdfUploaded,
            lastAutomaticProcessingResult: 'success'
          })
          .commit();
        console.log('✅ Registration updated with automatic processing status');
      } catch (updateError) {
        console.error('⚠️ Failed to update registration with automatic processing status:', updateError);
      }

    } catch (emailError) {
      console.error('⚠️ Automatic post-payment processing failed (non-blocking):', {
        error: emailError instanceof Error ? emailError.message : 'Unknown error',
        stack: emailError instanceof Error ? emailError.stack : undefined,
        registrationId,
        transactionId,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        smtpConfig: {
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          user: process.env.SMTP_USER,
          hasPassword: !!process.env.SMTP_PASS
        }
      });

      // Log specific error types for better debugging
      if (emailError instanceof Error) {
        if (emailError.message.includes('SMTP')) {
          console.error('🔧 SMTP Configuration Issue - Check environment variables and network connectivity');
        } else if (emailError.message.includes('authentication')) {
          console.error('🔐 Authentication Issue - Verify SMTP credentials');
        } else if (emailError.message.includes('timeout')) {
          console.error('⏱️ Timeout Issue - Check network connectivity and SMTP server availability');
        }
      }

      // Email failure doesn't affect payment success - payment is still completed
      console.log('💡 Note: Payment was successful. Customer can use manual "Email PDF Receipt" button as backup.');

      // Update registration record to mark automatic processing as failed
      try {
        if (registration?._id) {
          await writeClient
            .patch(registration._id)
            .set({
              automaticProcessingCompleted: false,
              automaticProcessingAttemptedAt: new Date().toISOString(),
              receiptEmailSentAutomatically: false,
              pdfReceiptGeneratedAutomatically: false,
              pdfReceiptStoredAutomatically: false,
              lastAutomaticProcessingResult: 'failed',
              lastAutomaticProcessingError: emailError instanceof Error ? emailError.message : 'Unknown error'
            })
            .commit();
          console.log('✅ Registration updated with failed automatic processing status');
        }
      } catch (updateError) {
        console.error('⚠️ Failed to update registration with failed processing status:', updateError);
      }
    }

    return NextResponse.json({
      success: true,
      orderId,
      transactionId,
      amount,
      currency,
      status,
      registrationId,
      capturedAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error('❌ Error in capture-order API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * Send payment receipt email to user
 */
async function sendPaymentReceiptEmail(registrationId: string, paymentData: any) {
  try {
    console.log('📧 Preparing to send payment receipt email for registration:', registrationId);

    // Import email service
    const { sendPaymentReceiptEmail: sendEmail } = await import('@/app/services/emailService');

    // Fetch registration details from Sanity
    const { client } = await import('@/app/sanity/client');
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
        pricing
      }`,
      { registrationId }
    );

    if (!registrationDetails) {
      console.error('❌ Registration not found for email sending:', registrationId);
      throw new Error(`Registration not found: ${registrationId}`);
    }

    if (!registrationDetails.personalDetails?.email) {
      console.error('❌ No email address found in registration:', registrationId);
      throw new Error(`No email address found for registration: ${registrationId}`);
    }

    // Prepare email data
    const emailData = {
      registrationData: registrationDetails,
      paymentData: paymentData,
      recipientEmail: registrationDetails.personalDetails.email
    };

    console.log('📧 Sending payment receipt email to:', registrationDetails.personalDetails.email);

    // Send email
    const success = await sendEmail(emailData);

    if (success) {
      console.log('✅ Payment receipt email sent successfully');
    } else {
      console.error('❌ Failed to send payment receipt email');
      throw new Error('Email sending failed');
    }

  } catch (error) {
    console.error('❌ Error sending payment receipt email:', error);
    throw error;
  }
}

/**
 * Update registration payment status in database
 */
async function updateRegistrationPaymentStatus(registrationId: string, paymentData: any) {
  try {
    const { writeClient } = await import('@/app/sanity/client');

    console.log('📝 Updating registration payment status in Sanity:', {
      registrationId,
      paymentData
    });

    // Find the registration by registrationId
    const registration = await writeClient.fetch(
      `*[_type == "conferenceRegistration" && registrationId == $registrationId][0]`,
      { registrationId }
    );

    if (!registration) {
      console.error('❌ Registration not found for payment update:', registrationId);
      throw new Error(`Registration not found: ${registrationId}`);
    }

    // Update the registration with payment details
    const updateResult = await writeClient
      .patch(registration._id)
      .set({
        paymentStatus: paymentData.status,
        paymentMethod: paymentData.paymentMethod,
        paypalOrderId: paymentData.orderId,
        paypalTransactionId: paymentData.transactionId,
        paidAmount: paymentData.amount,
        paidCurrency: paymentData.currency,
        paymentCapturedAt: paymentData.capturedAt,
        updatedAt: new Date().toISOString(),
      })
      .commit();

    console.log('✅ Registration payment status updated successfully:', updateResult._id);
    return updateResult;

  } catch (error) {
    console.error('❌ Error updating registration payment status:', error);
    throw error;
  }
}
