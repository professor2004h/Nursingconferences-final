'use client';

import React, { useState, useEffect, useRef } from 'react';
import { getClientPayPalConfig } from '@/app/utils/clientPaypalConfig';

interface PayPalPaymentProps {
  amount: number;
  currency?: string;
  registrationId: string;
  registrationData: any;
  onSuccess: (paymentData: any) => void;
  onError: (error: any) => void;
  onCancel?: () => void;
  disabled?: boolean;
}

// Declare PayPal types
declare global {
  interface Window {
    paypal?: any;
  }
}

const PayPalPayment: React.FC<PayPalPaymentProps> = ({
  amount,
  currency = 'USD',
  registrationId,
  registrationData,
  onSuccess,
  onError,
  onCancel,
  disabled = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [paypalConfig, setPaypalConfig] = useState<any>(null);
  const [configLoading, setConfigLoading] = useState(true);
  const paypalRef = useRef<HTMLDivElement>(null);

  // Load PayPal configuration
  useEffect(() => {
    async function loadConfig() {
      try {
        setConfigLoading(true);
        console.log('🔍 Loading PayPal configuration...');

        const config = await getClientPayPalConfig();
        setPaypalConfig(config);

        console.log('✅ PayPal configuration loaded:', {
          clientIdLength: config.clientId?.length,
          environment: config.environment,
          isConfigured: config.isConfigured
        });
      } catch (error) {
        console.error('❌ Failed to load PayPal configuration:', error);
        setError('PayPal configuration error. Please contact support.');
      } finally {
        setConfigLoading(false);
      }
    }

    loadConfig();
  }, []);

  // Show loading state while configuration is loading
  if (configLoading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-600 text-sm">Loading PayPal configuration...</p>
      </div>
    );
  }

  // Enhanced error handling with more detailed information
  if (!paypalConfig || !paypalConfig.clientId) {
    console.error('❌ PayPal Client Configuration Error:', {
      paypalConfig,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    });

    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center mb-2">
          <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="text-red-800 font-semibold">PayPal Configuration Error</h3>
        </div>
        <p className="text-red-600 text-sm mb-2">
          PayPal payment system is currently unavailable. Please contact support or try again later.
        </p>
        <p className="text-red-500 text-xs">
          Error: Missing PayPal client configuration
        </p>
      </div>
    );
  }

  // Load PayPal SDK
  useEffect(() => {
    if (configLoading || !paypalConfig) {
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
      // Cleanup script if component unmounts
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [paypalConfig, currency, configLoading]);

  // Initialize PayPal buttons when script is loaded
  useEffect(() => {
    if (!scriptLoaded || !window.paypal || !paypalRef.current || disabled || !paypalConfig) {
      return;
    }

    // Clear any existing PayPal buttons
    if (paypalRef.current) {
      paypalRef.current.innerHTML = '';
    }

    // Initialize PayPal buttons
    window.paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'blue',
        shape: 'rect',
        label: 'paypal',
        height: 45,
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
        }
      },

      onApprove: async (data: any) => {
        try {
          setLoading(true);
          setError(null);

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

          const captureData = await response.json();

          if (!response.ok || !captureData.success) {
            throw new Error(captureData.error || 'Failed to capture PayPal payment');
          }

          console.log('✅ PayPal payment captured successfully:', captureData.paymentId);

          // Call success callback with payment data
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
        console.error('❌ PayPal payment error:', error);
        setError('Payment failed. Please try again.');
        setLoading(false);
        onError(error);
      },

      onCancel: () => {
        console.log('⚠️ PayPal payment cancelled by user');
        setError(null);
        setLoading(false);
        if (onCancel) {
          onCancel();
        }
      }

    }).render(paypalRef.current);

  }, [scriptLoaded, disabled, amount, currency, registrationId, registrationData, onSuccess, onError, onCancel, paypalConfig]);

  return (
    <div className="paypal-payment-container">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <span className="text-red-500 text-lg mr-2">⚠️</span>
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      {!scriptLoaded && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-gray-600">Loading PayPal...</span>
        </div>
      )}

      <div
        ref={paypalRef}
        className={`paypal-buttons-container ${disabled ? 'opacity-50 pointer-events-none' : ''} ${!scriptLoaded ? 'hidden' : ''}`}
      />

      {loading && (
        <div className="flex items-center justify-center mt-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-gray-600">Processing payment...</span>
        </div>
      )}

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          💳 Secure payment powered by PayPal
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Test mode - No real money will be charged
        </p>
      </div>
    </div>
  );
};

export default PayPalPayment;
