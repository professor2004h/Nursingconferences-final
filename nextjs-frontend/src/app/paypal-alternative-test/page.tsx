'use client';

import React, { useState } from 'react';
import PayPalButtonAlternative from '../components/PayPalButtonAlternative';

export default function PayPalAlternativeTestPage() {
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const [paymentError, setPaymentError] = useState<any>(null);

  const handlePaymentSuccess = (details: any) => {
    console.log('✅ Payment successful:', details);
    setPaymentResult(details);
    setPaymentError(null);
  };

  const handlePaymentError = (error: any) => {
    console.error('❌ Payment error:', error);
    setPaymentError(error);
    setPaymentResult(null);
  };

  const handlePaymentCancel = () => {
    console.log('⚠️ Payment cancelled');
    setPaymentResult(null);
    setPaymentError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            🔧 PayPal Alternative Implementation Test
          </h1>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-blue-900 mb-3">Test Purpose</h2>
            <p className="text-blue-800 mb-2">
              This page tests an alternative PayPal button implementation with:
            </p>
            <ul className="list-disc list-inside text-blue-700 space-y-1">
              <li>Multiple SDK URL fallbacks</li>
              <li>Retry mechanism with different URLs</li>
              <li>Enhanced error handling and logging</li>
              <li>Timeout protection</li>
              <li>Better user feedback</li>
            </ul>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                💳 Test Payment
              </h2>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="space-y-2 text-sm">
                  <div><strong>Amount:</strong> $75.00 USD</div>
                  <div><strong>Registration ID:</strong> alt-test-456</div>
                  <div><strong>Test Mode:</strong> Production SDK (Live)</div>
                </div>
              </div>
              
              <PayPalButtonAlternative
                amount={75.00}
                currency="USD"
                registrationId="alt-test-456"
                registrationData={{
                  testMode: true,
                  registrationId: 'alt-test-456'
                }}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                onCancel={handlePaymentCancel}
              />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                📊 Test Results
              </h2>
              
              {paymentResult && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <h3 className="text-green-800 font-semibold mb-2">✅ Payment Successful</h3>
                  <div className="text-sm text-green-700">
                    <div><strong>Order ID:</strong> {paymentResult.orderID}</div>
                    <div><strong>Payment ID:</strong> {paymentResult.paymentID}</div>
                    <div><strong>Status:</strong> {paymentResult.details?.status}</div>
                  </div>
                </div>
              )}

              {paymentError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <h3 className="text-red-800 font-semibold mb-2">❌ Payment Error</h3>
                  <div className="text-sm text-red-700">
                    <pre className="whitespace-pre-wrap">
                      {JSON.stringify(paymentError, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-gray-800 font-semibold mb-2">📝 Instructions</h3>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>1. The PayPal button should load without "container not found" errors</p>
                  <p>2. If the first SDK URL fails, it will automatically retry with alternatives</p>
                  <p>3. Check the browser console for detailed loading progress</p>
                  <p>4. Click the PayPal button to test the payment flow</p>
                  <p>5. Use PayPal sandbox credentials for testing</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-yellow-800 font-semibold mb-2">⚠️ Important Notes</h3>
            <div className="text-sm text-yellow-700 space-y-1">
              <p>• This uses LIVE PayPal credentials - do not complete real payments</p>
              <p>• Use PayPal sandbox accounts for testing</p>
              <p>• Check browser console for detailed error messages</p>
              <p>• If all attempts fail, there may be a network/firewall issue</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
