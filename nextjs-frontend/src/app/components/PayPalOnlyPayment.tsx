'use client';

import React, { useState } from 'react';

interface PayPalOnlyPaymentProps {
  amount: number;
  currency?: string;
  registrationId: string;
  registrationData: any;
  onSuccess: (paymentData: any) => void;
  onError: (error: any) => void;
  onCancel?: () => void;
  disabled?: boolean;
}

const PayPalOnlyPayment: React.FC<PayPalOnlyPaymentProps> = ({
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

  const handlePayPalPayment = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🎯 Creating PayPal order for:', { registrationId, amount, currency });

      // Create PayPal order
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

      // Find the approval URL from PayPal response
      const approvalUrl = data.order.links?.find((link: any) => link.rel === 'approve')?.href;
      
      if (!approvalUrl) {
        throw new Error('PayPal approval URL not found');
      }

      // Store order details for later verification
      sessionStorage.setItem('paypal_order_data', JSON.stringify({
        orderId: data.orderId,
        registrationId,
        amount,
        currency,
        registrationData,
      }));

      console.log('🔄 Redirecting to PayPal:', approvalUrl);

      // Redirect to PayPal for payment
      window.location.href = approvalUrl;

    } catch (error) {
      console.error('❌ Error creating PayPal order:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create order';
      setError(errorMessage);
      onError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="paypal-only-payment">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          💳 Complete Payment with PayPal
        </h3>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <span className="text-red-500 text-lg mr-2">⚠️</span>
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Payment Amount Display */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-blue-700">Total Amount:</span>
            <span className="text-2xl font-bold text-blue-900">
              {currency} {amount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm font-medium text-blue-700">Registration ID:</span>
            <span className="text-sm font-mono text-blue-600">{registrationId}</span>
          </div>
        </div>

        {/* PayPal Payment Button */}
        <button
          onClick={handlePayPalPayment}
          disabled={disabled || loading}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
            disabled || loading
              ? 'bg-gray-400 cursor-not-allowed text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
              Creating PayPal Order...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <span className="text-2xl mr-3">💳</span>
              Pay with PayPal
            </div>
          )}
        </button>

        {/* PayPal Info */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-3">
            <div className="bg-blue-600 text-white px-4 py-2 rounded-lg text-lg font-bold">
              PayPal
            </div>
            <span className="text-sm text-gray-600">Secure Payment Processing</span>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            You'll be redirected to PayPal to complete your payment securely
          </p>
          <p className="text-xs text-gray-500">
            After payment, you'll return here for confirmation
          </p>
        </div>

        {/* Security Notice */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-green-500 text-xl mr-3">🔒</span>
            <div>
              <p className="text-sm font-medium text-green-800">Secure Payment</p>
              <p className="text-xs text-green-600">
                Your payment is processed securely by PayPal. Test mode - no real charges.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Features */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-gray-50 rounded-lg">
            <span className="text-2xl mb-2 block">🌍</span>
            <p className="text-xs font-medium text-gray-700">Global Payments</p>
            <p className="text-xs text-gray-500">Worldwide acceptance</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <span className="text-2xl mb-2 block">⚡</span>
            <p className="text-xs font-medium text-gray-700">Instant Processing</p>
            <p className="text-xs text-gray-500">Quick confirmation</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <span className="text-2xl mb-2 block">🛡️</span>
            <p className="text-xs font-medium text-gray-700">Buyer Protection</p>
            <p className="text-xs text-gray-500">PayPal guarantee</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayPalOnlyPayment;
