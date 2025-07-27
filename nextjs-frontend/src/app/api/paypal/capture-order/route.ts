import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/app/sanity/client';
import { getPayPalConfig, logPayPalConfigStatus } from '@/app/utils/paypalConfig';
import { paypalService } from '@/app/services/paypalService';

// Get PayPal access token
async function getPayPalAccessToken(config: any) {
  try {
    const auth = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64');

    console.log('🔐 Requesting PayPal access token for capture...');
    const response = await fetch(`${config.baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ PayPal auth failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`PayPal auth failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ PayPal access token obtained for capture');
    return data.access_token;
  } catch (error) {
    console.error('❌ PayPal auth error:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('💰 Capturing PayPal payment...');

    // Log configuration status for debugging
    logPayPalConfigStatus();

    // Get and validate PayPal configuration
    let paypalConfig;
    try {
      paypalConfig = getPayPalConfig();
    } catch (configError) {
      console.error('❌ PayPal configuration error:', configError);
      return NextResponse.json(
        {
          error: 'PayPal configuration error. Please contact support.',
          details: configError instanceof Error ? configError.message : 'Unknown configuration error'
        },
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
    console.log(`🔒 Capturing payment in ${paypalConfig.environment.toUpperCase()} mode`);

    // Use production PayPal service
    const captureData = await paypalService.capturePayment(orderId);

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
