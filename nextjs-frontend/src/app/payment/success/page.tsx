'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const registrationId = searchParams?.get('registrationId');
  const paymentId = searchParams?.get('paymentId');
  
  const [registration, setRegistration] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (registrationId) {
      fetchRegistrationDetails();
    } else {
      setError('Registration ID is required');
      setLoading(false);
    }
  }, [registrationId]);

  const fetchRegistrationDetails = async () => {
    try {
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

  const downloadReceipt = () => {
    // In a real implementation, this would generate and download a PDF receipt
    alert('Receipt download functionality would be implemented here');
  };

  const sendConfirmationEmail = async () => {
    try {
      // In a real implementation, this would trigger an email
      alert('Confirmation email sent successfully!');
    } catch (err) {
      alert('Failed to send confirmation email');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading confirmation details...</p>
        </div>
      </div>
    );
  }

  if (error || !registration) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-red-600 text-6xl mb-4">❌</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error || 'Registration not found'}</p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Success Header */}
          <div className="bg-green-600 px-6 py-8 text-center">
            <div className="text-white text-6xl mb-4">✅</div>
            <h1 className="text-3xl font-bold text-white mb-2">Payment Successful!</h1>
            <p className="text-green-100">Your conference registration is confirmed</p>
          </div>

          <div className="p-6">
            {/* Confirmation Details */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Confirmation Details</h2>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Registration ID:</span>
                  <span className="font-mono font-medium text-green-700">{registration.registrationId}</span>
                </div>
                
                {paymentId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment ID:</span>
                    <span className="font-mono font-medium text-green-700">{paymentId}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status:</span>
                  <span className="font-medium text-green-700">✅ COMPLETED</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount Paid:</span>
                  <span className="font-bold text-green-700">${registration.pricing.totalPrice}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Date:</span>
                  <span className="font-medium text-green-700">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Registration Summary */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Registration Summary</h2>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Attendee Name:</span>
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

                {registration.accommodationOption?.hotel && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Accommodation:</span>
                    <span className="font-medium">
                      {registration.accommodationOption.hotel.hotelName}
                      {registration.accommodationOption.roomType && ` (${registration.accommodationOption.roomType})`}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-600">Number of Participants:</span>
                  <span className="font-medium">{registration.numberOfParticipants}</span>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">What's Next?</h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Confirmation Email</p>
                    <p className="text-sm text-gray-600">You will receive a confirmation email with your registration details and conference information.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Conference Details</p>
                    <p className="text-sm text-gray-600">Detailed conference schedule, venue information, and speaker details will be sent closer to the event date.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Event Access</p>
                    <p className="text-sm text-gray-600">Your registration ID will serve as your access pass to the conference. Please keep it safe.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={downloadReceipt}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center gap-2"
              >
                📄 Download Receipt
              </button>
              
              <button
                onClick={sendConfirmationEmail}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center justify-center gap-2"
              >
                📧 Resend Confirmation
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center justify-center gap-2"
              >
                🏠 Back to Home
              </button>
            </div>

            {/* Contact Information */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Need Help?</h3>
              <p className="text-sm text-blue-700">
                If you have any questions about your registration or the conference, please contact us at:
              </p>
              <div className="mt-2 space-y-1">
                <p className="text-sm text-blue-700">📧 Email: intelliglobalconferences@gmail.com</p>
                <p className="text-sm text-blue-700">📞 Phone: +919876543210</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
