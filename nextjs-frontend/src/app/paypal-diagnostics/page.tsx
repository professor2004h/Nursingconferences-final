'use client';

import React, { useEffect, useState } from 'react';

export default function PayPalDiagnosticsPage() {
  const [diagnostics, setDiagnostics] = useState<any>({});
  const [networkTest, setNetworkTest] = useState<string>('pending');

  useEffect(() => {
    // Gather diagnostic information
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    
    const diagInfo = {
      environment: {
        nodeEnv: process.env.NODE_ENV,
        nextPublicPaypalClientId: clientId ? `${clientId.substring(0, 10)}...` : 'NOT SET',
        nextPublicPaypalClientIdLength: clientId?.length || 0,
        userAgent: navigator.userAgent,
        currentUrl: window.location.href,
        timestamp: new Date().toISOString()
      },
      paypalSdk: {
        isLoaded: !!window.paypal,
        windowPaypal: typeof window.paypal,
        existingScripts: document.querySelectorAll('script[src*="paypal.com"]').length
      },
      network: {
        onLine: navigator.onLine,
        connection: (navigator as any).connection?.effectiveType || 'unknown'
      }
    };

    setDiagnostics(diagInfo);

    // Test network connectivity to PayPal
    testPayPalConnectivity();
  }, []);

  const testPayPalConnectivity = async () => {
    setNetworkTest('testing');
    
    try {
      // Test basic connectivity to PayPal domain
      const response = await fetch('https://www.paypal.com', { 
        method: 'HEAD', 
        mode: 'no-cors',
        cache: 'no-cache'
      });
      setNetworkTest('success');
    } catch (error) {
      console.error('PayPal connectivity test failed:', error);
      setNetworkTest('failed');
    }
  };

  const testSDKLoad = () => {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'AUmI5g_PA8vHr0HSeZq7PukrblnMLeOLQbW60lNHoJGLAqTg3JZjAeracZmAh1WSuuqmZnUIJxLdzGXc';
    const testUrl = `https://www.paypal.com/sdk/js?client-id=${clientId}&intent=capture&currency=USD`;
    
    console.log('🔧 Testing PayPal SDK load with URL:', testUrl);
    
    const script = document.createElement('script');
    script.src = testUrl;
    script.async = true;
    
    script.onload = () => {
      console.log('✅ PayPal SDK test load successful');
      setDiagnostics(prev => ({
        ...prev,
        sdkTest: { status: 'success', message: 'SDK loaded successfully' }
      }));
    };
    
    script.onerror = (error) => {
      console.error('❌ PayPal SDK test load failed:', error);
      setDiagnostics(prev => ({
        ...prev,
        sdkTest: { status: 'failed', message: 'SDK load failed', error: error.toString() }
      }));
    };
    
    document.head.appendChild(script);
    
    setDiagnostics(prev => ({
      ...prev,
      sdkTest: { status: 'testing', message: 'Loading SDK...', url: testUrl }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            🔍 PayPal Integration Diagnostics
          </h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Environment Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                🌍 Environment
              </h2>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="text-sm">
                  <strong>Node Environment:</strong> {diagnostics.environment?.nodeEnv || 'unknown'}
                </div>
                <div className="text-sm">
                  <strong>PayPal Client ID:</strong> {diagnostics.environment?.nextPublicPaypalClientId || 'NOT SET'}
                </div>
                <div className="text-sm">
                  <strong>Client ID Length:</strong> {diagnostics.environment?.nextPublicPaypalClientIdLength || 0} chars
                </div>
                <div className="text-sm">
                  <strong>Current URL:</strong> {diagnostics.environment?.currentUrl}
                </div>
                <div className="text-sm">
                  <strong>Timestamp:</strong> {diagnostics.environment?.timestamp}
                </div>
              </div>
            </div>

            {/* PayPal SDK Status */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                📦 PayPal SDK Status
              </h2>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="text-sm">
                  <strong>SDK Loaded:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    diagnostics.paypalSdk?.isLoaded ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {diagnostics.paypalSdk?.isLoaded ? 'YES' : 'NO'}
                  </span>
                </div>
                <div className="text-sm">
                  <strong>Window.paypal Type:</strong> {diagnostics.paypalSdk?.windowPaypal || 'undefined'}
                </div>
                <div className="text-sm">
                  <strong>Existing Scripts:</strong> {diagnostics.paypalSdk?.existingScripts || 0}
                </div>
              </div>
            </div>

            {/* Network Status */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                🌐 Network Status
              </h2>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="text-sm">
                  <strong>Online Status:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    diagnostics.network?.onLine ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {diagnostics.network?.onLine ? 'ONLINE' : 'OFFLINE'}
                  </span>
                </div>
                <div className="text-sm">
                  <strong>Connection Type:</strong> {diagnostics.network?.connection || 'unknown'}
                </div>
                <div className="text-sm">
                  <strong>PayPal Connectivity:</strong>
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    networkTest === 'success' ? 'bg-green-100 text-green-800' :
                    networkTest === 'failed' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {networkTest === 'success' ? 'SUCCESS' :
                     networkTest === 'failed' ? 'FAILED' :
                     networkTest === 'testing' ? 'TESTING...' : 'PENDING'}
                  </span>
                </div>
              </div>
            </div>

            {/* SDK Test */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                🧪 SDK Load Test
              </h2>
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <button
                  onClick={testSDKLoad}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Test SDK Load
                </button>
                
                {diagnostics.sdkTest && (
                  <div className="space-y-2">
                    <div className="text-sm">
                      <strong>Status:</strong>
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${
                        diagnostics.sdkTest.status === 'success' ? 'bg-green-100 text-green-800' :
                        diagnostics.sdkTest.status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {diagnostics.sdkTest.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm">
                      <strong>Message:</strong> {diagnostics.sdkTest.message}
                    </div>
                    {diagnostics.sdkTest.url && (
                      <div className="text-sm">
                        <strong>URL:</strong> 
                        <div className="mt-1 p-2 bg-white rounded border text-xs font-mono break-all">
                          {diagnostics.sdkTest.url}
                        </div>
                      </div>
                    )}
                    {diagnostics.sdkTest.error && (
                      <div className="text-sm">
                        <strong>Error:</strong> 
                        <div className="mt-1 p-2 bg-red-50 rounded border text-xs text-red-700">
                          {diagnostics.sdkTest.error}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Browser Information */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              🌐 Browser Information
            </h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm font-mono break-all">
                {diagnostics.environment?.userAgent}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-blue-900 font-semibold mb-3">💡 Troubleshooting Recommendations</h3>
            <div className="text-blue-800 space-y-2 text-sm">
              <p>• If PayPal Client ID is "NOT SET", check your .env.local file</p>
              <p>• If SDK load fails, check network connectivity and firewall settings</p>
              <p>• If "container not found" errors occur, check React component mounting</p>
              <p>• Clear browser cache and disable ad blockers if issues persist</p>
              <p>• Check browser console for detailed error messages</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
