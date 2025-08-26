'use client';

import React, { useState, useEffect } from 'react';

/**
 * Razorpay Payment Button Component
 * Integrates with Razorpay payment gateway for conference registration payments
 */

interface RazorpayButtonProps {
  amount: number;
  currency: string;
  registrationId: string;
  registrationData: any;
  onSuccess: (paymentData: any) => void;
  onError: (error: any) => void;
  onCancel?: () => void;
  disabled?: boolean;
  className?: string;
}

// Extend Window interface to include Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

const RazorpayButton: React.FC<RazorpayButtonProps> = ({
  amount,
  currency,
  registrationId,
  registrationData,
  onSuccess,
  onError,
  onCancel,
  disabled = false,
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  console.log('🔷 RazorpayButton component mounted/re-rendered');

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        console.log('🔷 Checking Razorpay script loading...');

        // Check if script is already loaded
        if (window.Razorpay) {
          console.log('✅ Razorpay script already loaded');
          setIsScriptLoaded(true);
          resolve(true);
          return;
        }

        // Check if script is already being loaded
        const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
        if (existingScript) {
          console.log('🔷 Razorpay script already exists, waiting for load...');

          // Wait for existing script to load
          const checkRazorpay = () => {
            if (window.Razorpay) {
              console.log('✅ Razorpay loaded from existing script');
              setIsScriptLoaded(true);
              resolve(true);
            } else {
              setTimeout(checkRazorpay, 100);
            }
          };
          checkRazorpay();
          return;
        }

        // Create script element dynamically (official React pattern)
        console.log('🔷 Creating new Razorpay script element...');
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;

        script.onload = () => {
          console.log('✅ Razorpay script loaded successfully');
          if (window.Razorpay) {
            console.log('✅ window.Razorpay is available:', typeof window.Razorpay);
            setIsScriptLoaded(true);
            resolve(true);
          } else {
            console.error('❌ Razorpay object not available after script load');
            setIsScriptLoaded(false);
            resolve(false);
          }
        };

        script.onerror = () => {
          console.error('❌ Failed to load Razorpay script');
          setIsScriptLoaded(false);
          resolve(false);
        };

        // Append to head instead of body for better loading
        document.head.appendChild(script);
        console.log('🔷 Razorpay script element added to head');
      });
    };

    loadRazorpayScript();
  }, []);

  const handlePayment = async () => {
    console.log('🔷 handlePayment called');
    console.log('🔷 isScriptLoaded:', isScriptLoaded);
    console.log('🔷 window.Razorpay:', typeof window.Razorpay);

    if (!isScriptLoaded) {
      console.error('❌ Razorpay script not loaded');
      onError(new Error('Razorpay script not loaded. Please try again.'));
      return;
    }

    if (!window.Razorpay) {
      console.error('❌ Razorpay not available on window object');
      onError(new Error('Razorpay payment system not available. Please try again.'));
      return;
    }

    setIsLoading(true);

    try {
      console.log('🔷 Creating Razorpay order...');

      // Create order with backend API
      const orderResponse = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          registrationId,
          customerEmail: registrationData.email,
          customerName: `${registrationData.title || 'Dr.'} ${registrationData.firstName} ${registrationData.lastName}`.trim()
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.error || 'Failed to create payment order');
      }

      const orderData = await orderResponse.json();
      console.log('✅ Razorpay order created:', orderData.order.id);

      // Configure Razorpay options using official format
      const options = {
        key: orderData.razorpayKeyId, // API Key ID from Dashboard
        amount: orderData.order.amount, // Amount in currency subunits
        currency: orderData.order.currency,
        name: 'International Nursing Conference 2025',
        description: 'Conference Registration Payment',
        image: '/logo.png', // Business logo
        order_id: orderData.order.id, // Order ID from backend
        handler: async function (response: any) {
          console.log('🔷 Razorpay payment successful:', response);
          
          try {
            // Verify payment with backend
            const verifyResponse = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                registrationId,
                amount,
                currency
              }),
            });

            if (!verifyResponse.ok) {
              const errorData = await verifyResponse.json();
              throw new Error(errorData.error || 'Payment verification failed');
            }

            const verifyData = await verifyResponse.json();
            console.log('✅ Razorpay payment verified successfully');

            // Call success callback with payment data
            onSuccess({
              transactionId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              amount: amount,
              currency: currency,
              registrationId: registrationId,
              paymentMethod: 'razorpay',
              paymentData: {
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
                capturedAt: new Date().toISOString()
              }
            });

          } catch (verifyError) {
            console.error('❌ Payment verification failed:', verifyError);
            onError(verifyError);
          }
        },
        prefill: {
          name: `${registrationData.title || 'Dr.'} ${registrationData.firstName} ${registrationData.lastName}`.trim(),
          email: registrationData.email,
          contact: registrationData.phoneNumber
        },
        notes: {
          registrationId: registrationId,
          purpose: 'Conference Registration'
        },
        theme: {
          color: '#1e40af' // Blue theme to match the website
        },
        modal: {
          ondismiss: function() {
            console.log('🔷 Razorpay payment cancelled by user');
            setIsLoading(false);
            if (onCancel) {
              onCancel();
            }
          }
        }
      };

      // Open Razorpay checkout
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('❌ Razorpay payment initiation failed:', error);
      setIsLoading(false);
      onError(error);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Razorpay Button - Styled to match PayPal button appearance */}
      <div className="w-full">
        <button
          id="rzp-button1"
          onClick={handlePayment}
          disabled={disabled || isLoading || !isScriptLoaded}
          className="w-full bg-blue-600 text-white font-medium rounded-md transition-all duration-200 ease-in-out hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm sm:text-base"
          style={{
            height: '45px', // Match PayPal button height exactly
            fontSize: '16px',
            fontWeight: '500',
            letterSpacing: '0.025em',
            border: 'none',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            minHeight: '45px', // Ensure consistent height on all devices
          }}
        >
          <div className="flex items-center justify-center gap-2 h-full">
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span className="text-sm sm:text-base font-medium">Processing Payment...</span>
              </>
            ) : !isScriptLoaded ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span className="text-sm sm:text-base font-medium">Loading Razorpay...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span className="text-sm sm:text-base font-medium">Pay with Razorpay</span>
              </>
            )}
          </div>
        </button>

        {/* Security notice to match PayPal styling */}
        <div className="mt-2 text-center">
          <p className="text-xs text-gray-500">
            Secure payment powered by Razorpay
          </p>
        </div>
      </div>
    </div>
  );
};

export default RazorpayButton;
