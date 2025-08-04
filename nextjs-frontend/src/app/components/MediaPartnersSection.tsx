'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MediaPartner, MediaPartnersApiResponse } from '@/app/types/mediaPartners';

const MediaPartnersSection: React.FC = () => {
  const [partners, setPartners] = useState<MediaPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/media-partners');
      const result: MediaPartnersApiResponse = await response.json();

      if (result.success) {
        setPartners(result.data || []);
      } else {
        setError(result.error || 'Failed to fetch partners');
      }
    } catch (err) {
      setError('An error occurred while fetching partners');
      console.error('Error fetching partners:', err);
    } finally {
      setLoading(false);
    }
  };

  // Don't render anything if there are no partners or if there's an error
  if (error || partners.length === 0) {
    return null;
  }

  if (loading) {
    return (
      <section className="py-8 sm:py-12 md:py-16 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <span className="text-orange-500 font-semibold text-sm sm:text-base lg:text-lg tracking-wide uppercase mb-2 sm:mb-3 block">
              OUR PARTNERS
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 md:mb-6 leading-tight text-slate-900">
              Media
              <span className="block bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
                Partners
              </span>
            </h2>
          </div>

          {/* Loading skeleton */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8 w-full">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6 animate-pulse">
                <div className="h-12 sm:h-16 md:h-20 lg:h-24 bg-gray-200 rounded mb-2 sm:mb-3"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          {/* Heading removed as requested */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 md:mb-6 leading-tight text-slate-900">
            Media
            <span className="block bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
              Partners
            </span>
          </h2>
          {/* Subtext removed as requested */}
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8 mb-6 sm:mb-8 md:mb-12 w-full">
          {partners.map((partner) => (
            <PartnerCard key={partner._id} partner={partner} />
          ))}
        </div>

        {/* View All Partners Link */}
        <div className="text-center">
          <Link
            href="/media-partners"
            className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold text-sm sm:text-base rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            View All Partners
            <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

// Partner Card Component
interface PartnerCardProps {
  partner: MediaPartner;
}

const PartnerCard: React.FC<PartnerCardProps> = ({ partner }) => {
  const cardContent = (
    <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 md:p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 min-h-[120px] sm:min-h-[140px] md:min-h-[160px] lg:min-h-[180px] group w-full max-w-full overflow-hidden flex flex-col">
      {/* Logo */}
      <div className="relative h-12 sm:h-16 md:h-20 lg:h-24 mb-2 sm:mb-3 flex items-center justify-center w-full flex-shrink-0">
        {partner.logo?.asset?.url ? (
          <Image
            src={partner.logo.asset.url}
            alt={partner.logo.alt || partner.companyName}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 480px) 120px, (max-width: 768px) 150px, (max-width: 1024px) 200px, 250px"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center text-gray-400">
            <span className="text-lg sm:text-xl md:text-2xl">🏢</span>
          </div>
        )}
      </div>

      {/* Company Name */}
      <div className="w-full px-1 sm:px-2 flex-grow">
        <h3
          className="font-medium text-gray-900 text-center text-xs sm:text-sm md:text-base leading-relaxed group-hover:text-green-600 transition-colors duration-300 w-full"
          style={{
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            whiteSpace: 'normal',
            hyphens: 'auto'
          }}
        >
          {partner.companyName}
        </h3>
      </div>
    </div>
  );

  // Wrap with link if website exists
  if (partner.website) {
    return (
      <a
        href={partner.website}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {cardContent}
      </a>
    );
  }

  return cardContent;
};

export default MediaPartnersSection;
