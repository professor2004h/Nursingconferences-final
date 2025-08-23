// =============================================================================
// PAYPAL CAPTURE ORDER API ROUTE
// =============================================================================

import { NextApiRequest, NextApiResponse } from 'next';
import { paypalConfig, getPayPalApiUrl } from '@/lib/config/paypal';

interface CaptureOrderRequest {
  orderId: string;
  registrationId: string;
}

interface PayPalCaptureResponse {
  id: string;
  status: string;
  purchase_units: Array<{
    reference_id: string;
    payments: {
      captures: Array<{
        id: string;
        status: string;
        amount: {
          currency_code: string;
          value: string;
        };
        final_capture: boolean;
        create_time: string;
        update_time: string;
      }>;
    };
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

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('❌ Error getting PayPal access token:', error);
    return null;
  }
}

// Capture PayPal order
async function capturePayPalOrder(
  accessToken: string,
  orderId: string
): Promise<PayPalCaptureResponse | null> {
  try {
    const response = await fetch(`${getPayPalApiUrl()}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'PayPal-Request-Id': `capture-${orderId}-${Date.now()}`, // Idempotency key
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ PayPal capture failed:', response.status, errorData);
      return null;
    }

    const captureData: PayPalCaptureResponse = await response.json();
    console.log('✅ PayPal order captured:', captureData.id);
    return captureData;
  } catch (error) {
    console.error('❌ Error capturing PayPal order:', error);
    return null;
  }
}

// Update registration with payment data (placeholder - implement with your database)
async function updateRegistrationPayment(
  registrationId: string,
  paymentData: {
    paymentId: string;
    transactionId: string;
    amount: number;
    currency: string;
    status: string;
  }
): Promise<boolean> {
  try {
    // TODO: Implement database update logic here
    // This is where you would update your registration record with payment information
    
    console.log('📝 Updating registration payment:', {
      registrationId,
      ...paymentData,
    });

    // Example implementation (replace with your database logic):
    /*
    await database.registration.update({
      where: { id: registrationId },
      data: {
        paymentStatus: 'completed',
        paymentId: paymentData.paymentId,
        paymentMethod: 'paypal',
        paymentAmount: paymentData.amount,
        paymentCurrency: paymentData.currency,
        paymentDate: new Date().toISOString(),
        status: 'confirmed',
      },
    });
    */

    return true;
  } catch (error) {
    console.error('❌ Error updating registration payment:', error);
    return false;
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
    const { orderId, registrationId }: CaptureOrderRequest = req.body;

    // Validate required fields
    if (!orderId || !registrationId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: orderId and registrationId',
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

    // Capture PayPal order
    const captureData = await capturePayPalOrder(accessToken, orderId);
    if (!captureData) {
      return res.status(500).json({
        success: false,
        error: 'Failed to capture PayPal payment',
      });
    }

    // Extract payment information
    const capture = captureData.purchase_units[0]?.payments?.captures?.[0];
    if (!capture) {
      return res.status(500).json({
        success: false,
        error: 'No capture data found in PayPal response',
      });
    }

    // Check if payment was successful
    if (capture.status !== 'COMPLETED') {
      return res.status(400).json({
        success: false,
        error: `Payment capture failed with status: ${capture.status}`,
      });
    }

    // Update registration with payment data
    const updateSuccess = await updateRegistrationPayment(registrationId, {
      paymentId: captureData.id,
      transactionId: capture.id,
      amount: parseFloat(capture.amount.value),
      currency: capture.amount.currency_code,
      status: capture.status,
    });

    if (!updateSuccess) {
      console.error('❌ Failed to update registration with payment data');
      // Note: Payment was successful but database update failed
      // You may want to implement retry logic or manual reconciliation
    }

    // Log successful capture
    console.log('✅ Payment captured successfully:', {
      orderId,
      captureId: capture.id,
      registrationId,
      amount: capture.amount.value,
      currency: capture.amount.currency_code,
      status: capture.status,
    });

    return res.status(200).json({
      success: true,
      paymentId: captureData.id,
      transactionId: capture.id,
      amount: parseFloat(capture.amount.value),
      currency: capture.amount.currency_code,
      status: capture.status,
      captureTime: capture.create_time,
      message: 'Payment captured successfully',
    });

  } catch (error) {
    console.error('❌ PayPal capture order error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
