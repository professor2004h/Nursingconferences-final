// =============================================================================
// PAYPAL PROVIDER COMPONENT
// =============================================================================

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { getPayPalScriptOptions, validatePayPalConfig } from '@/lib/config/paypal';
import { env } from '@/lib/config/environment';

interface PayPalContextType {
  isReady: boolean;
  isConfigValid: boolean;
  configErrors: string[];
  clientId: string;
}

const PayPalContext = createContext<PayPalContextType | undefined>(undefined);

interface PayPalProviderProps {
  children: React.ReactNode;
}

export const PayPalProvider: React.FC<PayPalProviderProps> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [configValidation, setConfigValidation] = useState({ isValid: false, errors: [] as string[] });

  useEffect(() => {
    // Validate PayPal configuration on mount
    const validation = validatePayPalConfig();
    setConfigValidation(validation);
    
    if (validation.isValid) {
      setIsReady(true);
    } else {
      console.error('❌ PayPal configuration validation failed:', validation.errors);
    }
  }, []);

  const contextValue: PayPalContextType = {
    isReady,
    isConfigValid: configValidation.isValid,
    configErrors: configValidation.errors,
    clientId: env.PAYPAL.CLIENT_ID,
  };

  // If configuration is invalid, render children without PayPal provider
  if (!configValidation.isValid) {
    return (
      <PayPalContext.Provider value={contextValue}>
        {children}
      </PayPalContext.Provider>
    );
  }

  const scriptOptions = getPayPalScriptOptions();

  return (
    <PayPalContext.Provider value={contextValue}>
      <PayPalScriptProvider options={scriptOptions}>
        {children}
      </PayPalScriptProvider>
    </PayPalContext.Provider>
  );
};

// Hook to use PayPal context
export const usePayPal = (): PayPalContextType => {
  const context = useContext(PayPalContext);
  if (context === undefined) {
    throw new Error('usePayPal must be used within a PayPalProvider');
  }
  return context;
};

export default PayPalProvider;
