'use client';

import React, { useEffect, useState } from 'react';

export default function PayPalFinalValidation() {
  const [validationResults, setValidationResults] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const runComprehensiveValidation = () => {
      const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '';
      const environment = process.env.PAYPAL_ENVIRONMENT || 'production';
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
      const currency = 'USD';
      const registrationId = 'test-reg-123';

      // Simulate the exact logic from PayPalButton.tsx
      const isLiveCredentials = clientId.startsWith('A');
      const actualEnvironment = isLiveCredentials ? 'production' : environment;

      // Test SDK URL construction (exact same logic as PayPalButton.tsx)
      let sdkUrl = `https://www.paypal.com/sdk/js?client-id=${clientId}&intent=capture&currency=${currency}&components=buttons&enable-funding=card,paylater,venmo`;
      
      // Check if buyer-country would be added
      let wouldAddBuyerCountry = false;
      if (actualEnvironment === 'sandbox' && !isLiveCredentials) {
        sdkUrl += '&buyer-country=US';
        wouldAddBuyerCountry = true;
      }

      // Test return URL construction (exact same logic as PayPalButton.tsx)
      const returnUrl = `${baseUrl}/paypal/return` +
        `?orderID=test-order-123` +
        `&paymentID=test-payment-456` +
        `&amount=100.00` +
        `&currency=${currency}` +
        `&registrationId=${registrationId}`;

      const results = {
        environment: {
          configured: environment,
          actual: actualEnvironment,
          isProduction: actualEnvironment === 'production',
          status: actualEnvironment === 'production' ? 'success' : 'warning'
        },
        credentials: {
          type: isLiveCredentials ? 'Live' : 'Sandbox',
          clientIdPrefix: clientId.substring(0, 10),
          isLive: isLiveCredentials,
          status: isLiveCredentials ? 'success' : 'warning'
        },
        sdkUrl: {
          url: sdkUrl,
          hasCurrency: sdkUrl.includes('currency='),
          hasEnableFunding: sdkUrl.includes('enable-funding=card'),
          hasBuyerCountry: wouldAddBuyerCountry,
          hasCleanEncoding: !sdkUrl.includes('¤') && !sdkUrl.includes('®'),
          status: (sdkUrl.includes('currency=') && !wouldAddBuyerCountry && !sdkUrl.includes('¤')) ? 'success' : 'error'
        },
        returnUrl: {
          url: returnUrl,
          hasCurrency: returnUrl.includes('currency='),
          hasRegistrationId: returnUrl.includes('registrationId='),
          hasCleanEncoding: !returnUrl.includes('¤') && !returnUrl.includes('®'),
          status: (returnUrl.includes('currency=') && returnUrl.includes('registrationId=') && !returnUrl.includes('¤') && !returnUrl.includes('®')) ? 'success' : 'error'
        },
        readyForRealCards: false
      };

      // Overall readiness check
      results.readyForRealCards = (
        results.environment.isProduction &&
        results.credentials.isLive &&
        results.sdkUrl.status === 'success' &&
        results.returnUrl.status === 'success' &&
        !results.sdkUrl.hasBuyerCountry
      );

      setValidationResults(results);
      setLoading(false);
    };

    runComprehensiveValidation();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return '❓';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">PayPal Final Validation</h1>
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Running comprehensive validation...</p>
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
          <h1 className="text-2xl font-bold text-gray-900 mb-6">PayPal Final Validation</h1>
          
          {/* Overall Status */}
          <div className={`border rounded-lg p-4 mb-6 ${getStatusColor(validationResults.readyForRealCards ? 'success' : 'error')}`}>
            <h2 className="text-lg font-semibold mb-2">
              {getStatusIcon(validationResults.readyForRealCards ? 'success' : 'error')} Ready for Real Credit Cards
            </h2>
            <p className="text-sm">
              {validationResults.readyForRealCards ? 
                'Configuration is ready for production - real credit cards should work' : 
                'Configuration issues detected - real credit cards may be rejected'
              }
            </p>
          </div>

          <div className="space-y-4">
            {/* Environment */}
            <div className={`border rounded-lg p-4 ${getStatusColor(validationResults.environment?.status)}`}>
              <h3 className="font-semibold mb-2">
                {getStatusIcon(validationResults.environment?.status)} Environment Configuration
              </h3>
              <div className="text-sm space-y-1">
                <div><strong>Configured:</strong> {validationResults.environment?.configured}</div>
                <div><strong>Actual:</strong> {validationResults.environment?.actual}</div>
                <div><strong>Production Mode:</strong> {validationResults.environment?.isProduction ? 'Yes' : 'No'}</div>
              </div>
            </div>

            {/* Credentials */}
            <div className={`border rounded-lg p-4 ${getStatusColor(validationResults.credentials?.status)}`}>
              <h3 className="font-semibold mb-2">
                {getStatusIcon(validationResults.credentials?.status)} PayPal Credentials
              </h3>
              <div className="text-sm space-y-1">
                <div><strong>Type:</strong> {validationResults.credentials?.type}</div>
                <div><strong>Client ID:</strong> {validationResults.credentials?.clientIdPrefix}...</div>
                <div><strong>Live Credentials:</strong> {validationResults.credentials?.isLive ? 'Yes' : 'No'}</div>
              </div>
            </div>

            {/* SDK URL */}
            <div className={`border rounded-lg p-4 ${getStatusColor(validationResults.sdkUrl?.status)}`}>
              <h3 className="font-semibold mb-2">
                {getStatusIcon(validationResults.sdkUrl?.status)} PayPal SDK URL
              </h3>
              <div className="space-y-2">
                <code className="block p-2 bg-gray-100 rounded text-xs break-all">
                  {validationResults.sdkUrl?.url}
                </code>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Currency param: {validationResults.sdkUrl?.hasCurrency ? '✅' : '❌'}</div>
                  <div>Enable funding: {validationResults.sdkUrl?.hasEnableFunding ? '✅' : '❌'}</div>
                  <div>Buyer country: {validationResults.sdkUrl?.hasBuyerCountry ? '❌ Present' : '✅ Absent'}</div>
                  <div>Clean encoding: {validationResults.sdkUrl?.hasCleanEncoding ? '✅' : '❌'}</div>
                </div>
              </div>
            </div>

            {/* Return URL */}
            <div className={`border rounded-lg p-4 ${getStatusColor(validationResults.returnUrl?.status)}`}>
              <h3 className="font-semibold mb-2">
                {getStatusIcon(validationResults.returnUrl?.status)} Return URL
              </h3>
              <div className="space-y-2">
                <code className="block p-2 bg-gray-100 rounded text-xs break-all">
                  {validationResults.returnUrl?.url}
                </code>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Currency param: {validationResults.returnUrl?.hasCurrency ? '✅' : '❌'}</div>
                  <div>Registration ID: {validationResults.returnUrl?.hasRegistrationId ? '✅' : '❌'}</div>
                  <div>Clean encoding: {validationResults.returnUrl?.hasCleanEncoding ? '✅' : '❌'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="mt-6 border border-blue-200 rounded-lg p-4 bg-blue-50">
            <h3 className="font-semibold text-blue-900 mb-2">Next Steps</h3>
            <div className="text-sm text-blue-800 space-y-1">
              {validationResults.readyForRealCards ? (
                <>
                  <div>1. Test with real credit card (small amount)</div>
                  <div>2. Ensure PayPal business account has "Advanced credit & debit card" enabled</div>
                  <div>3. Contact PayPal Business Support if card payments still fail</div>
                </>
              ) : (
                <>
                  <div>1. Fix configuration issues shown above</div>
                  <div>2. Ensure live credentials and production environment</div>
                  <div>3. Verify no encoding issues in URLs</div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
