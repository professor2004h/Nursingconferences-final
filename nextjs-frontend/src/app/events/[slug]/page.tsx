import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getConferenceBySlug, getConferenceEvents } from "../../getconferences";
import PortableTextRenderer from "../../components/PortableTextRenderer";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all conference events
export async function generateStaticParams() {
  try {
    const conferences = await getConferenceEvents();
    return conferences.map((conference) => ({
      // Encode the slug to handle spaces and special characters in URLs
      slug: encodeURIComponent(conference.slug.current),
    }));
  } catch (error) {
    console.error('Error generating static params for events:', error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const conference = await getConferenceBySlug(slug);
  
  if (!conference) {
    return {
      title: "Event Not Found | Intelli Global Conferences",
      description: "The requested conference event could not be found.",
    };
  }

  return {
    title: `${conference.title} | Conference Events`,
    description: conference.shortDescription || `Join us for ${conference.title} in ${conference.location}`,
    keywords: conference.topics?.join(', ') || `conference, ${conference.title}`,
  };
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const conference = await getConferenceBySlug(slug);

  if (!conference) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 to-orange-900/90"></div>
        
        {conference.imageUrl && (
          <div className="absolute inset-0">
            <Image
              src={conference.imageUrl}
              alt={conference.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {conference.title}
            </h1>
            
            <div className="flex flex-wrap justify-center items-center gap-6 text-lg md:text-xl mb-8">
              {conference.date && (
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{new Date(conference.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
              )}
              
              {conference.location && (
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{conference.location}</span>
                </div>
              )}
            </div>

            {conference.shortDescription && (
              <p className="text-xl md:text-2xl text-slate-200 max-w-4xl mx-auto leading-relaxed">
                {conference.shortDescription}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {conference.registerNowUrl && (
              <Link
                href={conference.registerNowUrl}
                className="inline-flex items-center px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Register Now
              </Link>
            )}
            
            {conference.submitAbstractUrl && (
              <Link
                href={conference.submitAbstractUrl}
                className="inline-flex items-center px-8 py-4 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Submit Abstract
              </Link>
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
              {conference.description && (
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-slate-900 mb-6">About This Conference</h2>
                  <div className="prose prose-lg max-w-none text-slate-600">
                    <PortableTextRenderer value={conference.description} />
                  </div>
                </div>
              )}

              {/* Topics */}
              {conference.topics && conference.topics.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-slate-900 mb-6">Conference Topics</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {conference.topics.map((topic, index) => (
                      <div key={index} className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                        <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                        <span className="text-slate-700">{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Highlights */}
              {conference.highlights && conference.highlights.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-slate-900 mb-6">Conference Highlights</h2>
                  <div className="space-y-4">
                    {conference.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-start gap-4 p-6 bg-gradient-to-r from-orange-50 to-slate-50 rounded-xl">
                        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className="text-slate-700 leading-relaxed">{highlight}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-8">
                {/* Quick Info */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Event Information</h3>
                  <div className="space-y-4">
                    {conference.date && (
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <p className="text-sm text-slate-500">Date</p>
                          <p className="font-semibold text-slate-900">
                            {new Date(conference.date).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {conference.location && (
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div>
                          <p className="text-sm text-slate-500">Location</p>
                          <p className="font-semibold text-slate-900">{conference.location}</p>
                        </div>
                      </div>
                    )}

                    {conference.email && (
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <p className="text-sm text-slate-500">Contact</p>
                          <a href={`mailto:${conference.email}`} className="font-semibold text-orange-600 hover:text-orange-700">
                            {conference.email}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Navigation */}
                <div className="bg-slate-50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Explore More</h3>
                  <div className="space-y-3">
                    <Link href="/conferences" className="block text-orange-600 hover:text-orange-700 font-medium">
                      ← All Conferences
                    </Link>
                    <Link href="/registration" className="block text-orange-600 hover:text-orange-700 font-medium">
                      Registration Information
                    </Link>
                    <Link href="/speakers" className="block text-orange-600 hover:text-orange-700 font-medium">
                      Featured Speakers
                    </Link>
                    <Link href="/venue" className="block text-orange-600 hover:text-orange-700 font-medium">
                      Venue Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
