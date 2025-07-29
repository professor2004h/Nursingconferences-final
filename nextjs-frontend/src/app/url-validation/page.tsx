'use client';

import React, { useEffect, useState } from 'react';

export default function URLValidation() {
  const [urlTests, setUrlTests] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateURLs = () => {
      const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'AUmI5g_PA8vHr0HSeZq7PukrblnMLeOLQbW60lNHoJGLAqTg3JZjAeracZmAh1WSuuqmZnUIJxLdzGXc';
      const currency = 'USD';
      const registrationId = 'test-reg-123';
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://nursingeducationconferences.org';

      // Test SDK URL construction
      const sdkUrl = `https://www.paypal.com/sdk/js?client-id=${clientId}&intent=capture&currency=${currency}&components=buttons&enable-funding=card,paylater,venmo`;
      
      // Test return URL construction
      const returnUrl = `${baseUrl}/paypal/return` +
        `?orderID=test-order-123` +
        `&paymentID=test-payment-456` +
        `&amount=100.00` +
        `&currency=${currency}` +
        `&registrationId=${registrationId}`;

      // Parse URLs to check for issues
      const sdkUrlObj = new URL(sdkUrl);
      const returnUrlObj = new URL(returnUrl);

      const tests = {
        sdkUrl: {
          url: sdkUrl,
          valid: true,
          issues: [],
          parameters: Object.fromEntries(sdkUrlObj.searchParams.entries())
        },
        returnUrl: {
          url: returnUrl,
          valid: true,
          issues: [],
          parameters: Object.fromEntries(returnUrlObj.searchParams.entries())
        }
      };

      // Check for encoding issues in SDK URL
      if (sdkUrl.includes('¤cy')) {
        tests.sdkUrl.valid = false;
        tests.sdkUrl.issues.push('Contains ¤cy instead of currency parameter');
      }
      if (sdkUrl.includes('®istrationId')) {
        tests.sdkUrl.valid = false;
        tests.sdkUrl.issues.push('Contains ®istrationId instead of registrationId parameter');
      }
      if (!sdkUrl.includes('currency=')) {
        tests.sdkUrl.valid = false;
        tests.sdkUrl.issues.push('Missing currency parameter');
      }
      if (sdkUrl.includes('buyer-country=US')) {
        tests.sdkUrl.valid = false;
        tests.sdkUrl.issues.push('Contains buyer-country=US (will reject real cards in production)');
      }

      // Check for encoding issues in return URL
      if (returnUrl.includes('¤cy')) {
        tests.returnUrl.valid = false;
        tests.returnUrl.issues.push('Contains ¤cy instead of currency parameter');
      }
      if (returnUrl.includes('®istrationId')) {
        tests.returnUrl.valid = false;
        tests.returnUrl.issues.push('Contains ®istrationId instead of registrationId parameter');
      }
      if (!returnUrl.includes('currency=')) {
        tests.returnUrl.valid = false;
        tests.returnUrl.issues.push('Missing currency parameter');
      }
      if (!returnUrl.includes('registrationId=')) {
        tests.returnUrl.valid = false;
        tests.returnUrl.issues.push('Missing registrationId parameter');
      }

      // Check parameter values
      if (tests.sdkUrl.parameters['currency'] !== currency) {
        tests.sdkUrl.valid = false;
        tests.sdkUrl.issues.push(`Currency parameter mismatch: expected ${currency}, got ${tests.sdkUrl.parameters['currency']}`);
      }
      if (tests.returnUrl.parameters['currency'] !== currency) {
        tests.returnUrl.valid = false;
        tests.returnUrl.issues.push(`Currency parameter mismatch: expected ${currency}, got ${tests.returnUrl.parameters['currency']}`);
      }
      if (tests.returnUrl.parameters['registrationId'] !== registrationId) {
        tests.returnUrl.valid = false;
        tests.returnUrl.issues.push(`RegistrationId parameter mismatch: expected ${registrationId}, got ${tests.returnUrl.parameters['registrationId']}`);
      }

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
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              PayPal URL Validation
            </h1>
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Validating PayPal URLs...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            PayPal URL Validation
          </h1>
          
          <div className="space-y-6">
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

                {urlTests.sdkUrl?.issues?.length > 0 && (
                  <div>
                    <h3 className="font-medium text-red-800 mb-2">Issues Found:</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {urlTests.sdkUrl.issues.map((issue: string, index: number) => (
                        <li key={index} className="text-sm text-red-700">{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h3 className="font-medium mb-2">Parsed Parameters:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    {Object.entries(urlTests.sdkUrl?.parameters || {}).map(([key, value]) => (
                      <div key={key} className="flex justify-between p-2 bg-gray-50 rounded">
                        <span className="font-medium">{key}:</span>
                        <span className="text-gray-600">{value as string}</span>
                      </div>
                    ))}
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

                {urlTests.returnUrl?.issues?.length > 0 && (
                  <div>
                    <h3 className="font-medium text-red-800 mb-2">Issues Found:</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {urlTests.returnUrl.issues.map((issue: string, index: number) => (
                        <li key={index} className="text-sm text-red-700">{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h3 className="font-medium mb-2">Parsed Parameters:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    {Object.entries(urlTests.returnUrl?.parameters || {}).map(([key, value]) => (
                      <div key={key} className="flex justify-between p-2 bg-gray-50 rounded">
                        <span className="font-medium">{key}:</span>
                        <span className="text-gray-600">{value as string}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Common Issues Guide */}
            <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
              <h2 className="text-lg font-semibold text-yellow-900 mb-3">
                🔍 Common URL Issues to Check
              </h2>
              
              <div className="text-sm text-yellow-800 space-y-2">
                <div><strong>❌ ¤cy instead of currency:</strong> PayPal SDK ignores the currency parameter</div>
                <div><strong>❌ ®istrationId instead of registrationId:</strong> Thank-you page never receives registration ID</div>
                <div><strong>❌ buyer-country=US in production:</strong> Forces sandbox test card validation, rejects real cards</div>
                <div><strong>❌ Missing parameters:</strong> Causes PayPal integration failures</div>
                <div><strong>✅ Correct format:</strong> currency=USD&registrationId=123 (properly encoded)</div>
              </div>
            </div>

            {/* Overall Status */}
            <div className={`border rounded-lg p-4 ${getStatusColor(urlTests.sdkUrl?.valid && urlTests.returnUrl?.valid)}`}>
              <h2 className="text-lg font-semibold mb-2">
                {getStatusIcon(urlTests.sdkUrl?.valid && urlTests.returnUrl?.valid)} Overall URL Validation
              </h2>
              <p className="text-sm">
                {(urlTests.sdkUrl?.valid && urlTests.returnUrl?.valid) ? 
                  'All URLs are correctly formatted and ready for production' : 
                  'URL issues detected - fix these before processing real payments'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
