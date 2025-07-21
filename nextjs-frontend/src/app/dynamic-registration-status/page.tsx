'use client';

import { useState, useEffect } from 'react';
import { useDynamicRegistration } from '@/app/hooks/useDynamicRegistration';
import { formatTimeDuration } from '@/app/utils/pricingPeriodUtils';

export default function DynamicRegistrationStatusPage() {
  const {
    data: dynamicData,
    loading: dynamicLoading,
    error: dynamicError,
    refetch: refetchDynamicData,
    realTimePeriodDetection,
  } = useDynamicRegistration();

  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (dynamicLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading System Status</h2>
              <p className="text-gray-600">Fetching dynamic registration configuration...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (dynamicError) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">System Error</h2>
              <p className="text-gray-600 mb-4">{dynamicError}</p>
              <button
                onClick={refetchDynamicData}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Retry
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
            Dynamic Registration System Status
          </h1>

          {/* System Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Pricing Periods</h3>
              <p className="text-3xl font-bold text-blue-600">{dynamicData?.pricingPeriods.length || 0}</p>
              <p className="text-sm text-blue-600">Active periods configured</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Registration Types</h3>
              <p className="text-3xl font-bold text-green-600">{dynamicData?.registrationTypes.length || 0}</p>
              <p className="text-sm text-green-600">Available registration options</p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Sponsorship Tiers</h3>
              <p className="text-3xl font-bold text-purple-600">{dynamicData?.sponsorshipTiers.length || 0}</p>
              <p className="text-sm text-purple-600">Sponsorship options available</p>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-orange-800 mb-2">Countries</h3>
              <p className="text-3xl font-bold text-orange-600">{dynamicData?.formConfig.countries.length || 0}</p>
              <p className="text-sm text-orange-600">Countries in dropdown</p>
            </div>
          </div>

          {/* Current Pricing Period */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">Current Pricing Period</h2>
            {dynamicData?.activePeriod ? (
              <div>
                <h3 className="text-lg font-medium text-blue-700 mb-2">
                  {dynamicData.activePeriod.title}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <strong>Period ID:</strong> {dynamicData.activePeriod.periodId}
                  </div>
                  <div>
                    <strong>Start Date:</strong> {new Date(dynamicData.activePeriod.startDate).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>End Date:</strong> {new Date(dynamicData.activePeriod.endDate).toLocaleDateString()}
                  </div>
                </div>
                {realTimePeriodDetection?.timeUntilCurrentPeriodEnds && (
                  <div className="mt-2 text-sm text-blue-600">
                    <strong>Time Remaining:</strong> {formatTimeDuration(realTimePeriodDetection.timeUntilCurrentPeriodEnds)}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-blue-700">
                <p className="font-medium">No active pricing period</p>
                <p className="text-sm">Check your pricing period configuration in Sanity</p>
              </div>
            )}
          </div>

          {/* Real-time Period Detection Status */}
          {realTimePeriodDetection && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Real-time Period Detection</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Status Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Current Time:</strong> {currentTime.toLocaleString()}</div>
                    <div><strong>Status:</strong> {realTimePeriodDetection.statusMessage}</div>
                    <div><strong>In Transition:</strong> {realTimePeriodDetection.isInTransitionPeriod ? 'Yes' : 'No'}</div>
                    <div><strong>Next Update:</strong> {Math.ceil(realTimePeriodDetection.timeUntilNextUpdate / 1000)}s</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Period Timeline</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Previous:</strong> {realTimePeriodDetection.previousPeriod?.title || 'None'}
                    </div>
                    <div>
                      <strong>Current:</strong> {realTimePeriodDetection.activePeriod?.title || 'None'}
                    </div>
                    <div>
                      <strong>Next:</strong> {realTimePeriodDetection.nextPeriod?.title || 'None'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Registration Types with Pricing */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Registration Types & Pricing</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {dynamicData?.registrationTypes.map((regType) => (
                <div key={regType._id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-800 mb-2">{regType.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">Category: {regType.category}</p>
                  
                  {/* Current Period Pricing */}
                  {dynamicData.activePeriod && regType.pricingByPeriod[dynamicData.activePeriod.periodId] && (
                    <div className="bg-green-50 border border-green-200 rounded p-3 mb-3">
                      <h4 className="font-medium text-green-800 text-sm mb-1">Current Pricing</h4>
                      <div className="text-sm space-y-1">
                        <div>Academia: ${regType.pricingByPeriod[dynamicData.activePeriod.periodId].academiaPrice}</div>
                        <div>Business: ${regType.pricingByPeriod[dynamicData.activePeriod.periodId].businessPrice}</div>
                      </div>
                    </div>
                  )}

                  {/* All Period Pricing */}
                  <div className="text-xs text-gray-500">
                    <strong>All Periods:</strong>
                    <div className="mt-1 space-y-1">
                      {Object.entries(regType.pricingByPeriod).map(([periodId, pricing]) => (
                        <div key={periodId} className="flex justify-between">
                          <span>{periodId}:</span>
                          <span>${pricing.academiaPrice}/${pricing.businessPrice}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sponsorship Tiers */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Sponsorship Tiers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dynamicData?.sponsorshipTiers.map((tier) => (
                <div key={tier._id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-800 mb-1">{tier.tierName}</h3>
                  <p className="text-lg font-bold text-purple-600 mb-2">${tier.price}</p>
                  <p className="text-sm text-gray-600">Level: {tier.tierLevel}</p>
                  {tier.description && (
                    <p className="text-xs text-gray-500 mt-2">{tier.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* System Actions */}
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={refetchDynamicData}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Refresh Data
            </button>
            <a
              href="/test-dynamic-registration"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Test Registration Form
            </a>
            <a
              href="/admin/populate-sample-data"
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
            >
              Populate Sample Data
            </a>
            <a
              href="/api/registration/dynamic-config"
              target="_blank"
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              View Raw API Data
            </a>
          </div>

          {/* Debug Information */}
          <div className="mt-8 bg-gray-100 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Debug Information</h3>
            <div className="text-xs text-gray-600 space-y-1">
              <div><strong>Last Fetched:</strong> {dynamicData?.lastFetched}</div>
              <div><strong>Registration Open:</strong> {dynamicData?.registrationSettings?.registrationStatus?.isOpen ? 'Yes' : 'No'}</div>
              <div><strong>Form Config Countries:</strong> {dynamicData?.formConfig.countries.length || 0}</div>
              <div><strong>Form Config Categories:</strong> {dynamicData?.formConfig.abstractCategories.length || 0}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
