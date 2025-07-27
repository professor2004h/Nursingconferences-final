import { NextRequest, NextResponse } from 'next/server';
import { getPayPalConfig, logPayPalConfigStatus } from '@/app/utils/paypalConfig';
import { paypalService } from '@/app/services/paypalService';

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

    // Validate amount is greater than 0
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      console.error('❌ Invalid payment amount:', amount);
      return NextResponse.json(
        {
          error: 'Invalid payment amount. Amount must be greater than 0.',
          details: `Received amount: ${amount}`,
          registrationId
        },
        { status: 400 }
      );
    }

    // Validate amount is reasonable (between $1 and $50,000)
    if (numericAmount < 1 || numericAmount > 50000) {
      console.error('❌ Payment amount out of range:', amount);
      return NextResponse.json(
        {
          error: 'Payment amount out of acceptable range ($1 - $50,000).',
          details: `Received amount: $${numericAmount}`,
          registrationId
        },
        { status: 400 }
      );
    }

    console.log('📝 Order details:', { amount: numericAmount, currency, registrationId });
    console.log(`🔒 Processing in ${paypalConfig.environment.toUpperCase()} mode`);

    // Use production PayPal service
    const order = await paypalService.createOrder({
      amount: numericAmount,
      currency,
      registrationId,
      registrationData,
      description: `Conference Registration - ${registrationData.firstName} ${registrationData.lastName}`
    });

    console.log('✅ PayPal order created successfully:', order.id);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      registrationId,
      approvalUrl: order.links?.find((link: any) => link.rel === 'approve')?.href,
      environment: paypalConfig.environment
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
