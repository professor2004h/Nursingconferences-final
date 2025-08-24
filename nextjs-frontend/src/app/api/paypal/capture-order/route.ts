import { NextRequest, NextResponse } from 'next/server';
import { sendPaymentReceiptEmail } from '@/app/services/emailService';

/**
 * PayPal Capture Order API Route - Production Version
 * Captures a PayPal order for live payments using production credentials
 */

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
    console.log('💰 Capturing PayPal production payment...');

    const body: CaptureOrderRequest = await request.json();
    const { orderId, registrationId } = body;

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

    // Send payment receipt email with REAL PayPal data (non-blocking with enhanced error handling)
    setImmediate(async () => {
      try {
        console.log('📧 Initiating REAL payment receipt email for registration:', registrationId);
        console.log('🔧 Production email delivery system starting...');

        // Import the updated payment receipt emailer
        const { sendPaymentReceiptEmailWithRealData } = await import('../../../utils/paymentReceiptEmailer');

        // Fetch registration data from Sanity with retry logic
        let registration = null;
        let retryCount = 0;
        const maxRetries = 3;

        while (!registration && retryCount < maxRetries) {
          try {
            registration = await client.fetch(
              `*[_type == "conferenceRegistration" && _id == $registrationId][0]`,
              { registrationId }
            );

            if (!registration) {
              retryCount++;
              console.log(`⚠️ Registration not found, retry ${retryCount}/${maxRetries}...`);
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

        // Prepare registration data
        const realRegistrationData = {
          registrationId: registration._id,
          fullName: `${registration.firstName || ''} ${registration.lastName || ''}`.trim(),
          email: registration.email,
          phone: registration.phoneNumber || 'N/A',
          country: registration.country || 'N/A',
          address: registration.address || 'N/A',
          registrationType: registration.registrationType || 'Regular Registration',
          numberOfParticipants: '1'
        };

        await sendPaymentReceiptEmailWithRealData(
          realPaymentData,
          realRegistrationData,
          registration.email
        );

        console.log('✅ REAL payment receipt email sent successfully for:', registrationId);
        console.log('📊 Email delivery metrics:', {
          registrationId,
          transactionId,
          recipientEmail: registration.personalDetails?.email,
          deliveryTime: new Date().toISOString(),
          environment: process.env.NODE_ENV
        });

      } catch (emailError) {
        console.error('⚠️ Failed to send REAL payment receipt email (non-blocking):', {
          error: emailError instanceof Error ? emailError.message : 'Unknown error',
          stack: emailError instanceof Error ? emailError.stack : undefined,
          registrationId,
          transactionId,
          recipientEmail: registration?.personalDetails?.email,
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

        // Email failure doesn't affect payment success
      }
    });

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
