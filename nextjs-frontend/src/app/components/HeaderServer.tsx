import Link from 'next/link';
import Image from 'next/image';
import { getSiteSettingsForHeader, getLogoImageUrl } from '../getSiteSettings';
import HeaderClient from './HeaderClient';

// Force this component to be dynamic to prevent caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HeaderServer() {
  // Always fetch fresh data for header to ensure manual refresh works
  const siteSettings = await getSiteSettingsForHeader();

  // Check if header section should be visible
  const isHeaderSectionVisible = siteSettings?.headerVisibility?.showHeaderSection !== false;

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 header-container">
      {/* Top Contact Bar - Conditionally Rendered */}
      {isHeaderSectionVisible && siteSettings?.contactInfo?.email && (
        <div className="bg-blue-900 text-white py-1.5 px-1">
          <div className="max-w-7xl mx-auto">
            {/* Mobile Layout - Single Line */}
            <div className="block sm:hidden">
              <div className="flex items-center text-xs mobile-header-bar w-full">
                {/* Left side - Contact Information */}
                <div className="flex items-center space-x-3 flex-grow min-w-0">
                  {/* Email - Only show if available */}
                  {siteSettings.contactInfo.email && (
                    <div className="flex items-center space-x-1 flex-shrink min-w-0">
                      <svg className="w-3 h-3 text-blue-200 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                      </svg>
                      <span className="text-white truncate text-xs font-medium">
                        {siteSettings.contactInfo.email}
                      </span>
                    </div>
                  )}

                  {/* Phone - Only show if available */}
                  {siteSettings.contactInfo.phone && (
                    <div className="flex items-center space-x-1 flex-shrink-0">
                      <svg className="w-3 h-3 text-blue-200 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                      </svg>
                      <span className="text-white text-xs font-medium">
                        {siteSettings.contactInfo.phone}
                      </span>
                    </div>
                  )}
                </div>

                {/* Right side - Social Media Icons */}
                <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                  {/* LinkedIn */}
                  {siteSettings.socialMedia?.linkedin && (
                    <a
                      href={siteSettings.socialMedia.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-blue-200 transition-colors"
                      aria-label="LinkedIn"
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                  )}

                  {/* Facebook */}
                  {siteSettings.socialMedia?.facebook && (
                    <a
                      href={siteSettings.socialMedia.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-blue-200 transition-colors"
                      aria-label="Facebook"
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                  )}

                  {/* X (Twitter) */}
                  {siteSettings.socialMedia?.twitter && (
                    <a
                      href={siteSettings.socialMedia.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-blue-200 transition-colors"
                      aria-label="X (Twitter)"
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </a>
                  )}

                  {/* Instagram */}
                  {siteSettings.socialMedia?.instagram && (
                    <a
                      href={siteSettings.socialMedia.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-blue-200 transition-colors"
                      aria-label="Instagram"
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.618 5.367 11.986 11.988 11.986s11.987-5.368 11.987-11.986C24.014 5.367 18.635.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.596-3.205-1.529l1.703-1.703c.389.389.925.629 1.502.629.577 0 1.113-.24 1.502-.629l1.703 1.703c-.757.933-1.908 1.529-3.205 1.529zm7.119 0c-1.297 0-2.448-.596-3.205-1.529l1.703-1.703c.389.389.925.629 1.502.629.577 0 1.113-.24 1.502-.629l1.703 1.703c-.757.933-1.908 1.529-3.205 1.529z"/>
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:flex justify-between items-center text-sm">
              {/* Left side - Contact Information */}
              <div className="flex items-center space-x-6">
                {siteSettings.contactInfo.email && (
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                    </svg>
                    <span className="text-white">{siteSettings.contactInfo.email}</span>
                  </div>
                )}

                {siteSettings.contactInfo.phone && (
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                    </svg>
                    <span className="text-white">{siteSettings.contactInfo.phone}</span>
                  </div>
                )}
              </div>

              {/* Right side - Social Media */}
              <div className="flex items-center space-x-4">
                {siteSettings.socialMedia?.linkedin && (
                  <a
                    href={siteSettings.socialMedia.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-blue-200 transition-colors"
                    aria-label="LinkedIn"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                )}

                {siteSettings.socialMedia?.facebook && (
                  <a
                    href={siteSettings.socialMedia.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-blue-200 transition-colors"
                    aria-label="Facebook"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                )}

                {siteSettings.socialMedia?.twitter && (
                  <a
                    href={siteSettings.socialMedia.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-blue-200 transition-colors"
                    aria-label="X (Twitter)"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                )}

                {siteSettings.socialMedia?.instagram && (
                  <a
                    href={siteSettings.socialMedia.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-blue-200 transition-colors"
                    aria-label="Instagram"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.618 5.367 11.986 11.988 11.986s11.987-5.368 11.987-11.986C24.014 5.367 18.635.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.596-3.205-1.529l1.703-1.703c.389.389.925.629 1.502.629.577 0 1.113-.24 1.502-.629l1.703 1.703c-.757.933-1.908 1.529-3.205 1.529zm7.119 0c-1.297 0-2.448-.596-3.205-1.529l1.703-1.703c.389.389.925.629 1.502.629.577 0 1.113-.24 1.502-.629l1.703 1.703c-.757.933-1.908 1.529-3.205 1.529z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="w-full mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18 md:h-20 lg:h-22 xl:h-24 overflow-visible w-full py-1 md:py-2 lg:py-2">
          {/* Logo Container with enhanced prominence - moved slightly left on PC */}
          <div className="flex items-center h-full py-1 flex-shrink-0 ml-2 md:ml-4 lg:ml-6">
            <Link href="/" className="flex items-center h-full">
              {siteSettings?.logo && getLogoImageUrl(siteSettings.logo) ? (
                <div className="relative h-full max-h-10 sm:max-h-14 md:max-h-16 lg:max-h-18 xl:max-h-20 flex items-center">
                  <Image
                    src={getLogoImageUrl(siteSettings.logo) || ''}
                    alt={siteSettings.logo.alt || 'Intelli Global Conferences Logo'}
                    width={220}
                    height={70}
                    className="h-auto w-auto max-h-full max-w-full object-contain"
                    priority
                    quality={100}
                    sizes="(max-width: 640px) 140px, (max-width: 768px) 160px, (max-width: 1024px) 200px, 220px"
                    style={{
                      maxHeight: '100%',
                      maxWidth: '220px',
                      height: 'auto',
                      width: 'auto',
                    }}
                    unoptimized={false}
                  />
                </div>
              ) : (
                <div className="flex items-center h-full">
                  {/* Enhanced fallback logo */}
                  <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 xl:w-20 xl:h-20 max-h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xs sm:text-base md:text-lg lg:text-xl xl:text-xl">IG</span>
                  </div>
                </div>
              )}
            </Link>
          </div>

          {/* Pass site settings to client component for mobile menu */}
          <HeaderClient siteSettings={siteSettings} />
        </div>
      </nav>
    </header>
  );
}
