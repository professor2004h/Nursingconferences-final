import Link from "next/link";
import { getSponsorshipTiers, formatCurrency, type SponsorshipTier } from "../getSponsorshipData";
import { getSiteSettingsSSR, type SiteSettings } from "../getSiteSettings";
import { getSponsorshipSettingsWithFallback, type SponsorshipSettingsType, blocksToText } from "../getSponsorshipSettings";
import { PortableText } from '@portabletext/react';
import imageUrlBuilder from '@sanity/image-url';
import { client } from '../sanity/client';

// Initialize the image URL builder
const builder = imageUrlBuilder(client);

// Helper function to generate image URLs
function urlFor(source: any) {
  return builder.image(source);
}

export async function generateMetadata() {
  const sponsorshipSettings = await getSponsorshipSettingsWithFallback();

  return {
    title: sponsorshipSettings.pageSettings.metaTitle,
    description: sponsorshipSettings.pageSettings.metaDescription,
  };
}

export default async function SponsorshipPage() {
  let sponsorshipTiers: SponsorshipTier[] = [];
  let siteSettings: SiteSettings | null = null;
  let sponsorshipSettings: SponsorshipSettingsType;

  try {
    [sponsorshipTiers, siteSettings, sponsorshipSettings] = await Promise.all([
      getSponsorshipTiers(),
      getSiteSettingsSSR(),
      getSponsorshipSettingsWithFallback(),
    ]);
  } catch (error) {
    console.error('Error fetching sponsorship data:', error);
    sponsorshipSettings = await getSponsorshipSettingsWithFallback();
  }

  // Get background image URL if available
  const heroBackgroundImage = sponsorshipSettings.heroSection.backgroundImage?.asset?.url
    ? urlFor(sponsorshipSettings.heroSection.backgroundImage).url()
    : null;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section
        className="py-16 md:py-24 bg-gradient-to-br from-blue-900 via-slate-800 to-blue-900 relative"
        style={heroBackgroundImage ? {
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${heroBackgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        } : {}}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="flex flex-col items-center justify-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              {sponsorshipSettings.heroSection.title}
            </h1>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl md:text-2xl text-white leading-relaxed opacity-90">
                {sponsorshipSettings.heroSection.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              {sponsorshipSettings.mainContent.sectionTitle && (
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                  {sponsorshipSettings.mainContent.sectionTitle}
                </h2>
              )}
              <div className="prose prose-lg max-w-none">
                <PortableText
                  value={sponsorshipSettings.mainContent.content}
                  components={{
                    block: {
                      normal: ({children}) => <p className="text-gray-700 leading-relaxed mb-6">{children}</p>,
                      h2: ({children}) => <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">{children}</h2>,
                      h3: ({children}) => <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">{children}</h3>,
                      blockquote: ({children}) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-6">{children}</blockquote>,
                    },
                    marks: {
                      strong: ({children}) => <strong className="font-bold">{children}</strong>,
                      em: ({children}) => <em className="italic">{children}</em>,
                      underline: ({children}) => <span className="underline">{children}</span>,
                      link: ({children, value}) => (
                        <a href={value.href} className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">
                          {children}
                        </a>
                      ),
                    },
                  }}
                />
                {sponsorshipSettings.mainContent.highlightText && (
                  <div className="text-center mt-8">
                    <p className="text-2xl font-bold text-blue-900 italic">
                      {sponsorshipSettings.mainContent.highlightText}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsorship Tiers Section */}
      {sponsorshipSettings.pageSettings.showSponsorshipTiers && (
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Sponsorship Packages
            </h2>
            <div className="w-24 h-1 bg-orange-500 mx-auto"></div>
          </div>

          {/* Sponsorship Tiers Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {sponsorshipTiers.map((tier) => (
              <div 
                key={tier._id} 
                className={`bg-white rounded-xl shadow-lg border-2 p-8 ${
                  tier.featured 
                    ? 'border-orange-500 ring-4 ring-orange-100' 
                    : 'border-gray-200 hover:border-blue-300'
                } transition-all duration-300 hover:shadow-xl`}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">{tier.name}</h3>
                  {tier.featured && (
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Popular
                    </span>
                  )}
                </div>
                
                {tier.description && (
                  <p className="text-gray-600 mb-6">{tier.description}</p>
                )}

                <div className="mb-6">
                  <div className="text-3xl font-bold text-blue-900 mb-2">
                    {formatCurrency(tier.price)}
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.benefits.map((benefit, benefitIndex) => (
                    <li 
                      key={benefitIndex} 
                      className={`flex items-start ${
                        benefit.highlighted ? 'text-orange-600 font-semibold' : 'text-gray-700'
                      }`}
                    >
                      <svg 
                        className={`w-5 h-5 mt-0.5 mr-3 flex-shrink-0 ${
                          benefit.highlighted ? 'text-orange-500' : 'text-green-500'
                        }`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path 
                          fillRule="evenodd" 
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                          clipRule="evenodd" 
                        />
                      </svg>
                      {benefit.benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-900 to-slate-800 rounded-2xl p-8 md:p-12 text-white">
              <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                {sponsorshipSettings.callToAction.title}
              </h3>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                {sponsorshipSettings.callToAction.description}
              </p>
              <Link
                href={sponsorshipSettings.callToAction.buttonLink}
                className="inline-flex items-center bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 group"
              >
                {sponsorshipSettings.callToAction.buttonText}
                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Contact Information */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
              Need More Information?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h4 className="text-xl font-semibold text-gray-900 mb-4">Email Us</h4>
                <p className="text-gray-600 mb-4">
                  For sponsorship inquiries and custom packages
                </p>
                <a 
                  href={`mailto:${siteSettings?.contactInfo?.email || 'contact@intelliglobalconferences.com'}`}
                  className="text-blue-600 hover:text-blue-800 font-semibold"
                >
                  {siteSettings?.contactInfo?.email || 'contact@intelliglobalconferences.com'}
                </a>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h4 className="text-xl font-semibold text-gray-900 mb-4">Call Us</h4>
                <p className="text-gray-600 mb-4">
                  Speak directly with our sponsorship team
                </p>
                <a 
                  href={`tel:${siteSettings?.contactInfo?.phone || '+1-234-567-8900'}`}
                  className="text-blue-600 hover:text-blue-800 font-semibold"
                >
                  {siteSettings?.contactInfo?.phone || '+1-234-567-8900'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
