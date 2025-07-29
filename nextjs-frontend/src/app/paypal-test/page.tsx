'use client';

import React, { useEffect, useState } from 'react';

/**
 * PayPal Test Page - Enhanced with funding source diagnostics
 * Quick page to test PayPal configuration and debug guest checkout issues
 * Visit: /paypal-test
 */
export default function PayPalTestPage() {
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [fundingSources, setFundingSources] = useState<any>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPayPalSDK = () => {
      const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'AUmI5g_PA8vHr0HSeZq7PukrblnMLeOLQbW60lNHoJGLAqTg3JZjAeracZmAh1WSuuqmZnUIJxLdzGXc';

      // Enhanced SDK URL with guest checkout parameters
      const sdkParams = new URLSearchParams({
        'client-id': clientId,
        'intent': 'capture',
        'currency': 'USD',
        'components': 'buttons,funding-eligibility',
        'enable-funding': 'card,venmo,paylater',
        'disable-funding': '',
        'buyer-country': 'US',
        'locale': 'en_US',
        'commit': 'true'
      });

      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?${sdkParams.toString()}`;
      script.async = true;

      script.onload = () => {
        setSdkLoaded(true);

        // Check funding eligibility
        if (window.paypal) {
          try {
            const fundingCheck = {
              card: window.paypal.isFundingEligible ? window.paypal.isFundingEligible(window.paypal.FUNDING?.CARD) : 'unknown',
              paypal: window.paypal.isFundingEligible ? window.paypal.isFundingEligible(window.paypal.FUNDING?.PAYPAL) : 'unknown',
              venmo: window.paypal.isFundingEligible ? window.paypal.isFundingEligible(window.paypal.FUNDING?.VENMO) : 'unknown',
              paylater: window.paypal.isFundingEligible ? window.paypal.isFundingEligible(window.paypal.FUNDING?.PAYLATER) : 'unknown'
            };
            setFundingSources(fundingCheck);
          } catch (e) {
            console.error('Error checking funding sources:', e);
            setError('Error checking funding sources: ' + (e as Error).message);
          }
        }
      };

      script.onerror = () => {
        setError('Failed to load PayPal SDK');
      };

      document.head.appendChild(script);
    };

    loadPayPalSDK();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            PayPal Integration Test & Debug
          </h1>

          <div className="space-y-6">
            {/* SDK Status */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                SDK Status
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="font-medium mr-2">SDK Loaded:</span>
                    <span className={`px-2 py-1 rounded text-sm ${sdkLoaded ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {sdkLoaded ? '✅ Yes' : '⏳ Loading...'}
                    </span>
                  </div>
                  {error && (
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Error:</span>
                      <span className="px-2 py-1 rounded text-sm bg-red-100 text-red-800">
                        ❌ {error}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Environment Info */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Environment Configuration
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="space-y-2 text-sm">
                  <div><strong>Client ID:</strong> {process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID?.substring(0, 10)}...</div>
                  <div><strong>Environment:</strong> Production</div>
                  <div><strong>Currency:</strong> USD</div>
                  <div><strong>Intent:</strong> Capture</div>
                </div>
              </div>
            </div>

            {/* Funding Sources */}
            {sdkLoaded && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-3">
                  Funding Source Eligibility
                </h2>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>💳 Credit/Debit Cards:</span>
                        <span className={`px-2 py-1 rounded text-sm ${
                          fundingSources.card === true ? 'bg-green-100 text-green-800' :
                          fundingSources.card === false ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {fundingSources.card === true ? '✅ Enabled' :
                           fundingSources.card === false ? '❌ Disabled' : '❓ Unknown'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>🅿️ PayPal:</span>
                        <span className={`px-2 py-1 rounded text-sm ${
                          fundingSources.paypal === true ? 'bg-green-100 text-green-800' :
                          fundingSources.paypal === false ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {fundingSources.paypal === true ? '✅ Enabled' :
                           fundingSources.paypal === false ? '❌ Disabled' : '❓ Unknown'}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>💜 Venmo:</span>
                        <span className={`px-2 py-1 rounded text-sm ${
                          fundingSources.venmo === true ? 'bg-green-100 text-green-800' :
                          fundingSources.venmo === false ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {fundingSources.venmo === true ? '✅ Enabled' :
                           fundingSources.venmo === false ? '❌ Disabled' : '❓ Unknown'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>💰 Pay Later:</span>
                        <span className={`px-2 py-1 rounded text-sm ${
                          fundingSources.paylater === true ? 'bg-green-100 text-green-800' :
                          fundingSources.paylater === false ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {fundingSources.paylater === true ? '✅ Enabled' :
                           fundingSources.paylater === false ? '❌ Disabled' : '❓ Unknown'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Troubleshooting */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Troubleshooting Tips
              </h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="space-y-3 text-sm text-yellow-800">
                  <div>
                    <strong>If Credit/Debit Cards are disabled:</strong>
                    <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                      <li>Check your PayPal business account settings</li>
                      <li>Ensure "PayPal Account Optional" is enabled</li>
                      <li>Verify your account is approved for guest checkout</li>
                      <li>Check if there are country/region restrictions</li>
                    </ul>
                  </div>
                  <div>
                    <strong>Common Issues:</strong>
                    <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                      <li>New PayPal accounts may have guest checkout disabled initially</li>
                      <li>Some regions may not support all funding sources</li>
                      <li>Business account verification status affects available features</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Environment Variables Check */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Environment Variables (Client-Side)
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">NEXT_PUBLIC_PAYPAL_CLIENT_ID:</span>
                    <span className={process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ? 'text-green-600' : 'text-red-600'}>
                      {process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ? 
                        `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID.substring(0, 10)}...` : 
                        'NOT SET'
                      }
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="font-medium">NEXT_PUBLIC_BASE_URL:</span>
                    <span className={process.env.NEXT_PUBLIC_BASE_URL ? 'text-green-600' : 'text-red-600'}>
                      {process.env.NEXT_PUBLIC_BASE_URL || 'NOT SET'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="font-medium">NODE_ENV:</span>
                    <span className="text-gray-600">
                      {process.env.NODE_ENV || 'production'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* API Test */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                API Endpoints Test
              </h2>
              <div className="space-y-3">
                <a
                  href="/api/debug/env"
                  target="_blank"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Test Environment Debug API
                </a>

                <a
                  href="/api/paypal/client-config"
                  target="_blank"
                  className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors ml-3"
                >
                  Test PayPal Client Config API
                </a>
              </div>
            </div>

            {/* PayPal Order Test */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                PayPal Order Creation Test
              </h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm mb-3">
                  Test PayPal order creation with a $1.00 test order:
                </p>
                <button
                  onClick={async () => {
                    try {
                      console.log('🧪 Testing PayPal order creation...');
                      const response = await fetch('/api/paypal/create-order', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          amount: 1.00,
                          currency: 'USD',
                          registrationId: 'TEST_' + Date.now(),
                          registrationData: {
                            firstName: 'Test',
                            lastName: 'User',
                            email: 'test@example.com'
                          }
                        })
                      });
                      const data = await response.json();
                      console.log('📋 Order creation result:', data);
                      alert(data.success ?
                        `✅ Order created successfully! ID: ${data.orderId}` :
                        `❌ Order creation failed: ${data.error}`
                      );
                    } catch (error) {
                      console.error('❌ Order creation test failed:', error);
                      alert('❌ Order creation test failed. Check console for details.');
                    }
                  }}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Test Order Creation ($1.00)
                </button>
              </div>
            </div>
            
            {/* Instructions */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Troubleshooting Steps
              </h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                  <li>Check that all configuration values show as "CONFIGURED" or "SET" above</li>
                  <li>Test both API endpoints to ensure they return valid PayPal configuration</li>
                  <li>If environment variables are "NOT SET", redeploy the application</li>
                  <li>Clear browser cache and try again</li>
                  <li>Check browser console for any JavaScript errors</li>
                  <li>Verify PayPal buttons render properly on registration page</li>
                </ol>
              </div>
            </div>
            
            {/* Back to Registration */}
            <div className="pt-4 border-t border-gray-200">
              <a 
                href="/register" 
                className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                ← Back to Registration Page
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


