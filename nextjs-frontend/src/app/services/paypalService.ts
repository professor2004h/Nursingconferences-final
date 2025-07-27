/**
 * Production PayPal Service
 * Handles live PayPal payment processing using direct HTTP calls (like working example)
 * ⚠️ WARNING: This processes REAL MONEY transactions!
 */

import { getPayPalConfig } from '@/app/utils/paypalConfig';

// PayPal SDK types
interface PayPalOrder {
  id: string;
  status: string;
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
  purchase_units: Array<{
    reference_id: string;
    amount: {
      currency_code: string;
      value: string;
    };
  }>;
}

interface PayPalCaptureResponse {
  id: string;
  status: string;
  purchase_units: Array<{
    payments: {
      captures: Array<{
        id: string;
        status: string;
        amount: {
          currency_code: string;
          value: string;
        };
      }>;
    };
  }>;
}

/**
 * Production PayPal Service Class
 * Handles all PayPal operations with enhanced security and logging
 */
export class PayPalService {
  private config: any;
  private baseUrl: string;
  private isConfigured: boolean;

  constructor() {
    try {
      this.config = getPayPalConfig();
      this.baseUrl = this.config.environment === 'production'
        ? 'https://api-m.paypal.com'
        : 'https://api-m.sandbox.paypal.com';

      // Check if properly configured
      this.isConfigured = !!(this.config.clientId && this.config.clientSecret);

      if (this.isConfigured) {
        // Log environment for security awareness
        console.log(`🔒 PayPal Service initialized in ${this.config.environment.toUpperCase()} mode`);
        if (this.config.environment === 'production') {
          console.log('⚠️ PRODUCTION MODE: Real money transactions enabled!');
        }
      } else {
        console.log('⚠️ PayPal Service initialized without credentials (build time)');
      }
    } catch (error) {
      console.log('⚠️ PayPal Service initialization failed (likely build time):', error.message);
      this.isConfigured = false;
      this.config = { environment: 'sandbox' };
      this.baseUrl = 'https://api-m.sandbox.paypal.com';
    }
  }

  /**
   * Generate PayPal access token using HTTP calls (like working example)
   * This method follows the same pattern as the working PayPal code
   */
  private async generateAccessToken(): Promise<string> {
    if (!this.isConfigured) {
      throw new Error('PayPal service not properly configured');
    }

    try {
      console.log('🔑 Generating PayPal access token...');

      const response = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64')}`
        },
        body: 'grant_type=client_credentials'
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ PayPal token generation failed:', response.status, errorText);
        throw new Error(`PayPal authentication failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ PayPal access token generated successfully');
      return data.access_token;
    } catch (error) {
      console.error('❌ Error generating PayPal access token:', error);
      throw error;
    }
  }

  /**
   * Check if PayPal is properly configured
   */
  private checkConfiguration(): void {
    if (!this.isConfigured) {
      throw new Error('PayPal service is not properly configured. Missing credentials.');
    }
  }



  /**
   * Create PayPal order with production-grade validation
   */
  async createOrder(orderData: {
    amount: number;
    currency: string;
    registrationId: string;
    registrationData: any;
    description?: string;
  }): Promise<PayPalOrder> {
    this.checkConfiguration();

    try {
      // Enhanced validation for production
      if (orderData.amount <= 0) {
        throw new Error('Invalid amount: must be greater than 0');
      }
      
      if (orderData.amount > 50000) {
        throw new Error('Amount exceeds maximum limit ($50,000)');
      }

      const accessToken = await this.generateAccessToken();
      
      // PayPal order structure optimized for JavaScript SDK integration
      const paypalOrderData = {
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: orderData.registrationId,
            amount: {
              currency_code: orderData.currency,
              value: orderData.amount.toFixed(2),
            },
            description: orderData.description || 'Conference Registration Payment',
            custom_id: orderData.registrationId,
            invoice_id: `INV_${orderData.registrationId}_${Date.now()}`,
            soft_descriptor: 'NURSING_CONF',
          },
        ],
        application_context: {
          brand_name: 'Intelli Global Conferences',
          landing_page: 'BILLING',
          user_action: 'PAY_NOW',
          shipping_preference: 'NO_SHIPPING',
          // No return_url/cancel_url for JavaScript SDK integration
          // SDK uses onApprove/onCancel callbacks instead
        },
      };

      console.log(`💳 Creating PayPal order (${this.config.environment}):`, {
        amount: orderData.amount,
        currency: orderData.currency,
        registrationId: orderData.registrationId,
        environment: this.config.environment
      });

      const response = await fetch(`${this.baseUrl}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'PayPal-Request-Id': `${orderData.registrationId}_${Date.now()}`,
          'Prefer': 'return=representation',
        },
        body: JSON.stringify(paypalOrderData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ PayPal order creation failed:', {
          status: response.status,
          error: errorText,
          orderData: paypalOrderData,
          environment: this.config.environment
        });
        throw new Error(`PayPal order creation failed: ${response.status} - ${errorText}`);
      }

      const order: PayPalOrder = await response.json();
      
      console.log(`✅ PayPal order created successfully (${this.config.environment}):`, {
        orderId: order.id,
        status: order.status,
        amount: orderData.amount,
        registrationId: orderData.registrationId
      });

      return order;
    } catch (error) {
      console.error('❌ PayPal order creation error:', error);
      throw error;
    }
  }

  /**
   * Capture PayPal payment with enhanced validation
   */
  async capturePayment(orderId: string): Promise<PayPalCaptureResponse> {
    this.checkConfiguration();

    try {
      const accessToken = await this.generateAccessToken();

      console.log(`💰 Capturing PayPal payment (${this.config.environment}):`, {
        orderId,
        environment: this.config.environment
      });

      const response = await fetch(`${this.baseUrl}/v2/checkout/orders/${orderId}/capture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'PayPal-Request-Id': `CAPTURE_${orderId}_${Date.now()}`,
          'Prefer': 'return=representation',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ PayPal payment capture failed:', {
          status: response.status,
          error: errorText,
          orderId,
          environment: this.config.environment
        });
        throw new Error(`PayPal payment capture failed: ${response.status} - ${errorText}`);
      }

      const captureResult: PayPalCaptureResponse = await response.json();
      
      console.log(`✅ PayPal payment captured successfully (${this.config.environment}):`, {
        orderId,
        captureId: captureResult.id,
        status: captureResult.status,
        environment: this.config.environment
      });

      return captureResult;
    } catch (error) {
      console.error('❌ PayPal payment capture error:', error);
      throw error;
    }
  }

  /**
   * Verify PayPal webhook signature (for production security)
   */
  async verifyWebhookSignature(
    headers: any,
    body: string,
    webhookId: string
  ): Promise<boolean> {
    try {
      const accessToken = await this.generateAccessToken();

      const verificationData = {
        auth_algo: headers['paypal-auth-algo'],
        cert_id: headers['paypal-cert-id'],
        transmission_id: headers['paypal-transmission-id'],
        transmission_sig: headers['paypal-transmission-sig'],
        transmission_time: headers['paypal-transmission-time'],
        webhook_id: webhookId,
        webhook_event: JSON.parse(body),
      };

      const response = await fetch(`${this.baseUrl}/v1/notifications/verify-webhook-signature`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(verificationData),
      });

      const result = await response.json();
      return result.verification_status === 'SUCCESS';
    } catch (error) {
      console.error('❌ PayPal webhook verification error:', error);
      return false;
    }
  }
}

// Export singleton instance
export const paypalService = new PayPalService();
