'use client';

import React, { useState, useEffect } from 'react';
import { VenueSettings, VenueSettingsApiResponse, PopulateVenueSettingsResponse } from '@/app/types/venueSettings';

const AdminVenueSettingsPage: React.FC = () => {
  const [venueSettings, setVenueSettings] = useState<VenueSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchVenueSettings();
  }, []);

  const fetchVenueSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/venue-settings');
      const result: VenueSettingsApiResponse = await response.json();
      
      if (result.success && result.data) {
        setVenueSettings(result.data);
      } else {
        setError(result.error || 'Failed to fetch venue settings');
      }
    } catch (err) {
      setError('An error occurred while fetching venue settings');
      console.error('Error fetching venue settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const populateVenueSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await fetch('/api/populate-venue-settings');
      const result: PopulateVenueSettingsResponse = await response.json();

      if (result.success) {
        setSuccess(result.message);
        await fetchVenueSettings(); // Refresh the settings
      } else {
        setError(result.error || 'Failed to populate venue settings');
      }
    } catch (err) {
      setError('An error occurred while populating venue settings');
      console.error('Error populating venue settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const uploadVenueImages = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await fetch('/api/upload-venue-images');
      const result = await response.json();

      if (result.success) {
        setSuccess(result.message);
        await fetchVenueSettings(); // Refresh the settings
      } else {
        setError(result.error || 'Failed to upload venue images');
      }
    } catch (err) {
      setError('An error occurred while uploading venue images');
      console.error('Error uploading venue images:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAddress = (address: any) => {
    if (!address) return 'Not set';
    const parts = [
      address.streetAddress,
      address.city,
      address.state,
      address.postalCode,
      address.country
    ].filter(Boolean);
    return parts.join(', ');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Venue Settings Management</h1>
              <p className="mt-2 text-gray-600">Manage venue information and location settings</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={populateVenueSettings}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                {loading ? 'Populating...' : 'Populate Default Settings'}
              </button>
              <button
                onClick={uploadVenueImages}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                {loading ? 'Uploading...' : 'Upload Venue Images'}
              </button>
              <a
                href="http://localhost:3333/structure/venueSettings"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Edit in Sanity Studio
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Status Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <svg className="w-5 h-5 text-green-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Success</h3>
                <p className="text-sm text-green-700 mt-1">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Status</h3>
            <p className={`text-sm font-bold ${venueSettings ? 'text-green-600' : 'text-red-600'}`}>
              {venueSettings ? 'Active' : 'Not Found'}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Last Updated</h3>
            <p className="text-sm text-gray-600">{formatDate(venueSettings?.lastUpdated)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Images</h3>
            <p className="text-2xl font-bold text-blue-600">
              {venueSettings?.venueImages?.length || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Source</h3>
            <p className="text-sm font-bold text-orange-600">Sanity CMS</p>
          </div>
        </div>

        {/* Venue Settings Overview */}
        {venueSettings ? (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Venue Settings Overview</h3>
              <p className="text-sm text-gray-600 mt-1">Current venue configuration</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Basic Information */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Basic Information</h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Venue Name:</span>
                      <p className="text-gray-900">{venueSettings.venueName}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Address:</span>
                      <p className="text-gray-900">{formatAddress(venueSettings.venueAddress)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Active:</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                        venueSettings.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {venueSettings.isActive ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Content Sections */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Content Sections</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-3 ${venueSettings.contactInformation ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      Contact Information
                    </div>
                    <div className="flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-3 ${venueSettings.amenities?.length ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      Amenities ({venueSettings.amenities?.length || 0} items)
                    </div>
                    <div className="flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-3 ${venueSettings.venueImages?.length ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      Venue Images ({venueSettings.venueImages?.length || 0} images)
                    </div>
                    <div className="flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-3 ${venueSettings.transportation?.options?.length ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      Transportation ({venueSettings.transportation?.options?.length || 0} options)
                    </div>
                    <div className="flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-3 ${venueSettings.localAttractions?.attractions?.length ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      Local Attractions ({venueSettings.localAttractions?.attractions?.length || 0} items)
                    </div>
                    <div className="flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-3 ${venueSettings.mapConfiguration ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      Map Configuration
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Configuration */}
              {venueSettings.mapConfiguration && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-4">Map Configuration</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Latitude:</span>
                      <p className="text-gray-900">{venueSettings.mapConfiguration.latitude}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Longitude:</span>
                      <p className="text-gray-900">{venueSettings.mapConfiguration.longitude}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Zoom Level:</span>
                      <p className="text-gray-900">{venueSettings.mapConfiguration.zoomLevel || 15}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Marker Title:</span>
                      <p className="text-gray-900">{venueSettings.mapConfiguration.markerTitle || 'Not set'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Information */}
              {venueSettings.contactInformation && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-4">Contact Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {venueSettings.contactInformation.phone && (
                      <div>
                        <span className="font-medium text-gray-700">Phone:</span>
                        <p className="text-gray-900">{venueSettings.contactInformation.phone}</p>
                      </div>
                    )}
                    {venueSettings.contactInformation.email && (
                      <div>
                        <span className="font-medium text-gray-700">Email:</span>
                        <p className="text-gray-900">{venueSettings.contactInformation.email}</p>
                      </div>
                    )}
                    {venueSettings.contactInformation.website && (
                      <div>
                        <span className="font-medium text-gray-700">Website:</span>
                        <a href={venueSettings.contactInformation.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                          {venueSettings.contactInformation.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No venue settings found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Click "Populate Default Settings" to create the venue settings.
            </p>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">How to Manage Venue Settings</h3>
          <div className="space-y-3 text-sm text-blue-800">
            <div className="flex items-start space-x-2">
              <span className="font-medium">1.</span>
              <span>Use "Populate Default Settings" to create initial venue settings with sample data</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-medium">2.</span>
              <span>Click "Edit in Sanity Studio" to customize venue information, upload images, and configure settings</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-medium">3.</span>
              <span>Changes in Sanity Studio will automatically appear on the venue page</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-medium">4.</span>
              <span>Configure map coordinates to show the exact venue location</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-center space-x-4">
          <a
            href="/venue"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            View Venue Page
          </a>
          <a
            href="/api/venue-settings"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            View API Response
          </a>
          <a
            href="/"
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Back to Homepage
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminVenueSettingsPage;
