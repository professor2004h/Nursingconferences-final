import { NextRequest, NextResponse } from 'next/server';

/**
 * Production-safe endpoint to check PayPal configuration status
 * Returns configuration status without exposing sensitive values
 */
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 PayPal configuration status check requested');

    // Check PayPal environment variables (without exposing values)
    const configStatus = {
      // Client-side variables
      hasNextPublicPayPalClientId: !!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
      nextPublicPayPalClientIdLength: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID?.length || 0,
      nextPublicPayPalClientIdPrefix: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID?.substring(0, 5) || 'N/A',
      nextPublicPayPalClientIdValue: process.env.NODE_ENV === 'development' ?
        process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID :
        (process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ? `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID.substring(0, 10)}...` : 'Missing'),
      
      hasNextPublicPayPalEnvironment: !!process.env.NEXT_PUBLIC_PAYPAL_ENVIRONMENT,
      nextPublicPayPalEnvironment: process.env.NEXT_PUBLIC_PAYPAL_ENVIRONMENT || 'Not set',
      
      hasNextPublicPayPalCurrency: !!process.env.NEXT_PUBLIC_PAYPAL_CURRENCY,
      nextPublicPayPalCurrency: process.env.NEXT_PUBLIC_PAYPAL_CURRENCY || 'Not set',
      
      // Server-side variables (existence only)
      hasPayPalClientId: !!process.env.PAYPAL_CLIENT_ID,
      payPalClientIdLength: process.env.PAYPAL_CLIENT_ID?.length || 0,
      payPalClientIdPrefix: process.env.PAYPAL_CLIENT_ID?.substring(0, 5) || 'N/A',
      
      hasPayPalClientSecret: !!process.env.PAYPAL_CLIENT_SECRET,
      payPalClientSecretLength: process.env.PAYPAL_CLIENT_SECRET?.length || 0,
      
      hasPayPalEnvironment: !!process.env.PAYPAL_ENVIRONMENT,
      payPalEnvironment: process.env.PAYPAL_ENVIRONMENT || 'Not set',
      
      // Other important variables
      nodeEnv: process.env.NODE_ENV,
      hasNextPublicBaseUrl: !!process.env.NEXT_PUBLIC_BASE_URL,
      nextPublicBaseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'Not set'
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
      ),
      clientIdValid: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID?.length === 80, // PayPal client IDs are 80 characters
      clientSecretValid: process.env.PAYPAL_CLIENT_SECRET?.length === 80 // PayPal client secrets are 80 characters
    };

    // Count PayPal-related environment variables
    const allEnvVarNames = Object.keys(process.env);
    const paypalEnvVarNames = allEnvVarNames.filter(name => name.includes('PAYPAL'));

    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      configStatus,
      validationResults,
      summary: {
        totalEnvVars: allEnvVarNames.length,
        paypalEnvVarsCount: paypalEnvVarNames.length,
        paypalEnvVarNames,
        configurationComplete: validationResults.allPayPalVarsPresent,
        readyForPayments: validationResults.hasRequiredClientVars && validationResults.hasRequiredServerVars
      },
      deployment: {
        nodeEnv: process.env.NODE_ENV,
        platform: process.platform,
        nodeVersion: process.version,
        buildTime: process.env.BUILD_TIME || 'Unknown',
        deploymentId: process.env.DEPLOYMENT_ID || 'Unknown'
      },
      troubleshooting: {
        missingVars: [],
        recommendations: []
      }
    };

    // Add troubleshooting information
    if (!configStatus.hasNextPublicPayPalClientId) {
      response.troubleshooting.missingVars.push('NEXT_PUBLIC_PAYPAL_CLIENT_ID');
      response.troubleshooting.recommendations.push('Add NEXT_PUBLIC_PAYPAL_CLIENT_ID to environment variables');
    }
    if (!configStatus.hasPayPalClientId) {
      response.troubleshooting.missingVars.push('PAYPAL_CLIENT_ID');
      response.troubleshooting.recommendations.push('Add PAYPAL_CLIENT_ID to environment variables');
    }
    if (!configStatus.hasPayPalClientSecret) {
      response.troubleshooting.missingVars.push('PAYPAL_CLIENT_SECRET');
      response.troubleshooting.recommendations.push('Add PAYPAL_CLIENT_SECRET to environment variables');
    }
    if (!validationResults.clientIdConsistency) {
      response.troubleshooting.recommendations.push('Ensure PAYPAL_CLIENT_ID and NEXT_PUBLIC_PAYPAL_CLIENT_ID have the same value');
    }

    console.log('✅ PayPal configuration status:', {
      hasClientId: configStatus.hasNextPublicPayPalClientId,
      hasServerVars: validationResults.hasRequiredServerVars,
      ready: response.summary.readyForPayments
    });

    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ PayPal configuration status check error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
