'use client';

import React from 'react';

/**
 * PayPal Test Page
 * Quick page to test PayPal configuration and debug issues
 * Visit: /paypal-test
 */
export default function PayPalTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            PayPal Integration Test & Debug
          </h1>
          
          <div className="space-y-6">
            {/* PayPal Configuration Status */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Configuration Status
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  ✅ PayPal integration has been simplified and rebuilt from scratch.
                  <br />
                  🔧 Using official PayPal JavaScript SDK with direct script loading.
                  <br />
                  📋 Check the environment variables below for configuration status.
                </p>
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
