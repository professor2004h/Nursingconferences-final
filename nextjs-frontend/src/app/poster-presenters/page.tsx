'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { PosterPresenter, PosterPresentersApiResponse } from '@/app/types/posterPresenters';
import PosterPresenterModal from '@/app/components/PosterPresenterModal';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import ErrorBoundary from '@/app/components/ErrorBoundary';

const PosterPresentersPage: React.FC = () => {
  const [posterPresenters, setPosterPresenters] = useState<PosterPresenter[]>([]);
  const [filteredPresenters, setFilteredPresenters] = useState<PosterPresenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPresenter, setSelectedPresenter] = useState<PosterPresenter | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResearchArea, setSelectedResearchArea] = useState('');
  const [selectedSessionTrack, setSelectedSessionTrack] = useState('');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  // Derived data for filters
  const [researchAreas, setResearchAreas] = useState<string[]>([]);
  const [sessionTracks, setSessionTracks] = useState<string[]>([]);

  useEffect(() => {
    fetchPosterPresenters();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [posterPresenters, searchQuery, selectedResearchArea, selectedSessionTrack, showFeaturedOnly]);

  const fetchPosterPresenters = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📋 Fetching poster presenters...');
      
      const response = await fetch('/api/poster-presenters');
      const result: PosterPresentersApiResponse = await response.json();

      if (result.success && result.data) {
        setPosterPresenters(result.data);
        
        // Extract unique research areas and session tracks for filters
        const uniqueResearchAreas = [...new Set(result.data.map(p => p.researchArea).filter(Boolean))];
        const uniqueSessionTracks = [...new Set(result.data.map(p => p.sessionTrack).filter(Boolean))];
        
        setResearchAreas(uniqueResearchAreas);
        setSessionTracks(uniqueSessionTracks);
        
        console.log(`✅ Successfully loaded ${result.data.length} poster presenters`);
      } else {
        setError(result.error || 'Failed to fetch poster presenters');
        console.error('❌ API error:', result.error);
      }
    } catch (err) {
      const errorMessage = 'An error occurred while fetching poster presenters';
      setError(errorMessage);
      console.error('❌ Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...posterPresenters];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(presenter =>
        presenter.name.toLowerCase().includes(query) ||
        presenter.posterTitle.toLowerCase().includes(query) ||
        presenter.institution.toLowerCase().includes(query) ||
        presenter.researchArea.toLowerCase().includes(query)
      );
    }

    // Research area filter
    if (selectedResearchArea) {
      filtered = filtered.filter(presenter => presenter.researchArea === selectedResearchArea);
    }

    // Session track filter
    if (selectedSessionTrack) {
      filtered = filtered.filter(presenter => presenter.sessionTrack === selectedSessionTrack);
    }

    // Featured filter
    if (showFeaturedOnly) {
      filtered = filtered.filter(presenter => presenter.isFeatured);
    }

    setFilteredPresenters(filtered);
  };

  const handleViewProfile = (presenter: PosterPresenter) => {
    setSelectedPresenter(presenter);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPresenter(null);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedResearchArea('');
    setSelectedSessionTrack('');
    setShowFeaturedOnly(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Poster Presenters</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={fetchPosterPresenters}
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
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">POSTER PRESENTERS</h1>
          <p className="text-xl text-blue-100 mb-6 max-w-3xl mx-auto">
            Discover innovative research and groundbreaking findings from our talented poster presenters
          </p>
          <nav className="text-sm">
            <span className="text-blue-200">Home</span>
            <span className="mx-2">»</span>
            <span>Poster Presenters</span>
          </nav>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search presenters, titles, institutions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Research Area Filter */}
              <select
                value={selectedResearchArea}
                onChange={(e) => setSelectedResearchArea(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Research Areas</option>
                {researchAreas.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>

              {/* Session Track Filter */}
              <select
                value={selectedSessionTrack}
                onChange={(e) => setSelectedSessionTrack(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Session Tracks</option>
                {sessionTracks.map(track => (
                  <option key={track} value={track}>
                    {track.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>

              {/* Featured Toggle */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showFeaturedOnly}
                  onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Featured Only</span>
              </label>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {filteredPresenters.length} of {posterPresenters.length} presenters
              </span>
              {(searchQuery || selectedResearchArea || selectedSessionTrack || showFeaturedOnly) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Poster Presenters Grid */}
      <div className="container mx-auto px-4 py-16">
        {filteredPresenters.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-semibold text-gray-600 mb-4">
              {posterPresenters.length === 0 ? 'No Poster Presenters Found' : 'No Results Found'}
            </h2>
            <p className="text-gray-500 mb-6">
              {posterPresenters.length === 0 
                ? 'Poster presenters will be displayed here once they are added to the system.'
                : 'Try adjusting your search criteria or clearing the filters.'
              }
            </p>
            {posterPresenters.length > 0 && (
              <button
                onClick={clearFilters}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPresenters.map((presenter) => (
              <PosterPresenterCard
                key={presenter._id}
                presenter={presenter}
                onViewProfile={handleViewProfile}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedPresenter && (
        <ErrorBoundary
          fallback={
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg">
                <p className="text-red-600">Error loading presenter details</p>
                <button onClick={closeModal} className="mt-4 bg-gray-500 text-white px-4 py-2 rounded">
                  Close
                </button>
              </div>
            </div>
          }
        >
          <PosterPresenterModal
            presenter={selectedPresenter}
            isOpen={isModalOpen}
            onClose={closeModal}
          />
        </ErrorBoundary>
      )}
    </div>
  );
};

// Poster Presenter Card Component
interface PosterPresenterCardProps {
  presenter: PosterPresenter;
  onViewProfile: (presenter: PosterPresenter) => void;
}

const PosterPresenterCard: React.FC<PosterPresenterCardProps> = ({ presenter, onViewProfile }) => {
  const defaultImage = '/images/default-profile.svg';

  // Validate presenter data
  if (!presenter || !presenter.name) {
    console.error('PosterPresenterCard: Invalid presenter data', presenter);
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600 text-sm">Invalid presenter data</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative aspect-square">
        <Image
          src={presenter.profileImageUrl || defaultImage}
          alt={`${presenter.name} profile photo`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          onError={(e) => {
            console.warn('Failed to load image for', presenter.name);
            const target = e.target as HTMLImageElement;
            target.src = defaultImage;
          }}
        />
        {presenter.isFeatured && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-md">
            Featured
          </div>
        )}
        {presenter.sessionTrack && (
          <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-md">
            {presenter.sessionTrack.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2 min-h-[2.5rem]">
          {presenter.name}
        </h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2 min-h-[2.5rem]">
          {presenter.title}
        </p>
        <p className="text-sm text-gray-500 mb-2 line-clamp-2 min-h-[2.5rem]">
          {presenter.institution}
        </p>
        <p className="text-sm text-blue-600 font-medium mb-2 line-clamp-1">
          {presenter.researchArea}
        </p>
        <p className="text-xs text-gray-600 mb-3 line-clamp-2 min-h-[2rem]">
          {presenter.posterTitle}
        </p>
        <button
          onClick={() => onViewProfile(presenter)}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md transition-colors duration-200 text-sm font-medium shadow-sm hover:shadow-md"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default PosterPresentersPage;
