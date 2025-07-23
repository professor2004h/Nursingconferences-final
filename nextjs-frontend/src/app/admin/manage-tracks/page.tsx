'use client';

import React, { useState, useEffect } from 'react';
import { TrackName, TracksApiResponse } from '@/app/types/tracks';

const ManageTracksPage: React.FC = () => {
  const [tracks, setTracks] = useState<TrackName[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchTracks();
  }, []);

  const fetchTracks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/conference-tracks');
      const result: TracksApiResponse = await response.json();
      
      if (result.success) {
        setTracks(result.data);
      } else {
        setError(result.error || 'Failed to fetch tracks');
      }
    } catch (err) {
      setError('An error occurred while fetching tracks');
      console.error('Error fetching tracks:', err);
    } finally {
      setLoading(false);
    }
  };

  const populateDefaultTracks = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const response = await fetch('/api/populate-sanity-options');
      const result = await response.json();
      
      if (response.ok) {
        setSuccess('Successfully populated default tracks!');
        await fetchTracks(); // Refresh the tracks list
      } else {
        setError('Failed to populate tracks');
      }
    } catch (err) {
      setError('An error occurred while populating tracks');
      console.error('Error populating tracks:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Conference Tracks</h1>
              <p className="mt-2 text-gray-600">Manage track names for the conference sessions</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={populateDefaultTracks}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                {loading ? 'Populating...' : 'Populate Default Tracks'}
              </button>
              <a
                href="http://localhost:3333/structure/abstractSubmissionSystem;abstractSettings"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Edit in Sanity Studio
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Status Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <svg className="w-5 h-5 text-green-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Success</h3>
                <p className="text-sm text-green-700 mt-1">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Tracks</h3>
            <p className="text-3xl font-bold text-blue-600">{tracks.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Source</h3>
            <p className="text-sm font-bold text-orange-600">Abstract Settings</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Status</h3>
            <p className={`text-sm font-bold ${tracks.length > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {tracks.length > 0 ? 'Active' : 'No Tracks'}
            </p>
          </div>
        </div>

        {/* Tracks List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Conference Tracks ({tracks.length})</h3>
            <p className="text-sm text-gray-600 mt-1">
              These tracks are displayed on the homepage and conference sessions page
            </p>
          </div>
          
          {tracks.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {tracks.map((track, index) => (
                <div key={track.value} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{track.label}</h4>
                        <p className="text-sm text-gray-500">Value: {track.value}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No tracks found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Click "Populate Default Tracks" to add default conference tracks.
              </p>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">How to Manage Tracks</h3>
          <div className="space-y-3 text-sm text-blue-800">
            <div className="flex items-start space-x-2">
              <span className="font-medium">1.</span>
              <span>Use "Populate Default Tracks" to add the default set of nursing conference tracks</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-medium">2.</span>
              <span>Click "Edit in Sanity Studio" to add, edit, or remove individual tracks</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-medium">3.</span>
              <span>Changes in Sanity Studio will automatically appear on the homepage and conference sessions page</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-medium">4.</span>
              <span>Each track needs both a "value" (URL-friendly) and "label" (display name)</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-center space-x-4">
          <a
            href="/"
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            View Homepage
          </a>
          <a
            href="/conference-sessions"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            View Conference Sessions
          </a>
          <a
            href="/test-tracks"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Test Page
          </a>
        </div>
      </div>
    </div>
  );
};

export default ManageTracksPage;
