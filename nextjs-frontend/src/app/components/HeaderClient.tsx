'use client';

import React, { useState, memo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { type SiteSettings } from '../getSiteSettings';

interface HeaderClientProps {
  siteSettings: SiteSettings | null;
}

// Memoized component to prevent unnecessary re-renders
const HeaderClient = memo(function HeaderClient({ siteSettings }: HeaderClientProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debug logging
  console.log('HeaderClient rendering:', { siteSettings: !!siteSettings, isMenuOpen });

  // Simple toggle functions without useCallback to avoid React hook issues
  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleMoreDropdown = () => {
    setIsMoreDropdownOpen(prev => !prev);
  };

  const closeMoreDropdown = () => {
    setIsMoreDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMoreDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
      <div className="hidden md:flex items-center overflow-visible flex-1 justify-center min-w-0 relative z-10">
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
            href="/organizing-committee"
            className="text-gray-700 hover:text-orange-600 font-medium transition-colors text-sm md:text-base whitespace-nowrap"
          >
            Committee
          </Link>

          {/* More Dropdown */}
          <div className="relative" ref={dropdownRef}>
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

            {/* Dropdown Menu */}
            {isMoreDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <Link
                  href="/conferences"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                  onClick={closeMoreDropdown}
                >
                  Conferences
                </Link>
                <Link
                  href="/speakers"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                  onClick={closeMoreDropdown}
                >
                  Speakers
                </Link>
                <Link
                  href="/venue"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                  onClick={closeMoreDropdown}
                >
                  Venue
                </Link>
                <Link
                  href="/sponsorship"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                  onClick={closeMoreDropdown}
                >
                  Sponsorship
                </Link>
                <Link
                  href="/past-conferences"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                  onClick={closeMoreDropdown}
                >
                  Past Conferences
                </Link>
                <Link
                  href="/media-partners"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                  onClick={closeMoreDropdown}
                >
                  Media Partners
                </Link>
                <Link
                  href="/submit-abstract"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                  onClick={closeMoreDropdown}
                >
                  Submit Abstract
                </Link>
                <Link
                  href="/speaker-guidelines"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                  onClick={closeMoreDropdown}
                >
                  Speaker Guidelines
                </Link>
                <Link
                  href="/poster-presenters"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                  onClick={closeMoreDropdown}
                >
                  Poster Presenters
                </Link>
                <Link
                  href="/past-conference-gallery"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                  onClick={closeMoreDropdown}
                >
                  Gallery
                </Link>
                {siteSettings?.journal?.showJournal && (
                  <Link
                    href={siteSettings.journal.journalUrl || "/journal"}
                    target={siteSettings.journal.openInNewTab ? "_blank" : "_self"}
                    rel={siteSettings.journal.openInNewTab ? "noopener noreferrer" : undefined}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    onClick={closeMoreDropdown}
                  >
                    Journal
                  </Link>
                )}
              </div>
            )}
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
              href="/organizing-committee"
              className="block px-3 py-3 text-gray-700 hover:text-orange-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              onClick={closeMenu}
            >
              Committee
            </Link>

            {/* Divider */}
            <div className="border-t border-gray-300 my-2"></div>
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              More
            </div>

            {/* More Section Links */}
            <Link
              href="/conferences"
              className="block px-3 py-3 text-gray-700 hover:text-orange-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              onClick={closeMenu}
            >
              Conferences
            </Link>
            <Link
              href="/speakers"
              className="block px-3 py-3 text-gray-700 hover:text-orange-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              onClick={closeMenu}
            >
              Speakers
            </Link>
            <Link
              href="/venue"
              className="block px-3 py-3 text-gray-700 hover:text-orange-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              onClick={closeMenu}
            >
              Venue
            </Link>
            <Link
              href="/sponsorship"
              className="block px-3 py-3 text-gray-700 hover:text-orange-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              onClick={closeMenu}
            >
              Sponsorship
            </Link>
            <Link
              href="/past-conferences"
              className="block px-3 py-3 text-gray-700 hover:text-orange-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              onClick={closeMenu}
            >
              Past Conferences
            </Link>
            <Link
              href="/media-partners"
              className="block px-3 py-3 text-gray-700 hover:text-orange-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              onClick={closeMenu}
            >
              Media Partners
            </Link>
            <Link
              href="/submit-abstract"
              className="block px-3 py-3 text-gray-700 hover:text-orange-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              onClick={closeMenu}
            >
              Submit Abstract
            </Link>
            <Link
              href="/speaker-guidelines"
              className="block px-3 py-3 text-gray-700 hover:text-orange-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              onClick={closeMenu}
            >
              Speaker Guidelines
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
              Gallery
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
    </>
  );
});

export default HeaderClient;
