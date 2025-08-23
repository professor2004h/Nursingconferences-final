// =============================================================================
// CONFIRMATION PAGE COMPONENT
// =============================================================================

'use client';

import React from 'react';
import Button from '@/components/ui/Button';
import { RegistrationData } from '@/types/registration';
import { formatCurrency, formatDate } from '@/lib/utils/formatting';
import { env } from '@/lib/config/environment';

interface ConfirmationPageProps {
  registrationData: RegistrationData;
  paymentData?: any;
  onDownloadReceipt?: () => void;
  onNewRegistration?: () => void;
}

const ConfirmationPage: React.FC<ConfirmationPageProps> = ({
  registrationData,
  paymentData,
  onDownloadReceipt,
  onNewRegistration,
}) => {
  const isPaid = registrationData.paymentStatus === 'completed';
  const isFree = registrationData.totalAmount === 0;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Success Header */}
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
                  <span className="text-gray-600">Registration Type:</span>
                  <span className="font-medium capitalize">
                    {registrationData.registrationType.replace('-', ' ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Attendance:</span>
                  <span className="font-medium capitalize">
                    {registrationData.attendanceType.replace('-', ' ')}
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
                {paymentData?.transactionId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-mono text-xs">
                      {paymentData.transactionId}
                    </span>
                  </div>
                )}
                {paymentData?.paymentMethod && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium capitalize">
                      {paymentData.paymentMethod}
                    </span>
                  </div>
                )}
                {registrationData.paymentDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Date:</span>
                    <span className="font-medium">
                      {formatDate(registrationData.paymentDate)}
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
                <span className="text-gray-600">Phone:</span>
                <p className="font-medium">{registrationData.phone}</p>
              </div>
              <div>
                <span className="text-gray-600">Organization:</span>
                <p className="font-medium">{registrationData.organization}</p>
              </div>
            </div>
          </div>

          {/* Conference Information */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Conference Information
            </h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">Event:</span>
                <p className="font-medium">{env.CONFERENCE.NAME}</p>
              </div>
              <div>
                <span className="text-gray-600">Date:</span>
                <p className="font-medium">{formatDate(env.CONFERENCE.DATE, 'long')}</p>
              </div>
              <div>
                <span className="text-gray-600">Location:</span>
                <p className="font-medium">{env.CONFERENCE.LOCATION}</p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-warning-50 border border-warning-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-warning-900 mb-3">
              What's Next?
            </h3>
            <ul className="text-sm text-warning-800 space-y-2">
              <li className="flex items-start">
                <span className="text-warning-600 mr-2">•</span>
                You will receive a confirmation email shortly with your registration details
              </li>
              <li className="flex items-start">
                <span className="text-warning-600 mr-2">•</span>
                Please save your registration ID for future reference
              </li>
              <li className="flex items-start">
                <span className="text-warning-600 mr-2">•</span>
                Conference materials and schedule will be sent closer to the event date
              </li>
              <li className="flex items-start">
                <span className="text-warning-600 mr-2">•</span>
                If you have any questions, contact us at {env.CONTACT_EMAIL}
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {onDownloadReceipt && (
              <Button
                variant="outline"
                onClick={onDownloadReceipt}
                className="flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Receipt
              </Button>
            )}
            
            {onNewRegistration && (
              <Button
                onClick={onNewRegistration}
                className="flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Register Another Attendee
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="mt-6 text-center text-sm text-gray-600">
        <p>
          Need help? Contact us at{' '}
          <a href={`mailto:${env.CONTACT_EMAIL}`} className="text-primary-600 hover:text-primary-700">
            {env.CONTACT_EMAIL}
          </a>
        </p>
      </div>
    </div>
  );
};

export default ConfirmationPage;
