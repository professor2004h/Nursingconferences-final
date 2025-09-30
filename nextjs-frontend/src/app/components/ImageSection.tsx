'use client';

import React from 'react';
import Image from 'next/image';
import { ImageSectionData } from '../getImageSection';

interface ImageSectionProps {
  data: ImageSectionData | null;
  className?: string;
}

const ImageSection: React.FC<ImageSectionProps> = ({ data: rawData, className = '' }) => {
  // Early return if no data
  if (!rawData) {
    console.warn('ImageSection: No data provided');
    return null;
  }

  // Validate required fields
  if (!rawData.image || !rawData.image.asset || !rawData.image.asset.url) {
    console.error('ImageSection: Missing required image data', rawData);
    return null;
  }

  // Normalize to ensure cpdImage is present on the object for TypeScript
  const data = rawData as ImageSectionData & {
    cpdImage?: {
      asset?: { _ref?: string; url?: string };
      alt?: string;
      caption?: string;
      hotspot?: { x: number; y: number };
    };
  };

  // Helper function to get aspect ratio class
  const getAspectRatioClass = (ratio: string) => {
    switch (ratio) {
      case '16/9': return 'aspect-video';
      case '4/3': return 'aspect-[4/3]';
      case '3/2': return 'aspect-[3/2]';
      case '1/1': return 'aspect-square';
      case 'auto': return '';
      default: return 'aspect-video';
    }
  };

  // Helper function to get border radius class
  const getBorderRadiusClass = (radius: string) => {
    switch (radius) {
      case 'none': return 'rounded-none';
      case 'sm': return 'rounded-sm';
      case 'md': return 'rounded-md';
      case 'lg': return 'rounded-lg';
      case 'xl': return 'rounded-xl';
      case 'full': return 'rounded-full';
      default: return 'rounded-lg';
    }
  };

  // Helper function to get object fit class
  const getObjectFitClass = (fit: string) => {
    switch (fit) {
      case 'cover': return 'object-cover';
      case 'contain': return 'object-contain';
      case 'fill': return 'object-fill';
      default: return 'object-cover';
    }
  };

  // For CPD banner we want full visibility (no crop), so force contain + fixed aspect
  const aspectRatioClass = getAspectRatioClass(data.layout?.aspectRatio || '16/9');
  const borderRadiusClass = getBorderRadiusClass(data.layout?.borderRadius || 'lg');
  const objectFitClass = getObjectFitClass(data.layout?.objectFit || 'cover');
  const hasCPD = Boolean(data.cpdImage?.asset?.url);

  return (
    <section className={`image-section w-full ${className}`}>
      {/* On desktop, stretch this right column to match the left column height */}
      <div className="relative w-full md:h-full">
        {data.title && (
          <div className="mb-4 text-center">
            <h3 className="text-lg font-semibold text-slate-900">
              {data.title}
            </h3>
          </div>
        )}

        {hasCPD ? (
          // Two-column layout: Left = About text (outside this component), Right = this column
          // Stack the CPD banner on top and the 16:9 image below it, both aligned to the top.
          // Make this column fill available height on desktop.
          <div className="flex flex-col gap-3 md:gap-4 md:self-stretch md:h-full">
            {/* CPD banner: force full image (no crop) and keep exact banner aspect */}
            <div className={`relative w-full overflow-hidden ${borderRadiusClass} aspect-[1552/531]`}>
              {data.cpdImage?.asset?.url ? (
                <Image
                  src={data.cpdImage.asset.url as string}
                  alt={data.cpdImage.alt || 'CPD Credits'}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 44vw, 44vw"
                  priority={true}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-500 text-sm">
                  CPD image not set
                </div>
              )}
            </div>

            {/* Main 16:9 image directly below CPD */}
            <div className={`relative w-full overflow-hidden ${borderRadiusClass} ${aspectRatioClass} md:flex-1`}>
              <Image
                src={data.image.asset.url}
                alt={data.image.alt}
                fill
                className={`${objectFitClass}`}
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 44vw, 44vw"
                priority={false}
              />
            </div>
          </div>
        ) : (
          /* Single image fallback */
          <div className={`relative w-full overflow-hidden ${borderRadiusClass} ${aspectRatioClass} md:self-stretch md:h-full`}>
            <Image
              src={data.image.asset.url}
              alt={data.image.alt}
              fill
              className={`${objectFitClass}`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={false}
            />
            
          </div>
        )}

        {(data.image.caption || data.cpdImage?.caption) && (
          <div className="mt-3 text-center space-y-1">
            {data.image.caption && (
              <p className="text-sm text-slate-600 italic">
                {data.image.caption}
              </p>
            )}
            {data.cpdImage?.caption && (
              <p className="text-xs text-slate-500">
                {data.cpdImage.caption}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ImageSection;
