import { NextRequest, NextResponse } from 'next/server';

/**
 * Debug endpoint to check environment variable configuration
 * Only available in development mode for security
 */
export async function GET(request: NextRequest) {
  // Only allow in development mode
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({
      error: 'Environment check not available in production'
    }, { status: 403 });
  }

  try {
    console.log('🔍 Environment variables check requested');

    // Check PayPal environment variables
    const paypalVars = {
      // Client-side variables
      NEXT_PUBLIC_PAYPAL_CLIENT_ID: {
        value: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ? 
          `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID.substring(0, 10)}...` : 
          'Missing',
        exists: !!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
        length: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID?.length || 0
      },
      NEXT_PUBLIC_PAYPAL_ENVIRONMENT: {
        value: process.env.NEXT_PUBLIC_PAYPAL_ENVIRONMENT || 'Not set',
        exists: !!process.env.NEXT_PUBLIC_PAYPAL_ENVIRONMENT
      },
      NEXT_PUBLIC_PAYPAL_CURRENCY: {
        value: process.env.NEXT_PUBLIC_PAYPAL_CURRENCY || 'Not set',
        exists: !!process.env.NEXT_PUBLIC_PAYPAL_CURRENCY
      },
      
      // Server-side variables
      PAYPAL_CLIENT_ID: {
        value: process.env.PAYPAL_CLIENT_ID ? 
          `${process.env.PAYPAL_CLIENT_ID.substring(0, 10)}...` : 
          'Missing',
        exists: !!process.env.PAYPAL_CLIENT_ID,
        length: process.env.PAYPAL_CLIENT_ID?.length || 0
      },
      PAYPAL_CLIENT_SECRET: {
        value: process.env.PAYPAL_CLIENT_SECRET ? 
          `${process.env.PAYPAL_CLIENT_SECRET.substring(0, 10)}...` : 
          'Missing',
        exists: !!process.env.PAYPAL_CLIENT_SECRET,
        length: process.env.PAYPAL_CLIENT_SECRET?.length || 0
      },
      PAYPAL_ENVIRONMENT: {
        value: process.env.PAYPAL_ENVIRONMENT || 'Not set',
        exists: !!process.env.PAYPAL_ENVIRONMENT
      }
    };

    // Check other important variables
    const otherVars = {
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'Not set',
      NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ? 'Set' : 'Missing',
      SANITY_API_TOKEN: process.env.SANITY_API_TOKEN ? 'Set' : 'Missing'
    };

    // Validation checks
    const validationResults = {
      clientIdConsistency: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID === process.env.PAYPAL_CLIENT_ID,
      environmentConsistency: (process.env.NEXT_PUBLIC_PAYPAL_ENVIRONMENT || 'production') === (process.env.PAYPAL_ENVIRONMENT || 'production'),
      hasRequiredClientVars: !!(process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID),
      hasRequiredServerVars: !!(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET),
      allPayPalVarsPresent: !!(
        process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID &&
        process.env.PAYPAL_CLIENT_ID &&
        process.env.PAYPAL_CLIENT_SECRET
      )
    };

    // Get all environment variable names for debugging
    const allEnvVarNames = Object.keys(process.env).sort();
    const paypalEnvVarNames = allEnvVarNames.filter(name => name.includes('PAYPAL'));

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      paypalVars,
      otherVars,
      validationResults,
      debug: {
        totalEnvVars: allEnvVarNames.length,
        paypalEnvVarNames,
        allEnvVarNames: process.env.NODE_ENV === 'development' ? allEnvVarNames : 'Hidden in production'
      }
    });

  } catch (error) {
    console.error('❌ Environment check error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
