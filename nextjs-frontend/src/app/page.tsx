import React from "react";
import Image from "next/image";
import Link from "next/link";

import { getAboutUsContent } from "./getAboutUs";
import { getConferences, getConferenceEvents, getConferencesSectionSettings, type ConferenceEventType, type ConferencesSectionSettings } from "./getconferences";
import { getFeaturedPastConferences, type PastConferenceType } from "./getPastConferences";
import { PortableText } from "@portabletext/react";
import { getHeroSection } from "./getHeroSection";
import { getImageSectionContent, getDefaultImageSection } from "./getImageSection";
import { getSiteSettingsSSR } from "./getSiteSettings";
import { getVenueSettings } from "./getVenueSettings";
import {
  getPastConferencesSectionStyling,
  type PastConferencesSectionStyling,
  generateBackgroundStyles,
  generateOverlayStyles,
  generateGradientClasses,
  generateGradientStyles
} from "./getPastConferencesSectionStyling";
import {
  getJournalSectionStyling,
  type JournalSectionStyling,
  generateJournalBackgroundStyles,
  generateJournalOverlayStyles
} from "./getJournalSectionStyling";
import {
  getCustomContentSectionData,
  type CustomContentSectionData
} from "./getCustomContentSectionStyling";
import FeaturedCommitteeMembers from '@/app/components/FeaturedCommitteeMembers';
import FeaturedSpeakersSection from '@/app/components/FeaturedSpeakersSection';
import ConferenceTracksSection from '@/app/components/ConferenceTracksSection';
import NavigationBlocks from '@/app/components/NavigationBlocks';
import VenueImageGallery from '@/app/components/VenueImageGallery';
import AboutLocationSection from '@/app/components/AboutLocationSection';
import EventScheduleAndBenefitsSection from '@/app/components/EventScheduleAndBenefitsSection';

// Direct imports to avoid SSR bailout
import ContactForm from "./components/ContactForm";
import HeroSlideshow from "./components/HeroSlideshow";
import ImageSection from "./components/ImageSection";
import LeafletMapLocations from "./components/LeafletMapLocations";

