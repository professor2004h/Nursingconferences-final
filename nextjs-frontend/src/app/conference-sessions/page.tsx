'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrackName, TracksApiResponse } from '@/app/types/tracks';

const ConferenceSessionsPage: React.FC = () => {
  const [tracks, setTracks] = useState<TrackName[]>([]);
  const [filteredTracks, setFilteredTracks] = useState<TrackName[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchTracks();
  }, []);

  useEffect(() => {
    filterTracks();
  }, [tracks, searchTerm, selectedCategory]);

  const fetchTracks = async () => {
    try {
      setLoading(true);
      console.log('🎯 Fetching all conference tracks...');
      
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

  const filterTracks = () => {
    let filtered = tracks;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(track =>
        track.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        track.value.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category (basic categorization based on keywords)
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(track => {
        const label = track.label.toLowerCase();
        switch (selectedCategory) {
          case 'clinical':
            return label.includes('clinical') || label.includes('practice') || label.includes('care');
          case 'education':
            return label.includes('education') || label.includes('teaching') || label.includes('learning');
          case 'research':
            return label.includes('research') || label.includes('evidence') || label.includes('innovation');
          case 'specialty':
            return label.includes('cardiac') || label.includes('mental') || label.includes('pediatric') || 
                   label.includes('geriatric') || label.includes('oncology') || label.includes('emergency');
          default:
            return true;
        }
      });
    }

    setFilteredTracks(filtered);
  };

  const categories = [
    { value: 'all', label: 'All Tracks', count: tracks.length },
    { value: 'clinical', label: 'Clinical Practice', count: tracks.filter(t => t.label.toLowerCase().includes('clinical') || t.label.toLowerCase().includes('practice') || t.label.toLowerCase().includes('care')).length },
    { value: 'education', label: 'Education', count: tracks.filter(t => t.label.toLowerCase().includes('education') || t.label.toLowerCase().includes('teaching')).length },
    { value: 'research', label: 'Research', count: tracks.filter(t => t.label.toLowerCase().includes('research') || t.label.toLowerCase().includes('evidence')).length },
    { value: 'specialty', label: 'Specialty Areas', count: tracks.filter(t => t.label.toLowerCase().includes('cardiac') || t.label.toLowerCase().includes('mental') || t.label.toLowerCase().includes('pediatric')).length },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4">Loading conference sessions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Conference Sessions</h1>
            <p className="text-xl text-red-300">Error loading tracks: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Scientific Session
            </h1>
            <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Below are the scientific sessions of the conference
            </p>
          </div>

          {/* Breadcrumb */}
          <nav className="flex justify-center" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link href="/" className="text-blue-200 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-blue-100 ml-1 md:ml-2">Conference Sessions</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Tracks
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  placeholder="Search by track name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Category Filter */}
            <div className="lg:w-64">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Category
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label} ({category.count})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing {filteredTracks.length} of {tracks.length} tracks
              {searchTerm && (
                <span className="ml-2">
                  for "<span className="font-medium text-gray-900">{searchTerm}</span>"
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Sessions Grid */}
        {filteredTracks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTracks.map((track, index) => (
              <SessionCard key={track.value} track={track} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-white">No sessions found</h3>
            <p className="mt-1 text-sm text-slate-300">
              Please check back later for session updates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Session Card Component
interface SessionCardProps {
  track: TrackName;
  index: number;
}

const SessionCard: React.FC<SessionCardProps> = ({ track, index }) => {
  return (
    <div className="bg-slate-600/50 backdrop-blur-sm rounded-xl border border-slate-500/30 hover:bg-slate-500/50 transition-all duration-300 overflow-hidden group cursor-pointer">
      <div className="p-4 flex items-center space-x-3">
        {/* Session Number */}
        <div className="bg-white rounded-lg px-3 py-2 flex-shrink-0">
          <span className="text-slate-800 font-medium text-sm">
            Session {index + 1}
          </span>
        </div>

        {/* Session Title */}
        <div className="flex-1">
          <h3 className="text-white font-medium text-sm md:text-base leading-tight group-hover:text-slate-200 transition-colors duration-200">
            {track.label}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default ConferenceSessionsPage;
