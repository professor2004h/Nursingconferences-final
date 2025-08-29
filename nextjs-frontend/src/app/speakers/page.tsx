'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Speaker, SpeakerApiResponse, SPEAKER_CATEGORIES, SPEAKER_CATEGORY_DESCRIPTIONS } from '@/app/types/speakers';
import SpeakerModal from '@/app/components/SpeakerModal';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import ErrorBoundary from '@/app/components/ErrorBoundary';

const SpeakersPage: React.FC = () => {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchSpeakers();
  }, []);

  const fetchSpeakers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/speakers');
      const result: SpeakerApiResponse = await response.json();

      if (result.success) {
        setSpeakers(result.data);
      } else {
        setError(result.error || 'Failed to fetch speakers');
      }
    } catch (err) {
      setError('An error occurred while fetching speakers');
      console.error('Error fetching speakers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = (speaker: Speaker) => {
    console.log('Opening modal for speaker:', speaker);

    // Validate speaker data before opening modal
    if (!speaker || !speaker.name || !speaker.title) {
      console.error('Invalid speaker data:', speaker);
      setError('Unable to load speaker profile. Invalid data received.');
      return;
    }

    setSelectedSpeaker(speaker);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSpeaker(null);
  };

  // Filter speakers by category
  const filteredSpeakers = selectedCategory === 'all' 
    ? speakers 
    : speakers.filter(speaker => speaker.speakerCategory === selectedCategory);

  // Group speakers by category for display
  const speakersByCategory = speakers.reduce((acc, speaker) => {
    if (!acc[speaker.speakerCategory]) {
      acc[speaker.speakerCategory] = [];
    }
    acc[speaker.speakerCategory].push(speaker);
    return acc;
  }, {} as Record<string, Speaker[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Simple Header */}
        <div className="bg-white border-b border-gray-200 py-12 mt-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2 sm:whitespace-nowrap leading-tight">CONFERENCE SPEAKERS</h1>
          </div>
        </div>
        <div className="container mx-auto px-4 py-16">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Simple Header */}
        <div className="bg-white border-b border-gray-200 py-12 mt-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2 sm:whitespace-nowrap leading-tight">CONFERENCE SPEAKERS</h1>
          </div>
        </div>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
            <button
              onClick={fetchSpeakers}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <div className="bg-white border-b border-gray-200 py-12 mt-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2 sm:whitespace-nowrap leading-tight">CONFERENCE SPEAKERS</h1>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Speakers ({speakers.length})
            </button>
            {Object.entries(SPEAKER_CATEGORIES).map(([key, label]) => {
              const count = speakersByCategory[key]?.length || 0;
              if (count === 0) return null;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {label} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Speakers Grid */}
      <div className="container mx-auto px-4 py-16">
        {filteredSpeakers.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-600 mb-4">
              {selectedCategory === 'all' ? 'No Speakers Found' : `No ${SPEAKER_CATEGORIES[selectedCategory]} Found`}
            </h2>
            <p className="text-gray-500">
              {selectedCategory === 'all' 
                ? 'Speakers will be displayed here once they are added to the system.'
                : 'Try selecting a different category or view all speakers.'
              }
            </p>
            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition-colors"
              >
                View All Speakers
              </button>
            )}
          </div>
        ) : (
          <>
            {selectedCategory === 'all' ? (
              // Show speakers grouped by category
              Object.entries(speakersByCategory).map(([category, categorySpeakers]) => (
                <div key={category} className="mb-12">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      {SPEAKER_CATEGORIES[category]}
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                      {SPEAKER_CATEGORY_DESCRIPTIONS[category]}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
                    {categorySpeakers.map((speaker) => (
                      <SpeakerCard
                        key={speaker._id}
                        speaker={speaker}
                        onViewProfile={handleViewProfile}
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              // Show filtered speakers
              <>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {SPEAKER_CATEGORIES[selectedCategory]}
                  </h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    {SPEAKER_CATEGORY_DESCRIPTIONS[selectedCategory]}
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
                  {filteredSpeakers.map((speaker) => (
                    <SpeakerCard
                      key={speaker._id}
                      speaker={speaker}
                      onViewProfile={handleViewProfile}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Speaker Modal */}
      {selectedSpeaker && (
        <ErrorBoundary
          fallback={
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={closeModal} />
              <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                  <h3 className="text-lg font-semibold text-red-600 mb-2">Modal Error</h3>
                  <p className="text-gray-600 mb-4">
                    Unable to display the speaker profile. There may be an issue with the data or component.
                  </p>
                  <button
                    onClick={closeModal}
                    className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          }
        >
          <SpeakerModal
            speaker={selectedSpeaker}
            isOpen={isModalOpen}
            onClose={closeModal}
          />
        </ErrorBoundary>
      )}
    </div>
  );
};

// Speaker Card Component
interface SpeakerCardProps {
  speaker: Speaker;
  onViewProfile: (speaker: Speaker) => void;
}

const SpeakerCard: React.FC<SpeakerCardProps> = ({ speaker, onViewProfile }) => {
  const defaultImage = '/images/default-profile.svg';

  // Validate speaker data
  if (!speaker || !speaker.name) {
    console.error('SpeakerCard: Invalid speaker data', speaker);
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600 text-sm">Invalid speaker data</p>
      </div>
    );
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      keynote: 'bg-purple-500',
      invited: 'bg-blue-500',
      plenary: 'bg-green-500',
      session: 'bg-orange-500',
      workshop: 'bg-teal-500',
      moderator: 'bg-indigo-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        <Image
          src={speaker.profileImageUrl || defaultImage}
          alt={`${speaker.name} profile photo`}
          width={300}
          height={400}
          className="w-full h-48 sm:h-56 lg:h-80 object-cover object-top"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          onError={(e) => {
            console.warn('Failed to load image for', speaker.name);
            const target = e.target as HTMLImageElement;
            target.src = defaultImage;
          }}
        />
      </div>
      <div className="p-3 sm:p-4">
        <h3 className="font-semibold text-sm sm:text-lg text-gray-900 mb-2 line-clamp-2">
          {speaker.name}
        </h3>

        {/* Speaker Category Tags - moved below name */}
        <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3">
          <div className={`${getCategoryColor(speaker.speakerCategory)} text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-semibold`}>
            {speaker.speakerCategory.charAt(0).toUpperCase() + speaker.speakerCategory.slice(1)}
          </div>
          {speaker.isKeynote && (
            <div className="bg-yellow-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-semibold">
              Keynote
            </div>
          )}
        </div>

        <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 line-clamp-2">
          {speaker.institution}
        </p>

        <button
          onClick={() => onViewProfile(speaker)}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-1.5 sm:py-2 px-3 sm:px-4 rounded-md transition-colors duration-200 text-xs sm:text-sm font-medium shadow-sm hover:shadow-md"
        >
          View Profile
        </button>
      </div>
    </div>
  );
};

export default SpeakersPage;
