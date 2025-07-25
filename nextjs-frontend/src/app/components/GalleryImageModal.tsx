'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { GalleryImage } from '@/app/types/pastConferenceGallery';

interface GalleryImageModalProps {
  images: GalleryImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  galleryTitle: string;
  allowDownload?: boolean;
}

// Navigation and utility icons
const ChevronLeftIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const XIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const GalleryImageModal: React.FC<GalleryImageModalProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  galleryTitle,
  allowDownload = true
}) => {
  const [imageIndex, setImageIndex] = useState(currentIndex);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    setImageIndex(currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, imageIndex]);

  const goToPrevious = () => {
    setImageLoading(true);
    setImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const goToNext = () => {
    setImageLoading(true);
    setImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleDownload = async () => {
    if (!allowDownload || !images[imageIndex]?.asset?.url) return;

    try {
      const imageUrl = images[imageIndex].asset!.url;
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${galleryTitle}-image-${imageIndex + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  if (!isOpen || !images.length) return null;

  const currentImage = images[imageIndex];
  if (!currentImage?.asset?.url) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-all"
        aria-label="Close gallery"
      >
        <XIcon />
      </button>

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-all"
            aria-label="Previous image"
          >
            <ChevronLeftIcon />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-all"
            aria-label="Next image"
          >
            <ChevronRightIcon />
          </button>
        </>
      )}

      {/* Main Image Container */}
      <div className="relative max-w-7xl max-h-[90vh] mx-4 flex flex-col items-center">
        {/* Loading Spinner */}
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}

        {/* Main Image */}
        <div className="relative max-w-full max-h-[80vh]">
          <Image
            src={currentImage.asset.url}
            alt={currentImage.alt || `Gallery image ${imageIndex + 1}`}
            width={1200}
            height={800}
            className="max-w-full max-h-[80vh] object-contain"
            onLoad={() => setImageLoading(false)}
            onError={() => setImageLoading(false)}
            priority
          />
        </div>

        {/* Image Info */}
        <div className="mt-4 text-center text-white max-w-4xl">
          {/* Image Caption */}
          {currentImage.caption && (
            <p className="text-lg font-medium mb-2">{currentImage.caption}</p>
          )}

          {/* Image Details */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-300 mb-3">
            <span>{imageIndex + 1} of {images.length}</span>
            
            {currentImage.category && (
              <span className="bg-blue-600 px-2 py-1 rounded-full text-xs">
                {currentImage.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            )}
            
            {currentImage.photographer && (
              <span>📸 {currentImage.photographer}</span>
            )}
            
            {currentImage.isFeatured && (
              <span className="bg-yellow-600 px-2 py-1 rounded-full text-xs">
                ⭐ Featured
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3">
            {allowDownload && (
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <DownloadIcon />
                Download
              </button>
            )}
            
            {images.length > 1 && (
              <div className="text-sm text-gray-400">
                Use ← → arrow keys to navigate
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Thumbnail Strip (for larger galleries) */}
      {images.length > 1 && images.length <= 20 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => {
                setImageLoading(true);
                setImageIndex(index);
              }}
              className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                index === imageIndex 
                  ? 'border-white scale-110' 
                  : 'border-transparent hover:border-gray-400'
              }`}
            >
              {image.asset?.url && (
                <Image
                  src={image.asset.url}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default GalleryImageModal;
