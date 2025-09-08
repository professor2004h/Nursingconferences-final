'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getSiteSettings, getImageUrl, getFullBrandName, type SiteSettings } from '../getSiteSettings';
import { shouldShowPastConferencesInMenu } from '../getPastConferencesRedirect';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPastConferences, setShowPastConferences] = useState(false); // Default to false for immediate hiding

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const settings = await getSiteSettings();
        setSiteSettings(settings);
      } catch (err) {
        console.error('Failed to fetch site settings:', err);
        // Set a minimal fallback state
        setSiteSettings(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // Fetch past conferences visibility setting with periodic refresh
  useEffect(() => {
    const fetchPastConferencesVisibility = async () => {
      try {
        console.log('🔍 Header: Checking Past Conferences visibility...');
        const shouldShow = await shouldShowPastConferencesInMenu();
        console.log('📊 Header: shouldShowPastConferencesInMenu =', shouldShow);
        setShowPastConferences(shouldShow);
        console.log('✅ Header: State updated to', shouldShow);
      } catch (error) {
        console.error('❌ Header: Error fetching past conferences visibility:', error);
        setShowPastConferences(true);
      }
    };

    // Initial fetch
    fetchPastConferencesVisibility();

    // Set up periodic refresh every 10 seconds for faster updates during testing
    const interval = setInterval(fetchPastConferencesVisibility, 10000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  // Check if header section should be visible
  const isHeaderSectionVisible = siteSettings?.headerVisibility?.showHeaderSection !== false;

  // Show loading state while fetching data
  if (isLoading) {
    return (
      <header className="bg-white shadow-md sticky top-0 z-50 header-container">
        <div className="bg-blue-900 text-white py-1.5 px-1">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-center items-center text-sm">
              <span className="text-blue-200">Loading...</span>
            </div>
          </div>
        </div>
        <nav className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-12 sm:h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gray-300 rounded-lg animate-pulse"></div>
              <div className="hidden sm:block">
                <div className="h-6 w-32 bg-gray-300 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    );
  }

  // Helper function to render social media icons conditionally (mobile)
  const renderSocialIcon = (url: string | undefined, title: string, iconPath: string) => {
    if (!url) return null;

    return (
      <a
        href={url}
        className="hover:text-blue-200 transition-colors px-0 py-1"
        target="_blank"
        rel="noopener noreferrer"
        title={title}
      >
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
          <path d={iconPath} />
        </svg>
      </a>
    );
  };

  // Helper function to render desktop social media icons
  const renderDesktopSocialIcon = (url: string | undefined, title: string, iconPath: string) => {
    if (!url) return null;

    return (
      <a
        href={url}
        className="hover:text-blue-200 transition-colors p-1"
        target="_blank"
        rel="noopener noreferrer"
        title={title}
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d={iconPath} />
        </svg>
      </a>
    );
  };

  // Social media icon paths
  const socialIcons = {
    linkedin: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
    facebook: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
    twitter: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
    instagram: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
  };

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
                    <svg className="w-3 h-3 text-blue-200 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a
                      href={`mailto:${siteSettings.contactInfo.email}`}
                      className="hover:text-blue-200 transition-colors text-[13px] leading-tight"
                      title={siteSettings.contactInfo.email}
                    >
                      {siteSettings.contactInfo.email}
                    </a>
                  </div>
                )}

                {/* WhatsApp - Only show if available */}
                {siteSettings.contactInfo.whatsapp && (
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <svg className="w-3 h-3 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a
                      href={`https://wa.me/${siteSettings.contactInfo.whatsapp.replace(/\s+/g, '').replace('+', '')}`}
                      className="hover:text-blue-200 transition-colors whitespace-nowrap text-[13px] leading-tight"
                      title={`WhatsApp: ${siteSettings.contactInfo.whatsapp}`}
                    >
                      {siteSettings.contactInfo.whatsapp}
                    </a>
                  </div>
                )}
              </div>

              {/* Right side - Social Links (only show if any social media URLs are provided) */}
              {(siteSettings?.socialMedia?.linkedin || siteSettings?.socialMedia?.facebook || siteSettings?.socialMedia?.twitter || siteSettings?.socialMedia?.instagram) && (
                <div className="flex items-center flex-shrink-0 social-icons-tight ml-auto">
                  {renderSocialIcon(siteSettings?.socialMedia?.linkedin, 'LinkedIn', socialIcons.linkedin)}
                  {renderSocialIcon(siteSettings?.socialMedia?.facebook, 'Facebook', socialIcons.facebook)}
                  {renderSocialIcon(siteSettings?.socialMedia?.twitter, 'X (Twitter)', socialIcons.twitter)}
                  {renderSocialIcon(siteSettings?.socialMedia?.instagram, 'Instagram', socialIcons.instagram)}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              {/* Email - Only show if available */}
              {siteSettings?.contactInfo?.email && (
                <>
                  <a
                    href={`mailto:${siteSettings.contactInfo.email}`}
                    className="hover:text-blue-200 transition-colors flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{siteSettings.contactInfo.email}</span>
                  </a>
                  {siteSettings?.contactInfo?.whatsapp && <span>|</span>}
                </>
              )}

              {/* WhatsApp - Only show if available */}
              {siteSettings?.contactInfo?.whatsapp && (
                <a
                  href={`https://wa.me/${siteSettings.contactInfo.whatsapp.replace(/\s+/g, '').replace('+', '')}`}
                  className="hover:text-blue-200 transition-colors flex items-center space-x-2"
                >
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>WhatsApp: {siteSettings.contactInfo.whatsapp}</span>
                </a>
              )}
            </div>
            {/* Desktop Social Media - Only show if any social media URLs are provided */}
            {(siteSettings?.socialMedia?.linkedin || siteSettings?.socialMedia?.facebook || siteSettings?.socialMedia?.twitter || siteSettings?.socialMedia?.instagram) && (
              <div className="flex items-center space-x-4 desktop-social">
                <span className="text-blue-200">Follow Us:</span>
                {renderDesktopSocialIcon(siteSettings?.socialMedia?.linkedin, 'LinkedIn', socialIcons.linkedin)}
                {renderDesktopSocialIcon(siteSettings?.socialMedia?.facebook, 'Facebook', socialIcons.facebook)}
                {renderDesktopSocialIcon(siteSettings?.socialMedia?.twitter, 'X (Twitter)', socialIcons.twitter)}
                {renderDesktopSocialIcon(siteSettings?.socialMedia?.instagram, 'Instagram', socialIcons.instagram)}
              </div>
            )}
          </div>
        </div>
      </div>
      )}

      {/* Main Navigation */}
      <nav className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20 md:h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            {siteSettings?.logo && getImageUrl(siteSettings.logo) ? (
              <Image
                src={getImageUrl(siteSettings.logo) || ''}
                alt={siteSettings.logo.alt || `${getFullBrandName(siteSettings)} Logo`}
                width={250}
                height={80}
                className="h-12 sm:h-16 md:h-20 w-auto object-contain"
                priority
              />
            ) : (
              <div className="flex items-center">
                {/* Fallback logo */}
                <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg sm:text-xl md:text-2xl">IG</span>
                </div>
              </div>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
              About Us
            </Link>
            {showPastConferences && (
              <Link href="/past-conferences" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
                Past Conferences
              </Link>
            )}
            <Link href="/structure/organizingCommittee" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
              Organizing Committee
            </Link>
            <Link href="/speakers" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
              Speakers
            </Link>
            <Link href="/brochure" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
              Brochure Download
            </Link>
            <Link href="/sponsorship" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
              Sponsorship
            </Link>
            {siteSettings?.journal?.showJournal && (
              <Link href="/journal" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
                Journal
              </Link>
            )}
            <Link href="/contact" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
              Contact Us
            </Link>
            <Link
              href="/registration"
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:text-gray-200 px-6 py-2 rounded-full font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Register Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-orange-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 rounded-lg mt-2 shadow-lg">
              <Link
                href="/"
                className="block px-3 py-3 text-gray-700 hover:text-orange-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/about"
                className="block px-3 py-3 text-gray-700 hover:text-orange-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              {showPastConferences && (
                <Link
                  href="/past-conferences"
                  className="block px-3 py-3 text-gray-700 hover:text-orange-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Past Conferences
                </Link>
              )}
              <Link
                href="/structure/organizingCommittee"
                className="block px-3 py-3 text-gray-700 hover:text-orange-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Organizing Committee
              </Link>
              <Link
                href="/speakers"
                className="block px-3 py-3 text-gray-700 hover:text-orange-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Speakers
              </Link>
              <Link
                href="/brochure"
                className="block px-3 py-3 text-gray-700 hover:text-orange-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Brochure Download
              </Link>
              <Link
                href="/sponsorship"
                className="block px-3 py-3 text-gray-700 hover:text-orange-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Sponsorship
              </Link>
              {siteSettings?.journal?.showJournal && (
                <Link
                  href="/journal"
                  className="block px-3 py-3 text-gray-700 hover:text-orange-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Journal
                </Link>
              )}
              <Link
                href="/contact"
                className="block px-3 py-3 text-gray-700 hover:text-orange-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact Us
              </Link>
              <Link
                href="/registration"
                className="block mx-3 mt-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:text-gray-200 px-4 py-3 rounded-full font-medium text-center hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Register Now
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
