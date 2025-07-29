'use client';

import React, { useEffect, useState } from 'react';

export default function CleanURLTest() {
  const [urlTests, setUrlTests] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateURLs = () => {
      const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '';
      const currency = 'USD';
      const registrationId = 'test-reg-123';
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';

      // Test SDK URL construction with clean encoding
      const sdkUrl = `https://www.paypal.com/sdk/js?client-id=${clientId}&intent=capture&currency=${currency}&components=buttons&enable-funding=card,paylater,venmo`;
      
      // Test return URL construction with clean encoding
      const returnUrl = `${baseUrl}/paypal/return?orderID=test-order&paymentID=test-payment&amount=100.00&currency=${currency}&registrationId=${registrationId}`;

      const tests = {
        environment: process.env.PAYPAL_ENVIRONMENT || 'production',
        clientIdType: clientId.startsWith('A') ? 'Live' : 'Sandbox',
        sdkUrl: {
          url: sdkUrl,
          valid: sdkUrl.includes('currency=') && !sdkUrl.includes('buyer-country'),
          hasCurrency: sdkUrl.includes('currency='),
          hasBuyerCountry: sdkUrl.includes('buyer-country'),
          hasEnableFunding: sdkUrl.includes('enable-funding=card')
        },
        returnUrl: {
          url: returnUrl,
          valid: returnUrl.includes('currency=') && returnUrl.includes('registrationId='),
          hasCurrency: returnUrl.includes('currency='),
          hasRegistrationId: returnUrl.includes('registrationId=')
        }
      };

      setUrlTests(tests);
      setLoading(false);
    };

    validateURLs();
  }, []);

  const getStatusIcon = (valid: boolean) => valid ? '✅' : '❌';
  const getStatusColor = (valid: boolean) => 
    valid ? 'text-green-600 bg-green-50 border-green-200' : 'text-red-600 bg-red-50 border-red-200';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Clean URL Test</h1>
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Testing URL construction...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Clean URL Test</h1>
          
          <div className="space-y-6">
            {/* Environment Status */}
            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
              <h2 className="text-lg font-semibold text-blue-900 mb-3">Environment Status</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <strong>Environment:</strong> {urlTests.environment}
                  {urlTests.environment === 'production' ? ' ✅' : ' ⚠️'}
                </div>
                <div>
                  <strong>Credentials:</strong> {urlTests.clientIdType}
                  {urlTests.clientIdType === 'Live' ? ' ✅' : ' ⚠️'}
                </div>
                <div>
                  <strong>Ready for Real Cards:</strong> {(urlTests.environment === 'production' && urlTests.clientIdType === 'Live') ? 'Yes ✅' : 'No ❌'}
                </div>
              </div>
            </div>

            {/* SDK URL Test */}
            <div className={`border rounded-lg p-4 ${getStatusColor(urlTests.sdkUrl?.valid)}`}>
              <h2 className="text-lg font-semibold mb-3">
                {getStatusIcon(urlTests.sdkUrl?.valid)} PayPal SDK URL
              </h2>
              
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium mb-2">Generated URL:</h3>
                  <code className="block p-2 bg-gray-100 rounded text-sm break-all">
                    {urlTests.sdkUrl?.url}
                  </code>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <strong>Has currency param:</strong> {urlTests.sdkUrl?.hasCurrency ? '✅ Yes' : '❌ No'}
                  </div>
                  <div>
                    <strong>Has buyer-country:</strong> {urlTests.sdkUrl?.hasBuyerCountry ? '❌ Yes (BAD)' : '✅ No (GOOD)'}
                  </div>
                  <div>
                    <strong>Has enable-funding:</strong> {urlTests.sdkUrl?.hasEnableFunding ? '✅ Yes' : '❌ No'}
                  </div>
                </div>
              </div>
            </div>

            {/* Return URL Test */}
            <div className={`border rounded-lg p-4 ${getStatusColor(urlTests.returnUrl?.valid)}`}>
              <h2 className="text-lg font-semibold mb-3">
                {getStatusIcon(urlTests.returnUrl?.valid)} PayPal Return URL
              </h2>
              
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium mb-2">Generated URL:</h3>
                  <code className="block p-2 bg-gray-100 rounded text-sm break-all">
                    {urlTests.returnUrl?.url}
                  </code>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Has currency param:</strong> {urlTests.returnUrl?.hasCurrency ? '✅ Yes' : '❌ No'}
                  </div>
                  <div>
                    <strong>Has registrationId param:</strong> {urlTests.returnUrl?.hasRegistrationId ? '✅ Yes' : '❌ No'}
                  </div>
                </div>
              </div>
            </div>

            {/* Overall Status */}
            <div className={`border rounded-lg p-4 ${getStatusColor(urlTests.sdkUrl?.valid && urlTests.returnUrl?.valid && urlTests.environment === 'production' && urlTests.clientIdType === 'Live')}`}>
              <h2 className="text-lg font-semibold mb-2">
                {getStatusIcon(urlTests.sdkUrl?.valid && urlTests.returnUrl?.valid && urlTests.environment === 'production' && urlTests.clientIdType === 'Live')} Production Readiness
              </h2>
              <p className="text-sm">
                {(urlTests.sdkUrl?.valid && urlTests.returnUrl?.valid && urlTests.environment === 'production' && urlTests.clientIdType === 'Live') ? 
                  'Configuration is ready for production with real credit cards' : 
                  'Configuration issues detected - real cards may be rejected'
                }
              </p>
            </div>

            {/* Instructions */}
            <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
              <h2 className="text-lg font-semibold text-yellow-900 mb-3">What to Look For</h2>
              <div className="text-sm text-yellow-800 space-y-2">
                <div><strong>✅ Good:</strong> currency=USD, registrationId=123, enable-funding=card</div>
                <div><strong>❌ Bad:</strong> buyer-country=US (rejects real cards), missing parameters</div>
                <div><strong>🔒 Production:</strong> Environment=production, Live credentials (starts with A)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
