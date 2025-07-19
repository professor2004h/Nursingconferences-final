'use client';

import { useState } from 'react';
import Link from 'next/link';
import { type SiteSettings } from '../getSiteSettings';

interface HeaderClientProps {
  siteSettings: SiteSettings | null;
}

export default function HeaderClient({ siteSettings }: HeaderClientProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-8">
        <Link
          href="/"
          className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
        >
          Home
        </Link>
        <Link
          href="/about"
          className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
        >
          About Us
        </Link>
        <Link
          href="/conferences"
          className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
        >
          All Conferences
        </Link>
        <Link
          href="/past-conferences"
          className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
        >
          Past Conferences
        </Link>
        <Link
          href="/brochure"
          className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
        >
          Download Brochure
        </Link>
        <Link
          href="/sponsorship"
          className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
        >
          Sponsorship
        </Link>
        {siteSettings?.journal?.showJournal && (
          <Link
            href={siteSettings.journal.journalUrl || "/journal"}
            target={siteSettings.journal.openInNewTab ? "_blank" : "_self"}
            rel={siteSettings.journal.openInNewTab ? "noopener noreferrer" : undefined}
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
          >
            Journal
          </Link>
        )}
        <Link
          href="/contact"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Contact Us
        </Link>
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
              className="block px-3 py-3 text-gray-700 hover:text-blue-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="block px-3 py-3 text-gray-700 hover:text-blue-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              href="/conferences"
              className="block px-3 py-3 text-gray-700 hover:text-blue-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              All Conferences
            </Link>
            <Link
              href="/past-conferences"
              className="block px-3 py-3 text-gray-700 hover:text-blue-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Past Conferences
            </Link>
            <Link
              href="/brochure"
              className="block px-3 py-3 text-gray-700 hover:text-blue-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Download Brochure
            </Link>
            <Link
              href="/sponsorship"
              className="block px-3 py-3 text-gray-700 hover:text-blue-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Sponsorship
            </Link>
            {siteSettings?.journal?.showJournal && (
              <Link
                href={siteSettings.journal.journalUrl || "/journal"}
                target={siteSettings.journal.openInNewTab ? "_blank" : "_self"}
                rel={siteSettings.journal.openInNewTab ? "noopener noreferrer" : undefined}
                className="block px-3 py-3 text-gray-700 hover:text-blue-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Journal
              </Link>
            )}
            <Link
              href="/contact"
              className="block px-3 py-3 text-gray-700 hover:text-blue-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
