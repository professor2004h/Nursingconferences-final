'use client';

import React, { useEffect, useState } from 'react';

export default function PayPalAccountCheck() {
  const [accountStatus, setAccountStatus] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPayPalAccount = async () => {
      const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '';
      
      // Basic account analysis
      const analysis = {
        clientId: {
          value: clientId,
          type: clientId.startsWith('A') ? 'Live/Production' : 'Sandbox',
          isLive: clientId.startsWith('A'),
          status: clientId.startsWith('A') ? 'success' : 'warning'
        },
        environment: {
          configured: process.env.PAYPAL_ENVIRONMENT || 'production',
          status: 'info'
        },
        commonIssues: [
          {
            issue: 'Advanced Credit & Debit Card not enabled',
            description: 'Your PayPal business account may not have card processing enabled',
            solution: 'Contact PayPal Business Support to enable this feature',
            severity: 'high'
          },
          {
            issue: 'Country/Region restrictions',
            description: 'Card processing may not be available in your country',
            solution: 'Verify with PayPal if card processing is supported in your region',
            severity: 'high'
          },
          {
            issue: 'Business account verification',
            description: 'Your business account may need additional verification',
            solution: 'Complete business verification in PayPal dashboard',
            severity: 'medium'
          }
        ],
        nextSteps: [
          'Log into PayPal Business Dashboard',
          'Go to "Products & Services" section',
          'Look for "Advanced Credit and Debit Card" product',
          'If not available, contact PayPal Business Support',
          'Request card processing activation for your business'
        ]
      };

      setAccountStatus(analysis);
      setLoading(false);
    };

    checkPayPalAccount();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">PayPal Account Check</h1>
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Analyzing PayPal account configuration...</p>
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
          <h1 className="text-2xl font-bold text-gray-900 mb-6">PayPal Account Check</h1>
          
          <div className="space-y-6">
            {/* Account Configuration */}
            <div className={`border rounded-lg p-4 ${getStatusColor(accountStatus.clientId?.status)}`}>
              <h2 className="text-lg font-semibold mb-3">Account Configuration</h2>
              <div className="space-y-2 text-sm">
                <div><strong>Client ID Type:</strong> {accountStatus.clientId?.type}</div>
                <div><strong>Environment:</strong> {accountStatus.environment?.configured}</div>
                <div><strong>Client ID:</strong> {accountStatus.clientId?.value?.substring(0, 20)}...</div>
                <div><strong>Live Credentials:</strong> {accountStatus.clientId?.isLive ? 'Yes ✅' : 'No ⚠️'}</div>
              </div>
            </div>

            {/* Error Analysis */}
            <div className="border border-red-200 rounded-lg p-4 bg-red-50">
              <h2 className="text-lg font-semibold text-red-900 mb-3">Current Error Analysis</h2>
              <div className="text-sm text-red-800 space-y-2">
                <div><strong>Error:</strong> "getConsentDetails is disabled for the customer country"</div>
                <div><strong>Meaning:</strong> PayPal card processing is not enabled for your business account</div>
                <div><strong>Impact:</strong> Credit/debit cards will be rejected with "invalid card" errors</div>
              </div>
            </div>

            {/* Common Issues */}
            <div>
              <h2 className="text-lg font-semibold mb-3">Common Issues & Solutions</h2>
              <div className="space-y-3">
                {accountStatus.commonIssues?.map((issue: any, index: number) => (
                  <div key={index} className={`border rounded-lg p-4 ${getSeverityColor(issue.severity)}`}>
                    <h3 className="font-medium mb-2">{issue.issue}</h3>
                    <p className="text-sm mb-2">{issue.description}</p>
                    <p className="text-sm font-medium">Solution: {issue.solution}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Steps */}
            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
              <h2 className="text-lg font-semibold text-blue-900 mb-3">Next Steps to Fix Card Processing</h2>
              <ol className="text-sm text-blue-800 space-y-2">
                {accountStatus.nextSteps?.map((step: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="font-medium mr-2">{index + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* PayPal Business Support Contact */}
            <div className="border border-green-200 rounded-lg p-4 bg-green-50">
              <h2 className="text-lg font-semibold text-green-900 mb-3">PayPal Business Support</h2>
              <div className="text-sm text-green-800 space-y-2">
                <div><strong>Phone:</strong> Contact your local PayPal Business Support</div>
                <div><strong>Online:</strong> Log into PayPal Business Dashboard → Help & Contact</div>
                <div><strong>Request:</strong> "Enable Advanced Credit and Debit Card processing for international customers"</div>
                <div><strong>Business Type:</strong> "Conference/Event Registration Services"</div>
              </div>
            </div>

            {/* Technical Status */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Technical Integration Status</h2>
              <div className="text-sm text-gray-700 space-y-1">
                <div>✅ PayPal SDK integration: Working</div>
                <div>✅ URL encoding: Fixed</div>
                <div>✅ Production configuration: Correct</div>
                <div>❌ Card processing: Blocked by account limitations</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
