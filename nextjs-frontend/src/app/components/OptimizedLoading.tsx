'use client';

import React, { memo } from 'react';

interface LoadingSkeletonProps {
  variant?: 'card' | 'hero' | 'text' | 'image' | 'stats' | 'form';
  count?: number;
  className?: string;
}

// Optimized loading skeleton components
const LoadingSkeleton = memo(function LoadingSkeleton({ 
  variant = 'card', 
  count = 1,
  className = '' 
}: LoadingSkeletonProps) {
  const renderSkeleton = () => {
    switch (variant) {
      case 'hero':
        return (
          <div className={`relative h-96 md:h-[500px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse ${className}`}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <div className="h-8 bg-white/20 rounded mb-4 w-3/4" />
              <div className="h-6 bg-white/20 rounded mb-6 w-1/2" />
              <div className="flex gap-4">
                <div className="h-12 bg-white/20 rounded w-32" />
                <div className="h-12 bg-white/20 rounded w-32" />
              </div>
            </div>
          </div>
        );

      case 'card':
        return (
          <div className={`bg-white rounded-xl shadow-lg overflow-hidden animate-pulse ${className}`}>
            <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300" />
            <div className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-3 w-24" />
              <div className="h-6 bg-gray-300 rounded mb-3 w-full" />
              <div className="h-6 bg-gray-300 rounded mb-4 w-3/4" />
              <div className="h-4 bg-gray-200 rounded mb-4 w-32" />
              <div className="h-4 bg-gray-200 rounded w-20" />
            </div>
          </div>
        );

      case 'stats':
        return (
          <div className={`bg-white rounded-lg p-6 shadow-lg animate-pulse ${className}`}>
            <div className="text-center">
              <div className="h-8 bg-gray-300 rounded mb-2 w-16 mx-auto" />
              <div className="h-4 bg-gray-200 rounded w-24 mx-auto" />
            </div>
          </div>
        );

      case 'text':
        return (
          <div className={`animate-pulse ${className}`}>
            <div className="h-4 bg-gray-200 rounded mb-2 w-full" />
            <div className="h-4 bg-gray-200 rounded mb-2 w-5/6" />
            <div className="h-4 bg-gray-200 rounded mb-2 w-4/6" />
            <div className="h-4 bg-gray-200 rounded w-3/6" />
          </div>
        );

      case 'image':
        return (
          <div className={`bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse rounded-lg ${className}`}>
            <div className="flex items-center justify-center h-full">
              <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        );

      case 'form':
        return (
          <div className={`animate-pulse ${className}`}>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
              <div className="h-12 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
              <div className="h-12 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-28 mb-2" />
              <div className="h-32 bg-gray-200 rounded" />
              <div className="h-12 bg-gray-300 rounded" />
            </div>
          </div>
        );

      default:
        return (
          <div className={`h-4 bg-gray-200 rounded animate-pulse ${className}`} />
        );
    }
  };

  if (count === 1) {
    return renderSkeleton();
  }

  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <div key={index}>
          {renderSkeleton()}
        </div>
      ))}
    </>
  );
});

// Page-specific loading components
export const HeroLoading = memo(() => (
  <LoadingSkeleton variant="hero" className="w-full" />
));
HeroLoading.displayName = 'HeroLoading';

export const ConferenceCardLoading = memo(({ count = 3 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    <LoadingSkeleton variant="card" count={count} />
  </div>
));
ConferenceCardLoading.displayName = 'ConferenceCardLoading';

export const StatsLoading = memo(() => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
    <LoadingSkeleton variant="stats" count={4} />
  </div>
));
StatsLoading.displayName = 'StatsLoading';

export const AboutLoading = memo(() => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
    <div>
      <div className="h-6 bg-gray-200 rounded mb-4 w-24 animate-pulse" />
      <div className="h-12 bg-gray-300 rounded mb-6 animate-pulse" />
      <LoadingSkeleton variant="text" className="mb-8" />
      <div className="flex gap-4">
        <div className="h-12 bg-gray-300 rounded w-32 animate-pulse" />
        <div className="h-12 bg-gray-200 rounded w-32 animate-pulse" />
      </div>
    </div>
    <LoadingSkeleton variant="image" className="h-96" />
  </div>
));
AboutLoading.displayName = 'AboutLoading';

export const ContactFormLoading = memo(() => (
  <LoadingSkeleton variant="form" className="max-w-2xl mx-auto" />
));
ContactFormLoading.displayName = 'ContactFormLoading';

// Full page loading component
export const PageLoading = memo(() => (
  <div className="min-h-screen bg-white">
    <HeroLoading />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <AboutLoading />
      <div className="mt-16">
        <div className="h-8 bg-gray-300 rounded mb-8 w-48 mx-auto animate-pulse" />
        <ConferenceCardLoading count={6} />
      </div>
      <div className="mt-16">
        <div className="h-8 bg-gray-300 rounded mb-8 w-64 mx-auto animate-pulse" />
        <ContactFormLoading />
      </div>
    </div>
  </div>
));
PageLoading.displayName = 'PageLoading';

export default LoadingSkeleton;
