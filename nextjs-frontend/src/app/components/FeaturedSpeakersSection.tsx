'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Speaker, SpeakerApiResponse, SPEAKER_CATEGORIES } from '@/app/types/speakers';

interface SpeakerCardProps {
  speaker: Speaker;
  onViewProfile: (speaker: Speaker) => void;
}

const SpeakerCard: React.FC<SpeakerCardProps> = ({ speaker, onViewProfile }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <div className="relative">
        {speaker.profileImageUrl ? (
          <Image
            src={speaker.profileImageUrl}
            alt={speaker.name}
            width={300}
            height={300}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                {speaker.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </span>
            </div>
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            {SPEAKER_CATEGORIES[speaker.speakerCategory]}
          </span>
        </div>
        
        {/* Keynote Badge */}
        {speaker.isKeynote && (
          <div className="absolute top-3 right-3">
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              Keynote
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-2">
          {speaker.name}
        </h3>
        <p className="text-orange-600 font-medium text-sm mb-2">
          {speaker.title}
        </p>
        <p className="text-gray-600 text-sm mb-3">
          {speaker.institution}
        </p>
        
        {speaker.sessionTitle && (
          <p className="text-gray-700 text-sm mb-3 line-clamp-2">
            <span className="font-medium">Session:</span> {speaker.sessionTitle}
          </p>
        )}
        
        <button
          onClick={() => onViewProfile(speaker)}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition-colors duration-300 text-sm font-medium"
        >
          View Profile
        </button>
      </div>
    </div>
  );
};

const FeaturedSpeakersSection: React.FC = () => {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchSpeakers();
  }, []);

  const fetchSpeakers = async () => {
    try {
      setLoading(true);
      console.log('🎤 Fetching speakers for Featured Speakers section...');
      
      const response = await fetch('/api/speakers');
      const result: SpeakerApiResponse = await response.json();

      if (result.success) {
        setSpeakers(result.data);
        console.log(`✅ Loaded ${result.data.length} speakers`);
      } else {
        setError(result.error || 'Failed to fetch speakers');
        console.error('❌ API error:', result.error);
      }
    } catch (err) {
      const errorMessage = 'An error occurred while fetching speakers';
      setError(errorMessage);
      console.error('❌ Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = (speaker: Speaker) => {
    setSelectedSpeaker(speaker);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSpeaker(null);
  };

  // Group speakers by category
  const speakersByCategory = speakers.reduce((acc, speaker) => {
    if (!acc[speaker.speakerCategory]) {
      acc[speaker.speakerCategory] = [];
    }
    acc[speaker.speakerCategory].push(speaker);
    return acc;
  }, {} as Record<string, Speaker[]>);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading speakers...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchSpeakers}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <p className="text-orange-500 font-semibold text-sm uppercase tracking-wider mb-2">
              OUR DISTINGUISHED SPEAKERS
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured
              <span className="text-orange-500 ml-2">Committee Members</span>
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Meet our distinguished speakers and thought leaders who will share their expertise and insights at our conference.
            </p>
          </div>

          {/* Speakers by Category */}
          {Object.entries(speakersByCategory).map(([category, categorySpeakers]) => (
            <div key={category} className="mb-16">
              {/* Category Header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {SPEAKER_CATEGORIES[category]}
                </h3>
                <div className="w-24 h-1 bg-orange-500 mx-auto"></div>
              </div>

              {/* Speakers Grid - 4 columns on PC, 2 columns on mobile */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
                {categorySpeakers.map((speaker) => (
                  <SpeakerCard
                    key={speaker._id}
                    speaker={speaker}
                    onViewProfile={handleViewProfile}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* View All Button */}
          <div className="text-center mt-12">
            <a
              href="/speakers"
              className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              View All Speakers
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Speaker Modal */}
      {isModalOpen && selectedSpeaker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{selectedSpeaker.name}</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  {selectedSpeaker.profileImageUrl ? (
                    <Image
                      src={selectedSpeaker.profileImageUrl}
                      alt={selectedSpeaker.name}
                      width={300}
                      height={300}
                      className="w-full h-auto rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                      <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-2xl">
                          {selectedSpeaker.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <p className="text-orange-600 font-medium mb-2">{selectedSpeaker.title}</p>
                  <p className="text-gray-600 mb-4">{selectedSpeaker.institution}</p>
                  
                  {selectedSpeaker.sessionTitle && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-1">Session Title:</h4>
                      <p className="text-gray-700">{selectedSpeaker.sessionTitle}</p>
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Biography:</h4>
                    <p className="text-gray-700 leading-relaxed">{selectedSpeaker.bio}</p>
                  </div>
                  
                  {selectedSpeaker.specialization && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-1">Specialization:</h4>
                      <p className="text-gray-700">{selectedSpeaker.specialization}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FeaturedSpeakersSection;
