// =============================================================================
// REGISTRATION SUCCESS PAGE
// =============================================================================

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Button from '@/components/ui/Button';
import { RegistrationData } from '@/types/registration';
import { formatCurrency, formatDate } from '@/lib/utils/formatting';
import { env } from '@/lib/config/environment';

export default function RegistrationSuccessPage() {
  const router = useRouter();
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get registration ID from query parameters
    const { registrationId, paymentId } = router.query;

    if (registrationId && typeof registrationId === 'string') {
      fetchRegistrationData(registrationId);
    } else {
      setError('No registration ID provided');
      setLoading(false);
    }
  }, [router.query]);

  const fetchRegistrationData = async (registrationId: string) => {
    try {
      const response = await fetch(`/api/registration/update?registrationId=${registrationId}`);
      const result = await response.json();

      if (result.success) {
        setRegistrationData(result.data);
      } else {
        setError(result.error || 'Failed to fetch registration data');
      }
    } catch (error) {
      console.error('Error fetching registration:', error);
      setError('Failed to load registration information');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReceipt = () => {
    // TODO: Implement receipt download
    alert('Receipt download feature coming soon!');
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>Loading... - {env.CONFERENCE.NAME}</title>
        </Head>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <LoadingSpinner size="lg" text="Loading registration details..." />
        </div>
      </>
    );
  }

  if (error || !registrationData) {
    return (
      <>
        <Head>
          <title>Error - {env.CONFERENCE.NAME}</title>
        </Head>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-error-100 rounded-full">
                <svg className="w-6 h-6 text-error-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-gray-900 mb-2">
                Registration Not Found
              </h1>
              <p className="text-gray-600 mb-6">
                {error || 'We could not find your registration information.'}
              </p>
              <Link href="/registration">
                <Button>
                  Start New Registration
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  const isPaid = registrationData.paymentStatus === 'completed';
  const isFree = registrationData.totalAmount === 0;

  return (
    <>
      <Head>
        <title>Registration Successful - {env.CONFERENCE.NAME}</title>
        <meta name="description" content="Your registration has been completed successfully" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Header */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            <div className="bg-success-600 text-white px-6 py-8 text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-success-500 rounded-full">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold mb-2">
                Registration Successful!
              </h1>
              <p className="text-success-100">
                Thank you for registering for {env.CONFERENCE.NAME}
              </p>
            </div>

            {/* Registration Details */}
            <div className="px-6 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Registration Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Registration Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Registration ID:</span>
                      <span className="font-mono font-medium">
                        {registrationData.registrationNumber}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium text-success-600">
                        {registrationData.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Registration Date:</span>
                      <span className="font-medium">
                        {formatDate(registrationData.createdAt)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium capitalize">
                        {registrationData.registrationType.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Payment Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium text-lg">
                        {formatCurrency(registrationData.totalAmount, registrationData.currency)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Status:</span>
                      <span className={`font-medium ${
                        isPaid ? 'text-success-600' : 
                        isFree ? 'text-blue-600' : 'text-warning-600'
                      }`}>
                        {isFree ? 'Free Registration' : 
                         isPaid ? 'Paid' : 'Pending'}
                      </span>
                    </div>
                    {registrationData.paymentId && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment ID:</span>
                        <span className="font-mono text-xs">
                          {registrationData.paymentId}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Attendee Information */}
              <div className="bg-primary-50 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Attendee Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <p className="font-medium">
                      {registrationData.title} {registrationData.firstName} {registrationData.lastName}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <p className="font-medium">{registrationData.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Organization:</span>
                    <p className="font-medium">{registrationData.organization}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Attendance:</span>
                    <p className="font-medium capitalize">
                      {registrationData.attendanceType.replace('-', ' ')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="outline"
                  onClick={handleDownloadReceipt}
                  className="flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Receipt
                </Button>
                
                <Link href="/registration">
                  <Button className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Register Another Attendee
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="text-center text-sm text-gray-600">
            <p>
              Need help? Contact us at{' '}
              <a href={`mailto:${env.CONTACT_EMAIL}`} className="text-primary-600 hover:text-primary-700">
                {env.CONTACT_EMAIL}
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
