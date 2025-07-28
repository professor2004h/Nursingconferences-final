'use client';

import { useEffect, useState } from 'react';

export default function PayPalDebugPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [testResults, setTestResults] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const addLog = (message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${type.toUpperCase()}: ${message}`;
    console.log(logEntry);
    setLogs(prev => [...prev, logEntry]);
  };

  const testPayPalConfiguration = async () => {
    addLog('🔧 Testing PayPal configuration...', 'info');
    
    try {
      const response = await fetch('/api/paypal/validate-config');
      const data = await response.json();
      
      if (response.ok) {
        addLog('✅ PayPal configuration is valid', 'success');
        setTestResults(prev => ({ ...prev, config: { status: 'success', data } }));
      } else {
        addLog(`❌ PayPal configuration error: ${data.error}`, 'error');
        setTestResults(prev => ({ ...prev, config: { status: 'error', data } }));
      }
    } catch (error) {
      addLog(`❌ Failed to test PayPal configuration: ${error}`, 'error');
      setTestResults(prev => ({ ...prev, config: { status: 'error', error: String(error) } }));
    }
  };

  const testCreateOrder = async () => {
    addLog('💳 Testing PayPal order creation...', 'info');
    
    const testOrderData = {
      amount: 10.00,
      currency: 'USD',
      registrationId: `TEST_${Date.now()}`,
      registrationData: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com'
      }
    };

    try {
      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testOrderData)
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        addLog(`✅ PayPal order created successfully: ${data.orderId}`, 'success');
        setTestResults(prev => ({ ...prev, createOrder: { status: 'success', data } }));
        return data.orderId;
      } else {
        addLog(`❌ PayPal order creation failed: ${data.error}`, 'error');
        setTestResults(prev => ({ ...prev, createOrder: { status: 'error', data } }));
        return null;
      }
    } catch (error) {
      addLog(`❌ Failed to create PayPal order: ${error}`, 'error');
      setTestResults(prev => ({ ...prev, createOrder: { status: 'error', error: String(error) } }));
      return null;
    }
  };

  const testPayPalSDK = async () => {
    addLog('🔧 Testing PayPal SDK loading...', 'info');
    
    return new Promise((resolve) => {
      const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'AUmI5g_PA8vHr0HSeZq7PukrblnMLeOLQbW60lNHoJGLAqTg3JZjAeracZmAh1WSuuqmZnUIJxLdzGXc';
      
      if (window.paypal) {
        addLog('✅ PayPal SDK already loaded', 'success');
        setTestResults(prev => ({ ...prev, sdk: { status: 'success', message: 'Already loaded' } }));
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&intent=capture&currency=USD&components=buttons`;
      script.async = true;

      const timeout = setTimeout(() => {
        addLog('❌ PayPal SDK loading timeout (30s)', 'error');
        setTestResults(prev => ({ ...prev, sdk: { status: 'error', message: 'Loading timeout' } }));
        resolve(false);
      }, 30000);

      script.onload = () => {
        clearTimeout(timeout);
        addLog('✅ PayPal SDK loaded successfully', 'success');
        setTestResults(prev => ({ ...prev, sdk: { status: 'success', message: 'Loaded successfully' } }));
        resolve(true);
      };

      script.onerror = () => {
        clearTimeout(timeout);
        addLog('❌ PayPal SDK failed to load', 'error');
        setTestResults(prev => ({ ...prev, sdk: { status: 'error', message: 'Failed to load' } }));
        resolve(false);
      };

      document.head.appendChild(script);
      addLog(`📝 Loading PayPal SDK from: ${script.src}`, 'info');
    });
  };

  const runFullTest = async () => {
    setIsLoading(true);
    setLogs([]);
    setTestResults({});
    
    addLog('🚀 Starting comprehensive PayPal diagnostic test...', 'info');
    
    // Test 1: Configuration
    await testPayPalConfiguration();
    
    // Test 2: SDK Loading
    const sdkLoaded = await testPayPalSDK();
    
    // Test 3: Order Creation
    if (sdkLoaded) {
      await testCreateOrder();
    } else {
      addLog('⏭️ Skipping order creation test - SDK not loaded', 'warning');
    }
    
    addLog('🏁 Diagnostic test completed', 'info');
    setIsLoading(false);
  };

  const clearLogs = () => {
    setLogs([]);
    setTestResults({});
  };

  useEffect(() => {
    addLog('🔍 PayPal Debug Page loaded', 'info');
    addLog(`Environment: ${process.env.NODE_ENV}`, 'info');
    addLog(`Base URL: ${process.env.NEXT_PUBLIC_BASE_URL}`, 'info');
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">PayPal Integration Diagnostic Tool</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Control Panel */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
          
          <div className="space-y-4">
            <button
              onClick={runFullTest}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white px-4 py-3 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? '🔄 Running Tests...' : '🚀 Run Full Diagnostic'}
            </button>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={testPayPalConfiguration}
                className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 text-sm"
              >
                Test Config
              </button>
              <button
                onClick={testPayPalSDK}
                className="bg-purple-600 text-white px-3 py-2 rounded hover:bg-purple-700 text-sm"
              >
                Test SDK
              </button>
            </div>
            
            <button
              onClick={clearLogs}
              className="w-full bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Clear Logs
            </button>
          </div>
        </div>

        {/* Test Results Summary */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          
          <div className="space-y-3">
            {Object.entries(testResults).map(([test, result]: [string, any]) => (
              <div key={test} className="flex items-center justify-between p-3 border rounded">
                <span className="font-medium capitalize">{test.replace(/([A-Z])/g, ' $1')}</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  result.status === 'success' ? 'bg-green-100 text-green-800' :
                  result.status === 'error' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {result.status === 'success' ? '✅ Pass' : 
                   result.status === 'error' ? '❌ Fail' : '⏳ Running'}
                </span>
              </div>
            ))}
            
            {Object.keys(testResults).length === 0 && (
              <p className="text-gray-500 text-center py-4">No tests run yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Environment Info */}
      <div className="mt-6 bg-gray-50 border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Environment Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Node Environment:</strong> {process.env.NODE_ENV}
          </div>
          <div>
            <strong>Base URL:</strong> {process.env.NEXT_PUBLIC_BASE_URL}
          </div>
          <div>
            <strong>PayPal Client ID:</strong> {process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID?.substring(0, 10)}...
          </div>
          <div>
            <strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'N/A'}
          </div>
        </div>
      </div>

      {/* Debug Logs */}
      <div className="mt-6 bg-black text-green-400 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-white">Debug Logs</h2>
        <div className="font-mono text-sm max-h-96 overflow-y-auto space-y-1">
          {logs.map((log, index) => (
            <div key={index} className={`${
              log.includes('ERROR') ? 'text-red-400' :
              log.includes('SUCCESS') ? 'text-green-400' :
              log.includes('WARNING') ? 'text-yellow-400' :
              'text-gray-300'
            }`}>
              {log}
            </div>
          ))}
          {logs.length === 0 && (
            <div className="text-gray-500">No logs yet. Run a test to see debug information.</div>
          )}
        </div>
      </div>
    </div>
  );
}

// Declare PayPal type for TypeScript
declare global {
  interface Window {
    paypal?: any;
  }
}
