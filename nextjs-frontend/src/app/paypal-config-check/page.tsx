'use client';

import React, { useEffect, useState } from 'react';

interface ConfigStatus {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  config?: any;
}

interface ClientConfig {
  success: boolean;
  clientId?: string;
  environment?: string;
  baseUrl?: string;
  error?: string;
}

export default function PayPalConfigCheck() {
  const [serverConfig, setServerConfig] = useState<ConfigStatus | null>(null);
  const [clientConfig, setClientConfig] = useState<ClientConfig | null>(null);
  const [autoReturnConfig, setAutoReturnConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkConfigurations = async () => {
      try {
        // Check server-side configuration
        const serverResponse = await fetch('/api/paypal/validate-config');
        const serverData = await serverResponse.json();
        setServerConfig(serverData);

        // Check client-side configuration
        const clientResponse = await fetch('/api/paypal/client-config');
        const clientData = await clientResponse.json();
        setClientConfig(clientData);

        // Check auto-return configuration
        const autoReturnResponse = await fetch('/api/paypal/auto-return-config');
        const autoReturnData = await autoReturnResponse.json();
        setAutoReturnConfig(autoReturnData);

      } catch (error) {
        console.error('Error checking PayPal configuration:', error);
      } finally {
        setLoading(false);
      }
    };

    checkConfigurations();
  }, []);

  const getStatusIcon = (isValid: boolean) => isValid ? '✅' : '❌';
  const getStatusColor = (isValid: boolean) => 
    isValid ? 'text-green-600 bg-green-50 border-green-200' : 'text-red-600 bg-red-50 border-red-200';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              PayPal Configuration Check
            </h1>
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Checking PayPal configuration...</p>
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
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            PayPal Configuration Check
          </h1>
          
          <div className="space-y-6">
            {/* Server Configuration */}
            <div className={`border rounded-lg p-4 ${getStatusColor(serverConfig?.isValid || false)}`}>
              <h2 className="text-lg font-semibold mb-3">
                {getStatusIcon(serverConfig?.isValid || false)} Server Configuration
              </h2>
              
              {serverConfig?.errors && serverConfig.errors.length > 0 && (
                <div className="mb-3">
                  <h3 className="font-medium text-red-800 mb-2">Errors:</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {serverConfig.errors.map((error, index) => (
                      <li key={index} className="text-sm text-red-700">{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {serverConfig?.warnings && serverConfig.warnings.length > 0 && (
                <div className="mb-3">
                  <h3 className="font-medium text-yellow-800 mb-2">Warnings:</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {serverConfig.warnings.map((warning, index) => (
                      <li key={index} className="text-sm text-yellow-700">{warning}</li>
                    ))}
                  </ul>
                </div>
              )}

              {serverConfig?.config && (
                <div>
                  <h3 className="font-medium mb-2">Configuration Details:</h3>
                  <div className="text-sm space-y-1">
                    <div><strong>Environment:</strong> {serverConfig.config.environment}</div>
                    <div><strong>Base URL:</strong> {serverConfig.config.baseUrl}</div>
                    <div><strong>Has Client ID:</strong> {serverConfig.config.clientId ? 'Yes' : 'No'}</div>
                    <div><strong>Has Client Secret:</strong> {serverConfig.config.clientSecret ? 'Yes' : 'No'}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Client Configuration */}
            <div className={`border rounded-lg p-4 ${getStatusColor(clientConfig?.success || false)}`}>
              <h2 className="text-lg font-semibold mb-3">
                {getStatusIcon(clientConfig?.success || false)} Client Configuration
              </h2>
              
              {clientConfig?.error && (
                <div className="mb-3 text-red-700">
                  <strong>Error:</strong> {clientConfig.error}
                </div>
              )}

              {clientConfig?.success && (
                <div className="text-sm space-y-1">
                  <div><strong>Client ID:</strong> {clientConfig.clientId?.substring(0, 10)}...</div>
                  <div><strong>Environment:</strong> {clientConfig.environment}</div>
                  <div><strong>Base URL:</strong> {clientConfig.baseUrl}</div>
                </div>
              )}
            </div>

            {/* Auto Return Configuration */}
            {autoReturnConfig && (
              <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                <h2 className="text-lg font-semibold text-blue-900 mb-3">
                  📋 Auto Return Configuration
                </h2>
                
                <div className="text-sm space-y-2 mb-4">
                  <div><strong>Return URL:</strong> {autoReturnConfig.data?.autoReturnUrl}</div>
                  <div><strong>Cancel URL:</strong> {autoReturnConfig.data?.cancelUrl}</div>
                  <div><strong>SSL Enabled:</strong> {autoReturnConfig.data?.status?.sslEnabled ? 'Yes' : 'No'}</div>
                </div>

                <div className="bg-blue-100 border border-blue-300 rounded p-3">
                  <h3 className="font-medium text-blue-900 mb-2">Setup Instructions:</h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                    <li>Log into your PayPal Business Account</li>
                    <li>Go to Settings → Website Payments → Website Payment Preferences</li>
                    <li>Enable "Auto Return" and set Return URL to: <code className="bg-blue-200 px-1 rounded">{autoReturnConfig.data?.autoReturnUrl}</code></li>
                    <li>Enable "Payment Data Transfer (PDT)" (optional)</li>
                    <li>Save settings</li>
                  </ol>
                </div>
              </div>
            )}

            {/* Environment Variables Check */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                🔧 Environment Variables Status
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h3 className="font-medium mb-2">Server-side (Required):</h3>
                  <ul className="space-y-1">
                    <li>PAYPAL_CLIENT_ID: {serverConfig?.config?.clientId ? '✅' : '❌'}</li>
                    <li>PAYPAL_CLIENT_SECRET: {serverConfig?.config?.clientSecret ? '✅' : '❌'}</li>
                    <li>PAYPAL_ENVIRONMENT: {serverConfig?.config?.environment || '❌'}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Client-side (Required):</h3>
                  <ul className="space-y-1">
                    <li>NEXT_PUBLIC_PAYPAL_CLIENT_ID: {clientConfig?.clientId ? '✅' : '❌'}</li>
                    <li>NEXT_PUBLIC_BASE_URL: {clientConfig?.baseUrl ? '✅' : '❌'}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Items */}
            <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
              <h2 className="text-lg font-semibold text-yellow-900 mb-3">
                ⚡ Action Items
              </h2>
              
              <div className="text-sm text-yellow-800 space-y-2">
                {(!serverConfig?.isValid || !clientConfig?.success) && (
                  <div>🔧 <strong>Fix configuration errors above before proceeding</strong></div>
                )}
                
                <div>📋 <strong>Configure Auto Return in PayPal account</strong> (see instructions above)</div>
                <div>🔒 <strong>Set up webhook endpoint</strong> with PAYPAL_WEBHOOK_ID for production</div>
                <div>🧪 <strong>Test guest checkout</strong> at /test-guest-checkout</div>
                <div>💳 <strong>Verify PayPal account has "PayPal Account Optional" enabled</strong></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
