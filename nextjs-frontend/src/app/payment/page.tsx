'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RegistrationDetails {
  registrationId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const registrationId = searchParams.get('registrationId');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registration, setRegistration] = useState<any>(null);
  const [paymentInitialized, setPaymentInitialized] = useState(false);

  useEffect(() => {
    if (registrationId) {
      fetchRegistrationDetails();
    } else {
      setError('Registration ID is required');
    }
  }, [registrationId]);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const fetchRegistrationDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/registration?registrationId=${registrationId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch registration details');
      }

      const data = await response.json();
      setRegistration(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const initializePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      // Initialize Razorpay payment
      const response = await fetch('/api/payment/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ registrationId }),
      });

      if (!response.ok) {
        throw new Error('Failed to initialize payment');
      }

      const paymentData = await response.json();
      
      // Configure Razorpay options
      const options = {
        key: paymentData.razorpayKeyId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        name: 'Intelli Global Conferences',
        description: 'Conference Registration Payment',
        order_id: paymentData.orderId,
        prefill: {
          name: paymentData.registrationDetails.customerName,
          email: paymentData.registrationDetails.customerEmail,
          contact: paymentData.registrationDetails.customerPhone,
        },
        theme: {
          color: '#2563eb', // Blue color matching the website theme
        },
        handler: async (response: any) => {
          await handlePaymentSuccess(response);
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setError('Payment was cancelled');
          },
        },
      };

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();
      setPaymentInitialized(true);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment initialization failed');
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (response: any) => {
    try {
      setLoading(true);

      // Verify payment with backend
      const verificationResponse = await fetch('/api/payment/razorpay', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          registrationId,
        }),
      });

      if (!verificationResponse.ok) {
        throw new Error('Payment verification failed');
      }

      const verificationData = await verificationResponse.json();

      // Redirect to success page
      window.location.href = `/payment/success?registrationId=${registrationId}&paymentId=${verificationData.paymentDetails.paymentId}`;

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment verification failed');
      setLoading(false);
    }
  };

  if (loading && !registration) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-red-600 text-6xl mb-4">❌</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Payment Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.href = '/registration'}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Registration
          </button>
        </div>
      </div>
    );
  }

  if (!registration) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Registration not found</h3>
          <p className="text-gray-500">Please check your registration ID and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Complete Payment</h1>
            <p className="text-blue-100 mt-1">Registration ID: {registration.registrationId}</p>
          </div>

          <div className="p-6">
            {/* Registration Summary */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Registration Summary</h2>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">
                    {registration.personalDetails.title} {registration.personalDetails.firstName} {registration.personalDetails.lastName}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{registration.personalDetails.email}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">{registration.personalDetails.phoneNumber}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Country:</span>
                  <span className="font-medium">{registration.personalDetails.country}</span>
                </div>

                {registration.registrationType && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Registration Type:</span>
                    <span className="font-medium">{registration.registrationType.name}</span>
                  </div>
                )}

                {registration.sponsorshipTier && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sponsorship Tier:</span>
                    <span className="font-medium">{registration.sponsorshipTier.tierName}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-600">Participants:</span>
                  <span className="font-medium">{registration.numberOfParticipants}</span>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount:</span>
                    <span className="text-blue-600">${registration.pricing.totalPrice}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Status */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Status</h2>
              
              <div className="flex items-center space-x-3">
                {registration.paymentStatus === 'completed' ? (
                  <>
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-green-600 font-medium">Payment Completed</p>
                      <p className="text-sm text-gray-500">Your registration is confirmed</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-yellow-600 font-medium">Payment Pending</p>
                      <p className="text-sm text-gray-500">Complete payment to confirm registration</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Payment Button */}
            {registration.paymentStatus !== 'completed' && (
              <div className="text-center">
                <button
                  onClick={initializePayment}
                  disabled={loading}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : `Pay $${registration.pricing.totalPrice} Now`}
                </button>
                
                <p className="text-sm text-gray-500 mt-4">
                  Secure payment powered by Razorpay
                </p>
              </div>
            )}

            {registration.paymentStatus === 'completed' && (
              <div className="text-center">
                <button
                  onClick={() => window.location.href = '/'}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Back to Home
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
