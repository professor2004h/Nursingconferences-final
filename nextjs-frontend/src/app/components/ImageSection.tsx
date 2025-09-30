'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ImageSectionData } from '../getImageSection';

interface ImageSectionProps {
  data: ImageSectionData | null;
  className?: string;
}

const ImageSection: React.FC<ImageSectionProps> = ({ data: rawData, className = '' }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Early return if no data
  if (!rawData) {
    console.warn('ImageSection: No data provided');
    return null;
  }

  const data = rawData;

  // Check if we have carousel slides
  const hasCarousel = data.carouselSlides && data.carouselSlides.length > 0;

  if (!hasCarousel) {
    console.warn('ImageSection: No carousel slides provided');
    return null;
  }

  const slides = data.carouselSlides || [];
  const settings = data.carouselSettings || {
    autoplay: true,
    autoplaySpeed: 5,
    showDots: true,
    showArrows: true,
  };

  // Auto-play functionality
  useEffect(() => {
    if (!settings.autoplay || !isAutoPlaying || slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, (settings.autoplaySpeed || 5) * 1000);

    return () => clearInterval(interval);
  }, [settings.autoplay, settings.autoplaySpeed, isAutoPlaying, slides.length]);

  // Navigation functions
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // Resume autoplay after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  // Helper function to get border radius class
  const getBorderRadiusClass = (radius: string) => {
    switch (radius) {
      case 'none': return 'rounded-none';
      case 'sm': return 'rounded-sm';
      case 'md': return 'rounded-md';
      case 'lg': return 'rounded-lg';
      case 'xl': return 'rounded-xl';
      default: return 'rounded-lg';
    }
  };

  const borderRadiusClass = getBorderRadiusClass(data.layout?.borderRadius || 'lg');
  const currentSlideData = slides[currentSlide];

  return (
    <section className={`image-section w-full ${className}`}>
      <div className="relative w-full md:h-full">
        {data.title && (
          <div className="mb-4 text-center">
            <h3 className="text-lg font-semibold text-slate-900">
              {data.title}
            </h3>
          </div>
        )}

        {/* Carousel Container - 16:9 Aspect Ratio */}
        <div className={`relative w-full aspect-video overflow-hidden ${borderRadiusClass} bg-white shadow-lg`}>
          {/* Current Slide */}
          {currentSlideData && (
            <div className="absolute inset-0 w-full h-full">
              {/* Centered Layout - Large Logo with Name Below */}
              <div className="flex flex-col items-center justify-center h-full p-4 md:p-8 bg-gradient-to-b from-white/95 to-white/90">
                {/* Large Logo - Takes most of the space */}
                <div className="relative w-52 h-52 md:w-56 md:h-56 mb-3 md:mb-4">
                  <Image
                    src={currentSlideData.logo.asset.url}
                    alt={currentSlideData.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 208px, 224px"
                    priority
                  />
                </div>

                {/* Organization Name - Below Logo */}
                <div className="text-center max-w-3xl px-4">
                  {currentSlideData.link ? (
                    <a
                      href={currentSlideData.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base md:text-xl font-bold text-slate-900 hover:text-orange-600 transition-colors duration-300 inline-block"
                    >
                      {currentSlideData.name}
                    </a>
                  ) : (
                    <h3 className="text-base md:text-xl font-bold text-slate-900">
                      {currentSlideData.name}
                    </h3>
                  )}

                  {/* Truncated Description */}
                  {currentSlideData.description && (
                    <p className="mt-2 text-xs md:text-sm text-slate-600 line-clamp-2">
                      {currentSlideData.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Arrows */}
          {settings.showArrows && slides.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-800 rounded-full p-2 md:p-3 shadow-lg transition-all duration-300 hover:scale-110 z-10"
                aria-label="Previous slide"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-800 rounded-full p-2 md:p-3 shadow-lg transition-all duration-300 hover:scale-110 z-10"
                aria-label="Next slide"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Navigation Dots - Hidden on Mobile, Visible on Desktop */}
          {settings.showDots && slides.length > 1 && (
            <div className="hidden md:flex absolute bottom-4 left-1/2 -translate-x-1/2 gap-2 z-10">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? 'bg-orange-600 w-8 h-2.5'
                      : 'bg-white/70 hover:bg-white w-2.5 h-2.5'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* CPD Credits Image - Below Carousel */}
        {data.cpdImage && data.cpdImage.asset?.url && (
          <div className={`mt-6 w-full ${borderRadiusClass} overflow-hidden bg-white shadow-lg`}>
            <div className="relative w-full" style={{ aspectRatio: '2.92 / 1' }}>
              <Image
                src={data.cpdImage.asset.url}
                alt={data.cpdImage.alt || 'CPD Credits'}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            {data.cpdImage.caption && (
              <div className="px-4 py-2 text-center text-sm text-slate-600 bg-slate-50">
                {data.cpdImage.caption}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ImageSection;
