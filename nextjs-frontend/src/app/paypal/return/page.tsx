'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import React from 'react';

export default function PayPalReturnPage() {
  const search = useSearchParams();
  const router = useRouter();

  const orderID = search.get('orderID') || '';
  const paymentID = search.get('paymentID') || '';
  const amount = search.get('amount') || '';
  const currency = search.get('currency') || '';
  const registrationId = search.get('registrationId') || '';

  const onContinue = () => {
    // Safest default: go back to registration page if present, else home
    router.push('/registration');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="rounded-lg border border-green-200 bg-green-50 p-6">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-2">✅</span>
          <h1 className="text-xl font-semibold text-green-900">Payment Successful</h1>
        </div>

        <p className="text-green-800 mb-4">
          Thank you. Your payment has been captured successfully.
        </p>

        <div className="bg-white rounded-md border border-green-100 p-4 text-sm text-gray-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="text-gray-500">Payment ID (Capture)</div>
              <div className="font-mono break-all">{paymentID || '-'}</div>
            </div>
            <div>
              <div className="text-gray-500">Order ID</div>
              <div className="font-mono break-all">{orderID || '-'}</div>
            </div>
            <div>
              <div className="text-gray-500">Amount</div>
              <div className="font-mono">{currency} {amount}</div>
            </div>
            <div>
              <div className="text-gray-500">Registration ID</div>
              <div className="font-mono break-all">{registrationId || '-'}</div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onContinue}
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
          >
            Continue
          </button>
          <a
            href={`/api/registration/update-payment?registrationId=${encodeURIComponent(registrationId)}&paymentId=${encodeURIComponent(paymentID)}`}
            className="px-4 py-2 rounded border border-green-300 text-green-800 hover:bg-green-100"
          >
            Download Receipt (stub)
          </a>
        </div>

        <p className="text-xs text-gray-500 mt-4">
          Save your Payment ID and Order ID for future reference.
        </p>
      </div>
    </div>
  );
}
