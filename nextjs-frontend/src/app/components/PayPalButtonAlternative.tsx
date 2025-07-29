'use client';

import React, { useEffect, useRef, useState } from 'react';

interface PayPalButtonAlternativeProps {
  amount: number;
  currency?: string;
  registrationId: string;
  registrationData: any;
  onSuccess: (details: any) => void;
  onError: (error: any) => void;
  onCancel?: () => void;
}

const PayPalButtonAlternative: React.FC<PayPalButtonAlternativeProps> = ({
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
  const [loadAttempt, setLoadAttempt] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadPayPalWithRetry = async () => {
      const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'AUmI5g_PA8vHr0HSeZq7PukrblnMLeOLQbW60lNHoJGLAqTg3JZjAeracZmAh1WSuuqmZnUIJxLdzGXc';
      
      console.log(`🔧 PayPal load attempt ${loadAttempt + 1} for registration:`, registrationId);
      
      // Check if PayPal is already loaded
      if (window.paypal) {
        console.log('✅ PayPal SDK already available');
        renderPayPalButton();
        return;
      }

      // Try different SDK URLs in order of preference - PRODUCTION READY
      const sdkUrls = [
        `https://www.paypal.com/sdk/js?client-id=${clientId}&intent=capture&currency=${currency}&components=buttons&enable-funding=card,paylater,venmo`,
        `https://www.paypal.com/sdk/js?client-id=${clientId}&intent=capture&currency=${currency}&components=buttons`,
        `https://www.paypal.com/sdk/js?client-id=${clientId}&intent=capture&currency=${currency}`,
        `https://www.paypal.com/sdk/js?client-id=${clientId}&intent=capture`,
        `https://www.paypal.com/sdk/js?client-id=${clientId}`,
      ];

      const currentUrl = sdkUrls[Math.min(loadAttempt, sdkUrls.length - 1)];
      console.log('🔄 Trying PayPal SDK URL:', currentUrl);

      try {
        await loadScript(currentUrl);
        console.log('✅ PayPal SDK loaded successfully');
        renderPayPalButton();
      } catch (loadError) {
        console.error(`❌ Failed to load PayPal SDK (attempt ${loadAttempt + 1}):`, loadError);
        
        if (loadAttempt < 2) {
          console.log('🔄 Retrying with different URL...');
          setLoadAttempt(prev => prev + 1);
        } else {
          setError('Unable to load PayPal. Please check your internet connection and try again.');
          setIsLoading(false);
        }
      }
    };

    loadPayPalWithRetry();
  }, [loadAttempt, currency, registrationId]);

  const loadScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Remove any existing PayPal scripts
      const existingScripts = document.querySelectorAll('script[src*="paypal.com/sdk/js"]');
      existingScripts.forEach(script => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });

      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      
      const timeout = setTimeout(() => {
        reject(new Error('Script load timeout'));
      }, 15000); // 15 second timeout
      
      script.onload = () => {
        clearTimeout(timeout);
        resolve();
      };
      
      script.onerror = () => {
        clearTimeout(timeout);
        reject(new Error('Script load error'));
      };
      
      document.head.appendChild(script);
    });
  };

  const renderPayPalButton = async () => {
    if (!window.paypal || !containerRef.current) {
      console.error('❌ PayPal SDK or container not available');
      setError('PayPal initialization failed');
      setIsLoading(false);
      return;
    }

    console.log('🔄 Rendering PayPal button for amount:', amount);

    try {
      // Clear container
      containerRef.current.innerHTML = '';

      await window.paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'paypal',
          height: 50,
        },
        createOrder: function(_data: any, actions: any) {
          console.log('🔄 Creating PayPal order for amount:', amount);
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: amount.toFixed(2),
                currency_code: currency
              }
            }]
          });
        },
        onApprove: function(data: any, actions: any) {
          console.log('✅ Payment approved, capturing...');
          return actions.order.capture().then(function(details: any) {
            console.log('✅ Payment successful:', details);
            onSuccess({
              orderID: data.orderID,
              paymentID: details.id,
              details: details
            });
          });
        },
        onCancel: function(_data: any) {
          console.log('⚠️ Payment cancelled');
          if (onCancel) onCancel();
        },
        onError: function(err: any) {
          console.error('❌ PayPal error:', err);
          onError(err);
        }
      }).render(containerRef.current);

      console.log('✅ PayPal button rendered successfully');
      setIsLoading(false);
    } catch (err: any) {
      console.error('❌ Failed to render PayPal button:', err);
      setError('Failed to render PayPal button: ' + (err.message || 'Unknown error'));
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">
          Loading PayPal... {loadAttempt > 0 && `(Attempt ${loadAttempt + 1})`}
        </span>
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
            <div className="mt-3 space-x-2">
              <button
                onClick={() => {
                  setError(null);
                  setIsLoading(true);
                  setLoadAttempt(0);
                }}
                className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Retry
              </button>
              <button
                onClick={() => window.location.reload()}
                className="text-sm bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
              >
                Refresh Page
              </button>
            </div>
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
        ref={containerRef}
        className="min-h-[50px] w-full"
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

export default PayPalButtonAlternative;
