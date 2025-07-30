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
  const INITIAL_DISPLAY_COUNT = 9;

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
    <section className="py-12 md:py-16 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Scientific Session
          </h2>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Below are the scientific sessions of the conference
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

        {/* Sessions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 md:mb-12">
          {displayedTracks.map((track, index) => (
            <SessionCard key={track.value} track={track} index={index} />
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center">
          <Link
            href="/conference-sessions"
            className="inline-flex items-center bg-white text-slate-800 px-8 py-4 rounded-xl font-semibold hover:bg-slate-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg"
          >
            View All Scientific Sessions
            <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>


      </div>
    </section>
  );
};

// Session Card Component
interface SessionCardProps {
  track: TrackName;
  index: number;
}

const SessionCard: React.FC<SessionCardProps> = ({ track, index }) => {
  return (
    <div className="bg-slate-600/50 backdrop-blur-sm rounded-2xl border border-slate-500/30 hover:bg-slate-500/50 transition-all duration-300 overflow-hidden group cursor-pointer">
      <div className="p-6 flex items-center space-x-4">
        {/* Session Number */}
        <div className="bg-white rounded-xl px-4 py-3 flex-shrink-0">
          <span className="text-slate-800 font-semibold text-lg">
            Session {index + 1}
          </span>
        </div>

        {/* Session Title */}
        <div className="flex-1">
          <h3 className="text-white font-medium text-lg leading-tight group-hover:text-slate-200 transition-colors duration-200">
            {track.label}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default ConferenceTracksSection;
