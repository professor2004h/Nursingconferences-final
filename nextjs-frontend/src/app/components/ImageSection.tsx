'use client';

import React from 'react';
import Image from 'next/image';
import { ImageSectionData } from '../getImageSection';

interface ImageSectionProps {
  data: ImageSectionData;
  className?: string;
}

const ImageSection: React.FC<ImageSectionProps> = ({ data, className = '' }) => {
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

  const aspectRatioClass = getAspectRatioClass(data.layout.aspectRatio);
  const borderRadiusClass = getBorderRadiusClass(data.layout.borderRadius);
  const objectFitClass = getObjectFitClass(data.layout.objectFit);

  return (
    <section className={`image-section w-full ${className}`}>
      <div className="relative w-full">
        {/* Optional Title */}
        {data.title && (
          <div className="mb-4 text-center">
            <h3 className="text-lg font-semibold text-slate-900">
              {data.title}
            </h3>
          </div>
        )}

        {/* Image Container */}
        <div className={`relative w-full overflow-hidden ${borderRadiusClass} ${aspectRatioClass}`}>
          <Image
            src={data.image.asset.url}
            alt={data.image.alt}
            fill
            className={`${objectFitClass} transition-all duration-300 hover:scale-105`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
          
          {/* Overlay for better text readability if needed */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Optional Caption */}
        {data.image.caption && (
          <div className="mt-3 text-center">
            <p className="text-sm text-slate-600 italic">
              {data.image.caption}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ImageSection;
