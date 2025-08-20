import Image from 'next/image';

interface ConferenceCardProps {
  event: {
    _id: string;
    title: string;
    slug: { current: string };
    date: string;
    location: string;
    imageUrl?: string;
    mainConferenceUrl?: string;
    registerNowUrl?: string;
    submitAbstractUrl?: string;
  };
}

export default function ConferenceCard({ event }: ConferenceCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 card-hover conference-card min-h-[44px] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
      {event.imageUrl && (
        <div className="relative h-48 sm:h-52 md:h-48 overflow-hidden">
          {event.imageLinkUrl && event.imageLinkUrl.trim() !== '' ? (
            <a href={event.imageLinkUrl} className="block w-full h-full" title={`External link to ${event.imageLinkUrl}`} target="_blank" rel="noopener noreferrer">
              <Image
                src={event.imageUrl}
                alt={event.title}
                width={400}
                height={250}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </a>
          ) : (
            <div className="block w-full h-full cursor-default">
              <Image
                src={event.imageUrl}
                alt={event.title}
                width={400}
                height={250}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
          )}
        </div>
      )}
        <div className="p-4 sm:p-6">
          {event.imageLinkUrl && event.imageLinkUrl.trim() !== '' ? (
            <a href={event.imageLinkUrl} className="block" title={`External link to ${event.imageLinkUrl}`} target="_blank" rel="noopener noreferrer">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 line-clamp-2 leading-tight hover:text-orange-600 transition-colors">{event.title}</h3>
            </a>
          ) : (
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 line-clamp-2 leading-tight">{event.title}</h3>
          )}
          <div className="flex items-center text-gray-600 mb-2 sm:mb-3">
            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm sm:text-base truncate">{event.location}</span>
          </div>
          <div className="flex items-center text-gray-600 mb-4">
            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
            </svg>
            <span className="text-sm sm:text-base">
              {new Date(event.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center text-gray-600 mb-4">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-sm">intelliglobalconferences@gmail.com</span>
          </div>
          <div className="flex space-x-3">
            {event.registerNowUrl && event.registerNowUrl.trim() !== '' ? (
              <a
                href={event.registerNowUrl}
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 text-sm text-center"
              >
                Register Now
              </a>
            ) : (
              <button
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 text-sm opacity-50 cursor-not-allowed"
                disabled

              >
                Register Now
              </button>
            )}

            {event.submitAbstractUrl && event.submitAbstractUrl.trim() !== '' ? (
              <a
                href={event.submitAbstractUrl}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm text-center"
              >
                Submit Abstract
              </a>
            ) : (
              <button
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm opacity-50 cursor-not-allowed"
                disabled

              >
                Submit Abstract
              </button>
            )}
          </div>
        </div>
      </div>
  );
}
