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
  const scriptRef = useRef<HTMLScriptElement | null>(null); // To track the script element
  const renderedRef = useRef(false);

  // Refs for callback functions to prevent stale closures
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  const onCancelRef = useRef(onCancel);

  // Update refs when props change
  onSuccessRef.current = onSuccess;
  onErrorRef.current = onError;
  onCancelRef.current = onCancel;

  // Safe DOM element removal function
  const safeRemoveElement = (element: Element | null) => {
    if (!element) return false;

    try {
      // Check if element exists and has a parent
      if (element.parentNode && element.parentNode.contains(element)) {
        element.parentNode.removeChild(element);
        return true;
      }
    } catch (error) {
      console.warn('⚠️ Safe removal warning:', error);
    }
    return false;
  };

  // Safe script cleanup function
  const cleanupPayPalScripts = () => {
    try {
      // Remove our tracked script first
      if (scriptRef.current) {
        safeRemoveElement(scriptRef.current);
        scriptRef.current = null;
      }

      // Remove any other PayPal scripts safely
      const existingScripts = document.querySelectorAll('script[src*="paypal.com/sdk/js"]');
      existingScripts.forEach(script => {
        safeRemoveElement(script);
      });
    } catch (error) {
      console.warn('⚠️ Script cleanup warning:', error);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;

      // Cleanup PayPal buttons if they exist
      if (buttonsRef.current) {
        try {
          if (typeof buttonsRef.current.close === 'function') {
            buttonsRef.current.close();
          }
        } catch (e: unknown) {
          console.warn('⚠️ PayPal buttons cleanup warning:', e);
        }
        buttonsRef.current = null;
      }

      // Cleanup scripts safely
      cleanupPayPalScripts();
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
      if (isMounted.current) {
        setIsSDKLoaded(true);
      }
      return;
    }

    // Clean up any existing scripts safely
    cleanupPayPalScripts();

    // Load PayPal SDK with minimal parameters for better compatibility
    const script = document.createElement('script');
    const environment = process.env.PAYPAL_ENVIRONMENT || 'production';
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&intent=capture&currency=${currency}&components=buttons`;
    script.async = true;

    console.log('🔧 PayPal Environment:', environment);
    console.log('🔧 PayPal SDK URL:', script.src);

    // Store reference to the script
    scriptRef.current = script;

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

    // Safely append script to head
    try {
      document.head.appendChild(script);
    } catch (error) {
      console.error('❌ Failed to append PayPal script:', error);
      if (isMounted.current) {
        setError('Failed to initialize PayPal. Please refresh the page.');
        setIsLoading(false);
      }
    }

    return () => {
      // Cleanup script safely when effect cleans up
      if (scriptRef.current) {
        safeRemoveElement(scriptRef.current);
        scriptRef.current = null;
      }
    };
  }, [currency, registrationId]);

  // Render PayPal button when SDK is loaded and container is ready
  useEffect(() => {
    if (!isSDKLoaded || !window.paypal || !containerRef.current) {
      return;
    }

    console.log('🔄 Rendering PayPal button for amount:', amount);

    // Add timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      if (isLoading) {
        console.warn('⚠️ PayPal button loading timeout - forcing completion');
        setIsLoading(false);
        setError('PayPal button took too long to load. Please refresh the page.');
      }
    }, 15000); // 15 second timeout

    const renderButton = async () => {
      try {
        // Check if already rendered
        if (renderedRef.current) {
          console.log('🛑 Skipping render - button already rendered');
          return;
        }

        // Validate prerequisites
        if (!window.paypal) {
          throw new Error('PayPal SDK not available');
        }

        if (!containerRef.current) {
          throw new Error('PayPal container not available');
        }

        console.log('🎯 Starting PayPal button render process...');
        renderedRef.current = true;

        // Close existing button if any
        if (buttonsRef.current) {
          try {
            await buttonsRef.current.close();
          } catch (e: unknown) {
            console.warn('⚠️ Error closing previous PayPal buttons:', e);
          }
          buttonsRef.current = null;
        }

        // Create new buttons instance
        buttonsRef.current = window.paypal!.Buttons({
          style: {
            layout: 'vertical',
            color: 'blue',
            shape: 'rect',
            label: 'paypal',
            height: 50,
          },
          createOrder: async function(_data, _actions) {
            try {
              console.log('🔄 Creating server-side PayPal order for amount:', amount);

              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

              const response = await fetch('/api/paypal/create-order', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  amount: amount.toFixed(2),
                  currency,
                  registrationId,
                  registrationData,
                }),
                signal: controller.signal,
              });

              clearTimeout(timeoutId);

              if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server error: ${response.status} - ${errorText}`);
              }

              const orderData = await response.json();
              if (orderData.success && orderData.orderId) {
                console.log('✅ Server-side order created:', orderData.orderId);
                return orderData.orderId;
              } else {
                throw new Error(orderData.error || 'Failed to create order');
              }
            } catch (error: unknown) {
              console.error('❌ Order creation error:', error);
              if (error instanceof Error && error.name === 'AbortError') {
                throw new Error('Order creation timeout - please try again');
              }
              throw error;
            }
          },
          onApprove: async function(data, _actions) {
            try {
              console.log('✅ Payment approved, capturing server-side...');

              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

              const response = await fetch('/api/paypal/capture-order', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  orderId: data.orderID,
                  registrationId,
                }),
                signal: controller.signal,
              });

              clearTimeout(timeoutId);

              if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server error: ${response.status} - ${errorText}`);
              }

              const captureData = await response.json();

              // Check for recoverable errors
              const errorDetail = Array.isArray(captureData.details) ? captureData.details[0] : null;
              if (errorDetail && errorDetail.issue === 'INSTRUMENT_DECLINED') {
                console.log('⚠️ Instrument declined - please try a different payment method');
                throw new Error('Payment method declined. Please try a different payment method.');
              }

              if (captureData.success) {
                console.log('✅ Payment captured successfully:', captureData);
                onSuccessRef.current({
                  orderID: data.orderID,
                  paymentID: captureData.paymentId,
                  details: captureData,
                });
                // Redirect to return page
                const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://nursingeducationconferences.org';
                window.location.href = `${baseUrl}/paypal/return?orderID=${data.orderID}&paymentID=${captureData.paymentId}&amount=${captureData.amount}&currency=${captureData.currency}&registrationId=${registrationId}`;
              } else {
                let msg = captureData.error || 'Failed to capture payment';
                if (errorDetail) {
                  msg += `\nDetails: ${errorDetail.description || ''}`;
                }
                throw new Error(msg);
              }
            } catch (error: unknown) {
              console.error('❌ Payment capture error:', error);
              if (error instanceof Error && error.name === 'AbortError') {
                throw new Error('Payment capture timeout - please try again');
              }
              onError(error);
              throw error;
            }
          },
          onCancel: function(_data: any) {
            console.log('⚠️ Payment cancelled');
            if (onCancelRef.current) onCancelRef.current();
          },
          onError: function(err: any) {
            console.error('❌ PayPal error:', err);
            onErrorRef.current(err);
          }
        });

        // Render the button
        if (containerRef.current && buttonsRef.current) {
          console.log('🎯 Rendering PayPal button to container...');
          await buttonsRef.current.render(containerRef.current);
          console.log('✅ PayPal button rendered successfully');
          clearTimeout(loadingTimeout);
          setIsLoading(false);
        } else {
          throw new Error('Container or buttons instance not available for rendering');
        }
      } catch (renderError) {
        console.error('❌ PayPal button render error:', renderError);
        console.error('❌ Error details:', {
          hasWindow: typeof window !== 'undefined',
          hasPayPal: !!window.paypal,
          hasContainer: !!containerRef.current,
          isSDKLoaded,
          amount,
          currency,
          registrationId
        });
        clearTimeout(loadingTimeout);
        setError(`Failed to display PayPal button: ${renderError instanceof Error ? renderError.message : 'Unknown error'}`);
        setIsLoading(false);
        renderedRef.current = false;
      }
    };

    renderButton();

    return () => {
      clearTimeout(loadingTimeout);
      renderedRef.current = false;
      if (buttonsRef.current) {
        const btn = buttonsRef.current;
        buttonsRef.current = null;
        return btn.close().catch((e: unknown) => {
          console.warn('⚠️ Error closing PayPal buttons:', e);
        });
      }
    };
  }, [isSDKLoaded, amount, currency, registrationId]);

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
      
      <div className="relative min-h-[50px] w-full">
        <div
          ref={containerRef}
          id={`paypal-container-${registrationId}`}
          className="w-full"
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80">
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
