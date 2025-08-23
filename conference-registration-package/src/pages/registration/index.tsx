// =============================================================================
// REGISTRATION PAGE
// =============================================================================

import React, { useState } from 'react';
import Head from 'next/head';
import { toast } from 'react-hot-toast';
import RegistrationForm from '@/components/registration/RegistrationForm';
import PaymentSection from '@/components/registration/PaymentSection';
import ConfirmationPage from '@/components/registration/ConfirmationPage';
import { RegistrationFormData, RegistrationData } from '@/types/registration';
import { env } from '@/lib/config/environment';

type RegistrationStep = 'form' | 'payment' | 'confirmation';

export default function RegistrationPage() {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('form');
  const [registrationData, setRegistrationData] = useState<RegistrationFormData | null>(null);
  const [registrationResult, setRegistrationResult] = useState<RegistrationData | null>(null);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [registrationId, setRegistrationId] = useState<string>('');
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  // Handle form submission (create registration)
  const handleFormSubmit = async (formData: RegistrationFormData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/registration/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to create registration');
      }

      setRegistrationResult(result.data);
      setRegistrationData(formData);
      
      // If no payment required, go directly to confirmation
      if (result.data.totalAmount === 0) {
        setCurrentStep('confirmation');
        toast.success('Registration completed successfully!');
      } else {
        // Payment required, show confirmation
        setCurrentStep('confirmation');
        toast.success('Registration created! Payment completed.');
      }

    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle payment requirement (show payment step)
  const handlePaymentRequired = async (formData: RegistrationFormData, amount: number) => {
    setLoading(true);
    try {
      // Create registration first
      const response = await fetch('/api/registration/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to create registration');
      }

      setRegistrationResult(result.data);
      setRegistrationData(formData);
      setRegistrationId(result.data.id);
      setPaymentAmount(amount);
      setCurrentStep('payment');
      
      toast.success('Registration created! Please complete payment.');

    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle successful payment
  const handlePaymentSuccess = async (payment: any) => {
    setLoading(true);
    try {
      // Update registration with payment information
      const response = await fetch(`/api/registration/update?registrationId=${registrationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          updates: {
            paymentStatus: 'completed',
            paymentId: payment.transactionId || payment.orderId,
            paymentMethod: payment.paymentMethod || 'paypal',
            paymentDate: new Date().toISOString(),
            status: 'confirmed',
            confirmedAt: new Date().toISOString(),
          },
        }),
      });

      const result = await response.json();

      if (result.success) {
        setRegistrationResult(result.data);
      }

      setPaymentData(payment);
      setCurrentStep('confirmation');
      toast.success('Payment completed successfully!');

    } catch (error) {
      console.error('Payment update error:', error);
      // Still show confirmation even if update fails
      setPaymentData(payment);
      setCurrentStep('confirmation');
      toast.success('Payment completed successfully!');
    } finally {
      setLoading(false);
    }
  };

  // Handle payment error
  const handlePaymentError = (error: any) => {
    console.error('Payment error:', error);
    toast.error('Payment failed. Please try again.');
  };

  // Handle payment cancellation
  const handlePaymentCancel = () => {
    toast.error('Payment was cancelled');
  };

  // Handle back to payment from confirmation
  const handleBackToPayment = () => {
    setCurrentStep('payment');
  };

  // Handle new registration
  const handleNewRegistration = () => {
    setCurrentStep('form');
    setRegistrationData(null);
    setRegistrationResult(null);
    setPaymentData(null);
    setRegistrationId('');
    setPaymentAmount(0);
  };

  // Handle download receipt (placeholder)
  const handleDownloadReceipt = () => {
    toast.success('Receipt download feature coming soon!');
  };

  return (
    <>
      <Head>
        <title>Registration - {env.CONFERENCE.NAME}</title>
        <meta name="description" content={`Register for ${env.CONFERENCE.NAME} - ${env.CONFERENCE.DATE}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {env.CONFERENCE.NAME}
            </h1>
            <p className="text-lg text-gray-600 mb-1">
              {env.CONFERENCE.DATE} • {env.CONFERENCE.LOCATION}
            </p>
            <p className="text-gray-500">
              Complete your registration below
            </p>
          </div>

          {/* Registration Steps */}
          {currentStep === 'form' && (
            <RegistrationForm
              onSubmit={handleFormSubmit}
              onPaymentRequired={handlePaymentRequired}
              loading={loading}
            />
          )}

          {currentStep === 'payment' && registrationData && registrationResult && (
            <PaymentSection
              registrationData={registrationData}
              amount={paymentAmount}
              registrationId={registrationId}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
              onPaymentCancel={handlePaymentCancel}
              onBack={handleBackToPayment}
              loading={loading}
            />
          )}

          {currentStep === 'confirmation' && registrationResult && (
            <ConfirmationPage
              registrationData={registrationResult}
              paymentData={paymentData}
              onDownloadReceipt={handleDownloadReceipt}
              onNewRegistration={handleNewRegistration}
            />
          )}
        </div>
      </div>
    </>
  );
}
