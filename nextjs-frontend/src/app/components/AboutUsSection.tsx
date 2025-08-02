'use client';

import { useState, useEffect } from 'react';

interface AboutUsData {
  _id: string;
  title: string;
  content: string;
  // New fields
  primaryBrandName?: string;
  secondaryBrandText?: string;
  brandTagline?: string;
  // Legacy fields for backward compatibility
  organizationName?: string;
  organizationBrandName?: string;
  isActive: boolean;
  _createdAt: string;
  _updatedAt: string;
}

interface AboutUsResponse {
  success: boolean;
  data: AboutUsData | null;
  error?: string;
}

export default function AboutUsSection() {
  const [aboutUsData, setAboutUsData] = useState<AboutUsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAboutUsData = async () => {
      try {
        setLoading(true);
        // Add cache busting parameter
        const response = await fetch(`/api/about-us?t=${Date.now()}`);
        const result: AboutUsResponse = await response.json();

        if (result.success && result.data) {
          setAboutUsData(result.data);
        } else {
          setError(result.error || 'Failed to load About Us data');
        }
      } catch (err) {
        console.error('Error fetching About Us data:', err);
        setError('Failed to load About Us data');
      } finally {
        setLoading(false);
      }
    };

    fetchAboutUsData();
  }, []);

  // Don't render if loading, error, or no data
  if (loading || error || !aboutUsData || !aboutUsData.isActive) {
    return null;
  }

  return (
    <section className="py-12 sm:py-14 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start">
          {/* Left Column - About Us Content */}
          <div className="text-slate-900 order-1 lg:order-1">
            <div className="mb-6 sm:mb-8">
              <span className="text-orange-500 font-semibold text-base sm:text-lg tracking-wide uppercase mb-3 sm:mb-4 block">
                About
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight text-slate-900">
                {aboutUsData.title}
                <span className="block bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                  {(() => {
                    // Use new fields if available, otherwise parse legacy fields, otherwise use defaults
                    const primaryBrand = aboutUsData.primaryBrandName ||
                      (aboutUsData.organizationBrandName ?
                        aboutUsData.organizationBrandName.split(' ').slice(0, -1).join(' ') || 'Nursing' :
                        'Nursing');
                    const secondaryBrand = aboutUsData.secondaryBrandText ||
                      (aboutUsData.organizationBrandName ?
                        aboutUsData.organizationBrandName.split(' ').slice(-1)[0] || 'Conference 2026' :
                        'Conference 2026');
                    return `${primaryBrand} ${secondaryBrand}`;
                  })()}
                </span>
              </h2>
              {aboutUsData.brandTagline && (
                <p className="text-lg sm:text-xl text-orange-600 font-semibold mb-4 italic">
                  {aboutUsData.brandTagline}
                </p>
              )}
              <div className="text-lg sm:text-xl text-slate-600 leading-relaxed">
                {aboutUsData.content.split('\n').map((paragraph, index) => (
                  <p key={index} className={index > 0 ? 'mt-4' : ''}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Visual Element */}
          <div className="order-2 lg:order-2">
            <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Our Mission</h3>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Advancing research and fostering collaboration among medical professionals, researchers, engineers, and scientists through international conferences and events.
              </p>
              
              <div className="mt-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-slate-700">Global Network Building</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-slate-700">Scientific Exchange</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-slate-700">Research Advancement</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-slate-700">Professional Development</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
