'use client';

import { useEffect, useState } from 'react';

interface ConfigStatus {
  success: boolean;
  configStatus: any;
  validationResults: any;
  summary: any;
  deployment?: any;
  troubleshooting?: any;
  timestamp: string;
}

export default function PayPalConfigVerifyPage() {
  const [configStatus, setConfigStatus] = useState<ConfigStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkConfig = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/paypal/config-status');
        const data = await response.json();
        setConfigStatus(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to check configuration');
      } finally {
        setLoading(false);
      }
    };

    checkConfig();
  }, []);

  // Client-side environment variable check
  const clientSideVars = {
    NEXT_PUBLIC_PAYPAL_CLIENT_ID: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
    NEXT_PUBLIC_PAYPAL_ENVIRONMENT: process.env.NEXT_PUBLIC_PAYPAL_ENVIRONMENT,
    NEXT_PUBLIC_PAYPAL_CURRENCY: process.env.NEXT_PUBLIC_PAYPAL_CURRENCY,
    NODE_ENV: process.env.NODE_ENV
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking PayPal configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            PayPal Configuration Verification
          </h1>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <span className="text-red-500 text-lg mr-2">❌</span>
                <div>
                  <h3 className="text-red-800 font-medium">Configuration Check Failed</h3>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Client-Side Variables */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Client-Side Environment Variables
            </h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(clientSideVars).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">{key}:</span>
                    <span className={`text-sm ${value ? 'text-green-600' : 'text-red-600'}`}>
                      {value ? 
                        (key.includes('CLIENT_ID') ? `${value.substring(0, 10)}...` : value) : 
                        'NOT SET'
                      }
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Server-Side Configuration Status */}
          {configStatus && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Server-Side Configuration Status
              </h2>
              
              {/* Overall Status */}
              <div className={`rounded-lg p-4 mb-4 ${
                configStatus.summary.readyForPayments 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center">
                  <span className={`text-lg mr-2 ${
                    configStatus.summary.readyForPayments ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {configStatus.summary.readyForPayments ? '✅' : '❌'}
                  </span>
                  <div>
                    <h3 className={`font-medium ${
                      configStatus.summary.readyForPayments ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {configStatus.summary.readyForPayments 
                        ? 'PayPal Configuration Complete' 
                        : 'PayPal Configuration Incomplete'
                      }
                    </h3>
                    <p className={`text-sm ${
                      configStatus.summary.readyForPayments ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {configStatus.summary.readyForPayments 
                        ? 'All required environment variables are properly configured' 
                        : 'Some required environment variables are missing or incorrect'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Detailed Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 mb-2">Client Variables</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>NEXT_PUBLIC_PAYPAL_CLIENT_ID:</span>
                      <span className={configStatus.configStatus.hasNextPublicPayPalClientId ? 'text-green-600' : 'text-red-600'}>
                        {configStatus.configStatus.hasNextPublicPayPalClientId ? '✅ Set' : '❌ Missing'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Environment:</span>
                      <span className="text-gray-600">
                        {configStatus.configStatus.nextPublicPayPalEnvironment}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 mb-2">Server Variables</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>PAYPAL_CLIENT_ID:</span>
                      <span className={configStatus.configStatus.hasPayPalClientId ? 'text-green-600' : 'text-red-600'}>
                        {configStatus.configStatus.hasPayPalClientId ? '✅ Set' : '❌ Missing'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>PAYPAL_CLIENT_SECRET:</span>
                      <span className={configStatus.configStatus.hasPayPalClientSecret ? 'text-green-600' : 'text-red-600'}>
                        {configStatus.configStatus.hasPayPalClientSecret ? '✅ Set' : '❌ Missing'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Troubleshooting */}
              {configStatus.troubleshooting && configStatus.troubleshooting.missingVars.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-yellow-800 mb-2">Missing Variables</h4>
                  <ul className="list-disc list-inside text-sm text-yellow-700">
                    {configStatus.troubleshooting.missingVars.map((varName: string) => (
                      <li key={varName}>{varName}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Deployment Info */}
              {configStatus.deployment && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Deployment Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm text-blue-700">
                    <div>Environment: {configStatus.deployment.nodeEnv}</div>
                    <div>Node Version: {configStatus.deployment.nodeVersion}</div>
                    <div>Platform: {configStatus.deployment.platform}</div>
                    <div>Timestamp: {new Date(configStatus.timestamp).toLocaleString()}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh Check
            </button>
            <a
              href="/registration"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Test Registration Page
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
