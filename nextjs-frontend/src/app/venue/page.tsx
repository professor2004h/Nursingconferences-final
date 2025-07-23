'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';
import { VenueSettings, VenueSettingsApiResponse } from '@/app/types/venueSettings';
import VenueMap from '@/app/components/VenueMap';
import VenueImageGallery from '@/app/components/VenueImageGallery';

const VenuePage: React.FC = () => {
  const [venueSettings, setVenueSettings] = useState<VenueSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVenueSettings();
  }, []);

  const fetchVenueSettings = async () => {
    try {
      setLoading(true);
      console.log('🏨 Fetching venue settings...');
      
      const response = await fetch('/api/venue-settings');
      const result: VenueSettingsApiResponse = await response.json();

      if (result.success && result.data) {
        setVenueSettings(result.data);
        console.log('✅ Venue settings loaded successfully');
      } else {
        setError(result.error || 'Failed to fetch venue settings');
        console.error('❌ API error:', result.error);
      }
    } catch (err) {
      const errorMessage = 'An error occurred while fetching venue settings';
      setError(errorMessage);
      console.error('❌ Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (address: any) => {
    if (!address) return '';
    const parts = [
      address.streetAddress,
      address.city,
      address.state,
      address.postalCode,
      address.country
    ].filter(Boolean);
    return parts.join(', ');
  };

  // Check if location data is available
  const hasLocationData = (venueSettings: VenueSettings) => {
    return !!(
      venueSettings.venueAddress ||
      venueSettings.mapConfiguration ||
      venueSettings.locationDescription ||
      venueSettings.transportation
    );
  };

  // Check if venue address is complete
  const hasCompleteAddress = (address: any) => {
    return !!(address && (address.streetAddress || address.city || address.country));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'restaurant': return '🍽️';
      case 'shopping': return '🛍️';
      case 'cultural': return '🎭';
      case 'entertainment': return '🎪';
      case 'nature': return '🌳';
      case 'historical': return '🏛️';
      default: return '📍';
    }
  };

  const getTransportationIcon = (type: string) => {
    switch (type) {
      case 'airport-shuttle': return '🚌';
      case 'public-transit': return '🚇';
      case 'taxi-rideshare': return '🚕';
      case 'car-rental': return '🚗';
      case 'walking': return '🚶';
      default: return '🚌';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4">Loading venue information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !venueSettings) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Venue Information</h1>
            <p className="text-xl text-red-300">
              {error || 'Venue information not available'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-orange-400 font-semibold text-lg tracking-wide uppercase mb-4 block">
              Conference Location
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {venueSettings.title}
            </h1>
            {venueSettings.subtitle && (
              <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                {venueSettings.subtitle}
              </p>
            )}
          </div>

          {/* Breadcrumb */}
          <nav className="flex justify-center" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link href="/" className="text-blue-200 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-blue-100 ml-1 md:ml-2">Venue</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Venue Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-3xl mr-4">🏨</span>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{venueSettings.venueName}</h2>
              {hasCompleteAddress(venueSettings.venueAddress) && (
                <p className="text-lg text-gray-600 mt-1">{formatAddress(venueSettings.venueAddress)}</p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          {venueSettings.contactInformation && (
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                <div className="space-y-2 text-sm">
                  {venueSettings.contactInformation.phone && (
                    <div className="flex items-center">
                      <span className="text-blue-600 mr-2">📞</span>
                      <a href={`tel:${venueSettings.contactInformation.phone}`} className="text-blue-600 hover:text-blue-800">
                        {venueSettings.contactInformation.phone}
                      </a>
                    </div>
                  )}
                  {venueSettings.contactInformation.email && (
                    <div className="flex items-center">
                      <span className="text-blue-600 mr-2">✉️</span>
                      <a href={`mailto:${venueSettings.contactInformation.email}`} className="text-blue-600 hover:text-blue-800">
                        {venueSettings.contactInformation.email}
                      </a>
                    </div>
                  )}
                  {venueSettings.contactInformation.website && (
                    <div className="flex items-center">
                      <span className="text-blue-600 mr-2">🌐</span>
                      <a href={venueSettings.contactInformation.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Check-in/Check-out */}
              {venueSettings.checkInOut && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Check-in & Check-out</h3>
                  <div className="space-y-2 text-sm">
                    {venueSettings.checkInOut.checkInTime && (
                      <div><span className="font-medium">Check-in:</span> {venueSettings.checkInOut.checkInTime}</div>
                    )}
                    {venueSettings.checkInOut.checkOutTime && (
                      <div><span className="font-medium">Check-out:</span> {venueSettings.checkInOut.checkOutTime}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Special Notes */}
          {venueSettings.contactInformation?.organizerNote && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <span className="text-orange-500 mr-2 mt-0.5">ℹ️</span>
                <p className="text-orange-800 text-sm">{venueSettings.contactInformation.organizerNote}</p>
              </div>
            </div>
          )}

          {/* Group Rate Note */}
          {venueSettings.checkInOut?.groupRateNote && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <span className="text-blue-500 mr-2 mt-0.5">💰</span>
                <p className="text-blue-800 text-sm">{venueSettings.checkInOut.groupRateNote}</p>
              </div>
            </div>
          )}
        </div>

        {/* Amenities */}
        {venueSettings.amenities && venueSettings.amenities.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex items-center mb-6">
              <span className="text-2xl mr-3">✨</span>
              <h2 className="text-2xl font-bold text-gray-900">Room Amenities and Services</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {venueSettings.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-green-500 mr-3">✓</span>
                  <span className="text-gray-700">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Location Description */}
        {venueSettings.locationDescription && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex items-center mb-6">
              <span className="text-2xl mr-3">🌆</span>
              <h2 className="text-2xl font-bold text-gray-900">About the Location</h2>
            </div>
            <div className="prose prose-lg max-w-none">
              <PortableText value={venueSettings.locationDescription} />
            </div>
          </div>
        )}

        {/* Enhanced Venue Images Gallery */}
        {venueSettings.venueImages && venueSettings.venueImages.length > 0 && (
          <VenueImageGallery
            images={venueSettings.venueImages}
            title="Venue & Location Gallery"
          />
        )}

        {/* Transportation */}
        {venueSettings.transportation && venueSettings.transportation.options && venueSettings.transportation.options.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex items-center mb-6">
              <span className="text-2xl mr-3">🚌</span>
              <h2 className="text-2xl font-bold text-gray-900">
                {venueSettings.transportation.title || 'Transportation'}
              </h2>
            </div>
            <div className="grid gap-4">
              {venueSettings.transportation.options.map((option, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start">
                    <span className="text-2xl mr-4 mt-1">{getTransportationIcon(option.type)}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{option.title}</h3>
                      {option.description && (
                        <p className="text-gray-600 mb-2">{option.description}</p>
                      )}
                      <div className="flex flex-wrap gap-4 text-sm">
                        {option.duration && (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            ⏱️ {option.duration}
                          </span>
                        )}
                        {option.cost && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                            💰 {option.cost}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Local Attractions */}
        {venueSettings.localAttractions && venueSettings.localAttractions.attractions && venueSettings.localAttractions.attractions.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex items-center mb-6">
              <span className="text-2xl mr-3">🎯</span>
              <h2 className="text-2xl font-bold text-gray-900">
                {venueSettings.localAttractions.title || 'Local Attractions'}
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {venueSettings.localAttractions.attractions.map((attraction, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start">
                    <span className="text-2xl mr-3 mt-1">{getCategoryIcon(attraction.category)}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{attraction.name}</h3>
                      {attraction.description && (
                        <p className="text-gray-600 text-sm mb-2">{attraction.description}</p>
                      )}
                      {attraction.distance && (
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          📍 {attraction.distance}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Information */}
        {venueSettings.additionalInformation && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex items-center mb-6">
              <span className="text-2xl mr-3">📋</span>
              <h2 className="text-2xl font-bold text-gray-900">Additional Information</h2>
            </div>
            <div className="prose prose-lg max-w-none">
              <PortableText value={venueSettings.additionalInformation} />
            </div>
          </div>
        )}

        {/* Map Section - Only show if map configuration exists */}
        {venueSettings.mapConfiguration && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-center mb-6">
              <span className="text-2xl mr-3">🗺️</span>
              <h2 className="text-2xl font-bold text-gray-900">Venue Location</h2>
            </div>
            <VenueMap
              mapConfig={venueSettings.mapConfiguration}
              venueName={venueSettings.venueName}
              venueAddress={formatAddress(venueSettings.venueAddress)}
            />
            {hasCompleteAddress(venueSettings.venueAddress) && (
              <div className="mt-4 text-center">
                <p className="text-gray-600 text-sm">
                  📍 {formatAddress(venueSettings.venueAddress)}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Join Us?</h3>
            <p className="text-orange-100 mb-6">
              Register now and secure your spot at this prestigious nursing conference
            </p>
            <div className="space-x-4">
              <Link
                href="/registration"
                className="inline-block bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Register Now
              </Link>
              <Link
                href="/submit-abstract"
                className="inline-block border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors"
              >
                Submit Abstract
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenuePage;
