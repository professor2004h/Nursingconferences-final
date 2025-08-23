// =============================================================================
// REGISTRATION CANCEL PAGE
// =============================================================================

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { env } from '@/lib/config/environment';

export default function RegistrationCancelPage() {
  return (
    <>
      <Head>
        <title>Registration Cancelled - {env.CONFERENCE.NAME}</title>
        <meta name="description" content="Your registration was cancelled" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            {/* Cancel Icon */}
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-warning-100 rounded-full">
              <svg className="w-8 h-8 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Registration Cancelled
            </h1>

            {/* Message */}
            <p className="text-gray-600 mb-6">
              Your registration for {env.CONFERENCE.NAME} has been cancelled. 
              No payment was processed.
            </p>

            {/* Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
              <h3 className="text-sm font-medium text-blue-900 mb-2">
                What happened?
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• You cancelled the payment process</li>
                <li>• No charges were made to your account</li>
                <li>• Your registration was not completed</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Link href="/registration">
                <Button size="lg" fullWidth>
                  Try Registration Again
                </Button>
              </Link>
              
              <Link href="/">
                <Button variant="outline" size="lg" fullWidth>
                  Return to Home
                </Button>
              </Link>
            </div>

            {/* Help */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Need assistance?{' '}
                <a 
                  href={`mailto:${env.CONTACT_EMAIL}`} 
                  className="text-primary-600 hover:text-primary-700"
                >
                  Contact Support
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
