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
        <div className="text-center mb-6 sm:mb-8">
          {/* Heading adjusted for perfect centering on mobile */}
          <h2 className="text-xl sm:text-2xl md:text-5xl font-bold text-slate-900 mb-3 sm:mb-4 mx-auto text-center">
            Venue & Location Information
          </h2>
          {/* Subtext removed as requested */}
        </div>

        {/* Single Column Layout */}
        <div className="max-w-4xl mx-auto">
          {/* About the Location Section */}
          <div className="bg-slate-50 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 relative">
            <div className="flex items-center mb-4 sm:mb-5">
              <span className="text-3xl mr-4">🌆</span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">About the Location</h3>
            </div>

            {/* Mobile-only scroll container to show limited content initially */}
            <div className="block md:hidden relative max-h-72 overflow-y-auto pr-1 [-webkit-overflow-scrolling:touch] scrollbar-thin w-full">
              {/* gradient fade at bottom for subtle cue - keep inside the card bounds */}
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-slate-50 to-transparent rounded-b-xl"></div>
              <div className="space-y-6">
                {/* Venue Information (mobile scroll area) */}
                <div className="mb-3">
                  <div className="flex items-start gap-3 mb-2">
                    <span className="text-2xl leading-none">🏨</span>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-base font-bold text-slate-900 break-words">{venueSettings.venueName}</h4>
                      {venueSettings.venueAddress && (
                        <p className="text-sm text-slate-600 mt-1 break-words">{formatAddress(venueSettings.venueAddress)}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Location Description (mobile scroll area) */}
                {venueSettings.locationDescription && (
                  <div className="prose prose-sm max-w-none text-slate-700">
                    <PortableText value={venueSettings.locationDescription} />
                  </div>
                )}
              </div>
            </div>

            {/* Desktop and tablet view (no scroll truncation) */}
            <div className="hidden md:block">
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
          {/* close desktop container */}
        </div>

          {/* Call to Action Section */}
          <div className="text-center">
            <a
              href="/venue"
              className="inline-flex items-center bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
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
