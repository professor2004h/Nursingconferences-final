'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrackName, TracksApiResponse } from '@/app/types/tracks';

const ConferenceTracksSection: React.FC = () => {
  const [tracks, setTracks] = useState<TrackName[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  // Number of tracks to show initially on homepage
  const INITIAL_DISPLAY_COUNT = 8;

  useEffect(() => {
    fetchTracks();
  }, []);

  const fetchTracks = async () => {
    try {
      setLoading(true);
      console.log('🎯 Fetching conference tracks for homepage...');
      
      const response = await fetch('/api/conference-tracks');
      const result: TracksApiResponse = await response.json();

      if (result.success) {
        setTracks(result.data);
        console.log(`✅ Loaded ${result.data.length} conference tracks`);
      } else {
        setError(result.error || 'Failed to fetch conference tracks');
        console.error('❌ API error:', result.error);
      }
    } catch (err) {
      const errorMessage = 'An error occurred while fetching conference tracks';
      setError(errorMessage);
      console.error('❌ Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Don't render anything if loading, error, or no tracks
  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading conference tracks...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || tracks.length === 0) {
    // Don't render the section if there are no tracks or an error
    return null;
  }

  // Determine which tracks to display
  const displayedTracks = showAll ? tracks : tracks.slice(0, INITIAL_DISPLAY_COUNT);
  const hasMoreTracks = tracks.length > INITIAL_DISPLAY_COUNT;

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-12">
          <span className="text-orange-500 font-semibold text-lg tracking-wide uppercase mb-4 block">
            Conference Sessions
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Conference
            <span className="block bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              Tracks
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore our diverse range of specialized tracks covering the latest developments and innovations in nursing practice, education, and research.
          </p>
        </div>

        {/* Toggle Controls */}
        {hasMoreTracks && (
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 rounded-lg p-1 inline-flex">
              <button
                onClick={() => setShowAll(false)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  !showAll
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Featured Tracks
              </button>
              <button
                onClick={() => setShowAll(true)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  showAll
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All Tracks ({tracks.length})
              </button>
            </div>
          </div>
        )}

        {/* Tracks Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-10 md:mb-12">
          {displayedTracks.map((track, index) => (
            <TrackCard key={track.value} track={track} index={index} />
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center">
          <Link
            href="/conference-sessions"
            className="inline-flex items-center bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg"
          >
            View All Conference Sessions
            <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Statistics */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">{tracks.length}+</div>
              <div className="text-gray-600 font-medium">Specialized Tracks</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">Expert</div>
              <div className="text-gray-600 font-medium">Session Leaders</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">Global</div>
              <div className="text-gray-600 font-medium">Perspectives</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Track Card Component
interface TrackCardProps {
  track: TrackName;
  index: number;
}

const TrackCard: React.FC<TrackCardProps> = ({ track, index }) => {
  // Generate a consistent color based on the track index
  const colors = [
    'from-blue-500 to-blue-600',
    'from-green-500 to-green-600',
    'from-purple-500 to-purple-600',
    'from-pink-500 to-pink-600',
    'from-indigo-500 to-indigo-600',
    'from-teal-500 to-teal-600',
    'from-red-500 to-red-600',
    'from-yellow-500 to-yellow-600',
  ];
  
  const colorClass = colors[index % colors.length];

  return (
    <div className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden">
      {/* Gradient Header */}
      <div className={`h-2 bg-gradient-to-r ${colorClass}`}></div>
      
      {/* Content */}
      <div className="p-4 md:p-6">
        <div className="flex items-start justify-between mb-3">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${colorClass} flex items-center justify-center flex-shrink-0`}>
            <span className="text-white font-bold text-sm">
              {track.label.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-500 font-medium">Track</span>
          </div>
        </div>
        
        <h3 className="font-semibold text-gray-900 text-sm md:text-base mb-2 line-clamp-2 min-h-[2.5rem] group-hover:text-orange-600 transition-colors duration-200 leading-tight">
          {track.label}
        </h3>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
            Session Available
          </span>
          <svg 
            className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors duration-200" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ConferenceTracksSection;
