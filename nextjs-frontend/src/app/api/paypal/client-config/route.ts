/**
 * PayPal Client Configuration API
 * Provides client-safe PayPal configuration for frontend use
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 PayPal client config requested');

    // Get client-safe environment variables with fallback priority
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || process.env.PAYPAL_CLIENT_ID;
    const environment = process.env.NEXT_PUBLIC_PAYPAL_ENVIRONMENT || process.env.PAYPAL_ENVIRONMENT || 'production';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://nursingeducationconferences.org';

    // Debug environment variables
    console.log('🔍 Environment variables check:', {
      hasNextPublicPayPalClientId: !!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
      hasPayPalClientId: !!process.env.PAYPAL_CLIENT_ID,
      environment,
      baseUrl
    });

    // Validate that we have the required configuration
    if (!clientId) {
      console.error('❌ PayPal client ID not available for client config');
      console.error('💡 Available environment variables:', Object.keys(process.env).filter(key => key.includes('PAYPAL')));
      return NextResponse.json({
        success: false,
        error: 'PayPal client configuration not available. Please check NEXT_PUBLIC_PAYPAL_CLIENT_ID or PAYPAL_CLIENT_ID environment variables.',
        availablePayPalVars: Object.keys(process.env).filter(key => key.includes('PAYPAL')),
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

    console.log('✅ PayPal client config provided:', {
      hasClientId: !!clientId,
      clientIdLength: clientId.length,
      clientIdPrefix: clientId.substring(0, 10) + '...',
      environment,
      baseUrl
    });

    return NextResponse.json({
      success: true,
      clientId,
      environment,
      baseUrl,
      timestamp: new Date().toISOString(),
      source: 'server-api'
    });

  } catch (error) {
    console.error('❌ Error providing PayPal client config:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to get PayPal client configuration',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
