'use client';

import React from 'react';
import { useDynamicRegistration } from '@/app/hooks/useDynamicRegistration';

export default function TestHookPage() {
  const {
    data: dynamicData,
    loading: dynamicLoading,
    error: dynamicError,
  } = useDynamicRegistration();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Hook Test Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Hook Status</h2>
          <div className="space-y-2">
            <p><strong>Loading:</strong> {String(dynamicLoading)}</p>
            <p><strong>Error:</strong> {dynamicError || 'None'}</p>
            <p><strong>Has Data:</strong> {String(!!dynamicData)}</p>
            <p><strong>Registration Types:</strong> {dynamicData?.registrationTypes?.length || 0}</p>
            <p><strong>Active Period:</strong> {dynamicData?.activePeriod?.title || 'None'}</p>
          </div>
        </div>

        {dynamicLoading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800">Loading data...</p>
          </div>
        )}

        {dynamicError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">Error: {dynamicError}</p>
          </div>
        )}

        {dynamicData && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="text-green-800 font-semibold mb-2">Data Loaded Successfully!</h3>
            <div className="space-y-1 text-sm">
              <p>Registration Types: {dynamicData.registrationTypes?.length}</p>
              <p>Pricing Periods: {dynamicData.pricingPeriods?.length}</p>
              <p>Active Period: {dynamicData.activePeriod?.title}</p>
            </div>
          </div>
        )}

        {dynamicData?.registrationTypes && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Registration Types</h3>
            <div className="space-y-2">
              {dynamicData.registrationTypes.map((type, index) => (
                <div key={type._id} className="border-b border-gray-100 pb-2">
                  <p className="font-medium">{index + 1}. {type.name}</p>
                  <p className="text-sm text-gray-600">Category: {type.category}</p>
                  <p className="text-sm text-gray-600">
                    Prices: Early ${type.earlyBirdPrice} | Next ${type.nextRoundPrice} | OnSpot ${type.onSpotPrice}
                  </p>
                  <p className="text-sm text-gray-600">Active: {String(type.isActive)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
