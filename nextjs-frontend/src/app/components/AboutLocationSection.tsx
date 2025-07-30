'use client';

import React from 'react';
import { PortableText } from '@portabletext/react';
import { VenueSettings } from '@/app/types/venueSettings';

interface AboutLocationSectionProps {
  venueSettings: VenueSettings | null;
}

const AboutLocationSection: React.FC<AboutLocationSectionProps> = ({ venueSettings }) => {
  // Don't render if no venue settings
  if (!venueSettings) {
    return null;
  }

  // Check if we have any location-related content to display
  const hasLocationContent = !!(
    venueSettings.locationDescription ||
    venueSettings.venueName ||
    venueSettings.venueAddress ||
    venueSettings.transportation?.options?.length ||
    venueSettings.localAttractions?.attractions?.length
  );

  if (!hasLocationContent) {
    return null;
  }

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

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-orange-500 font-semibold text-lg tracking-wide uppercase mb-4 block">
            Conference Location
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            🌆 About the Location
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Discover everything you need to know about our conference venue and the surrounding area.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Venue & Location Info */}
          <div className="space-y-8">
            {/* Venue Information */}
            <div className="bg-slate-50 rounded-xl p-6 sm:p-8">
              <div className="flex items-center mb-6">
                <span className="text-3xl mr-4">🏨</span>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">{venueSettings.venueName}</h3>
                  {venueSettings.venueAddress && (
                    <p className="text-lg text-slate-600 mt-1">{formatAddress(venueSettings.venueAddress)}</p>
                  )}
                </div>
              </div>

              {/* Location Description */}
              {venueSettings.locationDescription && (
                <div className="prose prose-lg max-w-none text-slate-700">
                  <PortableText value={venueSettings.locationDescription} />
                </div>
              )}
            </div>

            {/* Transportation */}
            {venueSettings.transportation?.options && venueSettings.transportation.options.length > 0 && (
              <div className="bg-blue-50 rounded-xl p-6 sm:p-8">
                <div className="flex items-center mb-6">
                  <span className="text-2xl mr-3">🚌</span>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {venueSettings.transportation.title || 'Transportation'}
                  </h3>
                </div>
                <div className="space-y-4">
                  {venueSettings.transportation.options.slice(0, 3).map((option, index) => (
                    <div key={index} className="flex items-start bg-white rounded-lg p-4 shadow-sm">
                      <span className="text-2xl mr-4 mt-1">{getTransportationIcon(option.type)}</span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 mb-1">{option.title}</h4>
                        {option.description && (
                          <p className="text-slate-600 text-sm mb-2">{option.description}</p>
                        )}
                        <div className="flex gap-4 text-sm text-slate-500">
                          {option.duration && <span>⏱️ {option.duration}</span>}
                          {option.cost && <span>💰 {option.cost}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Local Attractions */}
          <div className="space-y-8">
            {venueSettings.localAttractions?.attractions && venueSettings.localAttractions.attractions.length > 0 && (
              <div className="bg-green-50 rounded-xl p-6 sm:p-8">
                <div className="flex items-center mb-6">
                  <span className="text-2xl mr-3">🎯</span>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {venueSettings.localAttractions.title || 'Local Attractions'}
                  </h3>
                </div>
                <div className="space-y-4">
                  {venueSettings.localAttractions.attractions.slice(0, 6).map((attraction, index) => (
                    <div key={index} className="flex items-start bg-white rounded-lg p-4 shadow-sm">
                      <span className="text-xl mr-3 mt-1">{getCategoryIcon(attraction.category)}</span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 mb-1">{attraction.name}</h4>
                        {attraction.description && (
                          <p className="text-slate-600 text-sm mb-2">{attraction.description}</p>
                        )}
                        {attraction.distance && (
                          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                            📍 {attraction.distance}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 sm:p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">Need More Information?</h3>
              <p className="text-orange-100 mb-6 leading-relaxed">
                Explore our comprehensive venue page for detailed maps, amenities, and complete location information.
              </p>
              <a
                href="/venue"
                className="inline-flex items-center bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                View Full Venue Details
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutLocationSection;
