'use client';

import React, { useEffect, useRef, useState } from 'react';

interface PayPalButtonProps {
  amount: number;
  currency?: string;
  registrationId: string;
  registrationData: any;
  onSuccess: (details: any) => void;
  onError: (error: any) => void;
  onCancel?: () => void;
}

const PayPalButton: React.FC<PayPalButtonProps> = ({
  amount,
  currency = 'USD',
  registrationId,
  registrationData,
  onSuccess,
  onError,
  onCancel
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simple script loading without complex state management
    const loadPayPalAndRender = () => {
      const clientId = 'AUmI5g_PA8vHr0HSeZq7PukrblnMLeOLQbW60lNHoJGLAqTg3JZjAeracZmAh1WSuuqmZnUIJxLdzGXc';

      console.log('🔧 Loading PayPal for registration:', registrationId);

      // If PayPal is already loaded, render immediately
      if (window.paypal) {
        console.log('✅ PayPal already loaded, rendering button...');
        renderButton();
        return;
      }

      // Load PayPal SDK
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&intent=capture`;
      script.onload = () => {
        console.log('✅ PayPal SDK loaded, rendering button...');
        renderButton();
      };
      script.onerror = () => {
        console.error('❌ Failed to load PayPal SDK');
        setError('Failed to load PayPal. Please refresh the page.');
        setIsLoading(false);
      };
      document.head.appendChild(script);
    };

    const renderButton = () => {
      if (!window.paypal) {
        console.error('❌ PayPal not available');
        setError('PayPal not loaded');
        setIsLoading(false);
        return;
      }

      const container = document.getElementById(`paypal-container-${registrationId}`);
      if (!container) {
        console.error('❌ PayPal container not found');
        setError('PayPal container not found');
        setIsLoading(false);
        return;
      }

      console.log('🔄 Rendering PayPal button for amount:', amount);

      window.paypal.Buttons({
        createOrder: function(data: any, actions: any) {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: amount.toFixed(2)
              }
            }]
          });
        },
        onApprove: function(data: any, actions: any) {
          return actions.order.capture().then(function(details: any) {
            console.log('✅ Payment successful:', details);
            onSuccess({
              orderID: data.orderID,
              paymentID: details.id,
              details: details
            });
            // Redirect to return page
            window.location.href = `https://nursingeducationconferences.org/paypal/return?orderID=${data.orderID}&paymentID=${details.id}&amount=${amount}&currency=${currency}&registrationId=${registrationId}`;
          });
        },
        onCancel: function(data: any) {
          console.log('⚠️ Payment cancelled');
          if (onCancel) onCancel();
        },
        onError: function(err: any) {
          console.error('❌ PayPal error:', err);
          onError(err);
        }
      }).render(container).then(() => {
        console.log('✅ PayPal button rendered successfully');
        setIsLoading(false);
      }).catch((err: any) => {
        console.error('❌ Failed to render PayPal button:', err);
        setError('Failed to render PayPal button');
        setIsLoading(false);
      });
    };

    loadPayPalAndRender();
  }, [amount, registrationId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading PayPal...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <div className="text-red-400 text-xl mr-3">❌</div>
          <div>
            <h3 className="text-sm font-medium text-red-800">Payment Error</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center">
          <div className="text-blue-500 text-xl mr-3">💳</div>
          <div>
            <h3 className="text-sm font-medium text-blue-900">Secure Payment</h3>
            <p className="text-sm text-blue-700">
              Pay securely with PayPal - {currency} {amount.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
      
      <div
        id={`paypal-container-${registrationId}`}
        className="min-h-[50px]"
      >
        {/* PayPal button will be rendered here */}
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          🔒 Secure payment powered by PayPal
        </p>
      </div>
    </div>
  );
};

export default PayPalButton;
