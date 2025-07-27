import { NextRequest, NextResponse } from 'next/server';
import { validatePayPalConfig, logPayPalConfigStatus } from '@/app/utils/paypalConfig';

/**
 * PayPal Configuration Validation Endpoint
 * Provides detailed information about PayPal configuration status
 * Useful for debugging and health checks
 */
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 PayPal Configuration Validation Request');
    
    // Log current configuration status
    logPayPalConfigStatus();
    
    // Validate configuration
    const validation = validatePayPalConfig();
    
    // Prepare response data (excluding sensitive information)
    const responseData = {
      isValid: validation.isValid,
      errors: validation.errors,
      warnings: validation.warnings,
      environment: validation.config?.environment || 'unknown',
      hasClientId: !!validation.config?.clientId,
      hasClientSecret: !!validation.config?.clientSecret,
      baseUrl: validation.config?.baseUrl || 'unknown',
      timestamp: new Date().toISOString(),
      // Environment variables status (without exposing values)
      environmentVariables: {
        PAYPAL_CLIENT_ID: !!process.env.PAYPAL_CLIENT_ID,
        PAYPAL_CLIENT_SECRET: !!process.env.PAYPAL_CLIENT_SECRET,
        NEXT_PUBLIC_PAYPAL_CLIENT_ID: !!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
        PAYPAL_ENVIRONMENT: process.env.PAYPAL_ENVIRONMENT || 'sandbox',
        NEXT_PUBLIC_BASE_URL: !!process.env.NEXT_PUBLIC_BASE_URL
      }
    };
    
    if (validation.isValid) {
      console.log('✅ PayPal configuration is valid');
      return NextResponse.json({
        success: true,
        message: 'PayPal configuration is valid',
        data: responseData
      });
    } else {
      console.error('❌ PayPal configuration is invalid:', validation.errors);
      return NextResponse.json({
        success: false,
        message: 'PayPal configuration is invalid',
        data: responseData
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('❌ Error validating PayPal configuration:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Error validating PayPal configuration',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

/**
 * Test PayPal API connectivity
 * Attempts to get an access token to verify credentials work
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Testing PayPal API connectivity...');
    
    const validation = validatePayPalConfig();
    
    if (!validation.isValid) {
      return NextResponse.json({
        success: false,
        message: 'Cannot test API - configuration is invalid',
        errors: validation.errors
      }, { status: 400 });
    }
    
    if (!validation.config) {
      return NextResponse.json({
        success: false,
        message: 'Configuration not available'
      }, { status: 500 });
    }
    
    // Test API connectivity by requesting access token
    const auth = Buffer.from(`${validation.config.clientId}:${validation.config.clientSecret}`).toString('base64');
    
    const response = await fetch(`${validation.config.baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ PayPal API connectivity test successful');
      
      return NextResponse.json({
        success: true,
        message: 'PayPal API connectivity test successful',
        data: {
          environment: validation.config.environment,
          baseUrl: validation.config.baseUrl,
          tokenType: data.token_type,
          expiresIn: data.expires_in,
          timestamp: new Date().toISOString()
        }
      });
    } else {
      const errorText = await response.text();
      console.error('❌ PayPal API connectivity test failed:', {
        status: response.status,
        error: errorText
      });
      
      return NextResponse.json({
        success: false,
        message: 'PayPal API connectivity test failed',
        error: {
          status: response.status,
          statusText: response.statusText,
          details: errorText
        }
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('❌ Error testing PayPal API connectivity:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Error testing PayPal API connectivity',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
