import { NextRequest, NextResponse } from 'next/server';

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
