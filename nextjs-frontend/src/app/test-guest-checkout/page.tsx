'use client';

import React, { useEffect, useState } from 'react';

export default function TestGuestCheckout() {
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [fundingEligibility, setFundingEligibility] = useState<any>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPayPalSDK = () => {
      const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'AUmI5g_PA8vHr0HSeZq7PukrblnMLeOLQbW60lNHoJGLAqTg3JZjAeracZmAh1WSuuqmZnUIJxLdzGXc';
      
      // Use the same SDK configuration as the main PayPal button
      const environment = process.env.PAYPAL_ENVIRONMENT || 'production';
      let sdkUrl = `https://www.paypal.com/sdk/js?client-id=${clientId}&intent=capture&currency=USD&components=buttons&enable-funding=card&disable-funding=credit,paylater,venmo`;
      
      if (environment === 'sandbox') {
        sdkUrl += '&buyer-country=US';
      }

      const script = document.createElement('script');
      script.src = sdkUrl;
      script.async = true;
      
      script.onload = () => {
        setSdkLoaded(true);
        
        // Check funding eligibility
        if (window.paypal) {
          try {
            const eligibility = {
              card: window.paypal.isFundingEligible ? window.paypal.isFundingEligible(window.paypal.FUNDING?.CARD) : 'unknown',
              paypal: window.paypal.isFundingEligible ? window.paypal.isFundingEligible(window.paypal.FUNDING?.PAYPAL) : 'unknown',
              venmo: window.paypal.isFundingEligible ? window.paypal.isFundingEligible(window.paypal.FUNDING?.VENMO) : 'unknown',
              paylater: window.paypal.isFundingEligible ? window.paypal.isFundingEligible(window.paypal.FUNDING?.PAYLATER) : 'unknown'
            };
            setFundingEligibility(eligibility);
            
            // Render test buttons
            renderTestButtons();
          } catch (e) {
            console.error('Error checking funding eligibility:', e);
            setError('Error checking funding eligibility');
          }
        }
      };
      
      script.onerror = () => {
        setError('Failed to load PayPal SDK');
      };
      
      document.head.appendChild(script);
    };

    const renderTestButtons = () => {
      if (!window.paypal) return;

      try {
        window.paypal.Buttons({
          style: {
            layout: 'vertical',
            color: 'blue',
            shape: 'rect',
            height: 50,
          },
          createOrder: function() {
            // Mock order creation for testing
            return Promise.resolve('TEST_ORDER_ID');
          },
          onApprove: function(data: any) {
            console.log('✅ Payment approved:', data);
            alert('Test payment approved! (This is just a test)');
          },
          onError: function(err: any) {
            console.error('❌ Payment error:', err);
            alert('Payment error: ' + JSON.stringify(err));
          },
          onCancel: function(data: any) {
            console.log('❌ Payment cancelled:', data);
            alert('Payment cancelled');
          }
        }).render('#paypal-test-container');
      } catch (e) {
        console.error('Error rendering PayPal buttons:', e);
        setError('Error rendering PayPal buttons');
      }
    };

    loadPayPalSDK();
  }, []);

  const getStatusIcon = (status: any) => {
    if (status === true) return '✅';
    if (status === false) return '❌';
    return '❓';
  };

  const getStatusText = (status: any) => {
    if (status === true) return 'Enabled';
    if (status === false) return 'Disabled';
    return 'Unknown';
  };

  const getStatusColor = (status: any) => {
    if (status === true) return 'text-green-600 bg-green-50 border-green-200';
    if (status === false) return 'text-red-600 bg-red-50 border-red-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            PayPal Guest Checkout Test
          </h1>
          
          <div className="space-y-6">
            {/* SDK Status */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-blue-900 mb-3">SDK Status</h2>
              <div className="space-y-2">
                <div>
                  <strong>SDK Loaded:</strong> {sdkLoaded ? '✅ Yes' : '⏳ Loading...'}
                </div>
                <div>
                  <strong>Environment:</strong> {process.env.PAYPAL_ENVIRONMENT || 'production'}
                </div>
                <div>
                  <strong>Client ID:</strong> {process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID?.substring(0, 10)}...
                </div>
                {error && (
                  <div className="text-red-600">
                    <strong>Error:</strong> {error}
                  </div>
                )}
              </div>
            </div>

            {/* Funding Eligibility */}
            {sdkLoaded && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Funding Source Eligibility</h2>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(fundingEligibility).map(([source, status]) => (
                    <div 
                      key={source}
                      className={`border rounded-lg p-3 ${getStatusColor(status)}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium capitalize">{source}:</span>
                        <span>
                          {getStatusIcon(status)} {getStatusText(status)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Test Buttons */}
            {sdkLoaded && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Test PayPal Buttons</h2>
                <p className="text-sm text-gray-600 mb-4">
                  These buttons are for testing only. They won't process real payments.
                </p>
                <div id="paypal-test-container" className="min-h-[100px]"></div>
              </div>
            )}

            {/* Expected Results */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-green-900 mb-3">Expected Results</h2>
              <div className="text-sm text-green-800 space-y-2">
                <div>✅ <strong>Card funding should be "Enabled"</strong> - This allows guest checkout</div>
                <div>✅ <strong>Two buttons should appear:</strong> "PayPal" and "Debit or Credit Card"</div>
                <div>✅ <strong>Clicking "Debit or Credit Card"</strong> should open guest checkout form</div>
                <div>⚠️ <strong>If card is disabled:</strong> Check PayPal business account settings</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

declare global {
  interface Window {
    paypal: any;
  }
}
