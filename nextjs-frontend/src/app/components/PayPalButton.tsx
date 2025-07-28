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
  const paypalRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const loadPayPalScript = async () => {
      // Check if PayPal client ID is available
      let clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

      if (!clientId || clientId === 'undefined') {
        console.warn('⚠️ PayPal Client ID not found in environment variables, fetching from API...');

        try {
          const response = await fetch('/api/paypal/client-config');
          const config = await response.json();

          if (config.success && config.clientId) {
            clientId = config.clientId;
            console.log('✅ PayPal Client ID fetched from API:', clientId.substring(0, 10) + '...');
          } else {
            throw new Error('Failed to get PayPal configuration from API');
          }
        } catch (error) {
          console.error('❌ Failed to fetch PayPal configuration:', error);
          setError('PayPal configuration error. Please contact support.');
          setIsLoading(false);
          return;
        }
      } else {
        console.log('🔧 PayPal Client ID found in environment:', clientId.substring(0, 10) + '...');
      }

      // Check if PayPal script is already loaded
      if (window.paypal) {
        setScriptLoaded(true);
        setIsLoading(false);
        renderPayPalButton();
        return;
      }

      // Check if script is already in DOM
      const existingScript = document.querySelector('script[src*="paypal.com/sdk/js"]');
      if (existingScript) {
        existingScript.addEventListener('load', () => {
          setScriptLoaded(true);
          setIsLoading(false);
          renderPayPalButton();
        });
        return;
      }

      // Load PayPal SDK script
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&intent=capture&currency=${currency}`;
      script.async = true;

      console.log('🔄 Loading PayPal SDK:', script.src);

      script.onload = () => {
        console.log('✅ PayPal SDK loaded successfully');
        setScriptLoaded(true);
        setIsLoading(false);
        renderPayPalButton();
      };

      script.onerror = () => {
        console.error('❌ Failed to load PayPal SDK');
        setError('Failed to load PayPal. Please refresh the page and try again.');
        setIsLoading(false);
      };

      document.head.appendChild(script);
    };

    const renderPayPalButton = () => {
      if (!window.paypal || !paypalRef.current) return;

      // Clear any existing buttons
      paypalRef.current.innerHTML = '';

      window.paypal.Buttons({
        // Set up the transaction when the buyer clicks the button
        createOrder: function (data: any, actions: any) {
          console.log('🔄 Creating PayPal order...', { amount, currency, registrationId });
          
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: amount.toFixed(2)
              },
              description: `Conference Registration - ${registrationId}`,
              custom_id: registrationId,
              invoice_id: `REG-${registrationId}-${Date.now()}`
            }]
          });
        },

        // Finalize the transaction after buyer approval
        onApprove: function (data: any, actions: any) {
          console.log('✅ PayPal payment approved:', data);
          
          return actions.order.capture().then(function (details: any) {
            console.log('✅ PayPal payment captured:', details);
            
            // Call success callback with payment details
            onSuccess({
              orderID: data.orderID,
              paymentID: details.id,
              payerID: details.payer.payer_id,
              amount: amount,
              currency: currency,
              registrationId: registrationId,
              details: details
            });

            // Redirect to return page
            window.location.href = `https://nursingeducationconferences.org/paypal/return?orderID=${data.orderID}&paymentID=${details.id}&amount=${amount}&currency=${currency}&registrationId=${registrationId}`;
          });
        },

        // Handle cancellations if the buyer backs out
        onCancel: function (data: any) {
          console.log('⚠️ PayPal payment cancelled:', data);
          if (onCancel) {
            onCancel();
          }
          window.location.href = 'https://nursingeducationconferences.org/paypal/cancel';
        },

        // Handle any errors
        onError: function (err: any) {
          console.error('❌ PayPal error:', err);
          setError('Payment failed. Please try again.');
          onError(err);
        },

        // Button styling
        style: {
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'paypal',
          height: 45
        }
      }).render(paypalRef.current);
    };

    loadPayPalScript().catch(error => {
      console.error('❌ Error loading PayPal script:', error);
      setError('Failed to load PayPal. Please refresh the page and try again.');
      setIsLoading(false);
    });
  }, [amount, currency, registrationId, onSuccess, onError, onCancel]);

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
      
      <div ref={paypalRef} id="paypal-button-container" className="min-h-[50px]">
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
