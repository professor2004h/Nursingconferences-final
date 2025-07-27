'use client';

import React, { useState, useEffect } from 'react';
import { getClientPayPalConfig } from '@/app/utils/clientPaypalConfig';

/**
 * PayPal Debug Component
 * Shows the actual PayPal configuration being used on the client-side
 * Helps diagnose configuration issues
 */
const PayPalDebug: React.FC = () => {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadConfig() {
      try {
        setLoading(true);
        console.log('🔍 PayPal Debug: Loading configuration...');
        
        const paypalConfig = await getClientPayPalConfig();
        setConfig(paypalConfig);
        
        console.log('✅ PayPal Debug: Configuration loaded:', paypalConfig);
      } catch (err) {
        console.error('❌ PayPal Debug: Failed to load configuration:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    loadConfig();
  }, []);

  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <h3 className="text-blue-800 font-semibold mb-2">PayPal Client-Side Debug</h3>
        <p className="text-blue-600 text-sm">Loading configuration...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
      <h3 className="text-gray-800 font-semibold mb-3">PayPal Client-Side Debug</h3>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="font-medium">Client ID:</span>
          <span className={config?.clientId ? 'text-green-600' : 'text-red-600'}>
            {config?.clientId ? `${config.clientId.substring(0, 10)}...` : 'NOT SET'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="font-medium">Environment:</span>
          <span className={config?.environment ? 'text-green-600' : 'text-red-600'}>
            {config?.environment || 'NOT_SET'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="font-medium">Base URL:</span>
          <span className={config?.baseUrl ? 'text-green-600' : 'text-red-600'}>
            {config?.baseUrl || 'NOT_SET'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="font-medium">Node ENV:</span>
          <span className="text-gray-600">
            {process.env.NODE_ENV || 'production'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="font-medium">Status:</span>
          <span className={config?.isConfigured ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
            {config?.isConfigured ? 'CONFIGURED' : 'MISSING'}
          </span>
        </div>
        
        {error && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
            <p className="text-red-600 text-xs">Error: {error}</p>
          </div>
        )}
      </div>
      
      <div className="mt-3 text-xs text-gray-500">
        {new Date().toLocaleString()}
      </div>
    </div>
  );
};

export default PayPalDebug;
