import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/app/sanity/client';

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_ENVIRONMENT = process.env.PAYPAL_ENVIRONMENT || 'sandbox';

const PAYPAL_BASE_URL = PAYPAL_ENVIRONMENT === 'sandbox' 
  ? 'https://api-m.sandbox.paypal.com'
  : 'https://api-m.paypal.com';

// Get PayPal access token
async function getPayPalAccessToken() {
  try {
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');

    const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      throw new Error(`PayPal auth failed: ${response.status}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('❌ PayPal auth error:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('💰 Capturing PayPal payment...');

    // Validate environment variables
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      console.error('❌ PayPal credentials missing');
      return NextResponse.json(
        { error: 'PayPal configuration error' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { orderId, registrationId } = body;

    // Validate required fields
    if (!orderId || !registrationId) {
      return NextResponse.json(
        { error: 'Missing required fields: orderId, registrationId' },
        { status: 400 }
      );
    }

    console.log('📝 Capture details:', { orderId, registrationId });

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();

    // Capture the PayPal order
    const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'PayPal-Request-Id': `${registrationId}_capture_${Date.now()}`,
      },
    });

    const captureData = await response.json();

    if (!response.ok) {
      console.error('❌ PayPal capture failed:', captureData);
      return NextResponse.json(
        { error: 'Failed to capture PayPal payment', details: captureData },
        { status: 500 }
      );
    }

    // Extract payment details
    const capture = captureData.purchase_units[0].payments.captures[0];
    const paymentId = capture.id;
    const amount = parseFloat(capture.amount.value);
    const currency = capture.amount.currency_code;
    const status = capture.status;

    console.log('✅ PayPal payment captured:', {
      paymentId,
      amount,
      currency,
      status,
      registrationId
    });

    // Update registration in Sanity with payment details
    try {
      const paymentDetails = {
        paymentId,
        paymentMethod: 'paypal',
        amount,
        currency,
        paymentDate: new Date().toISOString(),
        paypalOrderId: orderId,
        paypalCaptureId: capture.id,
        status: 'completed',
        invoiceNumber: `INV_${registrationId}_${Date.now()}`,
      };

      // Find and update the registration
      const registrationQuery = `*[_type == "registration" && registrationId == $registrationId][0]`;
      const registration = await client.fetch(registrationQuery, { registrationId });

      if (!registration) {
        console.error('❌ Registration not found:', registrationId);
        return NextResponse.json(
          { error: 'Registration not found' },
          { status: 404 }
        );
      }

      // Update registration with payment details
      await client
        .patch(registration._id)
        .set({
          status: 'confirmed',
          paymentDetails,
          paymentStatus: 'completed',
        })
        .commit();

      console.log('✅ Registration updated with PayPal payment details');

      return NextResponse.json({
        success: true,
        paymentId,
        registrationId,
        amount,
        currency,
        status: 'completed',
        captureData,
      });

    } catch (sanityError) {
      console.error('❌ Error updating registration in Sanity:', sanityError);
      // Payment was successful but registration update failed
      return NextResponse.json({
        success: true,
        paymentId,
        registrationId,
        amount,
        currency,
        status: 'completed',
        warning: 'Payment successful but registration update failed',
        captureData,
      });
    }

  } catch (error) {
    console.error('❌ PayPal capture error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
