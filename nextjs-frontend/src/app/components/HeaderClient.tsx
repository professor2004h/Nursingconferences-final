'use client';

import React, { useState, memo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { type SiteSettings } from '../getSiteSettings';

interface HeaderClientProps {
  siteSettings: SiteSettings | null;
}

// Memoized component to prevent unnecessary re-renders
const HeaderClient = memo(function HeaderClient({ siteSettings }: HeaderClientProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  const [isMobileMoreExpanded, setIsMobileMoreExpanded] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownContentRef = useRef<HTMLDivElement>(null);

  // Debug logging (development only)
  if (process.env.NODE_ENV === 'development') {
    console.log('HeaderClient rendering:', { siteSettings: !!siteSettings, isMenuOpen });
  }

  // Simple toggle functions without useCallback to avoid React hook issues
  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsMobileMoreExpanded(false); // Reset mobile more section when closing menu
  };

  const toggleMobileMore = () => {
    setIsMobileMoreExpanded(prev => !prev);
  };

  const toggleMoreDropdown = () => {
    if (!isMoreDropdownOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      // Calculate position with better viewport handling
      const viewportHeight = window.innerHeight;
      const dropdownHeight = 300; // Estimated dropdown height

      let top = rect.bottom + 8;
      let left = rect.left;

      // Adjust if dropdown would go off-screen vertically
      if (top + dropdownHeight > viewportHeight) {
        top = rect.top - dropdownHeight - 8;
      }

      // Adjust if dropdown would go off-screen horizontally
      const dropdownWidth = 224; // w-56 = 14rem = 224px
      if (left + dropdownWidth > window.innerWidth) {
        left = window.innerWidth - dropdownWidth - 16;
      }

      setDropdownPosition({
        top: top,
        left: left
      });
    }
    setIsMoreDropdownOpen(prev => !prev);
  };

  const closeMoreDropdown = () => {
    setIsMoreDropdownOpen(false);
  };

  const handleDropdownLinkClick = (e: React.MouseEvent) => {
    console.log('Dropdown link clicked:', e.currentTarget);
    // Allow the link navigation to proceed
    // Close dropdown after a small delay to ensure navigation happens
    setTimeout(() => {
      setIsMoreDropdownOpen(false);
    }, 100);
  };

  // Render dropdown content
  const renderDropdownContent = () => (
    <div
      ref={dropdownContentRef}
      className="w-56 bg-white rounded-lg shadow-2xl border border-gray-200 py-2 dropdown-menu-overlay"
      style={{
        position: 'fixed',
        top: dropdownPosition.top,
        left: dropdownPosition.left,
        zIndex: 2147483647, // Maximum safe z-index value
        isolation: 'isolate',
        transform: 'translateZ(0)',
        willChange: 'transform',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        pointerEvents: 'auto'
      }}
    >
      <Link
        href="/conferences"
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
        onClick={handleDropdownLinkClick}
      >
        Conferences
      </Link>
      <Link
        href="/speakers"
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
        onClick={handleDropdownLinkClick}
      >
        Speakers
      </Link>
      <Link
        href="/sponsorship"
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
        onClick={handleDropdownLinkClick}
      >
        Sponsorship
      </Link>
      <Link
        href="/past-conferences"
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
        onClick={handleDropdownLinkClick}
      >
        Past Conferences
      </Link>
      <Link
        href="/media-partners"
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
        onClick={handleDropdownLinkClick}
      >
        Media Partners
      </Link>
      <Link
        href="/exhibitors"
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
        onClick={handleDropdownLinkClick}
      >
        Exhibitors
      </Link>
      <Link
        href="/speaker-guidelines"
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
        onClick={handleDropdownLinkClick}
      >
        Speaker Guidelines
      </Link>
      <Link
        href="/poster-presenters"
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
        onClick={handleDropdownLinkClick}
      >
        Poster Presenters
      </Link>
      <Link
        href="/past-conference-gallery"
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
        onClick={handleDropdownLinkClick}
      >
        Gallery
      </Link>
      {siteSettings?.journal?.showJournal && (
        <Link
          href={siteSettings.journal.journalUrl || "/journal"}
          target={siteSettings.journal.openInNewTab ? "_blank" : "_self"}
          rel={siteSettings.journal.openInNewTab ? "noopener noreferrer" : undefined}
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
          onClick={handleDropdownLinkClick}
        >
          Journal
        </Link>
      )}
    </div>
  );

  // Close dropdown when clicking outside and handle scroll repositioning
  useEffect(() => {
    if (!isMoreDropdownOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isOutsideDropdownTrigger = dropdownRef.current && !dropdownRef.current.contains(target);
      const isOutsideDropdownContent = dropdownContentRef.current && !dropdownContentRef.current.contains(target);

      if (isOutsideDropdownTrigger && isOutsideDropdownContent) {
        setIsMoreDropdownOpen(false);
      }
    };

    // Update dropdown position on scroll
    const handleScroll = () => {
      if (dropdownRef.current) {
        const rect = dropdownRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const dropdownHeight = 300;

        let top = rect.bottom + 8;
        let left = rect.left;

        // Adjust if dropdown would go off-screen vertically
        if (top + dropdownHeight > viewportHeight) {
          top = rect.top - dropdownHeight - 8;
        }

        // Adjust if dropdown would go off-screen horizontally
        const dropdownWidth = 224;
        if (left + dropdownWidth > window.innerWidth) {
          left = window.innerWidth - dropdownWidth - 16;
        }

        setDropdownPosition({
          top: top,
          left: left
        });
      }
    };

    // Add a small delay to ensure portal is rendered
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('resize', handleScroll, { passive: true });
    }, 10);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isMoreDropdownOpen]);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMoreDropdownOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  return (
    <>
      {/* Desktop Navigation - Reorganized with More dropdown */}
      <div className="hidden md:flex items-center overflow-visible flex-1 justify-center min-w-0 relative z-[9998]">
        {/* Main navigation links - Keep visible */}
        <div className="flex items-center space-x-3 md:space-x-4 lg:space-x-5 xl:space-x-6 overflow-visible">
          <Link
            href="/"
            className="text-gray-700 hover:text-orange-600 font-medium transition-colors text-sm md:text-base whitespace-nowrap"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-gray-700 hover:text-orange-600 font-medium transition-colors text-sm md:text-base whitespace-nowrap"
          >
            About Us
          </Link>
          <Link
            href="/brochure"
            className="text-gray-700 hover:text-orange-600 font-medium transition-colors text-sm md:text-base whitespace-nowrap"
          >
            Brochure
          </Link>
          <Link
            href="/venue"
            className="text-gray-700 hover:text-orange-600 font-medium transition-colors text-sm md:text-base whitespace-nowrap"
          >
            Venue
          </Link>
          <Link
            href="/submit-abstract"
            className="text-gray-700 hover:text-orange-600 font-medium transition-colors text-sm md:text-base whitespace-nowrap"
          >
            Submit Abstract
          </Link>

          {/* More Dropdown */}
          <div
            className="relative dropdown-container-isolation"
            style={{ zIndex: 9999 }}
            ref={dropdownRef}
          >
            <button
              onClick={toggleMoreDropdown}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleMoreDropdown();
                }
              }}
              className="text-gray-700 hover:text-orange-600 font-medium transition-colors text-sm md:text-base whitespace-nowrap flex items-center space-x-1 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-md px-2 py-1"
              aria-expanded={isMoreDropdownOpen}
              aria-haspopup="true"
            >
              <span>More</span>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${isMoreDropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>


          </div>

          {/* Registration Button */}
          <Link
            href="/registration"
            className="bg-green-600 text-white hover:text-gray-200 px-3 lg:px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm md:text-base whitespace-nowrap"
          >
            Register Now
          </Link>
        </div>

        {/* Contact button with responsive spacing */}
        <div className="ml-3 lg:ml-4 xl:ml-6">
          <Link
            href="/contact"
            className="bg-orange-600 text-white hover:text-gray-200 px-4 lg:px-5 py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium text-sm md:text-base whitespace-nowrap"
          >
            Contact Us
          </Link>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden">
        <button
          onClick={toggleMenu}
          className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600 transition-colors"
          aria-label="Toggle menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t z-40">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 rounded-lg mt-2 mx-2 shadow-lg max-h-96 overflow-y-auto">
            {/* Main Navigation Links */}
            <Link
              href="/"
              className="block px-3 py-3 text-gray-700 hover:text-orange-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="block px-3 py-3 text-gray-700 hover:text-orange-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              onClick={closeMenu}
            >
              About Us
            </Link>
            <Link
              href="/brochure"
              className="block px-3 py-3 text-gray-700 hover:text-orange-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              onClick={closeMenu}
            >
              Brochure
            </Link>
            <Link
              href="/venue"
              className="block px-3 py-3 text-gray-700 hover:text-orange-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              onClick={closeMenu}
            >
              Venue
            </Link>
            <Link
              href="/submit-abstract"
              className="block px-3 py-3 text-gray-700 hover:text-orange-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              onClick={closeMenu}
            >
              Submit Abstract
            </Link>

            {/* Divider */}
            <div className="border-t border-gray-300 my-2"></div>

            {/* Expandable More Button */}
            <button
              onClick={toggleMobileMore}
              className="w-full flex items-center justify-between px-3 py-3 text-gray-700 hover:text-orange-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                  />
                </svg>
                More Options
              </span>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${
                  isMobileMoreExpanded ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Expandable More Section Links */}
            {isMobileMoreExpanded && (
              <div className="ml-4 space-y-1 border-l-2 border-gray-200 pl-3">
                <Link
                  href="/conferences"
                  className="block px-3 py-2 text-sm text-gray-600 hover:text-orange-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={closeMenu}
                >
                  Conferences
                </Link>
                <Link
                  href="/speakers"
                  className="block px-3 py-2 text-sm text-gray-600 hover:text-orange-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={closeMenu}
                >
                  Speakers
                </Link>
                <Link
                  href="/sponsorship"
                  className="block px-3 py-2 text-sm text-gray-600 hover:text-orange-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={closeMenu}
                >
                  Sponsorship
                </Link>
                <Link
                  href="/past-conferences"
                  className="block px-3 py-2 text-sm text-gray-600 hover:text-orange-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={closeMenu}
                >
                  Past Conferences
                </Link>
                <Link
                  href="/media-partners"
                  className="block px-3 py-2 text-sm text-gray-600 hover:text-orange-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={closeMenu}
                >
                  Media Partners
                </Link>
                <Link
                  href="/exhibitors"
                  className="block px-3 py-2 text-sm text-gray-600 hover:text-orange-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={closeMenu}
                >
                  Exhibitors
                </Link>
                <Link
                  href="/speaker-guidelines"
                  className="block px-3 py-2 text-sm text-gray-600 hover:text-orange-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={closeMenu}
                >
                  Speaker Guidelines
                </Link>
                <Link
                  href="/poster-presenters"
                  className="block px-3 py-2 text-sm text-gray-600 hover:text-orange-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={closeMenu}
                >
                  Poster Presenters
                </Link>
                <Link
                  href="/past-conference-gallery"
                  className="block px-3 py-2 text-sm text-gray-600 hover:text-orange-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={closeMenu}
                >
                  Gallery
                </Link>
                {siteSettings?.journal?.showJournal && (
                  <Link
                    href={siteSettings.journal.journalUrl || "/journal"}
                    target={siteSettings.journal.openInNewTab ? "_blank" : "_self"}
                    rel={siteSettings.journal.openInNewTab ? "noopener noreferrer" : undefined}
                    className="block px-3 py-2 text-sm text-gray-600 hover:text-orange-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={closeMenu}
                  >
                    Journal
                  </Link>
                )}
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-gray-300 my-2"></div>

            {/* Action Buttons */}
            <Link
              href="/contact"
              className="block px-3 py-3 text-gray-700 hover:text-orange-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              onClick={closeMenu}
            >
              Contact Us
            </Link>
            <Link
              href="/registration"
              className="block mx-3 mt-4 bg-green-600 text-white hover:text-gray-200 px-4 py-3 rounded-lg font-medium text-center hover:bg-green-700 transition-all duration-300 shadow-lg"
              onClick={closeMenu}
            >
              Register Now
            </Link>
          </div>
        </div>
      )}

      {/* Portal-based Dropdown Menu for Desktop */}
      {isMoreDropdownOpen && typeof window !== 'undefined' &&
        createPortal(renderDropdownContent(), document.body)
      }
    </>
  );
});

export default HeaderClient;
