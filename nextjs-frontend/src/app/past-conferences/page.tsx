import Image from "next/image";
import Link from "next/link";
import { getPastConferences, getPastConferencesStats, type PastConferenceType } from "../getPastConferences";
// import { PortableText } from "@portabletext/react";

export const metadata = {
  title: "Past Conferences | Intelli Global Conferences",
  description: "Explore our successful past conferences featuring leading experts, researchers, and professionals from around the world.",
  keywords: ["past conferences", "academic conferences", "research events", "professional conferences", "global conferences"],
};

export default async function PastConferencesPage() {
  let conferences: PastConferenceType[] = [];
  let stats = null;

  try {
    conferences = await getPastConferences();
    stats = await getPastConferencesStats();
  } catch (error) {
    console.error('Error fetching past conferences:', error);
    conferences = [];
    stats = null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Past Conferences
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            Discover the impact and success of our previous conferences that brought together 
            leading minds to share knowledge and drive innovation across various fields.
          </p>
          
          {/* Statistics */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl md:text-3xl font-bold text-orange-400">
                  {stats.totalConferences}
                </div>
                <div className="text-blue-100 text-sm">Total Conferences</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl md:text-3xl font-bold text-orange-400">
                  {stats.totalAttendees?.toLocaleString() || '0'}
                </div>
                <div className="text-blue-100 text-sm">Total Attendees</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl md:text-3xl font-bold text-orange-400">
                  {stats.totalSpeakers}
                </div>
                <div className="text-blue-100 text-sm">Expert Speakers</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl md:text-3xl font-bold text-orange-400">
                  {stats.featuredCount}
                </div>
                <div className="text-blue-100 text-sm">Featured Events</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Past Conferences Grid */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {conferences && conferences.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {conferences.map((conference) => (
                <Link
                  href={`/past-conferences/${encodeURIComponent(conference.slug.current)}`}
                  key={conference._id}
                  prefetch={true}
                  className="block h-full"
                >
                  <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-200 hover:border-orange-200 h-full">
                    {conference.mainImageUrl && (
                      <div className="relative h-56 overflow-hidden">
                        <Image
                          src={conference.mainImageUrl}
                          alt={conference.title}
                          width={400}
                          height={250}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          priority={false}
                          loading="lazy"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                        
                        {/* Featured Badge */}
                        {conference.featured && (
                          <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            ⭐ Featured
                          </div>
                        )}

                        {/* Date Badge */}
                        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
                          <div className="text-orange-600 font-bold text-sm">
                            {new Date(conference.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                          <div className="text-slate-600 text-xs">
                            {new Date(conference.date).getFullYear()}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 leading-tight group-hover:text-orange-600 transition-colors">
                        {conference.title}
                      </h3>
                      
                      <div className="flex items-center text-slate-600 mb-3">
                        <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm truncate">{conference.location}</span>
                      </div>

                      <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                        {conference.shortDescription}
                      </p>

                      {/* Conference Stats */}
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                        {conference.attendeeCount && (
                          <span className="flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                            </svg>
                            {conference.attendeeCount} attendees
                          </span>
                        )}
                        {conference.keySpeakers && conference.keySpeakers.length > 0 && (
                          <span className="flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                            </svg>
                            {conference.keySpeakers.length} speakers
                          </span>
                        )}
                      </div>

                      {/* Topics Tags */}
                      {conference.topics && conference.topics.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {conference.topics.slice(0, 3).map((topic, index) => (
                            <span
                              key={index}
                              className="bg-orange-50 text-orange-600 px-2 py-1 rounded-full text-xs font-medium"
                            >
                              {topic}
                            </span>
                          ))}
                          {conference.topics.length > 3 && (
                            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-full text-xs">
                              +{conference.topics.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-orange-600 font-semibold text-sm group-hover:text-orange-700 transition-colors">
                          View Details →
                        </span>
                        <div className="text-slate-400 text-xs">
                          {new Date(conference.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">No Past Conferences Available</h3>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                We&apos;re currently updating our past conference archives. Please check back soon to explore our successful events.
              </p>
              <Link
                href="/conferences"
                className="inline-flex items-center mt-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
              >
                View Upcoming Conferences
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
