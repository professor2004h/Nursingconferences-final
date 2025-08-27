'use client';

import React, { useState } from 'react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';

interface PayPalButtonReliableProps {
  amount: number;
  currency?: string;
  registrationId: string;
  registrationData: any;
  onSuccess: (paymentData: any) => void;
  onError: (error: any) => void;
  onCancel: () => void;
  onRegistrationIdUpdate?: (newRegistrationId: string) => void;
  disabled?: boolean;
}

interface PaymentStatus {
  status: 'idle' | 'processing' | 'success' | 'error' | 'cancelled';
  message: string;
  transactionId?: string;
  orderId?: string;
}

export default function PayPalButtonReliable({
  amount,
  currency = 'USD',
  registrationId,
  registrationData,
  onSuccess,
  onError,
  onCancel,
  onRegistrationIdUpdate,
  disabled = false,
}: PayPalButtonReliableProps) {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({
    status: 'idle',
    message: '',
  });

  // Direct environment variable access - no complex loading
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'AUmI5g_PA8vHr0HSeZq7PukrblnMLeOLQbW60lNHoJGLAqTg3JZjAeracZmAh1WSuuqmZnUIJxLdzGXc';
  const environment = 'production';

  console.log('🔍 PayPal Reliable Button Configuration:', {
    clientId: clientId ? `${clientId.substring(0, 10)}...` : 'Missing',
    environment,
    amount,
    currency,
    registrationId
  });

  // Track the current registration ID
  const [currentRegistrationId, setCurrentRegistrationId] = useState<string>(registrationId);

  // Validate client ID
  if (!clientId) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <span className="text-red-500 text-lg mr-2">❌</span>
          <div>
            <h3 className="text-red-800 font-medium">PayPal Configuration Error</h3>
            <p className="text-red-700 text-sm mb-2">
              PayPal Client ID is not configured. Please contact support.
            </p>
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm text-blue-800">
                <strong>Alternative:</strong> Contact us directly at{' '}
                <a href="mailto:intelliglobalconferences@gmail.com" className="underline">
                  intelliglobalconferences@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PayPal SDK options
  const initialOptions = {
    clientId: clientId,
    currency: currency,
    intent: 'capture' as const,
    components: 'buttons',
    debug: false
  };

  // Create PayPal order
  const createOrder = async () => {
    try {
      console.log('🔄 Creating PayPal order...');
      setPaymentStatus({ 
        status: 'processing', 
        message: 'Creating payment order...' 
      });

      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount.toString(),
          currency: currency,
          registrationId: currentRegistrationId,
          registrationData: registrationData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      console.log('✅ PayPal order created:', data.orderId);

      // Update registration ID if PayPal provided a new one
      if (data.orderId && data.orderId !== currentRegistrationId) {
        console.log('🔄 Updating registration ID from PayPal:', data.orderId);
        setCurrentRegistrationId(data.orderId);
        onRegistrationIdUpdate?.(data.orderId);
      }

      setPaymentStatus({ 
        status: 'processing', 
        message: 'Order created, waiting for payment...',
        orderId: data.orderId 
      });

      return data.orderId;
    } catch (error) {
      console.error('❌ Error creating PayPal order:', error);
      setPaymentStatus({ 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Failed to create order' 
      });
      throw error;
    }
  };

  // Capture PayPal payment
  const onApprove = async (data: any) => {
    try {
      console.log('🔄 Capturing PayPal payment...');
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
          registrationId: currentRegistrationId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to capture payment');
      }

      console.log('✅ PayPal payment captured successfully:', result);

      setPaymentStatus({ 
        status: 'success', 
        message: 'Payment completed successfully!',
        transactionId: result.transactionId,
        orderId: data.orderID 
      });

      // Call success callback
      onSuccess({
        orderId: data.orderID,
        transactionId: result.transactionId,
        amount: amount,
        currency: currency,
        registrationId: currentRegistrationId,
        paymentData: result
      });

    } catch (error) {
      console.error('❌ Error capturing PayPal payment:', error);
      const errorMessage = error instanceof Error ? error.message : 'Payment processing failed';
      
      setPaymentStatus({ 
        status: 'error', 
        message: errorMessage 
      });

      onError(error);
    }
  };

  // Handle PayPal errors
  const onPayPalError = (error: any) => {
    console.error('❌ PayPal error:', error);
    setPaymentStatus({ 
      status: 'error', 
      message: 'PayPal payment failed' 
    });
    onError(error);
  };

  // Handle PayPal cancellation
  const onPayPalCancel = () => {
    console.log('⚠️ PayPal payment cancelled');
    setPaymentStatus({ 
      status: 'cancelled', 
      message: 'Payment was cancelled' 
    });
    onCancel();
  };

  return (
    <div className="space-y-4">
      {/* Payment Status */}
      {paymentStatus.status !== 'idle' && paymentStatus.status !== 'success' && (
        <div className={`rounded-lg p-3 ${
          paymentStatus.status === 'processing' ? 'bg-blue-50 border border-blue-200' :
          paymentStatus.status === 'error' ? 'bg-red-50 border border-red-200' :
          'bg-yellow-50 border border-yellow-200'
        }`}>
          <p className={`text-sm ${
            paymentStatus.status === 'processing' ? 'text-blue-700' :
            paymentStatus.status === 'error' ? 'text-red-700' :
            'text-yellow-700'
          }`}>
            {paymentStatus.message}
          </p>
        </div>
      )}

      {/* Success Message */}
      {paymentStatus.status === 'success' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-green-500 text-lg mr-2">✅</span>
            <div>
              <h3 className="text-green-800 font-medium">Payment Successful!</h3>
              <p className="text-green-700 text-sm">
                Your payment has been processed successfully.
              </p>
              {paymentStatus.transactionId && (
                <p className="text-green-600 text-xs mt-1">
                  Transaction ID: {paymentStatus.transactionId}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PayPal Button */}
      {paymentStatus.status !== 'success' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-4 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Complete Payment
            </h3>
            <p className="text-2xl font-bold text-blue-600">
              {currency} {amount.toFixed(2)}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Registration ID: {currentRegistrationId}
            </p>
          </div>

          <PayPalScriptProvider options={initialOptions}>
            <PayPalButtons
              style={{
                layout: 'vertical',
                color: 'blue',
                shape: 'rect',
                label: 'paypal',
                height: 45,
                tagline: false,
              }}
              disabled={disabled || paymentStatus.status === 'processing'}
              createOrder={createOrder}
              onApprove={onApprove}
              onError={onPayPalError}
              onCancel={onPayPalCancel}
            />
          </PayPalScriptProvider>


          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Secure payment powered by PayPal
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
