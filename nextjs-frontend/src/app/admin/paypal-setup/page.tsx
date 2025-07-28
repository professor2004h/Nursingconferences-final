'use client';

import React, { useEffect, useState } from 'react';

interface PayPalConfig {
  autoReturnUrl: string;
  cancelUrl: string;
  environment: string;
  instructions: {
    title: string;
    steps: Array<{
      step: number;
      title: string;
      description: string;
    }>;
    requirements: string[];
    notes: string[];
  };
  status: {
    returnUrlConfigured: boolean;
    cancelUrlConfigured: boolean;
    sslEnabled: boolean;
    environment: string;
    domain: string;
    timestamp: string;
  };
}

const PayPalSetupPage: React.FC = () => {
  const [config, setConfig] = useState<PayPalConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/api/paypal/auto-return-config');
        const data = await response.json();
        
        if (data.success) {
          setConfig(data.data);
        } else {
          setError(data.error || 'Failed to load configuration');
        }
      } catch (err) {
        setError('Failed to fetch PayPal configuration');
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading PayPal configuration...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-red-500 text-4xl mb-4">❌</div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Configuration Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!config) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">PayPal Auto Return Setup</h1>
          <p className="text-gray-600 mb-6">
            Configure your PayPal Business account to enable Auto Return functionality for seamless payment processing.
          </p>
          
          {/* Current Status */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Current Configuration Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <span className={`w-3 h-3 rounded-full mr-3 ${config.status.sslEnabled ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className="font-medium">SSL Enabled:</span>
                <span className="ml-2">{config.status.sslEnabled ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-green-500 mr-3"></span>
                <span className="font-medium">Environment:</span>
                <span className="ml-2 capitalize">{config.status.environment}</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-green-500 mr-3"></span>
                <span className="font-medium">Domain:</span>
                <span className="ml-2">{config.status.domain}</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-green-500 mr-3"></span>
                <span className="font-medium">Return URL:</span>
                <span className="ml-2">Configured</span>
              </div>
            </div>
          </div>
        </div>

        {/* URLs to Configure */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">URLs to Configure in PayPal</h2>
          
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Auto Return URL</label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={config.autoReturnUrl}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 font-mono text-sm"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(config.autoReturnUrl)}
                  className="ml-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  Copy
                </button>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Cancel Return URL</label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={config.cancelUrl}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 font-mono text-sm"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(config.cancelUrl)}
                  className="ml-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{config.instructions.title}</h2>
          
          <div className="space-y-6">
            {config.instructions.steps.map((step) => (
              <div key={step.step} className="flex">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">
                  {step.step}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Requirements */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Requirements</h2>
          <ul className="space-y-2">
            {config.instructions.requirements.map((requirement, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">{requirement}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Important Notes */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-yellow-900 mb-6">Important Notes</h2>
          <ul className="space-y-2">
            {config.instructions.notes.map((note, index) => (
              <li key={index} className="flex items-start">
                <span className="text-yellow-500 mr-2">⚠️</span>
                <span className="text-yellow-800">{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PayPalSetupPage;
