'use client';

import React, { useState, useEffect } from 'react';
import { VenueImage } from '@/app/types/venueSettings';

interface VenueImageGalleryProps {
  images: VenueImage[];
  title?: string;
}

const VenueImageGallery: React.FC<VenueImageGalleryProps> = ({ 
  images, 
  title = "Venue Gallery" 
}) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [imageLoading, setImageLoading] = useState<{ [key: number]: boolean }>({});

  const openLightbox = (index: number) => {
    setSelectedImage(index);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset'; // Restore scrolling
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImage === null) return;
    
    if (direction === 'prev') {
      setSelectedImage(selectedImage > 0 ? selectedImage - 1 : images.length - 1);
    } else {
      setSelectedImage(selectedImage < images.length - 1 ? selectedImage + 1 : 0);
    }
  };

  const handleImageLoad = (index: number) => {
    setImageLoading(prev => ({ ...prev, [index]: false }));
  };

  const handleImageLoadStart = (index: number) => {
    setImageLoading(prev => ({ ...prev, [index]: true }));
  };

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (selectedImage === null) return;
      
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          navigateImage('prev');
          break;
        case 'ArrowRight':
          navigateImage('next');
          break;
      }
    };

    if (selectedImage !== null) {
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [selectedImage]);

  if (!images || images.length === 0) {
    return null; // Hide section if no images
  }

  return (
    <>
      {/* Gallery Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
        <div className="flex items-center mb-6">
          <span className="text-2xl mr-3">📸</span>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <span className="ml-3 text-sm text-gray-500">({images.length} photos)</span>
        </div>
        
        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div 
              key={index} 
              className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer bg-gray-100"
              onClick={() => openLightbox(index)}
            >
              {/* Loading Placeholder */}
              {imageLoading[index] && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
              )}
              
              {image.asset?.url && (
                <>
                  <img
                    src={image.asset.url}
                    alt={image.alt || `Venue image ${index + 1}`}
                    className="w-full h-48 sm:h-56 lg:h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    onLoadStart={() => handleImageLoadStart(index)}
                    onLoad={() => handleImageLoad(index)}
                    loading="lazy"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Caption Overlay */}
                  {image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-3">
                      <p className="text-sm font-medium overflow-hidden text-ellipsis text-white" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>{image.caption}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
        
        {/* Gallery Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Click on any image to view in full size • Use arrow keys to navigate
          </p>
        </div>
      </div>

      {/* Lightbox Modal - raised z-index and header offset to avoid overlap */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 z-[2147483000] flex items-center justify-center bg-black/90 backdrop-blur-sm pt-24 md:pt-28"
          style={{ isolation: 'isolate' }}
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 z-[2147483600] text-white hover:text-gray-300 transition-colors p-2 rounded-full bg-black/60 hover:bg-black/80"
            aria-label="Close gallery"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Previous Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateImage('prev');
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-[2147483600] text-white hover:text-gray-300 transition-colors p-3 rounded-full bg-black/60 hover:bg-black/80"
            aria-label="Previous image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateImage('next');
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-[2147483600] text-white hover:text-gray-300 transition-colors p-3 rounded-full bg-black/60 hover:bg-black/80"
            aria-label="Next image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Main Image */}
          <div
            className="max-w-7xl max-h-full mx-4 flex flex-col items-center mt-2"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[selectedImage].asset?.url}
              alt={images[selectedImage].alt || `Venue image ${selectedImage + 1}`}
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />
            
            {/* Image Info */}
            <div className="mt-4 text-center max-w-2xl">
              {images[selectedImage].caption && (
                <p className="text-lg font-medium mb-2 text-white" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>{images[selectedImage].caption}</p>
              )}
              <p className="text-sm text-gray-300">
                Image {selectedImage + 1} of {images.length}
              </p>
            </div>
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-[2147483600]">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === selectedImage ? 'bg-white' : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default VenueImageGallery;
