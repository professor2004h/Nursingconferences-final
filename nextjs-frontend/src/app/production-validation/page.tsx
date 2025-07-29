'use client';

import React, { useEffect, useState } from 'react';

export default function ProductionValidation() {
  const [validationResults, setValidationResults] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateProduction = () => {
      const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '';
      const environment = process.env.PAYPAL_ENVIRONMENT || 'production';
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
      
      const results = {
        environment: {
          value: environment,
          isProduction: environment === 'production',
          status: environment === 'production' ? 'success' : 'error',
          message: environment === 'production' ? 'Production environment configured' : 'Not using production environment'
        },
        clientId: {
          value: clientId.substring(0, 10) + '...',
          isLive: clientId.startsWith('A'),
          status: clientId.startsWith('A') ? 'success' : 'error',
          message: clientId.startsWith('A') ? 'Live PayPal credentials detected' : 'Using sandbox credentials'
        },
        baseUrl: {
          value: baseUrl,
          isHttps: baseUrl.startsWith('https://'),
          isProduction: !baseUrl.includes('localhost'),
          status: (baseUrl.startsWith('https://') && !baseUrl.includes('localhost')) ? 'success' : 'error',
          message: (baseUrl.startsWith('https://') && !baseUrl.includes('localhost')) ? 'Production URL configured' : 'Not using production URL'
        },
        sdkConfiguration: {
          willUseBuyerCountry: false,
          willUseProductionSDK: true,
          status: 'success',
          message: 'SDK will use production configuration'
        }
      };

      // Check if buyer-country would be added (it shouldn't in production)
      const isLiveCredentials = clientId.startsWith('A');
      const actualEnvironment = isLiveCredentials ? 'production' : environment;
      const wouldUseBuyerCountry = actualEnvironment === 'sandbox' && !isLiveCredentials;
      
      results.sdkConfiguration = {
        willUseBuyerCountry: wouldUseBuyerCountry,
        willUseProductionSDK: !wouldUseBuyerCountry,
        status: wouldUseBuyerCountry ? 'error' : 'success',
        message: wouldUseBuyerCountry ? 
          'SDK will add buyer-country=US (WILL REJECT REAL CARDS)' : 
          'SDK will use production configuration (accepts real cards)'
      };

      setValidationResults(results);
      setLoading(false);
    };

    validateProduction();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return '❓';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Production Configuration Validation
            </h1>
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Validating production configuration...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const allValid = Object.values(validationResults).every((result: any) => result.status === 'success');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Production Configuration Validation
          </h1>
          
          {/* Overall Status */}
          <div className={`border rounded-lg p-4 mb-6 ${getStatusColor(allValid ? 'success' : 'error')}`}>
            <h2 className="text-lg font-semibold mb-2">
              {getStatusIcon(allValid ? 'success' : 'error')} Overall Status
            </h2>
            <p className="text-sm">
              {allValid ? 
                'Configuration is ready for production with real credit cards' : 
                'Configuration issues detected - real cards may be rejected'
              }
            </p>
          </div>

          <div className="space-y-4">
            {/* Environment Check */}
            <div className={`border rounded-lg p-4 ${getStatusColor(validationResults.environment?.status)}`}>
              <h3 className="font-semibold mb-2">
                {getStatusIcon(validationResults.environment?.status)} PayPal Environment
              </h3>
              <div className="text-sm space-y-1">
                <div><strong>Value:</strong> {validationResults.environment?.value}</div>
                <div><strong>Status:</strong> {validationResults.environment?.message}</div>
              </div>
            </div>

            {/* Client ID Check */}
            <div className={`border rounded-lg p-4 ${getStatusColor(validationResults.clientId?.status)}`}>
              <h3 className="font-semibold mb-2">
                {getStatusIcon(validationResults.clientId?.status)} PayPal Client ID
              </h3>
              <div className="text-sm space-y-1">
                <div><strong>Value:</strong> {validationResults.clientId?.value}</div>
                <div><strong>Type:</strong> {validationResults.clientId?.isLive ? 'Live Credentials' : 'Sandbox Credentials'}</div>
                <div><strong>Status:</strong> {validationResults.clientId?.message}</div>
              </div>
            </div>

            {/* Base URL Check */}
            <div className={`border rounded-lg p-4 ${getStatusColor(validationResults.baseUrl?.status)}`}>
              <h3 className="font-semibold mb-2">
                {getStatusIcon(validationResults.baseUrl?.status)} Base URL
              </h3>
              <div className="text-sm space-y-1">
                <div><strong>Value:</strong> {validationResults.baseUrl?.value}</div>
                <div><strong>HTTPS:</strong> {validationResults.baseUrl?.isHttps ? 'Yes' : 'No'}</div>
                <div><strong>Production Domain:</strong> {validationResults.baseUrl?.isProduction ? 'Yes' : 'No'}</div>
                <div><strong>Status:</strong> {validationResults.baseUrl?.message}</div>
              </div>
            </div>

            {/* SDK Configuration Check */}
            <div className={`border rounded-lg p-4 ${getStatusColor(validationResults.sdkConfiguration?.status)}`}>
              <h3 className="font-semibold mb-2">
                {getStatusIcon(validationResults.sdkConfiguration?.status)} PayPal SDK Configuration
              </h3>
              <div className="text-sm space-y-1">
                <div><strong>Will use buyer-country parameter:</strong> {validationResults.sdkConfiguration?.willUseBuyerCountry ? 'Yes (BAD)' : 'No (GOOD)'}</div>
                <div><strong>Will accept real cards:</strong> {validationResults.sdkConfiguration?.willUseProductionSDK ? 'Yes' : 'No'}</div>
                <div><strong>Status:</strong> {validationResults.sdkConfiguration?.message}</div>
              </div>
            </div>
          </div>

          {/* Critical Warning */}
          {!allValid && (
            <div className="mt-6 border border-red-300 rounded-lg p-4 bg-red-50">
              <h3 className="font-semibold text-red-900 mb-2">🚨 Critical Issues Detected</h3>
              <div className="text-sm text-red-800 space-y-2">
                <p><strong>Real credit cards will be rejected if:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>buyer-country=US parameter is added to SDK URL</li>
                  <li>Sandbox credentials are used instead of live credentials</li>
                  <li>Environment is set to 'sandbox' instead of 'production'</li>
                </ul>
                <p className="mt-3"><strong>Fix these issues before accepting real payments!</strong></p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {allValid && (
            <div className="mt-6 border border-green-300 rounded-lg p-4 bg-green-50">
              <h3 className="font-semibold text-green-900 mb-2">🎉 Production Ready!</h3>
              <div className="text-sm text-green-800 space-y-2">
                <p>Your PayPal configuration is correctly set up for production:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>✅ Live PayPal credentials configured</li>
                  <li>✅ Production environment enabled</li>
                  <li>✅ HTTPS production URL configured</li>
                  <li>✅ No sandbox parameters that would reject real cards</li>
                </ul>
                <p className="mt-3"><strong>Real credit cards should now work correctly!</strong></p>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="mt-6 border border-blue-200 rounded-lg p-4 bg-blue-50">
            <h3 className="font-semibold text-blue-900 mb-2">📋 Next Steps</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <div>1. Test with a real credit card (small amount)</div>
              <div>2. Verify PayPal Business account has "PayPal Account Optional" enabled</div>
              <div>3. Configure Auto Return in PayPal account settings</div>
              <div>4. Set up webhook endpoint for production notifications</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
