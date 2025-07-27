'use client';

import React, { useEffect, useState } from 'react';

/**
 * PayPal SDK Test Page
 * Tests PayPal integration using the exact pattern from PayPal's official documentation
 */
export default function PayPalSDKTestPage() {
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [paypalLoaded, setPaypalLoaded] = useState(false);

  // Test PayPal integration
  const runIntegrationTest = async () => {
    try {
      setLoading(true);
      console.log('🧪 Running PayPal integration test...');

      const response = await fetch('/api/paypal/test-integration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      setTestResults(data);
      
      console.log('📋 Integration test results:', data);
    } catch (error) {
      console.error('❌ Integration test failed:', error);
      setTestResults({
        success: false,
        error: 'Test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Load PayPal SDK for testing
  useEffect(() => {
    if (window.paypal) {
      setPaypalLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://www.paypal.com/sdk/js?client-id=AUmI5g_PA8vHr0HSeZq7PukrblnMLeOLQbW60lNHoJGLAqTg3JZjAeracZmAh1WSuuqmZnUIJxLdzGXc&currency=USD&intent=capture&components=buttons&enable-funding=venmo,paylater,card&disable-funding=credit&env=production';
    script.async = true;

    script.onload = () => {
      console.log('✅ PayPal SDK loaded successfully');
      setPaypalLoaded(true);
    };

    script.onerror = () => {
      console.error('❌ Failed to load PayPal SDK');
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Initialize PayPal buttons when SDK is loaded
  useEffect(() => {
    if (!paypalLoaded || !window.paypal) return;

    const container = document.getElementById('paypal-test-buttons');
    if (!container) return;

    container.innerHTML = '';

    try {
      window.paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'paypal',
          height: 50,
        },

        createOrder: async () => {
          try {
            console.log('🔄 Creating test PayPal order...');

            const response = await fetch('/api/paypal/create-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                amount: 1.00,
                currency: 'USD',
                registrationId: 'SDK_TEST_' + Date.now(),
                registrationData: {
                  firstName: 'Test',
                  lastName: 'User',
                  email: 'test@example.com'
                }
              })
            });

            const data = await response.json();
            
            if (!response.ok || !data.success) {
              throw new Error(data.error || 'Failed to create order');
            }

            console.log('✅ Test order created:', data.orderId);
            return data.orderId;

          } catch (error) {
            console.error('❌ Error creating test order:', error);
            alert('Failed to create test order: ' + (error instanceof Error ? error.message : 'Unknown error'));
            throw error;
          }
        },

        onApprove: async (data: any) => {
          try {
            console.log('🎉 PayPal onApprove triggered:', data);

            const response = await fetch('/api/paypal/capture-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: data.orderID,
                registrationId: 'SDK_TEST_' + Date.now()
              })
            });

            const captureData = await response.json();
            
            if (!response.ok || !captureData.success) {
              throw new Error(captureData.error || 'Failed to capture payment');
            }

            console.log('✅ Payment captured successfully:', captureData);
            alert('✅ Test payment successful! Payment ID: ' + captureData.paymentId);

          } catch (error) {
            console.error('❌ Error capturing payment:', error);
            alert('❌ Payment capture failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
          }
        },

        onError: (error: any) => {
          console.error('❌ PayPal button error:', error);
          alert('❌ PayPal error: ' + JSON.stringify(error));
        },

        onCancel: () => {
          console.log('⚠️ Payment cancelled by user');
          alert('⚠️ Payment was cancelled');
        }

      }).render('#paypal-test-buttons');

      console.log('✅ PayPal test buttons rendered');

    } catch (error) {
      console.error('❌ Error rendering PayPal buttons:', error);
    }
  }, [paypalLoaded]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            PayPal SDK Integration Test
          </h1>
          
          <div className="space-y-6">
            {/* Integration Test */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Backend Integration Test
              </h2>
              <button
                onClick={runIntegrationTest}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Testing...' : 'Run Integration Test'}
              </button>
              
              {testResults && (
                <div className={`mt-4 p-4 rounded-lg ${testResults.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <pre className="text-sm overflow-auto">
                    {JSON.stringify(testResults, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* PayPal SDK Test */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                PayPal SDK Test ($1.00)
              </h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-yellow-800 text-sm">
                  This tests the complete PayPal flow using the official SDK pattern.
                  Click the PayPal button below to test order creation and payment capture.
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <div id="paypal-test-buttons" className="min-h-[60px]">
                  {!paypalLoaded && (
                    <div className="text-center text-gray-500">
                      Loading PayPal SDK...
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Test Instructions
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                  <li>First run the "Integration Test" to verify backend configuration</li>
                  <li>Then test the PayPal SDK buttons below</li>
                  <li>Check browser console for detailed logs</li>
                  <li>Use PayPal sandbox credentials for testing</li>
                  <li>Verify the complete payment flow works end-to-end</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
