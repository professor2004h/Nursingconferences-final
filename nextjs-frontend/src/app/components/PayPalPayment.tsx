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
  const [paypalConfig, setPaypalConfig] = useState<ReturnType<typeof getClientPayPalConfig> | null>(null);
  const [configLoading, setConfigLoading] = useState(true);
  const paypalRef = useRef<HTMLDivElement | null>(null);

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
      } catch (err) {
        console.error('❌ Failed to load PayPal configuration:', err);
        setError('PayPal configuration error. Please contact support.');
      } finally {
        setConfigLoading(false);
      }
    }

    loadConfig();
  }, []);

  if (configLoading) {
    return <div>Loading PayPal configuration…</div>;
  }

  if (!paypalConfig || !paypalConfig.clientId) {
    return (
      <div>
        <h3>PayPal Configuration Error</h3>
        <p>PayPal payment system is currently unavailable. Please contact support or try again later.</p>
        {error && <pre>{error}</pre>}
      </div>
    );
  }

  // Dynamically load the PayPal SDK
  useEffect(() => {
    if (!paypalConfig || scriptLoaded) return;

    if (window.paypal) {
      setScriptLoaded(true);
      return;
    }

    console.log('🔄 Loading PayPal SDK with config:', {
      clientId: paypalConfig.clientId?.substring(0, 10) + '...',
      environment: paypalConfig.environment,
      currency
    });

    const script = document.createElement('script');
    // Simplified PayPal SDK URL for better compatibility
    script.src = `https://www.paypal.com/sdk/js?client-id=${paypalConfig.clientId}&currency=${currency}&intent=capture&components=buttons&enable-funding=card`;
    script.async = true;

    script.onload = () => {
      console.log('✅ PayPal SDK loaded successfully');
      setScriptLoaded(true);
    };

    script.onerror = (error) => {
      console.error('❌ Failed to load PayPal SDK:', error);
      setError('Failed to load PayPal SDK. Please check your internet connection and try again.');
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [paypalConfig, currency, scriptLoaded]);

  // Render the PayPal Buttons once the SDK is loaded
  useEffect(() => {
    if (!scriptLoaded || !window.paypal || !paypalRef.current || disabled) {
      return;
    }

    // Clear any existing buttons
    paypalRef.current.innerHTML = '';

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

        } catch (err) {
          const message = err instanceof Error ? err.message : 'Failed to create order';
          setError(message);
          onError(err);
          throw err;
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

        } catch (err) {
          const message = err instanceof Error ? err.message : 'Payment capture error';
          setError(message);
          onError(err);
        } finally {
          setLoading(false);
        }
      },

      onCancel: () => {
        setLoading(false);
        onCancel?.();
      },
      onError: (err: any) => {
        setLoading(false);
        setError('An unexpected PayPal error occurred.');
        onError(err);
      },

    }).render(paypalRef.current);
  }, [scriptLoaded, amount, currency, registrationId, registrationData, disabled, onSuccess, onError, onCancel]);

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Processing payment…</p>}
      <div ref={paypalRef} />
    </div>
  );
};

export default PayPalPayment;
