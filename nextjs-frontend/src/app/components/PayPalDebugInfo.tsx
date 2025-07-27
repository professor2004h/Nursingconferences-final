/**
 * PayPal Debug Component
 * Shows client-side environment variable status for debugging
 */

'use client';

import { useEffect, useState } from 'react';

interface DebugInfo {
  clientId: string | undefined;
  environment: string | undefined;
  baseUrl: string | undefined;
  nodeEnv: string | undefined;
  timestamp: string;
}

export default function PayPalDebugInfo() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    // Get client-side environment variables
    const info: DebugInfo = {
      clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
      environment: process.env.PAYPAL_ENVIRONMENT,
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    };

    setDebugInfo(info);

    // Log to console for debugging
    console.log('🔍 Client-side PayPal Debug Info:', {
      NEXT_PUBLIC_PAYPAL_CLIENT_ID: info.clientId ? `${info.clientId.substring(0, 10)}...` : 'NOT_SET',
      PAYPAL_ENVIRONMENT: info.environment || 'NOT_SET',
      NEXT_PUBLIC_BASE_URL: info.baseUrl || 'NOT_SET',
      NODE_ENV: info.nodeEnv || 'NOT_SET',
      hasClientId: !!info.clientId,
      timestamp: info.timestamp
    });
  }, []);

  if (!debugInfo) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setShowDebug(!showDebug)}
        className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
      >
        PayPal Debug
      </button>
      
      {showDebug && (
        <div className="absolute bottom-8 right-0 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-80 text-xs">
          <h3 className="font-bold mb-2">PayPal Client-Side Debug</h3>
          
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Client ID:</span>
              <span className={debugInfo.clientId ? 'text-green-600' : 'text-red-600'}>
                {debugInfo.clientId ? `${debugInfo.clientId.substring(0, 15)}...` : 'NOT_SET'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span>Environment:</span>
              <span className={debugInfo.environment ? 'text-green-600' : 'text-red-600'}>
                {debugInfo.environment || 'NOT_SET'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span>Base URL:</span>
              <span className={debugInfo.baseUrl ? 'text-green-600' : 'text-red-600'}>
                {debugInfo.baseUrl || 'NOT_SET'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span>Node ENV:</span>
              <span>{debugInfo.nodeEnv || 'NOT_SET'}</span>
            </div>
            
            <div className="mt-2 pt-2 border-t">
              <div className="flex justify-between">
                <span>Status:</span>
                <span className={debugInfo.clientId ? 'text-green-600' : 'text-red-600'}>
                  {debugInfo.clientId ? 'CONFIGURED' : 'MISSING'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-2 text-gray-500">
            {debugInfo.timestamp}
          </div>
        </div>
      )}
    </div>
  );
}
