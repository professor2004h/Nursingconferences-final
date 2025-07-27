import { NextRequest, NextResponse } from 'next/server';
import { getPayPalConfig, logPayPalConfigStatus } from '@/app/utils/paypalConfig';

// Get PayPal access token
async function getPayPalAccessToken(config: any) {
  try {
    const auth = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64');

    console.log('🔐 Requesting PayPal access token...');
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
    console.log('✅ PayPal access token obtained successfully');
    return data.access_token;
  } catch (error) {
    console.error('❌ PayPal auth error:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🎯 Creating PayPal order...');

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
    const { amount, currency = 'USD', registrationId, registrationData } = body;

    // Validate required fields
    if (!amount || !registrationId || !registrationData) {
      return NextResponse.json(
        { error: 'Missing required fields: amount, registrationId, registrationData' },
        { status: 400 }
      );
    }

    console.log('📝 Order details:', { amount, currency, registrationId });

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken(paypalConfig);

    // Create PayPal order
    const orderData = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: registrationId,
          amount: {
            currency_code: currency,
            value: amount.toString(),
          },
          description: `Conference Registration - ${registrationData.firstName} ${registrationData.lastName}`,
          custom_id: registrationId,
          invoice_id: `REG_${registrationId}_${Date.now()}`,
        },
      ],
      application_context: {
        brand_name: 'Intelli Global Conferences',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/paypal/return`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/paypal/cancel`,
      },
    };

    console.log('🔄 Sending order to PayPal...');

    const response = await fetch(`${paypalConfig.baseUrl}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'PayPal-Request-Id': `${registrationId}_${Date.now()}`,
      },
      body: JSON.stringify(orderData),
    });

    const order = await response.json();

    if (!response.ok) {
      console.error('❌ PayPal order creation failed:', order);
      return NextResponse.json(
        {
          error: 'Failed to create PayPal order',
          details: order,
          status: response.status
        },
        { status: 500 }
      );
    }

    console.log('✅ PayPal order created successfully:', order.id);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      order: order,
    });

  } catch (error) {
    console.error('❌ PayPal order creation error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
