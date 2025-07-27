import { NextRequest, NextResponse } from 'next/server';

/**
 * PayPal Integration Test Endpoint
 * Tests the complete PayPal flow according to official documentation
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🧪 PayPal Integration Test Started');

    // Test 1: Environment Variables
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    const environment = process.env.PAYPAL_ENVIRONMENT || 'production';

    if (!clientId || !clientSecret) {
      return NextResponse.json({
        success: false,
        error: 'PayPal credentials not configured',
        details: {
          clientId: clientId ? 'SET' : 'MISSING',
          clientSecret: clientSecret ? 'SET' : 'MISSING',
          environment
        }
      }, { status: 500 });
    }

    // Test 2: Generate Access Token
    console.log('🔑 Testing PayPal access token generation...');
    
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const baseURL = environment === 'production' 
      ? 'https://api-m.paypal.com' 
      : 'https://api-m.sandbox.paypal.com';

    const tokenResponse = await fetch(`${baseURL}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!tokenResponse.ok) {
      const tokenError = await tokenResponse.text();
      console.error('❌ Token generation failed:', tokenError);
      return NextResponse.json({
        success: false,
        error: 'Failed to generate PayPal access token',
        details: { status: tokenResponse.status, error: tokenError }
      }, { status: 500 });
    }

    const tokenData = await tokenResponse.json();
    console.log('✅ Access token generated successfully');

    // Test 3: Create Test Order (following official PayPal documentation)
    console.log('📦 Testing PayPal order creation...');
    
    const testOrderData = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: 'TEST_' + Date.now(),
          amount: {
            currency_code: 'USD',
            value: '1.00',
          },
          description: 'PayPal Integration Test Order',
          custom_id: 'TEST_ORDER_' + Date.now(),
          soft_descriptor: 'TEST_ORDER',
        },
      ],
      application_context: {
        brand_name: 'Intelli Global Conferences',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        shipping_preference: 'NO_SHIPPING',
        // No return_url/cancel_url for JavaScript SDK integration
      },
    };

    const orderResponse = await fetch(`${baseURL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json',
        'PayPal-Request-Id': `TEST_${Date.now()}`,
      },
      body: JSON.stringify(testOrderData),
    });

    if (!orderResponse.ok) {
      const orderError = await orderResponse.text();
      console.error('❌ Order creation failed:', orderError);
      return NextResponse.json({
        success: false,
        error: 'Failed to create PayPal test order',
        details: { status: orderResponse.status, error: orderError }
      }, { status: 500 });
    }

    const orderData = await orderResponse.json();
    console.log('✅ Test order created successfully:', orderData.id);

    // Test 4: Verify Order Structure
    const hasCorrectStructure = 
      orderData.id &&
      orderData.status &&
      orderData.links &&
      Array.isArray(orderData.links) &&
      orderData.links.some((link: any) => link.rel === 'approve');

    return NextResponse.json({
      success: true,
      message: 'PayPal integration test completed successfully',
      results: {
        environment,
        credentials: 'VALID',
        tokenGeneration: 'SUCCESS',
        orderCreation: 'SUCCESS',
        orderStructure: hasCorrectStructure ? 'VALID' : 'INVALID',
        testOrderId: orderData.id,
        testOrderStatus: orderData.status,
        approveLink: orderData.links?.find((link: any) => link.rel === 'approve')?.href,
        timestamp: new Date().toISOString()
      },
      orderData: {
        id: orderData.id,
        status: orderData.status,
        links: orderData.links
      }
    });

  } catch (error) {
    console.error('❌ PayPal integration test failed:', error);
    return NextResponse.json({
      success: false,
      error: 'PayPal integration test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
