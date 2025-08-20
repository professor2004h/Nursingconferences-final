import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPastConferenceBySlug, getPastConferences } from "../../getPastConferences";
// import type { PastConferenceType } from "../../getPastConferences";
import PortableTextRenderer from "../../components/PortableTextRenderer";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all past conferences
export async function generateStaticParams() {
  try {
    const conferences = await getPastConferences();
    return conferences.map((conference) => ({
      // Encode the slug to handle spaces and special characters in URLs
      slug: encodeURIComponent(conference.slug.current),
    }));
  } catch (error) {
    console.error('Error generating static params for past conferences:', error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const conference = await getPastConferenceBySlug(slug);
  
  if (!conference) {
    return {
      title: "Conference Not Found | Intelli Global Conferences",
      description: "The requested past conference could not be found.",
    };
  }

  return {
    title: conference.seo?.metaTitle || `${conference.title} | Past Conferences`,
    description: conference.seo?.metaDescription || conference.shortDescription,
    keywords: conference.seo?.keywords || conference.topics,
  };
}

export default async function PastConferenceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const conference = await getPastConferenceBySlug(slug);

  if (!conference) {
    notFound();
  }

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": conference.title,
    "description": conference.shortDescription,
    "startDate": conference.date,
    "endDate": conference.endDate || conference.date,
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "location": {
      "@type": "Place",
      "name": conference.location,
      "address": conference.location
    },
    "organizer": {
      "@type": "Organization",
      "name": "Intelli Global Conferences",
      "url": "https://intelliglobalconferences.com"
    },
    "image": conference.mainImageUrl ? [conference.mainImageUrl] : [],
    "url": `https://intelliglobalconferences.com/past-conferences/${conference.slug.current}`,
    ...(conference.attendeeCount && {
      "maximumAttendeeCapacity": conference.attendeeCount,
      "attendeeCount": conference.attendeeCount
    }),
    ...(conference.keySpeakers && conference.keySpeakers.length > 0 && {
      "performer": conference.keySpeakers.map(speaker => ({
        "@type": "Person",
        "name": speaker.name,
        "jobTitle": speaker.title,
        "worksFor": speaker.organization ? {
          "@type": "Organization",
          "name": speaker.organization
        } : undefined,
        "image": speaker.photoUrl || undefined
      }))
    })
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        {conference.mainImageUrl && (
          <div className="absolute inset-0 opacity-20">
            <Image
              src={conference.mainImageUrl}
              alt={conference.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {conference.featured && (
              <div className="inline-flex items-center bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                ⭐ Featured Conference
              </div>
            )}
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {conference.title}
            </h1>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-blue-100 mb-8">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
                </svg>
                <span>
                  {new Date(conference.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  {conference.endDate && (
                    <> - {new Date(conference.endDate).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                    })}</>
                  )}
                </span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{conference.location}</span>
              </div>
            </div>
            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              {conference.shortDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Conference Stats */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {conference.attendeeCount && (
              <div className="text-center bg-white rounded-lg p-6 shadow-sm">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {conference.attendeeCount.toLocaleString()}
                </div>
                <div className="text-slate-600">Attendees</div>
              </div>
            )}
            {conference.keySpeakers && (
              <div className="text-center bg-white rounded-lg p-6 shadow-sm">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {conference.keySpeakers.length}
                </div>
                <div className="text-slate-600">Key Speakers</div>
              </div>
            )}
            {conference.topics && (
              <div className="text-center bg-white rounded-lg p-6 shadow-sm">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {conference.topics.length}
                </div>
                <div className="text-slate-600">Topics Covered</div>
              </div>
            )}
            {conference.highlights && (
              <div className="text-center bg-white rounded-lg p-6 shadow-sm">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {conference.highlights.length}
                </div>
                <div className="text-slate-600">Key Highlights</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content Column */}
            <div className="lg:col-span-2">
              {/* Description */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-slate-900 mb-6">About This Conference</h2>
                <div className="prose prose-lg max-w-none text-slate-600">
                  <PortableTextRenderer value={conference.description} />
                </div>
              </div>

              {/* Key Speakers */}
              {conference.keySpeakers && conference.keySpeakers.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Key Speakers</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {conference.keySpeakers.map((speaker, index) => (
                      <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-orange-200 transform hover:-translate-y-1">
                        {speaker.photoUrl && (
                          <div className="relative w-full h-80 overflow-hidden">
                            <Image
                              src={speaker.photoUrl}
                              alt={speaker.name}
                              width={400}
                              height={320}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                          </div>
                        )}
                        <div className="p-6 space-y-4">
                          <h3 className="text-2xl font-bold text-slate-900">
                            {speaker.name}
                          </h3>
                          <p className="text-orange-600 font-semibold text-lg">
                            {speaker.title}
                          </p>
                          {speaker.organization && (
                            <p className="text-slate-600 font-medium text-base">
                              {speaker.organization}
                            </p>
                          )}
                          {speaker.bio && (
                            <p className="text-slate-600 text-base leading-relaxed">
                              {speaker.bio}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Conference Outcomes */}
              {conference.outcomes && (
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-slate-900 mb-6">Conference Outcomes</h2>
                  <div className="prose prose-lg max-w-none text-slate-600">
                    <PortableTextRenderer value={conference.outcomes} />
                  </div>
                </div>
              )}

              {/* Testimonials */}
              {conference.testimonials && conference.testimonials.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-slate-900 mb-6">What Attendees Said</h2>
                  <div className="space-y-6">
                    {conference.testimonials.map((testimonial, index) => (
                      <div key={index} className="bg-slate-50 rounded-lg p-6">
                        <blockquote className="text-slate-700 italic mb-4">
                          &ldquo;{testimonial.quote}&rdquo;
                        </blockquote>
                        <div className="flex items-center">
                          <div>
                            <div className="font-semibold text-slate-900">
                              {testimonial.author}
                            </div>
                            {testimonial.authorTitle && (
                              <div className="text-slate-600 text-sm">
                                {testimonial.authorTitle}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Conference Highlights */}
              {conference.highlights && conference.highlights.length > 0 && (
                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200 mb-8">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Conference Highlights</h3>
                  <ul className="space-y-3">
                    {conference.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-slate-700">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Topics Covered */}
              {conference.topics && conference.topics.length > 0 && (
                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200 mb-8">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Topics Covered</h3>
                  <div className="flex flex-wrap gap-2">
                    {conference.topics.map((topic, index) => (
                      <span
                        key={index}
                        className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Back to Past Conferences */}
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                <h3 className="text-lg font-bold mb-2">Explore More</h3>
                <p className="text-orange-100 mb-4 text-sm">
                  Discover other successful conferences we&apos;ve organized.
                </p>
                <Link
                  href="/past-conferences"
                  className="inline-flex items-center bg-white text-orange-600 px-4 py-2 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
                >
                  View All Past Conferences
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      {conference.gallery && conference.gallery.length > 0 && (
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Conference Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {conference.gallery.map((image, index) => (
                <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
                  <Image
                    src={image.imageUrl}
                    alt={image.caption || `Conference image ${index + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      </div>
    </>
  );
}
