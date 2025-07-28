'use client';

import React, { useState, memo } from 'react';
import Link from 'next/link';
import { type SiteSettings } from '../getSiteSettings';

interface HeaderClientProps {
  siteSettings: SiteSettings | null;
}

// Memoized component to prevent unnecessary re-renders
const HeaderClient = memo(function HeaderClient({ siteSettings }: HeaderClientProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Debug logging
  console.log('HeaderClient rendering:', { siteSettings: !!siteSettings, isMenuOpen });

  // Simple toggle functions without useCallback to avoid React hook issues
  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation - Optimized for better spacing and responsiveness */}
      <div className="hidden md:flex items-center overflow-visible flex-1 justify-center min-w-0 relative z-10">
        {/* Main navigation links with responsive spacing */}
        <div className="flex items-center space-x-3 md:space-x-4 lg:space-x-5 xl:space-x-6 overflow-visible flex-wrap">
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
            href="/past-conferences"
            className="text-gray-700 hover:text-orange-600 font-medium transition-colors text-sm md:text-base whitespace-nowrap"
          >
            Past Conferences
          </Link>
          <Link
            href="/organizing-committee"
            className="text-gray-700 hover:text-orange-600 font-medium transition-colors text-sm md:text-base whitespace-nowrap"
          >
            Committee
          </Link>
          <Link
            href="/speakers"
            className="text-gray-700 hover:text-orange-600 font-medium transition-colors text-sm md:text-base whitespace-nowrap"
          >
            Speakers
          </Link>
          <Link
            href="/poster-presenters"
            className="text-gray-700 hover:text-orange-600 font-medium transition-colors text-sm md:text-base whitespace-nowrap"
          >
            Poster Presenters
          </Link>
          <Link
            href="/past-conference-gallery"
            className="text-gray-700 hover:text-orange-600 font-medium transition-colors text-sm md:text-base whitespace-nowrap"
          >
            Gallery
          </Link>
          <Link
            href="/media-partners"
            className="text-gray-700 hover:text-orange-600 font-medium transition-colors text-sm md:text-base whitespace-nowrap"
          >
            Partners
          </Link>
          <Link
            href="/brochure"
            className="text-gray-700 hover:text-orange-600 font-medium transition-colors text-sm md:text-base whitespace-nowrap"
          >
            Brochure Download
          </Link>
          <Link
            href="/sponsorship"
            className="text-gray-700 hover:text-orange-600 font-medium transition-colors text-sm md:text-base whitespace-nowrap"
          >
            Sponsorship
          </Link>
          {siteSettings?.journal?.showJournal && (
            <Link
              href={siteSettings.journal.journalUrl || "/journal"}
              target={siteSettings.journal.openInNewTab ? "_blank" : "_self"}
              rel={siteSettings.journal.openInNewTab ? "noopener noreferrer" : undefined}
              className="text-gray-700 hover:text-orange-600 font-medium transition-colors text-sm md:text-base whitespace-nowrap"
            >
              Journal
            </Link>
          )}
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
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 rounded-lg mt-2 mx-2 shadow-lg">
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
              href="/past-conferences"
              className="block px-3 py-3 text-gray-700 hover:text-orange-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              onClick={closeMenu}
            >
              Past Conferences
            </Link>
            <Link
              href="/organizing-committee"
              className="block px-3 py-3 text-gray-700 hover:text-orange-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              onClick={closeMenu}
            >
              Committee
            </Link>
            <Link
              href="/speakers"
              className="block px-3 py-3 text-gray-700 hover:text-orange-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              onClick={closeMenu}
            >
              Speakers
            </Link>
            <Link
              href="/poster-presenters"
              className="block px-3 py-3 text-gray-700 hover:text-orange-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              onClick={closeMenu}
            >
              Poster Presenters
            </Link>
            <Link
              href="/past-conference-gallery"
              className="block px-3 py-3 text-gray-700 hover:text-orange-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              onClick={closeMenu}
            >
              Conference Gallery
            </Link>
            <Link
              href="/media-partners"
              className="block px-3 py-3 text-gray-700 hover:text-orange-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              onClick={closeMenu}
            >
              Media Partners
            </Link>
            <Link
              href="/brochure"
              className="block px-3 py-3 text-gray-700 hover:text-orange-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              onClick={closeMenu}
            >
              Brochure Download
            </Link>
            <Link
              href="/sponsorship"
              className="block px-3 py-3 text-gray-700 hover:text-orange-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              onClick={closeMenu}
            >
              Sponsorship
            </Link>
            {siteSettings?.journal?.showJournal && (
              <Link
                href={siteSettings.journal.journalUrl || "/journal"}
                target={siteSettings.journal.openInNewTab ? "_blank" : "_self"}
                rel={siteSettings.journal.openInNewTab ? "noopener noreferrer" : undefined}
                className="block px-3 py-3 text-gray-700 hover:text-orange-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                onClick={closeMenu}
              >
                Journal
              </Link>
            )}
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
    </>
  );
});

export default HeaderClient;
