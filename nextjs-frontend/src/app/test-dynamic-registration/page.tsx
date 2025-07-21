'use client';

import { useState } from 'react';
import { useDynamicRegistration } from '@/app/hooks/useDynamicRegistration';
import { useMultipleToggleableRadio } from '@/app/hooks/useToggleableRadio';

export default function TestDynamicRegistrationPage() {
  // Dynamic registration data
  const {
    data: dynamicData,
    loading: dynamicLoading,
    error: dynamicError,
    refetch: refetchDynamicData,
  } = useDynamicRegistration();

  // Enhanced radio button management
  const {
    selections,
    handleRadioChange,
    clearSelection,
    isSelected,
    getSelection,
    resetAllSelections,
  } = useMultipleToggleableRadio({
    onSelectionChange: (groupName, value, previousValue) => {
      console.log(`🔘 Selection changed in ${groupName}: ${previousValue} → ${value}`);
      
      // Clear other selections when switching between regular and sponsorship
      if (groupName === 'registrationType' && value) {
        clearSelection('sponsorshipType');
      } else if (groupName === 'sponsorshipType' && value) {
        clearSelection('registrationType');
      }
    },
    allowDeselect: true,
  });

  // Show loading state
  if (dynamicLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Dynamic Registration Test</h2>
              <p className="text-gray-600">Fetching the latest pricing and configuration...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (dynamicError) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Test Page</h2>
              <p className="text-gray-600 mb-4">{dynamicError}</p>
              <button
                onClick={refetchDynamicData}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Dynamic Registration Test Page
          </h1>

          {/* Current Pricing Period Indicator */}
          {dynamicData?.activePeriod && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    <strong>Current Pricing Period:</strong> {dynamicData.activePeriod.title}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Period ID: {dynamicData.activePeriod.periodId} | 
                    Start: {new Date(dynamicData.activePeriod.startDate).toLocaleDateString()} | 
                    End: {new Date(dynamicData.activePeriod.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Registration Types Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Registration Types</h2>
              <p className="text-sm text-gray-600 mb-4">
                Click to select, click again to deselect. Selecting a registration type will clear sponsorship selection.
              </p>
              
              <div className="space-y-3">
                {dynamicData?.registrationTypes.map((regType) => (
                  <div key={regType._id} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-800 mb-2">{regType.name}</h3>
                    
                    {/* Show pricing for current period */}
                    {dynamicData.activePeriod && regType.pricingByPeriod[dynamicData.activePeriod.periodId] && (
                      <div className="space-y-2 mb-3">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="registrationType"
                            value={`${regType.category}-academia`}
                            checked={isSelected('registrationType', `${regType.category}-academia`)}
                            onChange={() => handleRadioChange('registrationType', `${regType.category}-academia`)}
                            className="mr-2"
                          />
                          <span className="text-sm">
                            Academia - ${regType.pricingByPeriod[dynamicData.activePeriod.periodId].academiaPrice}
                            {isSelected('registrationType', `${regType.category}-academia`) && ' ✓'}
                          </span>
                        </label>
                        
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="registrationType"
                            value={`${regType.category}-business`}
                            checked={isSelected('registrationType', `${regType.category}-business`)}
                            onChange={() => handleRadioChange('registrationType', `${regType.category}-business`)}
                            className="mr-2"
                          />
                          <span className="text-sm">
                            Business - ${regType.pricingByPeriod[dynamicData.activePeriod.periodId].businessPrice}
                            {isSelected('registrationType', `${regType.category}-business`) && ' ✓'}
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Sponsorship Types Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Sponsorship Tiers</h2>
              <p className="text-sm text-gray-600 mb-4">
                Click to select, click again to deselect. Selecting a sponsorship tier will clear registration type selection.
              </p>
              
              <div className="space-y-3">
                {dynamicData?.sponsorshipTiers.map((tier) => (
                  <label key={tier._id} className="flex items-center cursor-pointer border border-gray-200 rounded-lg p-4">
                    <input
                      type="radio"
                      name="sponsorshipType"
                      value={tier.tierLevel}
                      checked={isSelected('sponsorshipType', tier.tierLevel)}
                      onChange={() => handleRadioChange('sponsorshipType', tier.tierLevel)}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <span className="font-medium text-gray-800">
                        {tier.tierName} - ${tier.price}
                        {isSelected('sponsorshipType', tier.tierLevel) && ' ✓'}
                      </span>
                      {tier.description && (
                        <p className="text-sm text-gray-600 mt-1">{tier.description}</p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => clearSelection('registrationType')}
              className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors"
            >
              Clear Registration Type
            </button>
            <button
              onClick={() => clearSelection('sponsorshipType')}
              className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
            >
              Clear Sponsorship Type
            </button>
            <button
              onClick={resetAllSelections}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Reset All Selections
            </button>
            <button
              onClick={refetchDynamicData}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Refresh Data
            </button>
          </div>

          {/* Current Selections Display */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Current Selections</h3>
            <div className="space-y-2 text-sm">
              <div>
                <strong>Registration Type:</strong> {getSelection('registrationType') || 'None selected'}
              </div>
              <div>
                <strong>Sponsorship Type:</strong> {getSelection('sponsorshipType') || 'None selected'}
              </div>
              <div>
                <strong>All Selections:</strong>
                <pre className="mt-2 bg-white p-2 rounded text-xs overflow-auto">
                  {JSON.stringify(selections, null, 2)}
                </pre>
              </div>
            </div>
          </div>

          {/* Data Summary */}
          <div className="mt-8 bg-gray-100 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Data Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <strong>Pricing Periods:</strong> {dynamicData?.pricingPeriods.length || 0}
              </div>
              <div>
                <strong>Registration Types:</strong> {dynamicData?.registrationTypes.length || 0}
              </div>
              <div>
                <strong>Sponsorship Tiers:</strong> {dynamicData?.sponsorshipTiers.length || 0}
              </div>
              <div>
                <strong>Countries:</strong> {dynamicData?.formConfig.countries.length || 0}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
