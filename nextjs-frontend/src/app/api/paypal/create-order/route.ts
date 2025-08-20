import { NextRequest, NextResponse } from 'next/server';

/**
 * PayPal Create Order API Route - Production Version
 * Creates a PayPal order for live payments using production credentials
 */

interface CreateOrderRequest {
  amount: string;
  currency: string;
  registrationId: string;
  registrationData: any;
}

/**
 * Get PayPal Access Token for Production
 */
async function getPayPalAccessToken(): Promise<string | null> {
  try {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.error('❌ Missing PayPal production credentials');
      return null;
    }

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    console.log('🔐 Requesting PayPal production access token...');
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

    console.log('✅ PayPal production access token obtained successfully');
    return data.access_token;
  } catch (error) {
    console.error('❌ Error getting PayPal production access token:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🎯 Creating PayPal production order...');

    const body: CreateOrderRequest = await request.json();
    const { amount, currency = 'USD', registrationId, registrationData } = body;

    // Validate request data
    if (!amount || !currency || !registrationId) {
      return NextResponse.json(
        { error: 'Missing required fields: amount, currency, registrationId' },
        { status: 400 }
      );
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      console.error('❌ Invalid payment amount:', amount);
      return NextResponse.json(
        { error: 'Invalid amount provided' },
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

    // Create PayPal order
    const orderData = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: registrationId,
          amount: {
            currency_code: currency,
            value: amount,
          },
          description: `Conference Registration - ID: ${registrationId}`,
          custom_id: registrationId,
        },
      ],
      application_context: {
        brand_name: 'Nursing Conferences',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/registration/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/registration`,
      },
    };

    console.log('📦 Creating PayPal order with data:', {
      amount,
      currency,
      registrationId,
      intent: 'CAPTURE'
    });

    const response = await fetch('https://api-m.paypal.com/v2/checkout/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'PayPal-Request-Id': `${registrationId}-${Date.now()}`,
      },
      body: JSON.stringify(orderData),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('❌ PayPal order creation failed:', result);
      return NextResponse.json(
        { error: 'Failed to create PayPal order', details: result },
        { status: response.status }
      );
    }

    console.log('✅ PayPal production order created successfully:', result.id);

    return NextResponse.json({
      orderId: result.id,
      status: result.status,
      links: result.links,
    });

  } catch (error) {
    console.error('❌ Error in create-order API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}


