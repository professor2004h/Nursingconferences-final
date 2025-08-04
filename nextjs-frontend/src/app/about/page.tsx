import Image from "next/image";
import { getAboutUsContent } from "../getAboutUs";
import { PortableText } from "@portabletext/react";
import { getAboutPageImageSection, getDefaultImageSection } from "../getImageSection";
import ImageSection from "../components/ImageSection";
import { getSiteSettings, getFullBrandName } from "../getSiteSettings";

export async function generateMetadata() {
  const about = await getAboutUsContent();
  let siteSettings = null;

  try {
    siteSettings = await getSiteSettings();
  } catch (error) {
    console.error('Error fetching site settings for about metadata:', error);
  }

  // Use organization branding from about data if available, otherwise fallback to site settings
  const primaryBrand = about?.primaryBrandName || 'Nursing';
  const secondaryBrand = about?.secondaryBrandText || 'Conference 2026';
  const brandTagline = about?.brandTagline;
  const fullBrandName = `${primaryBrand} ${secondaryBrand}`;

  return {
    title: `About Us - ${fullBrandName}`,
    description: `Learn more about ${fullBrandName} and our mission to connect scholars, researchers, and professionals worldwide.`,
  };
}

export default async function AboutPage() {
  const about = await getAboutUsContent();
  const imageSection = await getAboutPageImageSection();

  // Get site settings for dynamic branding fallback
  let siteSettings = null;
  try {
    siteSettings = await getSiteSettings();
  } catch (error) {
    console.error('Error fetching site settings for about page:', error);
  }

  // Use organization branding from about data if available, otherwise fallback to site settings
  const primaryBrand = about?.primaryBrandName || 'Nursing';
  const secondaryBrand = about?.secondaryBrandText || 'Conference 2026';
  const brandTagline = about?.brandTagline;
  const fullBrandName = `${primaryBrand} ${secondaryBrand}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Use About image as background with 40% black overlay */}
      <section
        className="relative py-16 md:py-24"
        style={{
          backgroundImage: about?.imageUrl ? `url(${about.imageUrl})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Fallback gradient if no image */}
        {!about?.imageUrl && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900" />
        )}
        {/* 40% black overlay (force with inline style for reliability) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2 md:mb-4 text-white">
              About
            </h1>
            <span className="block text-2xl md:text-4xl lg:text-5xl font-extrabold text-white">
              {primaryBrand} {secondaryBrand}
            </span>
            {brandTagline && (
              <span className="block text-lg md:text-xl lg:text-2xl font-medium text-white mt-3">
                {brandTagline}
              </span>
            )}
            <p className="mt-4 text-lg md:text-2xl text-white max-w-3xl mx-auto">
              Connecting minds, sharing knowledge, transforming the world through academic excellence
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                {about?.title && (
                  <div className="mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                      {about.title}
                    </h2>
                    <div className="text-lg text-orange-600 font-semibold">
                      <span className="text-xl font-bold text-orange-700">
                        {primaryBrand} {secondaryBrand}
                      </span>
                      {brandTagline && (
                        <span className="block text-base font-medium text-orange-600 mt-1 italic">
                          {brandTagline}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  {about?.description ? (
                    <PortableText value={about.description} />
                  ) : (
                    <div className="space-y-6">
                      <p>
                        We at {fullBrandName} built an ecosystem that brings the Scholars, people in the Scientific Study & Research,
                        knowledge group of the society, the students, learners and more on a common ground – to share their knowledge,
                        on the scientific progress that brings along the benefits to humanity and to our existence itself.
                      </p>
                      
                      <p>
                        Our agile Platform enables stake holders to carry out listing, updating & promoting different events, conferences, 
                        knowledge sharing sessions, seminars on latest technological advancements, workshops for participants and more. 
                        With a large group of diverse subscribers from different academic backgrounds, that include subject matter experts, 
                        researchers, academicians and more from across the Globe.
                      </p>
                      
                      <p>
                        We are the pioneers in connecting people – bringing in the best minds to the table to resolve complex global human concerns 
                        to deliver simple usable solutions. We are in the critical path of bringing scientific innovations to the masses.
                      </p>
                      
                      <p>
                        Core to our business - are People, a pack of extraordinary associates, who passionately express themselves by providing 
                        an ecosystem that brings best minds together in the quest to solve complex Global concerns.
                      </p>
                      
                      <p>
                        Enable a Better World - with knowledge sharing among Global Citizens By enabling knowledge sharing platforms, 
                        establishing an ecosystem that sustains today agile demands, promoting collaboration & constructive sharing.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-8">
                {/* Image removed to avoid duplicating hero background image */}

                {/* Dynamic Image Section */}
                <ImageSection
                  data={imageSection || getDefaultImageSection()}
                  className="shadow-lg"
                />


              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-700">
                To create a global platform that connects scholars, researchers, and professionals, fostering knowledge sharing 
                and collaboration that drives scientific progress and benefits humanity.
              </p>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-700">
                To be the world&apos;s leading conference platform that transforms how knowledge is shared, enabling breakthrough
                discoveries and innovations that shape a better future for all.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
