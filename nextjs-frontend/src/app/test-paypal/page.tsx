'use client';

import { useEffect, useState } from 'react';

export default function TestPayPalPage() {
  const [sdkStatus, setSdkStatus] = useState<string>('Loading...');
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    console.log(message);
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'AUmI5g_PA8vHr0HSeZq7PukrblnMLeOLQbW60lNHoJGLAqTg3JZjAeracZmAh1WSuuqmZnUIJxLdzGXc';
    
    addLog(`Starting PayPal SDK test with Client ID: ${clientId.substring(0, 10)}...`);

    // Check if PayPal is already loaded
    if (window.paypal) {
      addLog('✅ PayPal SDK already loaded');
      setSdkStatus('Already Loaded');
      return;
    }

    // Load PayPal SDK
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&intent=capture&currency=USD&enable-funding=card&disable-funding=credit,bancontact,blik,eps,giropay,ideal,mercadopago,mybank,p24,sepa,sofort,venmo&components=buttons`;
    script.async = true;

    addLog(`Loading PayPal SDK from: ${script.src}`);

    script.onload = () => {
      addLog('✅ PayPal SDK loaded successfully');
      setSdkStatus('Loaded Successfully');
      
      // Test PayPal object
      if (window.paypal) {
        addLog('✅ window.paypal object is available');
        addLog(`PayPal version: ${window.paypal.version || 'Unknown'}`);
        
        // Test button creation
        try {
          const testButtons = window.paypal.Buttons({
            createOrder: () => {
              addLog('🔄 Test createOrder called');
              return Promise.resolve('test-order-id');
            },
            onApprove: () => {
              addLog('✅ Test onApprove called');
            },
            onError: (err: any) => {
              addLog(`❌ Test onError called: ${err}`);
            }
          });
          addLog('✅ PayPal Buttons object created successfully');
        } catch (error) {
          addLog(`❌ Error creating PayPal Buttons: ${error}`);
        }
      } else {
        addLog('❌ window.paypal object not available after load');
      }
    };

    script.onerror = (error) => {
      addLog(`❌ Failed to load PayPal SDK: ${error}`);
      setSdkStatus('Failed to Load');
    };

    // Add timeout
    const timeout = setTimeout(() => {
      if (sdkStatus === 'Loading...') {
        addLog('⚠️ PayPal SDK loading timeout (30s)');
        setSdkStatus('Timeout');
      }
    }, 30000);

    try {
      document.head.appendChild(script);
      addLog('📝 PayPal script added to document head');
    } catch (error) {
      addLog(`❌ Failed to append script: ${error}`);
      setSdkStatus('Script Append Failed');
    }

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const testButtonRender = () => {
    addLog('🧪 Testing button render...');
    
    if (!window.paypal) {
      addLog('❌ PayPal SDK not available for button test');
      return;
    }

    const container = document.getElementById('test-paypal-container');
    if (!container) {
      addLog('❌ Test container not found');
      return;
    }

    try {
      const buttons = window.paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'paypal',
          height: 50,
        },
        createOrder: () => {
          addLog('🔄 Test button createOrder triggered');
          return Promise.resolve('test-order-12345');
        },
        onApprove: () => {
          addLog('✅ Test button onApprove triggered');
        },
        onError: (err: any) => {
          addLog(`❌ Test button onError: ${err}`);
        }
      });

      buttons.render(container).then(() => {
        addLog('✅ Test button rendered successfully');
      }).catch((error: any) => {
        addLog(`❌ Test button render failed: ${error}`);
      });

    } catch (error) {
      addLog(`❌ Error in test button creation: ${error}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">PayPal SDK Test Page</h1>
      
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">SDK Status</h2>
        <p className={`text-lg ${
          sdkStatus === 'Loaded Successfully' ? 'text-green-600' : 
          sdkStatus === 'Loading...' ? 'text-blue-600' : 'text-red-600'
        }`}>
          {sdkStatus}
        </p>
      </div>

      <div className="bg-white border rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Test PayPal Button</h2>
        <button
          onClick={testButtonRender}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
          disabled={sdkStatus !== 'Loaded Successfully'}
        >
          Test Button Render
        </button>
        <div 
          id="test-paypal-container" 
          className="min-h-[60px] border-2 border-dashed border-gray-300 rounded p-4"
        >
          <p className="text-gray-500 text-center">PayPal button will render here</p>
        </div>
      </div>

      <div className="bg-gray-50 border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Debug Logs</h2>
        <div className="bg-black text-green-400 p-4 rounded font-mono text-sm max-h-96 overflow-y-auto">
          {logs.map((log, index) => (
            <div key={index} className="mb-1">{log}</div>
          ))}
          {logs.length === 0 && <div className="text-gray-500">No logs yet...</div>}
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-600">
        <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
        <p><strong>Base URL:</strong> {process.env.NEXT_PUBLIC_BASE_URL}</p>
        <p><strong>PayPal Environment:</strong> {process.env.PAYPAL_ENVIRONMENT || 'Not set'}</p>
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
