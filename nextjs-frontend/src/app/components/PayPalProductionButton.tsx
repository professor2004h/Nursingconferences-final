'use client';

import React, { useState } from 'react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { 
  paypalSDKOptions, 
  paypalButtonStyle, 
  paypalErrorMessages, 
  paypalSuccessMessages,
  validatePayPalConfig 
} from '@/app/utils/paypalProductionConfig';

interface PayPalProductionButtonProps {
  amount: number;
  currency?: string;
  registrationId: string;
  registrationData: any;
  onSuccess: (paymentData: any) => void;
  onError: (error: any) => void;
  onCancel: () => void;
  disabled?: boolean;
}

interface PaymentStatus {
  status: 'idle' | 'processing' | 'success' | 'error' | 'cancelled';
  message: string;
  transactionId?: string;
  orderId?: string;
}

export default function PayPalProductionButton({
  amount,
  currency = 'USD',
  registrationId,
  registrationData,
  onSuccess,
  onError,
  onCancel,
  disabled = false,
}: PayPalProductionButtonProps) {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({
    status: 'idle',
    message: '',
  });

  // Validate PayPal configuration on component mount
  React.useEffect(() => {
    if (!validatePayPalConfig()) {
      setPaymentStatus({
        status: 'error',
        message: paypalErrorMessages.CONFIGURATION_ERROR,
      });
    }
  }, []);

  // Validate amount
  if (amount <= 0) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <span className="text-red-500 text-lg mr-2">⚠️</span>
          <div>
            <h3 className="text-red-800 font-medium">Invalid Payment Amount</h3>
            <p className="text-red-700 text-sm">
              Please select a registration type or sponsorship option to proceed with payment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Create PayPal order
  const createOrder = async () => {
    try {
      setPaymentStatus({ status: 'processing', message: 'Creating payment order...' });

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
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create PayPal order');
      }

      console.log('✅ PayPal order created:', data.orderId);
      return data.orderId;
    } catch (error) {
      console.error('❌ Error creating PayPal order:', error);
      setPaymentStatus({
        status: 'error',
        message: paypalErrorMessages.NETWORK_ERROR,
      });
      throw error;
    }
  };

  // Capture PayPal payment
  const onApprove = async (data: any) => {
    try {
      setPaymentStatus({ 
        status: 'processing', 
        message: 'Processing payment...',
        orderId: data.orderID 
      });

      const response = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: data.orderID,
          registrationId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to capture payment');
      }

      console.log('✅ Payment captured successfully:', result);

      const paymentData = {
        orderId: data.orderID,
        paymentId: result.transactionId,
        transactionId: result.transactionId,
        registrationId,
        amount,
        currency,
        status: 'completed',
        paymentMethod: 'paypal',
        timestamp: new Date().toISOString(),
      };

      setPaymentStatus({
        status: 'success',
        message: paypalSuccessMessages.PAYMENT_COMPLETED,
        transactionId: result.transactionId,
        orderId: data.orderID,
      });

      onSuccess(paymentData);
    } catch (error) {
      console.error('❌ Error capturing payment:', error);
      const errorMessage = error instanceof Error ? error.message : paypalErrorMessages.PAYMENT_FAILED;
      
      setPaymentStatus({
        status: 'error',
        message: errorMessage,
      });

      onError(error);
    }
  };

  // Handle payment errors
  const onPayPalError = (error: any) => {
    console.error('❌ PayPal error:', error);
    setPaymentStatus({
      status: 'error',
      message: paypalErrorMessages.PAYMENT_FAILED,
    });
    onError(error);
  };

  // Handle payment cancellation
  const onPayPalCancel = () => {
    console.log('⚠️ Payment cancelled by user');
    setPaymentStatus({
      status: 'cancelled',
      message: paypalErrorMessages.PAYMENT_CANCELLED,
    });
    onCancel();
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Payment Status Display */}
      {paymentStatus.status !== 'idle' && (
        <div className={`mb-4 p-4 rounded-lg border ${
          paymentStatus.status === 'success' 
            ? 'bg-green-50 border-green-200' 
            : paymentStatus.status === 'error'
            ? 'bg-red-50 border-red-200'
            : paymentStatus.status === 'cancelled'
            ? 'bg-yellow-50 border-yellow-200'
            : 'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex items-center">
            <span className={`text-lg mr-2 ${
              paymentStatus.status === 'success' ? 'text-green-500' :
              paymentStatus.status === 'error' ? 'text-red-500' :
              paymentStatus.status === 'cancelled' ? 'text-yellow-500' :
              'text-blue-500'
            }`}>
              {paymentStatus.status === 'success' ? '✅' :
               paymentStatus.status === 'error' ? '❌' :
               paymentStatus.status === 'cancelled' ? '⚠️' : '⏳'}
            </span>
            <div>
              <p className={`font-medium ${
                paymentStatus.status === 'success' ? 'text-green-800' :
                paymentStatus.status === 'error' ? 'text-red-800' :
                paymentStatus.status === 'cancelled' ? 'text-yellow-800' :
                'text-blue-800'
              }`}>
                {paymentStatus.message}
              </p>
              {paymentStatus.transactionId && (
                <p className="text-sm text-gray-600 mt-1">
                  Transaction ID: <span className="font-mono">{paymentStatus.transactionId}</span>
                </p>
              )}
              {paymentStatus.orderId && (
                <p className="text-sm text-gray-600">
                  Order ID: <span className="font-mono">{paymentStatus.orderId}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Official PayPal Button */}
      {paymentStatus.status !== 'success' && (
        <PayPalScriptProvider options={paypalSDKOptions}>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="mb-4 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Complete Payment
              </h3>
              <p className="text-2xl font-bold text-blue-600">
                {currency} {amount.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Registration ID: {registrationId}
              </p>
            </div>

            <PayPalButtons
              style={paypalButtonStyle}
              disabled={disabled || paymentStatus.status === 'processing'}
              createOrder={createOrder}
              onApprove={onApprove}
              onError={onPayPalError}
              onCancel={onPayPalCancel}
              forceReRender={[amount, currency, registrationId]}
            />

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Secure payment powered by PayPal
              </p>
              <div className="flex justify-center items-center mt-2 space-x-2">
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">🔒 Secure</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">🌍 Global</span>
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">✅ Trusted</span>
              </div>
            </div>
          </div>
        </PayPalScriptProvider>
      )}
    </div>
  );
}
