'use client';

import React from 'react';
import { useCurrency } from '@/app/contexts/CurrencyContext';
import { Currency, CURRENCIES } from '@/app/types/currency';

interface CurrencySelectorProps {
  className?: string;
}

export default function CurrencySelector({ className = '' }: CurrencySelectorProps) {
  const { selectedCurrency, setSelectedCurrency } = useCurrency();

  const handleCurrencyChange = (currency: Currency) => {
    setSelectedCurrency(currency);
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      <div className="bg-blue-800 text-white px-6 py-3 rounded-t-lg">
        <h2 className="text-lg font-bold text-white">Currency Selection</h2>
      </div>
      <div className="p-6">
        <div className="space-y-3">
          <p className="text-sm text-gray-600 mb-4">
            Select your preferred currency for pricing display:
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {Object.entries(CURRENCIES).map(([code, info]) => (
              <label
                key={code}
                className={`
                  relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
                  ${selectedCurrency === code
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }
                `}
              >
                <input
                  type="radio"
                  name="currency"
                  value={code}
                  checked={selectedCurrency === code}
                  onChange={() => handleCurrencyChange(code as Currency)}
                  className="sr-only"
                />
                
                <div className="flex items-center space-x-3 w-full">
                  <div className={`
                    flex items-center justify-center w-8 h-8 rounded-full text-lg font-bold
                    ${selectedCurrency === code
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600'
                    }
                  `}>
                    {info.symbol}
                  </div>
                  
                  <div className="flex-1">
                    <div className={`
                      font-semibold text-sm
                      ${selectedCurrency === code ? 'text-blue-900' : 'text-gray-900'}
                    `}>
                      {code}
                    </div>
                    <div className={`
                      text-xs
                      ${selectedCurrency === code ? 'text-blue-700' : 'text-gray-500'}
                    `}>
                      {info.name}
                    </div>
                  </div>
                  
                  {selectedCurrency === code && (
                    <div className="text-blue-500">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </label>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-start space-x-2">
              <div className="text-blue-500 mt-0.5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="text-xs text-gray-600">
                <p className="font-medium mb-1">Currency Information:</p>
                <ul className="space-y-1">
                  <li>• All prices are updated in real-time when you change currency</li>
                  <li>• Payment processing supports all selected currencies</li>
                  <li>• Your currency preference is saved for future visits</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
