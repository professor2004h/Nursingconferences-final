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
    venueSettings.venueAddress
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





  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-orange-500 font-semibold text-lg tracking-wide uppercase mb-4 block">
            Conference Location
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Venue & Location Information
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Discover everything you need to know about our conference venue and the surrounding area.
          </p>
        </div>

        {/* Single Column Layout */}
        <div className="max-w-4xl mx-auto">
          {/* About the Location Section */}
          <div className="bg-slate-50 rounded-xl p-6 sm:p-8 mb-8">
            <div className="flex items-center mb-6">
              <span className="text-3xl mr-4">🌆</span>
              <h3 className="text-2xl font-bold text-slate-900">About the Location</h3>
            </div>

            {/* Venue Information */}
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">🏨</span>
                <div>
                  <h4 className="text-xl font-bold text-slate-900">{venueSettings.venueName}</h4>
                  {venueSettings.venueAddress && (
                    <p className="text-base text-slate-600 mt-1">{formatAddress(venueSettings.venueAddress)}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Location Description */}
            {venueSettings.locationDescription && (
              <div className="prose prose-lg max-w-none text-slate-700">
                <PortableText value={venueSettings.locationDescription} />
              </div>
            )}
          </div>

          {/* Call to Action Section */}
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
    </section>
  );
};

export default AboutLocationSection;
