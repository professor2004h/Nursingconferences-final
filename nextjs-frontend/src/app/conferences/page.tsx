import Image from "next/image";
import Link from "next/link";
import { getConferenceEvents, type ConferenceEventType } from "../getconferences";
import { getConferences } from "../getconferences";

export default async function ConferencesPage() {
  let events: ConferenceEventType[] = [];
  let conference = null;

  try {
    events = await getConferenceEvents(50); // Get more events for the dedicated page
    conference = await getConferences();
  } catch (error) {
    console.error('Error fetching conferences:', error);
    events = [];
    conference = null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {conference?.title || "Our Conferences"}
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            Join leading experts, researchers, and professionals from around the world to share knowledge, 
            network, and drive industry advancement.
          </p>
        </div>
      </section>

      {/* Conferences Grid */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {events && events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <div key={event._id} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-slate-200 hover:border-orange-200">
                  {event.imageUrl && (
                    <div className="relative h-56 overflow-hidden">
                      {event.mainConferenceUrl ? (
                        <a href={event.mainConferenceUrl} className="block w-full h-full">
                          <Image
                            src={event.imageUrl}
                            alt={event.title}
                            width={400}
                            height={250}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                        </a>
                      ) : (
                        <>
                          <Image
                            src={event.imageUrl}
                            alt={event.title}
                            width={400}
                            height={250}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                        </>
                      )}

                        {/* Date Badge */}
                        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
                          <div className="text-orange-600 font-bold text-sm">
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

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 leading-tight group-hover:text-orange-600 transition-colors">
                        {event.title}
                      </h3>

                      <div className="flex items-center text-slate-600 mb-4">
                        <svg className="w-4 h-4 mr-2 flex-shrink-0 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm">{event.location}</span>
                      </div>

                      <div className="flex flex-col gap-3">
                        {event.registerNowUrl && event.registerNowUrl.trim() !== '' ? (
                          <a
                            href={event.registerNowUrl}
                            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-3 rounded-lg font-semibold text-base hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl text-center"
                          >
                            Register Now
                          </a>
                        ) : (
                          <button
                            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-3 rounded-lg font-semibold text-base hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl opacity-50 cursor-not-allowed"
                            disabled
                          >
                            Register Now
                          </button>
                        )}

                        {event.submitAbstractUrl && event.submitAbstractUrl.trim() !== '' ? (
                          <a
                            href={event.submitAbstractUrl}
                            className="w-full border-2 border-slate-300 text-slate-700 px-4 py-3 rounded-lg font-semibold text-base hover:border-orange-500 hover:text-orange-600 transition-all duration-300 text-center"
                          >
                            Submit Abstract
                          </a>
                        ) : (
                          <button
                            className="w-full border-2 border-slate-300 text-slate-700 px-4 py-3 rounded-lg font-semibold text-base hover:border-orange-500 hover:text-orange-600 transition-all duration-300 opacity-50 cursor-not-allowed"
                            disabled
                          >
                            Submit Abstract
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10m6-10v10m-6-4h6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">No Conferences Available</h3>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                We&apos;re currently updating our conference listings. Please check back soon for upcoming events and opportunities.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center mt-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                Contact Us for Updates
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
