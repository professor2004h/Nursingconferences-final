'use client';

import React, { memo, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ConferenceCardProps {
  conference: {
    _id: string;
    title: string;
    slug: { current: string };
    date: string;
    location: string;
    imageUrl?: string;
    mainConferenceUrl?: string;
    registerNowUrl?: string;
    submitAbstractUrl?: string;
  };
  priority?: boolean;
  className?: string;
}

// Memoized conference card component for better performance
const OptimizedConferenceCard = memo(function ConferenceCard({ 
  conference, 
  priority = false,
  className = '' 
}: ConferenceCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);

  const formattedDate = new Date(conference.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <article className={`group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden ${className}`}>
      {conference.mainConferenceUrl ? (
        <a href={conference.mainConferenceUrl} className="block">
      ) : (
        <Link href={`/events/${conference.slug.current}`} className="block">
      )}
        <div className="relative h-48 overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
          )}
          
          {conference.imageUrl && !imageError ? (
            <Image
              src={conference.imageUrl}
              alt={conference.title}
              fill
              className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={handleImageLoad}
              onError={handleImageError}
              priority={priority}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
              <div className="text-white text-center p-4">
                <svg className="w-12 h-12 mx-auto mb-2 opacity-80" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-medium">Conference Image</p>
              </div>
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="p-6">
          <div className="flex items-center text-sm text-orange-600 font-semibold mb-2">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            {formattedDate}
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300">
            {conference.title}
          </h3>

          <div className="flex items-center text-slate-600 mb-4">
            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm line-clamp-1">{conference.location}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="inline-flex items-center text-orange-600 font-semibold group-hover:text-orange-700 transition-colors duration-300">
              Learn More
              <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      {conference.mainConferenceUrl ? (
        </a>
      ) : (
        </Link>
      )}
    </article>
  );
});

export default OptimizedConferenceCard;
