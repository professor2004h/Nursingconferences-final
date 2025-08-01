'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { type HeroSectionType } from '../getHeroSection';

interface HeroSlideshowProps {
  hero: HeroSectionType | null;
}

export default function HeroSlideshow({ hero }: HeroSlideshowProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);



  // Auto-advance slideshow
  useEffect(() => {
    if (!hero?.images || hero.images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % hero.images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [hero?.images]);

  // Simple overlay settings
  const overlayOpacity = hero?.slideshowSettings?.overlayOpacity || 40;
  const overlayColor = typeof hero?.slideshowSettings?.overlayColor === 'string'
    ? hero.slideshowSettings.overlayColor
    : hero?.slideshowSettings?.overlayColor?.hex || '#000000';



  return (
    <section className="hero-section">
      {/* Background Images with Slideshow */}
      {hero?.images && hero.images.length > 0 ? (
        <div className="absolute inset-0">
          {hero.images.map((image, index) => (
            <div
              key={index}
              className={`hero-image-responsive absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentImageIndex ? 'opacity-100 animate-zoom' : 'opacity-0'
              }`}
              style={{
                backgroundImage: `url(${image.url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center bottom',
                backgroundRepeat: 'no-repeat',
                transform: index === currentImageIndex ? 'scale(1.05)' : 'scale(1)',
                transition: 'transform 5s ease-out, opacity 1s ease-in-out',
              }}
            />
          ))}
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d]" />
      )}

      {/* Dynamic Overlay from CMS */}
      <div
        className="absolute inset-0 z-10"
        style={{
          backgroundColor: overlayColor,
          opacity: overlayOpacity / 100,
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <div className="hero-content-container glass-layout-910x598">
          {/* Conference Title */}
          <h1
            className="hero-conference-title"
            style={{
              color: hero?.textColor?.hex || '#ffffff',
              opacity: hero?.textColor?.alpha || 1,
              fontSize: 'clamp(0.6rem, 2vw, 1.1rem)',
              fontWeight: '700',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              margin: '0',
              marginBottom: '0.1rem',
              lineHeight: '1.2'
            }}
          >
            {hero?.conferenceTitle || 'INTERNATIONAL CONFERENCE ON'}
          </h1>

          {/* Conference Subject */}
          <h2
            className="hero-conference-subject"
            style={{
              color: '#f97316',
              opacity: 1,
              fontSize: 'clamp(1.1rem, 3.5vw, 1.8rem)',
              fontWeight: '900',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              margin: '0',
              marginBottom: '0.25rem',
              lineHeight: '1.1'
            }}
          >
            {hero?.conferenceSubject || 'NURSING'}
          </h2>

          {/* Conference Theme */}
          {hero?.conferenceTheme && (
            <p
              className="hero-conference-theme"
              style={{
                color: hero?.textColor?.hex || '#ffffff',
                opacity: hero?.textColor?.alpha || 1
              }}
            >
              {hero.conferenceTheme}
            </p>
          )}

          {/* Event Type */}
          {hero?.eventType && (
            <div
              className="hero-event-type"
              style={{
                color: '#10b981',
                opacity: 1,
                fontSize: 'clamp(0.65rem, 2.2vw, 0.85rem)',
                fontWeight: '600',
                letterSpacing: '0.03em',
                textTransform: 'uppercase',
                margin: '0',
                marginBottom: '0.4rem',
                lineHeight: '1.1',
                textAlign: 'center',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: 'clamp(10px, 2.5vw, 16px)',
                padding: 'clamp(0.25rem, 1.2vw, 0.4rem) clamp(0.6rem, 2.5vw, 1rem)',
                backdropFilter: 'blur(4px)',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.2)',
                display: 'inline-block',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '90%'
              }}
            >
              🌐 {hero.eventType}
            </div>
          )}

          {/* Date and Venue Section - Simplified Layout */}
          <div className="hero-date-venue-container">
            {/* Date */}
            <div className="hero-info-item-simple">
              <div className="hero-info-icon-simple">
                <svg className="hero-icon-svg" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="hero-info-content-simple">
                <span className="hero-info-label-simple">Date</span>
                <span
                  className="hero-info-value-simple"
                  style={{
                    color: hero?.textColor?.hex || '#ffffff',
                    opacity: hero?.textColor?.alpha || 1,
                    fontSize: 'clamp(0.65rem, 2.2vw, 0.875rem)'
                  }}
                >
                  {hero?.conferenceDate || 'June 23-24, 2025'}
                </span>
              </div>
            </div>

            {/* Venue */}
            <div className="hero-info-item-simple">
              <div className="hero-info-icon-simple">
                <svg className="hero-icon-svg" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="hero-info-content-simple">
                <span className="hero-info-label-simple">Venue</span>
                <span
                  className="hero-info-value-simple"
                  style={{
                    color: hero?.textColor?.hex || '#ffffff',
                    opacity: hero?.textColor?.alpha || 1,
                    fontSize: 'clamp(0.65rem, 2.2vw, 0.875rem)'
                  }}
                >
                  {hero?.conferenceVenue || 'Hotel Indigo Kuala Lumpur On The Park, Kuala Lumpur, Malaysia'}
                </span>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="hero-additional-info">
              {hero?.abstractSubmissionInfo && (
              <div
                className="hero-info-bullet"
                style={{
                  color: hero?.textColor?.hex || '#ffffff',
                  opacity: hero?.textColor?.alpha || 1,
                  fontSize: 'clamp(0.65rem, 2.2vw, 0.875rem)'
                }}
              >
                <span className="hero-bullet-icon">📝</span>
                {hero.abstractSubmissionInfo}
              </div>
            )}
            {hero?.registrationInfo && (
              <div
                className="hero-info-bullet"
                style={{
                  color: hero?.textColor?.hex || '#ffffff',
                  opacity: hero?.textColor?.alpha || 1,
                  fontSize: 'clamp(0.65rem, 2.2vw, 0.875rem)'
                }}
              >
                <span className="hero-bullet-icon">🎟️</span>
                {hero.registrationInfo}
              </div>
            )}
          </div>

          {/* Register Button */}
          {hero?.showRegisterButton && (
            <div
              className="hero-register-container"
              style={{
                marginTop: 'clamp(0.3rem, 1vw, 0.5rem)',
                marginBottom: '0',
                padding: '0'
              }}
            >
              <Link
                href={hero?.registerButtonUrl || '/registration'}
                className="hero-register-button"
                aria-label={hero?.registerButtonText || 'Register for conference'}
                style={{
                  fontSize: 'clamp(0.65rem, 2.5vw, 0.95rem)',
                  padding: 'clamp(0.5rem, 2vw, 0.75rem) clamp(1rem, 4vw, 2.2rem)',
                  minHeight: 'clamp(36px, 8vw, 48px)',
                  minWidth: 'clamp(120px, 30vw, 200px)',
                  maxWidth: 'clamp(160px, 40vw, 240px)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: 'clamp(0.08em, 0.2vw, 0.12em)',
                  borderRadius: 'clamp(20px, 5vw, 50px)',
                  textDecoration: 'none',
                  background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                  color: '#ffffff',
                  boxShadow: '0 4px 16px rgba(249, 115, 22, 0.4)',
                  border: '2px solid transparent',
                  whiteSpace: 'nowrap'
                }}
              >
                {hero?.registerButtonText || 'Register Now'}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Dots - Desktop Only */}
      {hero?.images && hero.images.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 hidden lg:flex space-x-2">
          {hero.images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentImageIndex
                  ? 'bg-white scale-110'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
