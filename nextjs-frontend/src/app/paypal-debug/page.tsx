'use client';

import React, { useEffect, useState } from 'react';

/**
 * PayPal Debug Page - Quick diagnostic tool
 */
export default function PayPalDebugPage() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runDiagnostics = async () => {
    try {
      setLoading(true);
      setResults(null);

      console.log('🔍 Running PayPal diagnostics...');

      // Test 1: Backend Integration
      console.log('📡 Testing backend integration...');
      const backendResponse = await fetch('/api/paypal/test-integration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const backendData = await backendResponse.json();

      // Test 2: Create Test Order
      console.log('📦 Testing order creation...');
      const orderResponse = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 1.00,
          currency: 'USD',
          registrationId: 'DEBUG_TEST_' + Date.now(),
          registrationData: {
            firstName: 'Debug',
            lastName: 'Test',
            email: 'debug@test.com'
          }
        })
      });
      const orderData = await orderResponse.json();

      setResults({
        timestamp: new Date().toISOString(),
        backendTest: {
          success: backendResponse.ok && backendData.success,
          status: backendResponse.status,
          data: backendData
        },
        orderTest: {
          success: orderResponse.ok && orderData.success,
          status: orderResponse.status,
          data: orderData
        },
        summary: {
          backendWorking: backendResponse.ok && backendData.success,
          orderCreationWorking: orderResponse.ok && orderData.success,
          paypalCredentials: backendData.results?.credentials === 'VALID',
          environment: backendData.results?.environment
        }
      });

    } catch (error) {
      console.error('❌ Diagnostic error:', error);
      setResults({
        error: true,
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            PayPal Integration Diagnostics
          </h1>
          
          <div className="mb-6">
            <button
              onClick={runDiagnostics}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Running Diagnostics...' : 'Run Diagnostics'}
            </button>
          </div>

          {results && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-blue-900 mb-3">
                  Quick Summary
                </h2>
                {results.error ? (
                  <div className="text-red-600">
                    ❌ Error: {results.message}
                  </div>
                ) : (
                  <div className="space-y-2 text-sm">
                    <div className={results.summary?.backendWorking ? 'text-green-600' : 'text-red-600'}>
                      {results.summary?.backendWorking ? '✅' : '❌'} Backend Integration: {results.summary?.backendWorking ? 'Working' : 'Failed'}
                    </div>
                    <div className={results.summary?.orderCreationWorking ? 'text-green-600' : 'text-red-600'}>
                      {results.summary?.orderCreationWorking ? '✅' : '❌'} Order Creation: {results.summary?.orderCreationWorking ? 'Working' : 'Failed'}
                    </div>
                    <div className={results.summary?.paypalCredentials ? 'text-green-600' : 'text-red-600'}>
                      {results.summary?.paypalCredentials ? '✅' : '❌'} PayPal Credentials: {results.summary?.paypalCredentials ? 'Valid' : 'Invalid'}
                    </div>
                    <div className="text-gray-600">
                      🌍 Environment: {results.summary?.environment || 'Unknown'}
                    </div>
                  </div>
                )}
              </div>

              {/* Detailed Results */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-3">
                  Detailed Results
                </h2>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <pre className="text-xs overflow-auto whitespace-pre-wrap">
                    {JSON.stringify(results, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                  Next Steps
                </h3>
                <div className="text-sm text-yellow-800 space-y-2">
                  {results.summary?.backendWorking && results.summary?.orderCreationWorking ? (
                    <>
                      <p>✅ <strong>Great!</strong> Your PayPal integration is working correctly.</p>
                      <p>🎯 <strong>Test the full flow:</strong> Go to the registration page and test a real payment.</p>
                      <p>🔍 <strong>If 'Pay Now' still doesn't work:</strong> Check browser console for errors during payment.</p>
                    </>
                  ) : (
                    <>
                      <p>❌ <strong>Issues detected.</strong> Please check the detailed results above.</p>
                      <p>🔧 <strong>Common fixes:</strong></p>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Verify PayPal credentials in environment variables</li>
                        <li>Check if PayPal account is active and verified</li>
                        <li>Ensure proper network connectivity to PayPal APIs</li>
                        <li>Check server logs for detailed error messages</li>
                      </ul>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Recent Fixes */}
          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              Recent Fixes Applied
            </h3>
            <div className="text-sm text-green-800 space-y-1">
              <p>✅ Updated PayPal SDK with proper funding sources (enable-funding=card)</p>
              <p>✅ Corrected PayPal client secret from memory</p>
              <p>✅ Added enhanced debugging and error handling</p>
              <p>✅ Improved payment capture validation</p>
              <p>✅ Added onClick and onInit callbacks for better debugging</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
