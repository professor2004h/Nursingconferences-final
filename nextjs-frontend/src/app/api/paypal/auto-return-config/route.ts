import { NextRequest, NextResponse } from 'next/server';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

/**
 * PayPal Auto Return Configuration Endpoint
 * Provides configuration details for PayPal Auto Return setup
 */
export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://nursingeducationconferences.org';
    const environment = process.env.PAYPAL_ENVIRONMENT || 'production';
    
    const config = {
      success: true,
      message: 'PayPal Auto Return configuration',
      data: {
        // PayPal Auto Return URL (for PayPal account settings)
        autoReturnUrl: `${baseUrl}/paypal/return`,
        
        // PayPal Cancel URL (for PayPal account settings)
        cancelUrl: `${baseUrl}/paypal/cancel`,
        
        // Environment
        environment,
        
        // PayPal Account Configuration Instructions
        instructions: {
          title: 'PayPal Auto Return Setup Instructions',
          steps: [
            {
              step: 1,
              title: 'Log into your PayPal Business Account',
              description: 'Go to https://www.paypal.com and log into your business account'
            },
            {
              step: 2,
              title: 'Navigate to Account Settings',
              description: 'Click on the gear icon (Settings) in the top right corner'
            },
            {
              step: 3,
              title: 'Go to Website Payments',
              description: 'Under "Products & Services", click on "Website payments"'
            },
            {
              step: 4,
              title: 'Update Website Payment Preferences',
              description: 'Click on "Website payment preferences" or "Update" next to it'
            },
            {
              step: 5,
              title: 'Enable Auto Return',
              description: 'Set "Auto Return" to "On"'
            },
            {
              step: 6,
              title: 'Set Return URL',
              description: `Set the Return URL to: ${baseUrl}/paypal/return`
            },
            {
              step: 7,
              title: 'Enable Payment Data Transfer (PDT)',
              description: 'Set "Payment Data Transfer" to "On" (optional but recommended)'
            },
            {
              step: 8,
              title: 'Save Settings',
              description: 'Click "Save" to apply the changes'
            }
          ],
          requirements: [
            'PayPal Business Account (required)',
            'Website Payments enabled',
            'Auto Return feature enabled',
            'Correct Return URL configured',
            'SSL certificate on your domain (recommended)'
          ],
          notes: [
            'Auto Return only works with PayPal Business accounts',
            'The return URL must be on the same domain as your PayPal-approved website',
            'It may take a few minutes for changes to take effect',
            'Test the return URL with a small transaction first'
          ]
        },
        
        // Current configuration status
        status: {
          returnUrlConfigured: true,
          cancelUrlConfigured: true,
          sslEnabled: baseUrl.startsWith('https://'),
          environment: environment,
          domain: baseUrl.replace(/^https?:\/\//, ''),
          timestamp: new Date().toISOString()
        }
      }
    };

    return NextResponse.json(config, { headers: corsHeaders });

  } catch (error) {
    console.error('Error getting PayPal Auto Return config:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get PayPal Auto Return configuration',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}
