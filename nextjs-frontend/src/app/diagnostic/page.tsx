'use client';

import React from 'react';
import { useDynamicRegistration } from '@/app/hooks/useDynamicRegistration';

export default function DiagnosticPage() {
  const {
    data: dynamicData,
    loading: dynamicLoading,
    error: dynamicError,
  } = useDynamicRegistration();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Registration System Diagnostic</h1>
        
        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <h3 className="font-semibold text-gray-700">Loading</h3>
            <p className={`text-2xl font-bold ${dynamicLoading ? 'text-yellow-600' : 'text-green-600'}`}>
              {dynamicLoading ? 'YES' : 'NO'}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <h3 className="font-semibold text-gray-700">Error</h3>
            <p className={`text-2xl font-bold ${dynamicError ? 'text-red-600' : 'text-green-600'}`}>
              {dynamicError ? 'YES' : 'NO'}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <h3 className="font-semibold text-gray-700">Data</h3>
            <p className={`text-2xl font-bold ${dynamicData ? 'text-green-600' : 'text-red-600'}`}>
              {dynamicData ? 'LOADED' : 'MISSING'}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <h3 className="font-semibold text-gray-700">Status</h3>
            <p className={`text-2xl font-bold ${!dynamicLoading && !dynamicError && dynamicData ? 'text-green-600' : 'text-red-600'}`}>
              {!dynamicLoading && !dynamicError && dynamicData ? 'READY' : 'NOT READY'}
            </p>
          </div>
        </div>

        {/* Error Display */}
        {dynamicError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Details</h2>
            <p className="text-red-700">{dynamicError}</p>
          </div>
        )}

        {/* Loading Display */}
        {dynamicLoading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-blue-800">Loading registration data...</p>
          </div>
        )}

        {/* Data Summary */}
        {dynamicData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-gray-700 mb-2">Registration Types</h3>
              <p className="text-3xl font-bold text-blue-600">{dynamicData.registrationTypes?.length || 0}</p>
              <p className="text-sm text-gray-500">Active types available</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-gray-700 mb-2">Pricing Periods</h3>
              <p className="text-3xl font-bold text-green-600">{dynamicData.pricingPeriods?.length || 0}</p>
              <p className="text-sm text-gray-500">Periods configured</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-gray-700 mb-2">Sponsorship Tiers</h3>
              <p className="text-3xl font-bold text-purple-600">{dynamicData.sponsorshipTiers?.length || 0}</p>
              <p className="text-sm text-gray-500">Tiers available</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-gray-700 mb-2">Accommodation</h3>
              <p className="text-3xl font-bold text-orange-600">{dynamicData.accommodationOptions?.length || 0}</p>
              <p className="text-sm text-gray-500">Hotels available</p>
            </div>
          </div>
        )}

        {/* Detailed Data Display */}
        {dynamicData && (
          <div className="space-y-6">
            {/* Registration Types */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Registration Types ({dynamicData.registrationTypes?.length || 0})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dynamicData.registrationTypes?.map((type, index) => (
                  <div key={type._id} className="border rounded p-3">
                    <h3 className="font-medium">{type.name}</h3>
                    <p className="text-sm text-gray-600">Category: {type.category}</p>
                    <p className="text-sm text-gray-600">
                      Current Price: ${type.pricingByPeriod?.[dynamicData.activePeriod?.periodId]?.price || 'N/A'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sponsorship Tiers */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Sponsorship Tiers ({dynamicData.sponsorshipTiers?.length || 0})</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {dynamicData.sponsorshipTiers?.map((tier, index) => (
                  <div key={tier._id} className="border rounded p-3">
                    <h3 className="font-medium">{tier.tierName}</h3>
                    <p className="text-sm text-gray-600">Level: {tier.tierLevel}</p>
                    <p className="text-lg font-bold text-green-600">${tier.price}</p>
                    <p className="text-sm text-gray-600">Active: {String(tier.isActive)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Accommodation Options */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Accommodation Options ({dynamicData.accommodationOptions?.length || 0})</h2>
              <div className="space-y-4">
                {dynamicData.accommodationOptions?.map((hotel, index) => (
                  <div key={hotel._id} className="border rounded p-4">
                    <h3 className="font-medium">{hotel.hotelName} ({hotel.hotelCategory})</h3>
                    <p className="text-sm text-gray-600 mb-2">{hotel.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {hotel.roomOptions?.map((room, roomIndex) => (
                        <div key={roomIndex} className="bg-gray-50 p-2 rounded">
                          <p className="font-medium">{room.roomType}</p>
                          <p className="text-sm text-gray-600">${room.pricePerNight}/night</p>
                          <p className="text-xs text-gray-500">Max: {room.maxGuests} guests</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Period */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Active Pricing Period</h2>
              {dynamicData.activePeriod ? (
                <div className="bg-green-50 border border-green-200 rounded p-4">
                  <h3 className="font-medium text-green-800">{dynamicData.activePeriod.title}</h3>
                  <p className="text-sm text-green-700">Period ID: {dynamicData.activePeriod.periodId}</p>
                  <p className="text-sm text-green-700">
                    Duration: {new Date(dynamicData.activePeriod.startDate).toLocaleDateString()} - {new Date(dynamicData.activePeriod.endDate).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                  <p className="text-yellow-800">No active pricing period found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 text-center">
          <a 
            href="/registration" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Registration Page
          </a>
        </div>
      </div>
    </div>
  );
}
