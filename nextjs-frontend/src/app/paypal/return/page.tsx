'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const PayPalReturnPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [processing, setProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processPayPalReturn = async () => {
      try {
        // Get PayPal parameters from URL
        const paymentId = searchParams.get('paymentId');
        const token = searchParams.get('token');
        const payerId = searchParams.get('PayerID');

        console.log('🔄 Processing PayPal return:', { paymentId, token, payerId });

        // Get stored order data
        const storedData = sessionStorage.getItem('paypal_order_data');
        if (!storedData) {
          throw new Error('Order data not found. Please try again.');
        }

        const orderData = JSON.parse(storedData);
        console.log('📦 Retrieved order data:', orderData);

        // Validate that we have the order ID (token should match)
        if (token && token !== orderData.orderId) {
          console.warn('⚠️ Token mismatch, using token from URL:', token);
          orderData.orderId = token;
        }

        // Capture the payment
        console.log('💰 Capturing PayPal payment...');
        const response = await fetch('/api/paypal/capture-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId: orderData.orderId,
            registrationId: orderData.registrationId,
          }),
        });

        const captureData = await response.json();

        if (!response.ok || !captureData.success) {
          throw new Error(captureData.error || 'Failed to capture PayPal payment');
        }

        console.log('✅ PayPal payment captured successfully:', captureData.paymentId);

        // Clear stored data
        sessionStorage.removeItem('paypal_order_data');

        // Redirect to success page with payment details
        const successUrl = `/registration/success?` +
          `registration_id=${captureData.registrationId}&` +
          `payment_id=${captureData.paymentId}&` +
          `order_id=${orderData.orderId}&` +
          `amount=${captureData.amount}&` +
          `currency=${captureData.currency}&` +
          `payment_method=paypal&` +
          `status=completed&` +
          `test_mode=true`;

        router.push(successUrl);

      } catch (error) {
        console.error('❌ Error processing PayPal return:', error);
        setError(error instanceof Error ? error.message : 'Payment processing failed');
        setProcessing(false);
      }
    };

    processPayPalReturn();
  }, [searchParams, router]);

  if (processing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Processing Payment</h1>
          <p className="text-gray-600 mb-4">
            Please wait while we confirm your PayPal payment...
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              🔒 Your payment is being securely processed by PayPal
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Processing Failed</h1>
          <p className="text-gray-600 mb-6">
            {error}
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => router.push('/registration')}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Try Again
            </button>
            
            <button
              onClick={() => router.push('/contact')}
              className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Contact Support
            </button>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              💡 Your registration may have been saved. Please contact support if you need assistance.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PayPalReturnPage;
