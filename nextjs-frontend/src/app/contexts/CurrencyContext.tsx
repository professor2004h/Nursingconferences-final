'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Currency, DEFAULT_CURRENCY } from '@/app/types/currency';

interface CurrencyContextType {
  selectedCurrency: Currency;
  setSelectedCurrency: (currency: Currency) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

interface CurrencyProviderProps {
  children: ReactNode;
}

export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(DEFAULT_CURRENCY);

  // Always start with USD as default currency
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Always set USD as default and save to localStorage
      setSelectedCurrency('USD');
      localStorage.setItem('selectedCurrency', 'USD');
    }
  }, []);

  // Save currency preference to localStorage when it changes
  const handleSetSelectedCurrency = (currency: Currency) => {
    setSelectedCurrency(currency);
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedCurrency', currency);
    }
  };

  return (
    <CurrencyContext.Provider
      value={{
        selectedCurrency,
        setSelectedCurrency: handleSetSelectedCurrency,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