export default async function HomePage() {
  // Optimized parallel data fetching with error handling
  const startTime = performance.now();

  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('🏠 HomePage: Starting data fetch...');
    }

    // Batch fetch all data in parallel for better performance
    const [
      events,
      pastConferences,
      about,
      hero,
      conference,
      imageSection,
      siteSettings,
      pastConferencesStyling,
      journalStyling,
      customContentData,
      venueSettings,
      conferencesSectionSettings
    ] = await Promise.allSettled([
      getConferenceEvents(12), // Will be filtered later based on settings
      getFeaturedPastConferences(4),
      getAboutUsContent(),
      getHeroSection(),
      getConferences(),
      getImageSectionContent(),
      getSiteSettingsSSR(),
      getPastConferencesSectionStyling(),
      getJournalSectionStyling(),
      getCustomContentSectionData(),
      getVenueSettings(),
      getConferencesSectionSettings()
    ]);

    // Only log detailed results in development
    if (process.env.NODE_ENV === 'development') {
      const failedFetches = [events, pastConferences, about, hero, conference, imageSection, siteSettings, pastConferencesStyling, journalStyling, customContentData]
        .map((result, index) => {
          const names = ['events', 'pastConferences', 'about', 'hero', 'conference', 'imageSection', 'siteSettings', 'pastConferencesStyling', 'journalStyling', 'customContentData'];
          return result.status === 'rejected' ? names[index] : null;
        })
        .filter(Boolean);

      if (failedFetches.length > 0) {
        console.warn('⚠️ HomePage: Failed fetches:', failedFetches.join(', '));
      } else {
        console.log('✅ HomePage: All data fetched successfully');
      }
    }

    const endTime = performance.now();

    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 HomePage data fetching completed in ${(endTime - startTime).toFixed(2)}ms`);
    }

    // Extract data with fallbacks
    const pageData = {
      events: events.status === 'fulfilled' ? events.value : [],
      pastConferences: pastConferences.status === 'fulfilled' ? pastConferences.value : [],
      about: about.status === 'fulfilled' ? about.value : null,
      hero: hero.status === 'fulfilled' ? hero.value : null,
      conference: conference.status === 'fulfilled' ? conference.value : null,
      imageSection: imageSection.status === 'fulfilled' ? imageSection.value : null,
      siteSettings: siteSettings.status === 'fulfilled' ? siteSettings.value : null,
      pastConferencesStyling: pastConferencesStyling.status === 'fulfilled' ? pastConferencesStyling.value : null,
      journalStyling: journalStyling.status === 'fulfilled' ? journalStyling.value : null,
      customContentData: customContentData.status === 'fulfilled' ? customContentData.value : null,
      venueSettings: venueSettings.status === 'fulfilled' ? venueSettings.value : null,
      conferencesSectionSettings: conferencesSectionSettings.status === 'fulfilled' ? conferencesSectionSettings.value : null
    };

      // Filter events based on unified conferences section settings
    if (pageData.conferencesSectionSettings?.displaySettings) {
      const settings = pageData.conferencesSectionSettings.displaySettings;
      let filteredEvents = pageData.events;

      // Apply max events limit
      if (settings.maxEventsToShow && filteredEvents.length > settings.maxEventsToShow) {
        filteredEvents = filteredEvents.slice(0, settings.maxEventsToShow);
      }

      // Apply active status filter if enabled
      if (settings.showOnlyActiveEvents) {
        filteredEvents = filteredEvents.filter(event => event.isActive === true);
      }

      pageData.events = filteredEvents;
    }

    return <HomePageContent {...pageData} />;
  } catch (error) {
    console.error('Critical error in HomePage:', error);
    // Return with empty data for graceful fallback
    return <HomePageContent
      events={[]}
      pastConferences={[]}
      about={null}
      hero={null}
      conference={null}
      imageSection={null}
      siteSettings={null}
      pastConferencesStyling={null}
      journalStyling={null}
      customContentData={null}
      venueSettings={null}
      conferencesSectionSettings={null}
    />;
  }
}

// Separate component for the actual page content to improve performance
function HomePageContent({
  events,
  pastConferences,
  about,
  hero,
  conference,
  imageSection,
  siteSettings,
  pastConferencesStyling,
  journalStyling,
  customContentData,
  venueSettings,
  conferencesSectionSettings
}: {
  events: ConferenceEventType[];
  pastConferences: PastConferenceType[];
  about: any;
  hero: any;
  conference: any;
  imageSection: any;
  siteSettings: any;
  pastConferencesStyling: PastConferencesSectionStyling | null;
  journalStyling: JournalSectionStyling | null;
  customContentData: CustomContentSectionData | null;
  venueSettings: any;
  conferencesSectionSettings: ConferencesSectionSettings | null;
}) {
  // Use fallback data if needed
  const safeImageSection = imageSection || getDefaultImageSection();

  return (
    <div className="min-h-screen bg-white">
      {/* 1. Hero Section with Proper Slideshow */}
      <HeroSlideshow hero={hero} />

      {/* 2. Navigation Blocks Section */}
      <NavigationBlocks />

      {/* 3. About Us and Statistics Section */}
      <section className="py-8 md:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="animate-fade-in-up">
              <div className="mb-6">
                <span className="text-orange-500 font-semibold text-lg tracking-wide uppercase">About Us</span>
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-2 leading-tight">
                  Intelli Global
                  <span className="block bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                    Conferences
                  </span>
                </h2>
              </div>

              <div className="prose prose-lg text-slate-600 mb-8 max-w-none">
                {about?.description ? (
                  <div className="space-y-6">
                    {/* Show truncated content from backend */}
                    <div className="line-clamp-6 text-lg leading-relaxed">
                      <PortableText value={about.description} />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <p className="text-lg leading-relaxed text-slate-600">
                      We at Intelli Global Conferences built an ecosystem that brings the Scholars, people in the Scientific Study & Research,
                      knowledge group of the society, the students, learners and more on a common ground – to share their knowledge,
                      on the scientific progress that brings along the benefits to humanity and to our existence itself.
                    </p>
                    <p className="text-lg leading-relaxed text-slate-600">
                      Our agile Platform enables stake holders to carry out listing, updating & promoting different events, conferences,
                      knowledge sharing sessions, seminars on latest technological advancements that shape our future.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/about"
                  className="group inline-flex items-center justify-center bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  More About Conference
                  <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href="/conferences"
                  className="inline-flex items-center justify-center border-2 border-slate-300 text-slate-700 px-8 py-4 rounded-lg font-semibold text-lg hover:border-orange-500 hover:text-orange-600 transition-all duration-300"
                >
                  View Conferences
                </Link>
              </div>
            </div>

            <div className="animate-fade-in-up lg:animate-fade-in-right">
              {about?.imageUrl ? (
                <div className="space-y-6">
                  <div className="relative">
                    <Image
                      src={about.imageUrl}
                      alt="About Intelli Global Conferences"
                      width={600}
                      height={400}
                      className="w-full h-auto rounded-2xl shadow-2xl"
                    />
                  </div>

                  {/* Dynamic Image Section */}
                  <ImageSection
                    data={safeImageSection}
                    className="shadow-2xl"
                  />
                </div>
              ) : (
                <ImageSection
                  data={safeImageSection}
                  className="shadow-2xl"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Organizing Committee Section */}
      <FeaturedCommitteeMembers />

      {/* 5. Speakers Section */}
      <FeaturedSpeakersSection />

      {/* 6. Conference Sessions and Tracks Section */}
      <ConferenceTracksSection />

      {/* 7. Venue Section */}
      {venueSettings?.venueImages && venueSettings.venueImages.length > 0 && (
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                VENUE GALLERY
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Explore our stunning venue and discover the perfect setting for your conference experience.
              </p>
            </div>

            <VenueImageGallery
              images={venueSettings.venueImages}
              title="Conference Venue"
            />
          </div>
        </section>
      )}

      {/* 8. About the Location Section */}
      <AboutLocationSection venueSettings={venueSettings} />

      {/* 9. Event Schedule and Participation Benefits Section */}
      <EventScheduleAndBenefitsSection />

      {/* 10. Journal Section */}
      {siteSettings?.journal?.showJournal && (
        <section
          className={`py-12 md:py-16 relative overflow-hidden ${
            journalStyling?.isActive && journalStyling.backgroundImage?.url
              ? ''
              : 'bg-gradient-to-br from-slate-800 via-blue-900 to-slate-900'
          }`}
          style={generateJournalBackgroundStyles(journalStyling || undefined)}
        >
          {/* Custom Color Overlay (only when background image is active) */}
          {journalStyling?.isActive && journalStyling.backgroundImage?.url && journalStyling.overlayColor && (
            <div
              className="absolute inset-0 z-15"
              style={generateJournalOverlayStyles(journalStyling || undefined)}
            />
          )}

          {/* Default Background Pattern (only when no custom background) */}
          {(!journalStyling?.isActive || !journalStyling.backgroundImage?.url) && (
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
            </div>
          )}

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30">
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                JOURNAL
              </h2>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                Explore cutting-edge research, academic insights, and scholarly publications from our global network of experts and researchers.
              </p>

              <div className="flex justify-center">
                <Link
                  href={siteSettings.journal?.journalUrl || "/journal"}
                  target={siteSettings.journal?.openInNewTab ? "_blank" : "_self"}
                  rel={siteSettings.journal?.openInNewTab ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 group"
                >
                  CLICK HERE
                  <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Conferences Section - Only show if master toggle is explicitly enabled */}
      {(conferencesSectionSettings?.masterControl?.showOnHomepage === true) && (
      <section className="py-12 md:py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-12">
            <span className="text-orange-500 font-semibold text-lg tracking-wide uppercase mb-4 block">Our Events</span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              {conferencesSectionSettings?.masterControl?.title || conference?.title ? (
                conferencesSectionSettings?.masterControl?.title || conference.title
              ) : (
                <>
                  Featured
                  <span className="block bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                    Conferences
                  </span>
                </>
              )}
            </h2>
            {conferencesSectionSettings?.masterControl?.description && Array.isArray(conferencesSectionSettings.masterControl.description) ? (
              <div className="text-lg md:text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
                <PortableText value={conferencesSectionSettings.masterControl.description} />
              </div>
            ) : conference?.description && Array.isArray(conference.description) ? (
              <div className="text-lg md:text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
                <PortableText value={conference.description} />
              </div>
            ) : (
              <p className="text-lg md:text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
                We connect the Thoughts to Realizations – we conduct seminars, conferences as annual events that brings-in cross section of the world to share their efforts that impact the world that we live, to fellow intellectuals and other professionals who are transforming this world with their ideas for a better future.
              </p>
            )}
          </div>

          {/* Events Grid - 2 columns on mobile, 3 on desktop */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {events.map((event) => {
              return (
                <div key={event._id} className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 sm:hover:-translate-y-3 border border-slate-200 hover:border-orange-200">
                  {event.imageUrl && (
                    <div className="relative h-32 sm:h-40 md:h-48 lg:h-56 overflow-hidden">
                      <Image
                        src={event.imageUrl}
                        alt={event.title}
                        width={400}
                        height={250}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>

                      {/* Date Badge - Responsive sizing */}
                      <div className="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4 bg-white/95 backdrop-blur-sm rounded-md sm:rounded-lg px-2 sm:px-3 py-1 sm:py-2 shadow-lg">
                        <div className="text-orange-600 font-bold text-xs sm:text-sm">
                          {new Date(event.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                        <div className="text-slate-600 text-xs">
                          {new Date(event.date).getFullYear()}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-3 sm:p-4 md:p-6">
                    <Link href={`/events/${event.slug.current}`}>
                      <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-slate-900 mb-2 sm:mb-3 line-clamp-2 leading-tight hover:text-orange-600 transition-colors cursor-pointer">
                        {event.title}
                      </h3>
                    </Link>

                    <div className="flex items-center text-slate-600 mb-3 sm:mb-4">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-xs sm:text-sm truncate">{event.location}</span>
                    </div>

                    <div className="flex flex-col gap-2 sm:gap-3">


                      {event.registerNowUrl && event.registerNowUrl.trim() !== '' ? (
                        <a
                          href={event.registerNowUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 rounded-md sm:rounded-lg font-medium sm:font-semibold text-xs sm:text-sm md:text-base hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl text-center"
                        >
                          Register Now
                        </a>
                      ) : (
                        <button
                          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 rounded-md sm:rounded-lg font-medium sm:font-semibold text-xs sm:text-sm md:text-base hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl opacity-50 cursor-not-allowed"
                          disabled
                        >
                          Register Now
                        </button>
                      )}

                      {event.submitAbstractUrl && event.submitAbstractUrl.trim() !== '' ? (
                        <a
                          href={event.submitAbstractUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full border border-slate-300 sm:border-2 text-slate-700 px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 rounded-md sm:rounded-lg font-medium sm:font-semibold text-xs sm:text-sm md:text-base hover:border-orange-500 hover:text-orange-600 transition-all duration-300 text-center"
                        >
                          Submit Abstract
                        </a>
                      ) : (
                        <button
                          className="w-full border border-slate-300 sm:border-2 text-slate-700 px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 rounded-md sm:rounded-lg font-medium sm:font-semibold text-xs sm:text-sm md:text-base hover:border-orange-500 hover:text-orange-600 transition-all duration-300 opacity-50 cursor-not-allowed"
                          disabled
                        >
                          Submit Abstract
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-8 md:mt-10">
            <Link
              href="/conferences"
              className="group inline-flex items-center bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              View All Conferences
              <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
      )}

      {/* Past Conferences Section */}
      {pastConferences && pastConferences.length > 0 && (
        <section
          className={`past-conferences-section relative overflow-hidden ${generateGradientClasses(pastConferencesStyling || { isActive: false, overlayOpacity: 80, _id: 'default', title: 'Default' })}`}
          style={{
            ...generateBackgroundStyles(pastConferencesStyling || { isActive: false, overlayOpacity: 80, _id: 'default', title: 'Default' }),
            ...generateGradientStyles(pastConferencesStyling || { isActive: false, overlayOpacity: 80, _id: 'default', title: 'Default' }),
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat'
          }}
        >


          {/* Color Overlay */}
          {pastConferencesStyling?.isActive && pastConferencesStyling.overlayColor && (
            <div
              style={generateOverlayStyles(pastConferencesStyling)}
            />
          )}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30 w-full flex flex-col justify-start lg:justify-center min-h-full py-4 lg:py-0">
            <div className="text-center mb-8 lg:mb-12 flex-shrink-0">
              <span className="text-orange-400 font-semibold text-base sm:text-lg lg:text-xl tracking-wide uppercase mb-3 lg:mb-4 block">OUR SUCCESS STORIES</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 lg:mb-6 leading-tight">
                Featured
                <span className="block bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                  Past Conferences
                </span>
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-blue-100 max-w-3xl lg:max-w-4xl mx-auto leading-relaxed px-4">
                Discover the impact and success of our previous conferences that brought together leading minds to share knowledge and drive innovation.
              </p>
            </div>

            {/* Past Conferences Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 max-w-7xl mx-auto flex-shrink-0 mb-8 lg:mb-12">
              {pastConferences.map((conference) => (
                <Link
                  href={`/past-conferences/${conference.slug.current}`}
                  key={conference._id}
                  className="block h-full"
                  prefetch={true}
                >
                  <div className="group bg-slate-800/95 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-slate-700/95 transition-all duration-200 transform hover:-translate-y-1 border border-slate-600/30 hover:border-orange-400/60 w-full h-full flex flex-col shadow-lg hover:shadow-xl min-h-[280px] lg:min-h-[320px]">
                    {conference.mainImageUrl && (
                      <div className="relative h-32 sm:h-36 lg:h-40 w-full overflow-hidden flex-shrink-0">
                        <Image
                          src={conference.mainImageUrl}
                          alt={conference.title}
                          width={500}
                          height={320}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          priority={false}
                          loading="lazy"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/10 to-transparent"></div>

                        {/* Featured Badge */}
                        <div className="absolute top-3 right-3 bg-orange-500 text-white px-2.5 py-1 rounded-full text-xs font-semibold shadow-lg">
                          Featured
                        </div>

                        {/* Date Badge */}
                        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-lg px-2.5 py-1.5 shadow-lg">
                          <div className="text-orange-600 font-bold text-xs">
                            {new Date(conference.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                          <div className="text-slate-600 text-xs font-medium">
                            {new Date(conference.date).getFullYear()}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="p-3 sm:p-4 flex flex-col flex-grow">
                      {/* Conference Category/Domain */}
                      <div className="mb-2">
                        <span className="inline-block bg-orange-500/20 text-orange-300 px-2.5 py-1 rounded-full text-xs font-medium">
                          {conference.topics && conference.topics.length > 0 ? conference.topics[0] : 'Conference'}
                        </span>
                      </div>

                      {/* Location */}
                      <div className="flex items-center text-slate-300 mb-2">
                        <svg className="w-3.5 h-3.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm truncate">{conference.location}</span>
                      </div>

                      {/* Conference Title */}
                      <h3 className="text-base sm:text-lg font-bold text-white mb-2 line-clamp-2 leading-tight group-hover:text-orange-300 transition-colors">
                        {conference.title}
                      </h3>

                      {/* Conference Description */}
                      <p className="text-slate-300 text-xs sm:text-sm mb-3 line-clamp-3 flex-grow leading-relaxed">
                        {conference.shortDescription}
                      </p>

                      {/* Conference Stats */}
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-3 gap-2">
                        {conference.attendeeCount && (
                          <span className="flex items-center flex-shrink-0">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                            </svg>
                            <span className="truncate">{conference.attendeeCount}</span>
                          </span>
                        )}
                        {conference.keySpeakers && conference.keySpeakers.length > 0 && (
                          <span className="flex items-center flex-shrink-0">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                            </svg>
                            <span className="truncate">{conference.keySpeakers.length}</span>
                          </span>
                        )}
                      </div>

                      {/* View Details Button */}
                      <div className="mt-auto pt-1">
                        <span className="inline-flex items-center text-orange-400 font-semibold text-xs sm:text-sm group-hover:text-orange-300 transition-colors">
                          View Details
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* View All Past Conferences Button */}
            <div className="text-center flex-shrink-0">
              <Link
                href="/past-conferences"
                className="inline-flex items-center bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-base sm:text-lg"
              >
                View All Past Conferences
                <svg className="w-5 h-5 ml-2 sm:ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Custom Content Section - Only show if toggle is enabled */}
      {customContentData?.showOnHomepage && (
      <section className="custom-content-section bg-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Primary Text (Main Heading) */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 mb-6 sm:mb-8">
              {customContentData?.primaryText || 'INSIGHTS'}
            </h2>
          </div>

          {/* Two-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column - Insights */}
            <div className="bg-slate-100 rounded-lg p-6 sm:p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900">INSIGHTS</h3>
              </div>
              <p className="text-slate-700 leading-relaxed text-base sm:text-lg">
                {customContentData?.insights ||
                  'Being part of a Scientific Seminar is a professionally very rewarding and enriching experience. Apart from socializing with the greatest kinds from across the Globe, we get the insights to the realm of new global trends, the talking shapes in the Global research laboratories. These sessions inspire many a practitioner minds for new beginnings that have the potential to transform the way we live today. As individuals we constantly seeking to advance our careers, these knowledge sharing sessions function as gateways to a new realm of opportunities unseen before.'
                }
              </p>
            </div>

            {/* Right Column - Targets */}
            <div className="bg-slate-100 rounded-lg p-6 sm:p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900">TARGETS</h3>
              </div>
              <p className="text-slate-700 leading-relaxed text-base sm:text-lg">
                {customContentData?.targets ||
                  'We are the pioneers in connecting people – bringing in the best minds to the table to resolve complex global human concerns to deliver simple usable solutions. We are in the critical path of bringing scientific innovations to the masses by enabling an ecosystem to key stake holders to express themselves their research findings. These research findings are the Critical links to shaping our future living – seen or unseen.'
                }
              </p>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Contact Section */}
      <section className="py-12 sm:py-14 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="contact-section-grid grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start">
            <div className="contact-info-section text-slate-900 order-2 lg:order-1">
              <div className="mb-6 sm:mb-8">
                <span className="text-orange-500 font-semibold text-base sm:text-lg tracking-wide uppercase mb-3 sm:mb-4 block">Contact Us</span>
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

              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-slate-50 rounded-lg sm:rounded-xl border border-slate-200">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-base sm:text-lg text-slate-900 mb-1">Address</h4>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                      {siteSettings?.contactInfo?.address || "7 Bell Yard, London, WC2A 2JR, United Kingdom"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-slate-50 rounded-lg sm:rounded-xl border border-slate-200">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-base sm:text-lg text-slate-900 mb-1">Email</h4>
                    <a href={`mailto:${siteSettings?.contactInfo?.email || "intelliglobalconferences@gmail.com"}`} className="text-sm sm:text-base text-orange-500 hover:text-orange-600 transition-colors break-all">
                      {siteSettings?.contactInfo?.email || "intelliglobalconferences@gmail.com"}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-slate-50 rounded-lg sm:rounded-xl border border-slate-200">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-base sm:text-lg text-slate-900 mb-1">WhatsApp</h4>
                    <a href={`https://wa.me/${(siteSettings?.contactInfo?.whatsapp || "+442045718752").replace(/[^0-9]/g, '')}`} className="text-sm sm:text-base text-orange-500 hover:text-orange-600 transition-colors">
                      {siteSettings?.contactInfo?.whatsapp || "+44 20 4571 8752"}
                    </a>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="mt-6 sm:mt-8">
                <Link
                  href="/contact"
                  className="inline-flex items-center bg-orange-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 min-h-[48px]"
                >
                  Contact Us Now
                  <svg className="ml-2 w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="contact-form-section order-1 lg:order-2">
              <div className="contact-form-container bg-slate-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-slate-200 shadow-sm">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Conference Locations Map Section - OpenStreetMap with Leaflet */}
      <LeafletMapLocations />

    </div>
  );
}
