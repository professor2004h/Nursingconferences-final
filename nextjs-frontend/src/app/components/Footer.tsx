import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getSiteSettings, getImageUrl, getFullBrandName } from '../getSiteSettings';

export default async function Footer() {
  let siteSettings = null;

  try {
    siteSettings = await getSiteSettings();
  } catch (error) {
    console.error('Error fetching site settings for footer:', error);
  }
  // Get footer background image
  const footerBgImage = siteSettings?.footerContent?.footerBackgroundImage;
  const backgroundImageUrl = footerBgImage ? getImageUrl(footerBgImage) : null;

  // Get footer logo
  const footerLogo = siteSettings?.footerContent?.footerLogo;
  const footerLogoUrl = footerLogo ? getImageUrl(footerLogo) : null;

  // Get register button config from footerContent
  const registerButton = siteSettings?.footerContent?.registerButton;

  // Debug logging for Register Button
  console.log('🔍 Register Button Debug:', {
    registerButton,
    url: registerButton?.url,
    text: registerButton?.text,
    openInNewTab: registerButton?.openInNewTab
  });

  return (
    <footer
      className="relative text-white"
      style={{
        backgroundImage: backgroundImageUrl
          ? `url(${backgroundImageUrl})`
          : 'linear-gradient(135deg, #1f2937 0%, #111827 50%, #0f172a 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-80"></div>

      {/* Content wrapper */}
      <div className="relative z-10">


      {/* Newsletter Section - ULTRA COMPACT */}
      <div className="bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Subscribe to Our Newsletter</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Stay updated with the latest conferences, research opportunities, and academic events.
            </p>
            <div className="max-w-md mx-auto flex">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-l-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 border border-gray-300"
              />
              <button className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-r-lg font-medium transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content - ULTRA COMPACT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info with Logo */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              {/* Footer Logo */}
              <div className="mb-6">
                {footerLogoUrl ? (
                  <Image
                    src={footerLogoUrl}
                    alt={footerLogo?.alt || 'Footer Logo'}
                    width={200}
                    height={60}
                    className="h-12 sm:h-16 w-auto object-contain"
                    priority
                  />
                ) : siteSettings?.logo && getImageUrl(siteSettings.logo) ? (
                  <Image
                    src={getImageUrl(siteSettings.logo) || ''}
                    alt={siteSettings.logo.alt || 'Logo'}
                    width={200}
                    height={60}
                    className="h-12 sm:h-16 w-auto object-contain"
                    priority
                  />
                ) : (
                  <div className="flex items-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-lg sm:text-xl">IGC</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold">Nursing Conference 2026</h2>
                  </div>
                )}
              </div>

              {/* Register Now Button - Below logo on all devices */}
              {registerButton?.url && (
                <div className="mb-6">
                  <a
                    href={registerButton.url}
                    target={registerButton.openInNewTab ? '_blank' : '_self'}
                    rel={registerButton.openInNewTab ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
                  >
                    {registerButton.text || 'Register Now'}
                    {registerButton.openInNewTab && (
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    )}
                  </a>
                </div>
              )}
              <p className="text-gray-300 mb-6 max-w-md">
                We at Nursing Conference 2026 built an ecosystem that brings the Scholars, people in the Scientific Study & Research,
                knowledge group of the society, the students, learners and more on a common ground – to share their knowledge,
                on the scientific progress that brings along the benefits to humanity and to our existence itself.
              </p>
            </div>

            {/* Dynamic Social Media Links */}
            <div className="flex space-x-4">
              {/* LinkedIn */}
              {(siteSettings?.footerContent?.footerSocialMedia?.linkedin || siteSettings?.socialMedia?.linkedin) && (
                <a
                  href={siteSettings?.footerContent?.footerSocialMedia?.linkedin || siteSettings?.socialMedia?.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              )}

              {/* Twitter/X */}
              {(siteSettings?.footerContent?.footerSocialMedia?.twitter || siteSettings?.socialMedia?.twitter) && (
                <a
                  href={siteSettings?.footerContent?.footerSocialMedia?.twitter || siteSettings?.socialMedia?.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="X (Twitter)"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              )}

              {/* Instagram */}
              {(siteSettings?.footerContent?.footerSocialMedia?.instagram || siteSettings?.socialMedia?.instagram) && (
                <a
                  href={siteSettings?.footerContent?.footerSocialMedia?.instagram || siteSettings?.socialMedia?.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              )}

              {/* Facebook */}
              {(siteSettings?.footerContent?.footerSocialMedia?.facebook || siteSettings?.socialMedia?.facebook) && (
                <a
                  href={siteSettings?.footerContent?.footerSocialMedia?.facebook || siteSettings?.socialMedia?.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              )}
            </div>

          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-white font-medium hover:text-orange-400 transition-colors">About Us</Link></li>
              <li><Link href="/conferences" className="text-white font-medium hover:text-orange-400 transition-colors">All Conferences</Link></li>
              <li><Link href="/past-conferences" className="text-white font-medium hover:text-orange-400 transition-colors">Past Conferences</Link></li>
              <li><Link href="/sponsorship" className="text-white font-medium hover:text-orange-400 transition-colors">Sponsorship</Link></li>
              <li><Link href="/cancellation-policy" className="text-white font-medium hover:text-orange-400 transition-colors">Cancellation Policy</Link></li>
              <li><Link href="/contact" className="text-white font-medium hover:text-orange-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact Info - Mobile Optimized */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Contact Info</h3>
            <div className="space-y-4">
              {/* Email - Fixed line break issue */}
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <div className="flex-1 overflow-hidden">
                  <a
                    href={`mailto:${siteSettings?.contactInfo?.email || "intelliglobalconferences@gmail.com"}`}
                    className="text-white font-medium hover:text-orange-400 transition-colors text-sm whitespace-nowrap block overflow-hidden text-ellipsis"
                  >
                    {siteSettings?.contactInfo?.email || "intelliglobalconferences@gmail.com"}
                  </a>
                </div>
              </div>

              {/* Phone - Mobile Aligned */}
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <a
                    href={`tel:${siteSettings?.contactInfo?.phone || "+919876543421"}`}
                    className="text-white font-medium hover:text-orange-400 transition-colors text-sm"
                  >
                    Phone: {siteSettings?.contactInfo?.phone || "+919876543421"}
                  </a>
                </div>
              </div>

              {/* WhatsApp - Mobile Aligned */}
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <a
                    href={`https://wa.me/${(siteSettings?.contactInfo?.whatsapp || "919876543421").replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white font-medium hover:text-orange-400 transition-colors text-sm"
                  >
                    WhatsApp: {siteSettings?.contactInfo?.whatsapp || "+919876543421"}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - ULTRA COMPACT */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              ©2025 Copyright {getFullBrandName(siteSettings)}. All Rights Reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms & Conditions
              </Link>
              <Link href="/faqs" className="text-gray-400 hover:text-white text-sm transition-colors">
                FAQs
              </Link>
            </div>
          </div>
        </div>
      </div>
      </div> {/* Close content wrapper */}
    </footer>
  );
}
