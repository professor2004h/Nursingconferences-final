'use client';

import React from 'react';
import { useDynamicRegistration } from '@/app/hooks/useDynamicRegistration';

export default function DebugAccommodationPage() {
  const {
    data: dynamicData,
    loading: dynamicLoading,
    error: dynamicError,
  } = useDynamicRegistration();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Debug Accommodation Data</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Data Status</h2>
          <div className="space-y-2">
            <p><strong>Loading:</strong> {String(dynamicLoading)}</p>
            <p><strong>Error:</strong> {dynamicError || 'None'}</p>
            <p><strong>Has Data:</strong> {String(!!dynamicData)}</p>
            <p><strong>Accommodation Options:</strong> {dynamicData?.accommodationOptions?.length || 0}</p>
          </div>
        </div>

        {dynamicLoading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800">Loading accommodation data...</p>
          </div>
        )}

        {dynamicError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">Error: {dynamicError}</p>
          </div>
        )}

        {dynamicData?.accommodationOptions && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Accommodation Options</h2>
            {dynamicData.accommodationOptions.map((hotel, index) => (
              <div key={hotel._id} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">
                  {index + 1}. {hotel.hotelName} ({hotel.hotelCategory})
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p><strong>Description:</strong> {hotel.description}</p>
                    <p><strong>Location:</strong> {hotel.location}</p>
                    <p><strong>Active:</strong> {String(hotel.isActive)}</p>
                    <p><strong>Display Order:</strong> {hotel.displayOrder}</p>
                  </div>
                  <div>
                    <p><strong>Max Rooms:</strong> {hotel.maxRooms}</p>
                    <p><strong>Current Bookings:</strong> {hotel.currentBookings}</p>
                    <p><strong>Available From:</strong> {hotel.availableFrom}</p>
                    <p><strong>Available Until:</strong> {hotel.availableUntil}</p>
                  </div>
                </div>

                <h4 className="font-semibold mb-2">Room Options ({hotel.roomOptions?.length || 0})</h4>
                {hotel.roomOptions && hotel.roomOptions.length > 0 ? (
                  <div className="overflow-x-auto mb-4">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-4 py-2 text-left">Room Type</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                          <th className="border border-gray-300 px-4 py-2 text-right">Price/Night</th>
                          <th className="border border-gray-300 px-4 py-2 text-center">Max Guests</th>
                          <th className="border border-gray-300 px-4 py-2 text-center">Available</th>
                        </tr>
                      </thead>
                      <tbody>
                        {hotel.roomOptions.map((room, roomIndex) => (
                          <tr key={roomIndex}>
                            <td className="border border-gray-300 px-4 py-2 font-medium">{room.roomType}</td>
                            <td className="border border-gray-300 px-4 py-2">{room.roomDescription}</td>
                            <td className="border border-gray-300 px-4 py-2 text-right font-semibold">
                              ${room.pricePerNight || 'N/A'}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-center">{room.maxGuests}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">
                              {String(room.isAvailable)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 mb-4">No room options available</p>
                )}

                <h4 className="font-semibold mb-2">Package Options ({hotel.packageOptions?.length || 0})</h4>
                {hotel.packageOptions && hotel.packageOptions.length > 0 ? (
                  <div className="space-y-2">
                    {hotel.packageOptions.map((pkg, pkgIndex) => (
                      <div key={pkgIndex} className="bg-gray-50 p-3 rounded">
                        <p><strong>{pkg.packageName}</strong> - {pkg.nights} nights</p>
                        <p>Check-in: {pkg.checkInDate} | Check-out: {pkg.checkOutDate}</p>
                        <p>Inclusions: {pkg.inclusions}</p>
                        <p>Active: {String(pkg.isActive)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No package options available</p>
                )}

                <h4 className="font-semibold mb-2 mt-4">Price Calculation Test</h4>
                <div className="bg-yellow-50 p-3 rounded">
                  {hotel.roomOptions?.map((room, roomIndex) => (
                    <div key={roomIndex} className="mb-2">
                      <p><strong>{room.roomType}:</strong></p>
                      <p>2 nights: ${(room.pricePerNight || 0) * 2}</p>
                      <p>3 nights: ${(room.pricePerNight || 0) * 3}</p>
                      <p>5 nights: ${(room.pricePerNight || 0) * 5}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {dynamicData && (!dynamicData.accommodationOptions || dynamicData.accommodationOptions.length === 0) && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">No accommodation options found in the data.</p>
          </div>
        )}
      </div>
    </div>
  );
}
