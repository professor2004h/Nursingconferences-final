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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-orange-400 font-semibold text-lg tracking-wide uppercase mb-4 block">
              Conference Sessions
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              All Conference
              <span className="block bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                Tracks
              </span>
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Discover all {tracks.length} specialized tracks covering every aspect of nursing practice, education, and research.
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

        {/* Tracks Grid */}
        {filteredTracks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTracks.map((track, index) => (
              <TrackCard key={track.value} track={track} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tracks found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search terms or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Track Card Component (reused from homepage component)
interface TrackCardProps {
  track: TrackName;
  index: number;
}

const TrackCard: React.FC<TrackCardProps> = ({ track, index }) => {
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
      <div className={`h-2 bg-gradient-to-r ${colorClass}`}></div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${colorClass} flex items-center justify-center flex-shrink-0`}>
            <span className="text-white font-bold">
              {track.label.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-500 font-medium">Track</span>
          </div>
        </div>
        
        <h3 className="font-semibold text-gray-900 text-base mb-3 line-clamp-2 min-h-[3rem] group-hover:text-orange-600 transition-colors duration-200">
          {track.label}
        </h3>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
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

export default ConferenceSessionsPage;
