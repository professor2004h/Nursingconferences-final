// =============================================================================
// PAYPAL SERVICE
// =============================================================================

import { paypalConfig, getPayPalApiUrl, validatePayPalAmount, formatPayPalAmount } from '@/lib/config/paypal';
import { CreatePaymentOrderRequest, CreatePaymentOrderResponse, CapturePaymentRequest, CapturePaymentResponse } from '@/types/payment';

class PayPalService {
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  // Get or refresh access token
  private async getAccessToken(): Promise<string | null> {
    // Check if current token is still valid
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

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
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // Refresh 1 minute early

      return this.accessToken;
    } catch (error) {
      console.error('❌ Error getting PayPal access token:', error);
      return null;
    }
  }

  // Create PayPal order
  async createOrder(orderData: CreatePaymentOrderRequest): Promise<CreatePaymentOrderResponse> {
    try {
      // Validate amount
      const amountValidation = validatePayPalAmount(orderData.amount);
      if (!amountValidation.isValid) {
        return {
          success: false,
          error: amountValidation.error,
        };
      }

      // Get access token
      const accessToken = await this.getAccessToken();
      if (!accessToken) {
        return {
          success: false,
          error: 'Failed to authenticate with PayPal',
        };
      }

      // Create order payload
      const payload = {
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: orderData.registrationId,
            amount: {
              currency_code: orderData.currency || 'USD',
              value: formatPayPalAmount(orderData.amount),
            },
            description: orderData.description || 'Conference Registration Payment',
            custom_id: orderData.registrationId,
            invoice_id: `INV_${orderData.registrationId}_${Date.now()}`,
          },
        ],
        application_context: {
          brand_name: 'Conference Registration',
          landing_page: 'NO_PREFERENCE',
          user_action: 'PAY_NOW',
          return_url: orderData.returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/registration/success`,
          cancel_url: orderData.cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/registration/cancel`,
        },
      };

      // Make API request
      const response = await fetch(`${getPayPalApiUrl()}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'PayPal-Request-Id': `${orderData.registrationId}-${Date.now()}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ PayPal order creation failed:', response.status, errorData);
        return {
          success: false,
          error: 'Failed to create PayPal order',
        };
      }

      const order = await response.json();
      const approvalUrl = order.links?.find((link: any) => link.rel === 'approve')?.href;

      return {
        success: true,
        orderId: order.id,
        approvalUrl,
        message: 'PayPal order created successfully',
      };

    } catch (error) {
      console.error('❌ PayPal create order error:', error);
      return {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Capture PayPal order
  async captureOrder(captureData: CapturePaymentRequest): Promise<CapturePaymentResponse> {
    try {
      // Get access token
      const accessToken = await this.getAccessToken();
      if (!accessToken) {
        return {
          success: false,
          error: 'Failed to authenticate with PayPal',
        };
      }

      // Make capture request
      const response = await fetch(`${getPayPalApiUrl()}/v2/checkout/orders/${captureData.orderId}/capture`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'PayPal-Request-Id': `capture-${captureData.orderId}-${Date.now()}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ PayPal capture failed:', response.status, errorData);
        return {
          success: false,
          error: 'Failed to capture PayPal payment',
        };
      }

      const captureResult = await response.json();
      const capture = captureResult.purchase_units?.[0]?.payments?.captures?.[0];

      if (!capture) {
        return {
          success: false,
          error: 'No capture data found in PayPal response',
        };
      }

      if (capture.status !== 'COMPLETED') {
        return {
          success: false,
          error: `Payment capture failed with status: ${capture.status}`,
        };
      }

      return {
        success: true,
        paymentId: captureResult.id,
        transactionId: capture.id,
        amount: parseFloat(capture.amount.value),
        currency: capture.amount.currency_code,
        status: 'completed',
        message: 'Payment captured successfully',
      };

    } catch (error) {
      console.error('❌ PayPal capture order error:', error);
      return {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Get order details
  async getOrderDetails(orderId: string): Promise<any> {
    try {
      const accessToken = await this.getAccessToken();
      if (!accessToken) {
        return null;
      }

      const response = await fetch(`${getPayPalApiUrl()}/v2/checkout/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('❌ Failed to get PayPal order details:', response.status);
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Error getting PayPal order details:', error);
      return null;
    }
  }

  // Verify webhook signature
  async verifyWebhookSignature(headers: any, body: string, webhookId: string): Promise<boolean> {
    try {
      const accessToken = await this.getAccessToken();
      if (!accessToken) {
        return false;
      }

      const verificationData = {
        auth_algo: headers['paypal-auth-algo'],
        cert_id: headers['paypal-cert-id'],
        transmission_id: headers['paypal-transmission-id'],
        transmission_sig: headers['paypal-transmission-sig'],
        transmission_time: headers['paypal-transmission-time'],
        webhook_id: webhookId,
        webhook_event: JSON.parse(body),
      };

      const response = await fetch(`${getPayPalApiUrl()}/v1/notifications/verify-webhook-signature`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(verificationData),
      });

      if (!response.ok) {
        console.error('❌ Webhook signature verification failed:', response.status);
        return false;
      }

      const result = await response.json();
      return result.verification_status === 'SUCCESS';
    } catch (error) {
      console.error('❌ Error verifying webhook signature:', error);
      return false;
    }
  }
}

// Export singleton instance
export const paypalService = new PayPalService();
export default paypalService;
