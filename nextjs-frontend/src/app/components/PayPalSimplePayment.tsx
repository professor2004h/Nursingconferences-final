'use client';

import React, { useState } from 'react';

interface PayPalSimplePaymentProps {
  amount: number;
  currency?: string;
  registrationId: string;
  registrationData: any;
  onSuccess: (paymentData: any) => void;
  onError: (error: any) => void;
  onCancel?: () => void;
  disabled?: boolean;
}

const PayPalSimplePayment: React.FC<PayPalSimplePaymentProps> = ({
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
      }));

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
    <div className="paypal-simple-payment">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <span className="text-red-500 text-lg mr-2">⚠️</span>
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* PayPal Payment Button */}
        <button
          onClick={handlePayPalPayment}
          disabled={disabled || loading}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            disabled || loading
              ? 'bg-gray-400 cursor-not-allowed text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Creating PayPal Order...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <span className="text-lg mr-2">💳</span>
              Pay with PayPal
            </div>
          )}
        </button>

        {/* PayPal Logo and Info */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-bold">
              PayPal
            </div>
            <span className="text-xs text-gray-500">Secure Payment</span>
          </div>
          <p className="text-xs text-gray-500">
            You'll be redirected to PayPal to complete your payment
          </p>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center">
            <span className="text-blue-500 text-lg mr-2">🔒</span>
            <div>
              <p className="text-sm font-medium text-blue-800">Secure Payment</p>
              <p className="text-xs text-blue-600">
                Your payment is processed securely by PayPal. Test mode - no real charges.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-gray-700">Amount:</span>
            <span className="font-bold text-gray-900">{currency} {amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-sm mt-1">
            <span className="font-medium text-gray-700">Registration ID:</span>
            <span className="font-mono text-xs text-gray-600">{registrationId}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayPalSimplePayment;
