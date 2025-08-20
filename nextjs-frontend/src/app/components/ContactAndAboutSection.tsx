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
  // Button fields from Sanity
  showButton?: boolean;
  buttonText?: string;
  buttonUrl?: string;
  isActive: boolean;
  _createdAt: string;
  _updatedAt: string;
}

interface AboutUsResponse {
  success: boolean;
  data: AboutUsData | null;
  error?: string;
}

interface SiteSettings {
  contactInfo?: {
    email?: string;
    phone?: string;
    whatsapp?: string;
    address?: string;
  };
}

export default function ContactAndAboutSection() {
  const [aboutUsData, setAboutUsData] = useState<AboutUsData | null>(null);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch About Us data with cache busting
        const aboutResponse = await fetch(`/api/about-us?t=${Date.now()}`);
        const aboutResult: AboutUsResponse = await aboutResponse.json();

        // Fetch site settings for contact info (force fresh data to reflect latest Studio changes)
        const settingsResponse = await fetch(`/api/site-settings?t=${Date.now()}`, {
          method: 'GET',
          cache: 'no-store',
          headers: {
            'x-no-cache': '1'
          }
        });
        const settingsResult = await settingsResponse.json();

        if (aboutResult.success && aboutResult.data) {
          setAboutUsData(aboutResult.data);
        } else {
          setError(aboutResult.error || 'Failed to load About Us data');
        }

        if (settingsResult.success && settingsResult.data) {
          setSiteSettings(settingsResult.data);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Don't render if loading, error, or no data
  if (loading || error || !aboutUsData || !aboutUsData.isActive) {
    return null;
  }

  return (
    <section className="py-12 sm:py-14 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-stretch">
          {/* Left Column - Contact Information */}
          <div className="bg-white border border-slate-200 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg flex flex-col space-y-8 order-1 lg:order-1">
            <div>
              <span className="text-orange-500 font-semibold text-base sm:text-lg tracking-wide uppercase mb-3 sm:mb-4 block">
                CONTACT US
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight text-slate-900">
                Get In
                <span className="block bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                  Touch
                </span>
              </h2>
              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed">
                To know more about our conferences and events, get in touch with us and join our large network of scientists, professional experts, and research scholars.
              </p>
            </div>

            <div className="flex-grow space-y-6">
              {/* Address */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-slate-900 mb-1">Address</h4>
                  <p className="text-slate-600">
                    {siteSettings?.contactInfo?.address || "25 5thAve,New York, NY 10003"}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0" aria-hidden="true">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-lg text-slate-900 mb-1">Email</h4>
                  <a
                    href={`mailto:${siteSettings?.contactInfo?.email || "contactus@intelliglobalconferences.com"}`}
                    className="text-orange-600 hover:text-orange-700 transition-colors break-all text-sm sm:text-base"
                  >
                    {siteSettings?.contactInfo?.email || "contactus@intelliglobalconferences.com"}
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0" aria-hidden="true">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-lg text-slate-900 mb-1">Phone</h4>
                  <a
                    href={`tel:${(siteSettings?.contactInfo?.phone || "+14709166880").toString().replace(/[^0-9+]/g, '')}`}
                    className="text-orange-600 hover:text-orange-700 transition-colors break-all text-sm sm:text-base"
                  >
                    {siteSettings?.contactInfo?.phone || "+1 (470)-916-6880"}
                  </a>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.109"/>
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-lg text-slate-900 mb-1">WhatsApp</h4>
                  <a
                    href={`https://wa.me/${(siteSettings?.contactInfo?.whatsapp || "+14709166880").toString().replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 hover:text-orange-700 transition-colors break-all text-sm sm:text-base"
                  >
                    {siteSettings?.contactInfo?.whatsapp || "+1 (470)-916-6880"}
                  </a>
                </div>
              </div>
            </div>

            {/* Contact button only */}
            <div className="pt-4 mt-auto">
              <a
                href="/contact"
                className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Contact Us
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right Column - About Us Content */}
          <div className="bg-white border border-slate-200 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg order-2 lg:order-2 flex flex-col">
            <div className="flex-grow">
              <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-slate-900">
                {aboutUsData.title}
              </h3>
              <div className="text-slate-700 leading-relaxed">
                {aboutUsData.content.split('\n').map((paragraph, index) => (
                  <p key={index} className={index > 0 ? 'mt-4' : ''}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Optional About button configured in Sanity */}
            {aboutUsData.showButton && aboutUsData.buttonUrl ? (
              <div className="pt-6">
                <a
                  href={aboutUsData.buttonUrl}
                  target={aboutUsData.buttonUrl.startsWith('http') ? '_blank' : undefined}
                  rel={aboutUsData.buttonUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {aboutUsData.buttonText || 'Learn More'}
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
