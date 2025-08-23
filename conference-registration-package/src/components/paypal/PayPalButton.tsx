// =============================================================================
// PAYPAL BUTTON COMPONENT
// =============================================================================

'use client';

import React, { useState, useCallback } from 'react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { usePayPal } from './PayPalProvider';
import PayPalErrorBoundary from './PayPalErrorBoundary';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { paypalButtonStyle, getPayPalErrorMessage } from '@/lib/config/paypal';
import { formatCurrency } from '@/lib/utils/formatting';
import { PaymentStatus } from '@/types/payment';

interface PayPalButtonProps {
  amount: number;
  currency?: string;
  registrationId: string;
  registrationData?: any;
  onSuccess: (paymentData: any) => void;
  onError: (error: any) => void;
  onCancel: () => void;
  onRegistrationIdUpdate?: (newRegistrationId: string) => void;
  disabled?: boolean;
}

interface PaymentState {
  status: PaymentStatus;
  message: string;
  transactionId?: string;
  orderId?: string;
}

const PayPalButton: React.FC<PayPalButtonProps> = ({
  amount,
  currency = 'USD',
  registrationId,
  registrationData,
  onSuccess,
  onError,
  onCancel,
  onRegistrationIdUpdate,
  disabled = false,
}) => {
  const [{ isResolved, isPending, isRejected }] = usePayPalScriptReducer();
  const { isConfigValid, configErrors } = usePayPal();
  const [paymentState, setPaymentState] = useState<PaymentState>({
    status: 'pending',
    message: '',
  });

  // Create PayPal order
  const createOrder = useCallback(async () => {
    try {
      setPaymentState({ status: 'processing', message: 'Creating payment order...' });

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

      if (!data.success) {
        throw new Error(data.error || 'Failed to create payment order');
      }

      // Update registration ID if PayPal provides a new one
      if (data.orderId && onRegistrationIdUpdate) {
        onRegistrationIdUpdate(data.orderId);
      }

      setPaymentState({
        status: 'processing',
        message: 'Payment order created successfully',
        orderId: data.orderId,
      });

      return data.orderId;
    } catch (error) {
      console.error('❌ Error creating PayPal order:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create payment order';
      setPaymentState({ status: 'failed', message: errorMessage });
      onError(error);
      throw error;
    }
  }, [amount, currency, registrationId, registrationData, onRegistrationIdUpdate, onError]);

  // Handle PayPal approval
  const onApprove = useCallback(async (data: any) => {
    try {
      setPaymentState({ 
        status: 'processing', 
        message: 'Processing payment...',
        orderId: data.orderID,
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

      if (!result.success) {
        throw new Error(result.error || 'Payment capture failed');
      }

      setPaymentState({
        status: 'completed',
        message: 'Payment completed successfully!',
        transactionId: result.transactionId,
        orderId: data.orderID,
      });

      // Call success callback with payment data
      onSuccess({
        orderId: data.orderID,
        transactionId: result.transactionId,
        amount: result.amount,
        currency: result.currency,
        status: 'completed',
        paymentMethod: 'paypal',
      });
    } catch (error) {
      console.error('❌ Error capturing PayPal payment:', error);
      const errorMessage = error instanceof Error ? error.message : 'Payment processing failed';
      setPaymentState({ status: 'failed', message: errorMessage });
      onError(error);
    }
  }, [registrationId, onSuccess, onError]);

  // Handle PayPal errors
  const onPayPalError = useCallback((error: any) => {
    console.error('❌ PayPal error:', error);
    const errorMessage = getPayPalErrorMessage(error.code || error.name || 'UNKNOWN_ERROR');
    setPaymentState({ status: 'failed', message: errorMessage });
    onError(error);
  }, [onError]);

  // Handle PayPal cancellation
  const onPayPalCancel = useCallback(() => {
    console.log('💔 PayPal payment cancelled by user');
    setPaymentState({ status: 'cancelled', message: 'Payment was cancelled' });
    onCancel();
  }, [onCancel]);

  // Show configuration errors
  if (!isConfigValid) {
    return (
      <div className="bg-error-50 border border-error-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-error-900 mb-2">
          PayPal Configuration Error
        </h3>
        <ul className="text-sm text-error-700 space-y-1">
          {configErrors.map((error, index) => (
            <li key={index}>• {error}</li>
          ))}
        </ul>
        <p className="text-xs text-error-600 mt-2">
          Please contact the administrator to resolve this issue.
        </p>
      </div>
    );
  }

  // Show loading state
  if (isPending || !isResolved) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
        <LoadingSpinner size="md" text="Loading PayPal..." />
      </div>
    );
  }

  // Show script loading error
  if (isRejected) {
    return (
      <div className="bg-error-50 border border-error-200 rounded-lg p-4 text-center">
        <p className="text-error-700">
          Failed to load PayPal. Please refresh the page and try again.
        </p>
      </div>
    );
  }

  // Show success state
  if (paymentState.status === 'completed') {
    return (
      <div className="bg-success-50 border border-success-200 rounded-lg p-6 text-center">
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-success-100 rounded-full">
          <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-success-900 mb-2">Payment Successful!</h3>
        <p className="text-success-700 mb-2">{paymentState.message}</p>
        {paymentState.transactionId && (
          <p className="text-sm text-success-600">
            Transaction ID: {paymentState.transactionId}
          </p>
        )}
      </div>
    );
  }

  return (
    <PayPalErrorBoundary>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="mb-4 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Complete Payment
          </h3>
          <p className="text-2xl font-bold text-primary-600">
            {formatCurrency(amount, currency)}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Registration ID: {registrationId}
          </p>
        </div>

        {paymentState.status === 'failed' && (
          <div className="mb-4 bg-error-50 border border-error-200 rounded-md p-3">
            <p className="text-sm text-error-700">{paymentState.message}</p>
          </div>
        )}

        {paymentState.status === 'processing' && (
          <div className="mb-4 bg-primary-50 border border-primary-200 rounded-md p-3">
            <div className="flex items-center">
              <LoadingSpinner size="sm" color="primary" className="mr-2" />
              <p className="text-sm text-primary-700">{paymentState.message}</p>
            </div>
          </div>
        )}

        <PayPalButtons
          style={paypalButtonStyle}
          disabled={disabled || paymentState.status === 'processing'}
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
        </div>
      </div>
    </PayPalErrorBoundary>
  );
};

export default PayPalButton;
