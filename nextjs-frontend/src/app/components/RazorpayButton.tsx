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

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        // Check if script is already loaded
        if (window.Razorpay) {
          setIsScriptLoaded(true);
          resolve(true);
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          setIsScriptLoaded(true);
          resolve(true);
        };
        script.onerror = () => {
          console.error('❌ Failed to load Razorpay script');
          resolve(false);
        };
        document.body.appendChild(script);
      });
    };

    loadRazorpayScript();
  }, []);

  const handlePayment = async () => {
    if (!isScriptLoaded) {
      console.error('❌ Razorpay script not loaded');
      onError(new Error('Razorpay script not loaded. Please try again.'));
      return;
    }

    if (!window.Razorpay) {
      console.error('❌ Razorpay not available');
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

      // Configure Razorpay options
      const options = {
        key: orderData.razorpayKeyId,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'International Nursing Conference 2025',
        description: 'Conference Registration Payment',
        image: '/logo.png', // Add your logo here
        order_id: orderData.order.id,
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
    <button
      onClick={handlePayment}
      disabled={disabled || isLoading || !isScriptLoaded}
      className={`
        w-full bg-blue-600 text-white py-3 px-6 rounded-md font-semibold 
        hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed 
        transition-colors flex items-center justify-center gap-2
        ${className}
      `}
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          Processing Payment...
        </>
      ) : !isScriptLoaded ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          Loading Razorpay...
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          Pay with Razorpay
        </>
      )}
    </button>
  );
};

export default RazorpayButton;
