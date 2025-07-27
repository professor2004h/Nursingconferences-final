/**
 * Debug endpoint to check client-side environment variables
 * This helps diagnose why NEXT_PUBLIC_PAYPAL_CLIENT_ID might not be available
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Debug: Checking client-side environment variables');

    // Check all PayPal-related environment variables
    const envVars = {
      // Server-side variables (should be available)
      PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID ? 'SET' : 'NOT_SET',
      PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET ? 'SET' : 'NOT_SET',
      PAYPAL_ENVIRONMENT: process.env.PAYPAL_ENVIRONMENT || 'NOT_SET',
      
      // Client-side variables (should be available in browser)
      NEXT_PUBLIC_PAYPAL_CLIENT_ID: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ? 'SET' : 'NOT_SET',
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'NOT_SET',
      
      // Other environment info
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV || 'NOT_SET',
    };

    // Check actual values (masked for security)
    const envDetails = {
      PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID ? 
        `${process.env.PAYPAL_CLIENT_ID.substring(0, 10)}...` : 'NOT_SET',
      PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET ? 
        `${process.env.PAYPAL_CLIENT_SECRET.substring(0, 10)}...` : 'NOT_SET',
      NEXT_PUBLIC_PAYPAL_CLIENT_ID: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ? 
        `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID.substring(0, 10)}...` : 'NOT_SET',
      PAYPAL_ENVIRONMENT: process.env.PAYPAL_ENVIRONMENT,
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    };

    console.log('📋 Environment Variables Status:', envVars);
    console.log('📋 Environment Variables Details:', envDetails);

    return NextResponse.json({
      success: true,
      message: 'Environment variables debug info',
      data: {
        status: envVars,
        details: envDetails,
        timestamp: new Date().toISOString(),
        buildTime: process.env.NODE_ENV === 'production',
        
        // Check if client ID matches
        clientIdsMatch: process.env.PAYPAL_CLIENT_ID === process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
        
        // PayPal configuration status
        paypalConfigured: !!(
          process.env.PAYPAL_CLIENT_ID && 
          process.env.PAYPAL_CLIENT_SECRET && 
          process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
        ),
        
        // Environment validation
        environmentValid: ['sandbox', 'production'].includes(process.env.PAYPAL_ENVIRONMENT || ''),
      }
    });

  } catch (error) {
    console.error('❌ Error in environment debug:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Error checking environment variables',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
