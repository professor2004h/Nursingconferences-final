'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const PayPalReturnPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [processing, setProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    const processPayPalReturn = async () => {
      try {
        // Get PayPal parameters from URL
        const paymentId = searchParams.get('paymentId');
        const token = searchParams.get('token');
        const payerId = searchParams.get('PayerID');
        const txnId = searchParams.get('tx'); // Classic PayPal transaction ID
        const amount = searchParams.get('amt'); // Classic PayPal amount
        const currency = searchParams.get('cc'); // Classic PayPal currency
        const status = searchParams.get('st'); // Classic PayPal status

        console.log('🔄 Processing PayPal return:', {
          paymentId, token, payerId, txnId, amount, currency, status
        });

        // Check if this is a classic PayPal Auto Return (has tx parameter)
        if (txnId) {
          console.log('📧 Classic PayPal Auto Return detected');

          // For classic PayPal, we show confirmation immediately
          // as the payment has already been processed by PayPal
          setPaymentDetails({
            transactionId: txnId,
            amount: amount || 'N/A',
            currency: currency || 'USD',
            status: status || 'Completed',
            paymentMethod: 'PayPal Classic',
            timestamp: new Date().toISOString()
          });

          setPaymentConfirmed(true);
          setProcessing(false);
          return;
        }

        // Modern PayPal SDK flow (existing logic)
        const storedData = sessionStorage.getItem('paypal_order_data');
        if (!storedData) {
          // If no stored data but we have token/payerId, show basic confirmation
          if (token && payerId) {
            setPaymentDetails({
              orderId: token,
              payerId: payerId,
              status: 'Completed',
              paymentMethod: 'PayPal',
              timestamp: new Date().toISOString()
            });
            setPaymentConfirmed(true);
            setProcessing(false);
            return;
          }
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

        // Set payment details for confirmation display
        setPaymentDetails({
          registrationId: captureData.registrationId,
          paymentId: captureData.paymentId,
          orderId: orderData.orderId,
          amount: captureData.amount,
          currency: captureData.currency,
          status: 'Completed',
          paymentMethod: 'PayPal',
          timestamp: new Date().toISOString()
        });

        setPaymentConfirmed(true);
        setProcessing(false);

      } catch (error) {
        console.error('❌ Error processing PayPal return:', error);
        setError(error instanceof Error ? error.message : 'Payment processing failed');
        setProcessing(false);
      }
    };

    processPayPalReturn();
  }, [searchParams, router]);

  // PayPal-compliant confirmation page
  if (paymentConfirmed && paymentDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="text-green-500 text-6xl mb-4">✅</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Completed Successfully!</h1>
            <p className="text-lg text-gray-600">
              Thank you for your conference registration payment.
            </p>
          </div>

          {/* PayPal Required Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <div className="flex items-start">
              <div className="text-blue-500 text-2xl mr-3">📧</div>
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Payment Confirmation</h3>
                <p className="text-blue-800 mb-2">
                  <strong>Your payment has been completed and a receipt has been emailed to you by PayPal.</strong>
                </p>
                <p className="text-sm text-blue-700">
                  Please check your email (including spam folder) for the PayPal receipt and our conference confirmation.
                </p>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {paymentDetails.transactionId && (
                <div>
                  <span className="font-medium text-gray-700">Transaction ID:</span>
                  <span className="ml-2 text-gray-900 font-mono">{paymentDetails.transactionId}</span>
                </div>
              )}
              {paymentDetails.paymentId && (
                <div>
                  <span className="font-medium text-gray-700">Payment ID:</span>
                  <span className="ml-2 text-gray-900 font-mono">{paymentDetails.paymentId}</span>
                </div>
              )}
              {paymentDetails.registrationId && (
                <div>
                  <span className="font-medium text-gray-700">Registration ID:</span>
                  <span className="ml-2 text-gray-900 font-mono">{paymentDetails.registrationId}</span>
                </div>
              )}
              <div>
                <span className="font-medium text-gray-700">Amount:</span>
                <span className="ml-2 text-gray-900">{paymentDetails.currency} {paymentDetails.amount}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Payment Method:</span>
                <span className="ml-2 text-gray-900">{paymentDetails.paymentMethod}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Status:</span>
                <span className="ml-2 text-green-600 font-medium">{paymentDetails.status}</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-green-900 mb-3">What's Next?</h3>
            <ul className="text-sm text-green-800 space-y-2">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                You will receive a detailed conference confirmation email within 24 hours
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                Conference materials and schedule will be sent closer to the event date
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                If you have any questions, please contact our support team
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Return to Home
            </button>
            <button
              onClick={() => router.push('/contact')}
              className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Contact Support
            </button>
          </div>

          {/* Footer Note */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              International Nursing Conference 2025 • Secure payment processed by PayPal
            </p>
          </div>
        </div>
      </div>
    );
  }

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
