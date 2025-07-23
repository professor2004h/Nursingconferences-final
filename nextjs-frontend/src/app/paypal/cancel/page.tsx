'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const PayPalCancelPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Clear any stored PayPal order data
    sessionStorage.removeItem('paypal_order_data');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-yellow-500 text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Cancelled</h1>
        <p className="text-gray-600 mb-6">
          Your PayPal payment was cancelled. Don't worry - your registration has been saved 
          and you can complete the payment later.
        </p>
        
        <div className="space-y-3">
          <button
            onClick={() => router.push('/registration')}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Try Payment Again
          </button>
          
          <Link
            href="/"
            className="block w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Back to Home
          </Link>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <span className="text-blue-500 text-lg mr-2">ℹ️</span>
            <div className="text-left">
              <p className="text-sm font-medium text-blue-800">What's Next?</p>
              <p className="text-xs text-blue-600">
                Your registration is saved. You can complete payment anytime before the conference.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Need help? Contact us at{' '}
            <a href="mailto:support@intelliglobalconferences.com" className="text-blue-600 hover:underline">
              support@intelliglobalconferences.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PayPalCancelPage;
