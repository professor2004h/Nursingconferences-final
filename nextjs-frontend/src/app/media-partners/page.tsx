'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MediaPartner, MediaPartnersApiResponse } from '@/app/types/mediaPartners';

const MediaPartnersPage: React.FC = () => {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Partners</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchPartners}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-green-600">Media Partners</h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            We are grateful to our media partners who help us reach a wider audience and promote our conferences
          </p>
        </div>
      </div>

      {/* Partners Grid */}
      <div className="container mx-auto px-4 pb-16">
        {partners.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">🤝</div>
            <h2 className="text-2xl font-semibold text-gray-600 mb-4">No Partners Listed</h2>
            <p className="text-gray-500">Partner logos will be displayed here once they are added.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {partners.map((partner) => (
                <PartnerCard key={partner._id} partner={partner} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Partner Card Component
interface PartnerCardProps {
  partner: MediaPartner;
}

const PartnerCard: React.FC<PartnerCardProps> = ({ partner }) => {
  const cardContent = (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-300">
      {/* Logo */}
      <div className="relative h-20 mb-3 flex items-center justify-center">
        {partner.logo?.asset?.url ? (
          <Image
            src={partner.logo.asset.url}
            alt={partner.logo.alt || partner.companyName}
            fill
            className="object-contain"
            sizes="200px"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center text-gray-400">
            <span className="text-xl">🏢</span>
          </div>
        )}
      </div>

      {/* Company Name */}
      <h3 className="font-medium text-gray-900 text-center text-sm mb-2">
        {partner.companyName}
      </h3>

      {/* Description */}
      {partner.description && (
        <p className="text-xs text-gray-600 text-center line-clamp-2">
          {partner.description}
        </p>
      )}
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

export default MediaPartnersPage;
