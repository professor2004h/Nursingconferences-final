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
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const buttonsRef = useRef<any>(null); // To store PayPal buttons instance
  const isMounted = useRef(true); // To track component mount state

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
      // Cleanup PayPal buttons if they exist
      if (buttonsRef.current) {
        try {
          buttonsRef.current.close();
        } catch (e) {
          console.log('⚠️ Error closing PayPal buttons:', e);
        }
      }
    };
  }, []);

  // Load PayPal SDK
  useEffect(() => {
    if (!isMounted.current) return;
    
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'AUmI5g_PA8vHr0HSeZq7PukrblnMLeOLQbW60lNHoJGLAqTg3JZjAeracZmAh1WSuuqmZnUIJxLdzGXc';

    console.log('🔧 Loading PayPal SDK for registration:', registrationId);
    console.log('🔧 Using PayPal Client ID:', clientId.substring(0, 10) + '...');
    
    // Reset error state
    setError(null);
    setIsLoading(true);

    // Check if PayPal is already loaded
    if (window.paypal) {
      console.log('✅ PayPal SDK already loaded');
      setIsSDKLoaded(true);
      return;
    }

    // Remove any existing PayPal scripts to prevent conflicts
    const existingScripts = document.querySelectorAll('script[src*="paypal.com/sdk/js"]');
    existingScripts.forEach(script => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    });

    // Load PayPal SDK with simplified parameters
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&intent=capture&currency=${currency}`;
    script.async = true;

    script.onload = () => {
      console.log('✅ PayPal SDK loaded successfully');
      if (isMounted.current) {
        setIsSDKLoaded(true);
      }
    };

    script.onerror = (error) => {
      console.error('❌ Failed to load PayPal SDK:', error);
      console.error('❌ Script src:', script.src);
      if (isMounted.current) {
        setError('Failed to load PayPal. Please check your internet connection and refresh the page.');
        setIsLoading(false);
      }
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup script if component unmounts
      if (script.parentNode === document.head) {
        document.head.removeChild(script);
      }
    };
  }, [currency, registrationId]);

  // Render PayPal button when SDK is loaded and container is ready
  useEffect(() => {
    if (!isSDKLoaded || !window.paypal || !containerRef.current) {
      return;
    }

    console.log('🔄 Rendering PayPal button for amount:', amount);

    // Clear any existing content
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    const renderButton = async () => {
      try {
        // Check if component is still mounted and container exists
        if (!isMounted.current || !containerRef.current) {
          console.log('🛑 Component unmounted or container not available, skipping PayPal button render');
          return;
        }
        
        // Clear any existing buttons instance
        if (buttonsRef.current) {
          try {
            buttonsRef.current.close();
          } catch (e) {
            console.log('⚠️ Error closing previous PayPal buttons:', e);
          }
          buttonsRef.current = null;
        }
        
        // Clear container content
        containerRef.current.innerHTML = '';

        // Create and render PayPal buttons
        buttonsRef.current = window.paypal!.Buttons({
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
              // Redirect to return page
              window.location.href = `https://nursingeducationconferences.org/paypal/return?orderID=${data.orderID}&paymentID=${details.id}&amount=${amount}&currency=${currency}&registrationId=${registrationId}`;
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
        });
        
        if (isMounted.current && containerRef.current) {
          buttonsRef.current.render(containerRef.current);
        }

        if (isMounted.current) {
          console.log('✅ PayPal button rendered successfully');
          setIsLoading(false);
        }
      } catch (err: any) {
        console.error('❌ Failed to render PayPal button:', err);
        if (isMounted.current) {
          setError('Failed to render PayPal button: ' + (err.message || 'Unknown error'));
          setIsLoading(false);
        }
      }
    };

    renderButton();
  }, [isSDKLoaded, amount, currency, registrationId, onSuccess, onError, onCancel]);

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
        ref={containerRef}
        id={`paypal-container-${registrationId}`}
        className="min-h-[50px] w-full"
      >
        {isLoading && (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading PayPal...</span>
          </div>
        )}
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
