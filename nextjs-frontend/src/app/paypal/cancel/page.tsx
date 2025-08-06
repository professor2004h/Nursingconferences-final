'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import React from 'react';

export default function PayPalCancelPage() {
  const search = useSearchParams();
  const router = useRouter();

  const amount = search.get('amount') || '';
  const currency = search.get('currency') || '';
  // Show the PayPal Order ID as the Registration ID on cancel page
  const registrationId = search.get('registrationId') || search.get('orderID') || '';

  const onRetry = () => {
    // Navigate back to registration page where PayPal button is rendered
    const target = registrationId ? `/registration?registrationId=${encodeURIComponent(registrationId)}` : '/registration';
    router.push(target);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-2">⚠️</span>
          <h1 className="text-xl font-semibold text-yellow-900">Payment Cancelled</h1>
        </div>

        <p className="text-yellow-800 mb-4">
          Your PayPal payment was cancelled. No funds were captured.
        </p>

        <div className="bg-white rounded-md border border-yellow-100 p-4 text-sm text-gray-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="text-gray-500">Registration ID</div>
              <div className="font-mono break-all">{registrationId || '-'}</div>
            </div>
            <div>
              <div className="text-gray-500">Amount</div>
              <div className="font-mono">{currency} {amount || '-'}</div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onRetry}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Retry Payment
          </button>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 rounded border border-blue-300 text-blue-800 hover:bg-blue-100"
          >
            Go to Home
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-4">
          If the issue persists, please contact support with your Registration ID.
        </p>
      </div>
    </div>
  );
}
