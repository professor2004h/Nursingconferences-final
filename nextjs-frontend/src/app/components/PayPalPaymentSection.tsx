'use client';

import React, { useState, useEffect } from 'react';
import { getClientPayPalConfig, type ClientPayPalConfig } from '@/app/utils/clientPaypalConfig';

interface PayPalPaymentSectionProps {
  amount: number;
  currency?: string;
  registrationId: string;
  registrationData: any;
  onSuccess: (paymentData: any) => void;
  onError: (error: any) => void;
  disabled?: boolean;
}

// Declare PayPal types
declare global {
  interface Window {
    paypal?: any;
  }
}

const PayPalPaymentSection: React.FC<PayPalPaymentSectionProps> = ({
  amount,
  currency = 'USD',
  registrationId,
  registrationData,
  onSuccess,
  onError,
  disabled = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [paypalButtonsRendered, setPaypalButtonsRendered] = useState(false);
  const [paypalConfig, setPaypalConfig] = useState<ClientPayPalConfig | null>(null);
  const [configLoading, setConfigLoading] = useState(true);

  // Load PayPal configuration
  useEffect(() => {
    async function loadPayPalConfig() {
      try {
        setConfigLoading(true);
        setError(null);

        console.log('🔧 Loading PayPal configuration...');
        const config = await getClientPayPalConfig();

        console.log('✅ PayPal configuration loaded:', {
          hasClientId: !!config.clientId,
          environment: config.environment,
          isConfigured: config.isConfigured
        });

        setPaypalConfig(config);
      } catch (error) {
        console.error('❌ Failed to load PayPal configuration:', error);
        setError('PayPal configuration error. Please contact support.');
      } finally {
        setConfigLoading(false);
      }
    }

    loadPayPalConfig();
  }, []);

  // Validate amount before proceeding
  useEffect(() => {
    if (amount <= 0) {
      setError('Invalid payment amount. Please ensure a registration type is selected.');
      return;
    }
    if (!configLoading && paypalConfig) {
      setError(null);
    }
  }, [amount, configLoading, paypalConfig]);

  // Load PayPal SDK
  useEffect(() => {
    if (configLoading || !paypalConfig) {
      return;
    }

    if (!paypalConfig.clientId) {
      console.error('❌ PayPal Client ID missing from configuration');
      setError('PayPal configuration error. Please contact support.');
      return;
    }

    if (amount <= 0) {
      setError('Invalid payment amount. Please ensure a registration type is selected.');
      return;
    }

    if (window.paypal) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${paypalConfig.clientId}&currency=${currency}&intent=capture&components=buttons`;
    script.async = true;

    script.onload = () => {
      setScriptLoaded(true);
    };

    script.onerror = () => {
      setError('Failed to load PayPal SDK');
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [paypalConfig, currency, configLoading]);

  // Render PayPal buttons when script is loaded
  useEffect(() => {
    if (!scriptLoaded || !window.paypal || paypalButtonsRendered || disabled || !registrationId) {
      return;
    }

    // Don't render buttons if amount is invalid
    if (amount <= 0) {
      setError('Invalid payment amount. Please ensure a registration type is selected.');
      return;
    }

    const paypalButtonContainer = document.getElementById('paypal-button-container');
    if (!paypalButtonContainer) return;

    // Clear any existing buttons
    paypalButtonContainer.innerHTML = '';

    try {
      console.log('🔧 Initializing PayPal buttons with config:', {
        registrationId,
        amount,
        currency,
        paypalConfigured: !!paypalConfig,
        timestamp: new Date().toISOString()
      });

      window.paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'paypal',
          height: 50,
          tagline: false,
        },

        createOrder: async () => {
          try {
            setLoading(true);
            setError(null);

            console.log('🎯 Creating PayPal order for:', { registrationId, amount, currency });

            const response = await fetch('/api/paypal/create-order', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                amount,
                currency,
                registrationId,
                registrationData,
              }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
              throw new Error(data.error || 'Failed to create PayPal order');
            }

            console.log('✅ PayPal order created:', data.orderId);
            return data.orderId;

          } catch (error) {
            console.error('❌ Error creating PayPal order:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to create order';
            setError(errorMessage);
            onError(error);
            throw error;
          } finally {
            setLoading(false);
          }
        },

        onApprove: async (data: any) => {
          try {
            setLoading(true);
            setError(null);

            console.log('🎉 PayPal onApprove triggered! Payment approved by user:', {
              orderID: data.orderID,
              payerID: data.payerID,
              registrationId,
              timestamp: new Date().toISOString()
            });

            console.log('💰 Capturing PayPal payment for order:', data.orderID);

            const response = await fetch('/api/paypal/capture-order', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                orderId: data.orderID,
                registrationId,
              }),
            });

            console.log('📡 Capture API response status:', response.status);

            const captureData = await response.json();
            console.log('📋 Capture API response data:', captureData);

            if (!response.ok || !captureData.success) {
              console.error('❌ Capture API failed:', {
                status: response.status,
                captureData,
                error: captureData.error
              });
              throw new Error(captureData.error || 'Failed to capture PayPal payment');
            }

            console.log('✅ PayPal payment captured successfully:', {
              paymentId: captureData.paymentId,
              amount: captureData.amount,
              currency: captureData.currency,
              status: captureData.status
            });

            onSuccess({
              paymentId: captureData.paymentId,
              paymentMethod: 'paypal',
              amount: captureData.amount,
              currency: captureData.currency,
              registrationId,
              orderId: data.orderID,
              captureId: captureData.paymentId,
              status: 'completed',
            });

          } catch (error) {
            console.error('❌ Error capturing PayPal payment:', error);
            const errorMessage = error instanceof Error ? error.message : 'Payment capture failed';
            setError(errorMessage);
            onError(error);
          } finally {
            setLoading(false);
          }
        },

        onError: (error: any) => {
          console.error('❌ PayPal payment error:', {
            error,
            errorType: typeof error,
            errorMessage: error?.message || 'Unknown error',
            timestamp: new Date().toISOString()
          });
          setError('Payment failed. Please try again.');
          setLoading(false);
          onError(error);
        },

        onCancel: () => {
          console.log('⚠️ PayPal payment cancelled by user:', {
            timestamp: new Date().toISOString(),
            registrationId
          });
          setError(null);
          setLoading(false);
        }

      }).render('#paypal-button-container');

      setPaypalButtonsRendered(true);

      // Add CSS to ensure PayPal buttons stay within container
      const style = document.createElement('style');
      style.textContent = `
        #paypal-button-container {
          max-width: 100% !important;
          overflow: hidden !important;
          position: relative !important;
          z-index: 10 !important;
          box-sizing: border-box !important;
        }
        #paypal-button-container > div {
          max-width: 100% !important;
          overflow: hidden !important;
          box-sizing: border-box !important;
        }
        #paypal-button-container iframe {
          max-width: 100% !important;
          width: 100% !important;
          box-sizing: border-box !important;
        }
        .paypal-button-wrapper {
          position: relative !important;
          z-index: 10 !important;
          max-width: 100% !important;
          overflow: hidden !important;
          box-sizing: border-box !important;
        }
        .paypal-payment-section {
          position: relative !important;
          z-index: 10 !important;
          max-width: 100% !important;
          overflow: hidden !important;
          box-sizing: border-box !important;
        }

        /* Mobile responsive styles */
        @media (max-width: 768px) {
          #paypal-button-container {
            min-height: 50px !important;
          }
          .paypal-payment-section {
            padding: 1rem !important;
          }
        }

        /* Prevent PayPal elements from creating scrollbars */
        body {
          overflow-x: hidden;
        }
      `;
      document.head.appendChild(style);

    } catch (error) {
      console.error('❌ Error rendering PayPal buttons:', error);
      setError('Failed to initialize PayPal payment');
    }

  }, [scriptLoaded, disabled, registrationId, amount, currency, registrationData, onSuccess, onError, paypalButtonsRendered]);



  // This check is already handled above in the configuration loading logic
  // The component will show loading state or error state appropriately

  return (
    <div className="paypal-payment-section bg-white rounded-lg shadow-sm border border-gray-200 p-6 relative z-10 max-w-full overflow-hidden">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        💳 Pay with PayPal
      </h3>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <span className="text-red-500 text-lg mr-2">⚠️</span>
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Payment Amount Display */}
      {amount > 0 ? (
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-blue-700">Total Amount:</span>
            <span className="text-2xl font-bold text-blue-900">
              {currency} {amount.toFixed(2)}
            </span>
          </div>
          {registrationId && (
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm font-medium text-blue-700">Registration ID:</span>
              <span className="text-sm font-mono text-blue-600">{registrationId}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <span className="text-yellow-500 text-lg mr-2">⚠️</span>
            <div>
              <p className="text-yellow-800 font-medium">Payment Amount Not Available</p>
              <p className="text-yellow-700 text-sm mt-1">
                Please ensure you have selected a registration type or sponsorship option above.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* PayPal Buttons Container */}
      {(configLoading || !scriptLoaded) && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-gray-600">
            {configLoading ? 'Loading PayPal configuration...' : 'Loading PayPal...'}
          </span>
        </div>
      )}

      {/* PayPal Button Container with proper constraints */}
      <div className="paypal-button-wrapper relative w-full mb-6">
        <div
          id="paypal-button-container"
          className={`
            w-full
            min-h-[60px]
            max-w-full
            relative
            z-10
            ${!scriptLoaded ? 'hidden' : 'block'}
            ${disabled ? 'opacity-50 pointer-events-none' : ''}
          `}
          style={{
            maxWidth: '100%',
            overflow: 'hidden',
            position: 'relative',
            zIndex: 10
          }}
        />
      </div>

      {loading && (
        <div className="flex items-center justify-center mt-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-gray-600">Processing payment...</span>
        </div>
      )}

      {/* Security Notice */}
      <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center">
          <span className="text-green-500 text-xl mr-3">🔒</span>
          <div>
            <p className="text-sm font-medium text-green-800">Secure Payment</p>
            <p className="text-xs text-green-600">
              Your payment is processed securely by PayPal. Test mode - no real charges.
            </p>
          </div>
        </div>
      </div>

      {/* PayPal Features */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-center">
        <div className="p-3 bg-gray-50 rounded-lg">
          <span className="text-xl sm:text-2xl mb-2 block">🌍</span>
          <p className="text-xs font-medium text-gray-700">Global Payments</p>
          <p className="text-xs text-gray-500">Worldwide acceptance</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <span className="text-xl sm:text-2xl mb-2 block">⚡</span>
          <p className="text-xs font-medium text-gray-700">Instant Processing</p>
          <p className="text-xs text-gray-500">Quick confirmation</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg sm:col-span-2 lg:col-span-1">
          <span className="text-xl sm:text-2xl mb-2 block">🛡️</span>
          <p className="text-xs font-medium text-gray-700">Buyer Protection</p>
          <p className="text-xs text-gray-500">PayPal guarantee</p>
        </div>
      </div>
    </div>
  );
};

export default PayPalPaymentSection;
