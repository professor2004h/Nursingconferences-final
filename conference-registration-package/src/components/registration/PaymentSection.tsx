// =============================================================================
// PAYMENT SECTION COMPONENT
// =============================================================================

'use client';

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import PayPalButton from '@/components/paypal/PayPalButton';
import PayPalErrorBoundary from '@/components/paypal/PayPalErrorBoundary';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Button from '@/components/ui/Button';
import { RegistrationFormData } from '@/types/registration';
import { formatCurrency } from '@/lib/utils/formatting';

interface PaymentSectionProps {
  registrationData: RegistrationFormData;
  amount: number;
  currency?: string;
  registrationId: string;
  onPaymentSuccess: (paymentData: any) => void;
  onPaymentError: (error: any) => void;
  onPaymentCancel: () => void;
  onBack: () => void;
  loading?: boolean;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({
  registrationData,
  amount,
  currency = 'USD',
  registrationId,
  onPaymentSuccess,
  onPaymentError,
  onPaymentCancel,
  onBack,
  loading = false,
}) => {
  const [currentRegistrationId, setCurrentRegistrationId] = useState(registrationId);

  const handlePaymentSuccess = (paymentData: any) => {
    toast.success('Payment completed successfully!');
    onPaymentSuccess(paymentData);
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment error:', error);
    toast.error('Payment failed. Please try again.');
    onPaymentError(error);
  };

  const handlePaymentCancel = () => {
    toast.error('Payment was cancelled');
    onPaymentCancel();
  };

  const handleRegistrationIdUpdate = (newId: string) => {
    console.log('Registration ID updated:', newId);
    setCurrentRegistrationId(newId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" text="Processing payment..." />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-primary-600 text-white px-6 py-4">
          <h2 className="text-xl font-semibold">Complete Your Registration</h2>
          <p className="text-primary-100 text-sm mt-1">
            Secure payment powered by PayPal
          </p>
        </div>

        {/* Registration Summary */}
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            Registration Summary
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Attendee</p>
              <p className="font-medium">
                {registrationData.title} {registrationData.firstName} {registrationData.lastName}
              </p>
            </div>
            
            <div>
              <p className="text-gray-600">Email</p>
              <p className="font-medium">{registrationData.email}</p>
            </div>
            
            <div>
              <p className="text-gray-600">Registration Type</p>
              <p className="font-medium capitalize">
                {registrationData.registrationType?.replace('-', ' ')}
              </p>
            </div>
            
            <div>
              <p className="text-gray-600">Attendance</p>
              <p className="font-medium capitalize">
                {registrationData.attendanceType?.replace('-', ' ')}
              </p>
            </div>
            
            <div>
              <p className="text-gray-600">Organization</p>
              <p className="font-medium">{registrationData.organization}</p>
            </div>
            
            <div>
              <p className="text-gray-600">Registration ID</p>
              <p className="font-medium font-mono text-xs">
                {currentRegistrationId}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Amount */}
        <div className="px-6 py-4 bg-primary-50 border-b">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium text-gray-900">
              Total Amount
            </span>
            <span className="text-2xl font-bold text-primary-600">
              {formatCurrency(amount, currency)}
            </span>
          </div>
          
          {amount === 0 && (
            <p className="text-sm text-success-600 mt-1">
              Free registration - No payment required
            </p>
          )}
        </div>

        {/* Payment Section */}
        <div className="px-6 py-6">
          {amount > 0 ? (
            <PayPalErrorBoundary>
              <PayPalButton
                amount={amount}
                currency={currency}
                registrationId={currentRegistrationId}
                registrationData={registrationData}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                onCancel={handlePaymentCancel}
                onRegistrationIdUpdate={handleRegistrationIdUpdate}
                disabled={loading}
              />
            </PayPalErrorBoundary>
          ) : (
            <div className="text-center">
              <div className="bg-success-50 border border-success-200 rounded-lg p-6 mb-4">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-success-100 rounded-full">
                  <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-success-900 mb-2">
                  Free Registration
                </h3>
                <p className="text-success-700">
                  No payment is required for your registration type.
                </p>
              </div>
              
              <Button
                onClick={() => handlePaymentSuccess({ 
                  amount: 0, 
                  currency, 
                  status: 'completed',
                  paymentMethod: 'free',
                  registrationId: currentRegistrationId 
                })}
                size="lg"
                className="w-full"
              >
                Complete Free Registration
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={onBack}
              disabled={loading}
            >
              Back to Review
            </Button>
            
            <div className="text-xs text-gray-500 text-right">
              <p>Secure payment processing</p>
              <p>Your information is protected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          SSL Encrypted • Secure Payment • PCI Compliant
        </div>
      </div>
    </div>
  );
};

export default PaymentSection;
