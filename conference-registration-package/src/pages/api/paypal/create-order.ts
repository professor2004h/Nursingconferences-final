// =============================================================================
// PAYPAL CREATE ORDER API ROUTE
// =============================================================================

import { NextApiRequest, NextApiResponse } from 'next';
import { paypalConfig, getPayPalApiUrl, validatePayPalAmount, formatPayPalAmount, generateInvoiceId, generateCustomId, getSoftDescriptor } from '@/lib/config/paypal';
import { env } from '@/lib/config/environment';

interface CreateOrderRequest {
  amount: number;
  currency?: string;
  registrationId: string;
  registrationData?: any;
}

interface PayPalAccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface PayPalOrderResponse {
  id: string;
  status: string;
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

// Get PayPal access token
async function getPayPalAccessToken(): Promise<string | null> {
  try {
    const auth = Buffer.from(`${paypalConfig.clientId}:${paypalConfig.clientSecret}`).toString('base64');
    
    const response = await fetch(`${getPayPalApiUrl()}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      console.error('❌ PayPal auth failed:', response.status, response.statusText);
      return null;
    }

    const data: PayPalAccessTokenResponse = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('❌ Error getting PayPal access token:', error);
    return null;
  }
}

// Create PayPal order
async function createPayPalOrder(
  accessToken: string,
  amount: number,
  currency: string,
  registrationId: string,
  registrationData?: any
): Promise<PayPalOrderResponse | null> {
  try {
    const orderData = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: registrationId,
          amount: {
            currency_code: currency,
            value: formatPayPalAmount(amount),
          },
          description: `Conference Registration - ${env.CONFERENCE.NAME}`,
          custom_id: generateCustomId(registrationId),
          invoice_id: generateInvoiceId(registrationId),
          soft_descriptor: getSoftDescriptor(),
        },
      ],
      application_context: {
        brand_name: env.APP_NAME,
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: `${env.APP_URL}/registration/success`,
        cancel_url: `${env.APP_URL}/registration`,
      },
    };

    const response = await fetch(`${getPayPalApiUrl()}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'PayPal-Request-Id': `${registrationId}-${Date.now()}`, // Idempotency key
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ PayPal order creation failed:', response.status, errorData);
      return null;
    }

    const order: PayPalOrderResponse = await response.json();
    console.log('✅ PayPal order created:', order.id);
    return order;
  } catch (error) {
    console.error('❌ Error creating PayPal order:', error);
    return null;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    const { amount, currency = 'USD', registrationId, registrationData }: CreateOrderRequest = req.body;

    // Validate required fields
    if (!amount || !registrationId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: amount and registrationId',
      });
    }

    // Validate amount
    const amountValidation = validatePayPalAmount(amount);
    if (!amountValidation.isValid) {
      return res.status(400).json({
        success: false,
        error: amountValidation.error,
      });
    }

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();
    if (!accessToken) {
      return res.status(500).json({
        success: false,
        error: 'Failed to authenticate with PayPal',
      });
    }

    // Create PayPal order
    const order = await createPayPalOrder(
      accessToken,
      amount,
      currency,
      registrationId,
      registrationData
    );

    if (!order) {
      return res.status(500).json({
        success: false,
        error: 'Failed to create PayPal order',
      });
    }

    // Find approval URL
    const approvalUrl = order.links.find(link => link.rel === 'approve')?.href;

    // Log order creation for debugging
    console.log('📝 PayPal order created successfully:', {
      orderId: order.id,
      registrationId,
      amount,
      currency,
      status: order.status,
    });

    return res.status(200).json({
      success: true,
      orderId: order.id,
      status: order.status,
      approvalUrl,
      message: 'PayPal order created successfully',
    });

  } catch (error) {
    console.error('❌ PayPal create order error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
