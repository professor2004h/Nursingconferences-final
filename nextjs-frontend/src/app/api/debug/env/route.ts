import { NextRequest, NextResponse } from 'next/server';

/**
 * Debug Environment Variables Endpoint
 * Helps diagnose environment variable issues in production
 * ⚠️ Remove this endpoint after debugging is complete
 */
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Environment Variables Debug Request');

    // Check all PayPal-related environment variables
    const envVars = {
      // Server-side variables
      PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID ? `${process.env.PAYPAL_CLIENT_ID.substring(0, 10)}...` : 'NOT_SET',
      PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET ? `${process.env.PAYPAL_CLIENT_SECRET.substring(0, 10)}...` : 'NOT_SET',
      PAYPAL_ENVIRONMENT: process.env.PAYPAL_ENVIRONMENT || 'NOT_SET',
      
      // Client-side variables (should be available on server too)
      NEXT_PUBLIC_PAYPAL_CLIENT_ID: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ? `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID.substring(0, 10)}...` : 'NOT_SET',
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'NOT_SET',
      
      // Sanity variables
      NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'NOT_SET',
      NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET || 'NOT_SET',
      
      // System variables
      NODE_ENV: process.env.NODE_ENV || 'NOT_SET',
      VERCEL: process.env.VERCEL || 'NOT_SET',
      
      // Build info
      timestamp: new Date().toISOString(),
      buildTime: process.env.BUILD_TIME || 'NOT_SET'
    };

    console.log('📊 Environment Variables Status:', envVars);

    return NextResponse.json({
      success: true,
      environment: envVars,
      message: 'Environment variables debug information',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Environment debug error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve environment information',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
