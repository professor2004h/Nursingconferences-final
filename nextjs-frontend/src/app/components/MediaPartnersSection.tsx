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
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <span className="text-orange-500 font-semibold text-base sm:text-lg tracking-wide uppercase mb-3 sm:mb-4 block">
              OUR PARTNERS
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight text-slate-900">
              Media
              <span className="block bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
                Partners
              </span>
            </h2>
          </div>
          
          {/* Loading skeleton */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 sm:p-6 animate-pulse">
                <div className="h-16 sm:h-20 lg:h-24 bg-gray-200 rounded mb-3 sm:mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-orange-500 font-semibold text-base sm:text-lg tracking-wide uppercase mb-3 sm:mb-4 block">
            OUR PARTNERS
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight text-slate-900">
            Media
            <span className="block bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
              Partners
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
            We are grateful to our media partners who help us reach a wider audience and promote our conferences
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
          {partners.map((partner) => (
            <PartnerCard key={partner._id} partner={partner} />
          ))}
        </div>

        {/* View All Partners Link */}
        <div className="text-center">
          <Link
            href="/media-partners"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            View All Partners
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 min-h-[120px] sm:min-h-[140px] lg:min-h-[160px] group">
      {/* Logo */}
      <div className="relative h-16 sm:h-20 lg:h-24 mb-3 sm:mb-4 flex items-center justify-center">
        {partner.logo?.asset?.url ? (
          <Image
            src={partner.logo.asset.url}
            alt={partner.logo.alt || partner.companyName}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 150px, (max-width: 1024px) 200px, 250px"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center text-gray-400">
            <span className="text-xl sm:text-2xl">🏢</span>
          </div>
        )}
      </div>

      {/* Company Name */}
      <h3 className="font-medium text-gray-900 text-center text-xs sm:text-sm lg:text-base leading-tight group-hover:text-green-600 transition-colors duration-300">
        {partner.companyName}
      </h3>
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
