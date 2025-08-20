import { NextRequest, NextResponse } from 'next/server';

/**
 * PayPal Credentials Test Endpoint
 * Tests if PayPal credentials are working in production
 */
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Testing PayPal credentials...');

    // Get environment variables
    const clientId = process.env.PAYPAL_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    const environment = process.env.PAYPAL_ENVIRONMENT || process.env.NEXT_PUBLIC_PAYPAL_ENVIRONMENT || 'production';

    // Check if credentials are available
    if (!clientId || !clientSecret) {
      return NextResponse.json({
        success: false,
        error: 'PayPal credentials not available',
        details: {
          hasClientId: !!clientId,
          hasClientSecret: !!clientSecret,
          clientIdSource: process.env.PAYPAL_CLIENT_ID ? 'PAYPAL_CLIENT_ID' : 
                         process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ? 'NEXT_PUBLIC_PAYPAL_CLIENT_ID' : 'none',
          environment
        },
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

    // Test PayPal API access by requesting an access token
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const baseUrl = environment === 'production' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

    console.log('🔐 Testing PayPal API access...');
    const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${auth}`,
      },
      body: 'grant_type=client_credentials',
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ PayPal API test failed:', data);
      return NextResponse.json({
        success: false,
        error: 'PayPal API authentication failed',
        details: {
          status: response.status,
          statusText: response.statusText,
          paypalError: data,
          environment,
          baseUrl
        },
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

    console.log('✅ PayPal credentials test successful');
    return NextResponse.json({
      success: true,
      message: 'PayPal credentials are working correctly',
      details: {
        environment,
        baseUrl,
        clientIdLength: clientId.length,
        clientIdPrefix: clientId.substring(0, 10) + '...',
        tokenType: data.token_type,
        expiresIn: data.expires_in,
        hasAccessToken: !!data.access_token
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ PayPal credentials test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
