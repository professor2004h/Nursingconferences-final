'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function RegistrationSuccessPage() {
  const searchParams = useSearchParams();
  const [registrationDetails, setRegistrationDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const paymentId = searchParams?.get('payment_id');
  const orderId = searchParams?.get('order_id');
  const registrationId = searchParams?.get('registration_id');
  const testMode = searchParams?.get('test_mode') === 'true';

  useEffect(() => {
    if (registrationId) {
      // Fetch registration details
      fetch(`/api/registration?registrationId=${registrationId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setRegistrationDetails(data.data);
          }
        })
        .catch(error => {
          console.error('Error fetching registration details:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [registrationId]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Success Header */}
          <div className="bg-green-600 px-6 py-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <svg className="h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Registration Successful!</h1>
            <p className="text-green-100">Thank you for registering for the International Nursing Conference 2025</p>
          </div>

          {/* Registration Details */}
          <div className="px-6 py-8">
            {loading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading registration details...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Payment Information */}
                {paymentId && (
                  <div className={`border rounded-lg p-4 ${testMode ? 'bg-orange-50 border-orange-200' : 'bg-blue-50 border-blue-200'}`}>
                    <h3 className={`text-lg font-semibold mb-2 ${testMode ? 'text-orange-900' : 'text-blue-900'}`}>
                      {testMode ? '🧪 Test Payment Confirmed' : 'Payment Confirmed'}
                    </h3>
                    <div className={`text-sm ${testMode ? 'text-orange-800' : 'text-blue-800'}`}>
                      <p><strong>Payment ID:</strong> {paymentId}</p>
                      {orderId && <p><strong>Order ID:</strong> {orderId}</p>}
                      {testMode && (
                        <div className="mt-2 p-2 bg-orange-100 rounded border border-orange-300">
                          <p className="text-xs text-orange-700 font-medium">
                            ⚠️ This is a test payment - no actual charges were made to your account.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Registration Information */}
                {registrationDetails && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Registration Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><strong>Registration ID:</strong> {registrationDetails.registrationId}</p>
                        <p><strong>Name:</strong> {registrationDetails.personalDetails?.firstName} {registrationDetails.personalDetails?.lastName}</p>
                        <p><strong>Email:</strong> {registrationDetails.personalDetails?.email}</p>
                        <p><strong>Phone:</strong> {registrationDetails.personalDetails?.phoneNumber}</p>
                      </div>
                      <div>
                        <p><strong>Country:</strong> {registrationDetails.personalDetails?.country}</p>
                        <p><strong>Registration Type:</strong> {registrationDetails.registrationType}</p>
                        <p><strong>Participants:</strong> {registrationDetails.numberOfParticipants}</p>
                        <p><strong>Total Amount:</strong> ${registrationDetails.pricing?.totalPrice}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Next Steps */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-yellow-900 mb-2">What's Next?</h3>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• You will receive a confirmation email shortly with your registration details</li>
                    <li>• Your registration certificate will be sent via email within 24 hours</li>
                    <li>• Conference materials and schedule will be shared closer to the event date</li>
                    <li>• For any queries, please contact us at support@nursingconference.com</li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Print Registration
                  </button>
                  <a
                    href="/"
                    className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 text-center"
                  >
                    Back to Home
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
