'use client';

import React, { useState, useEffect } from 'react';
import { TrackName, TracksApiResponse } from '@/app/types/tracks';
import ConferenceTracksSection from '@/app/components/ConferenceTracksSection';

const TestTracksPage: React.FC = () => {
  const [tracks, setTracks] = useState<TrackName[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      
      console.log('Tracks API Response:', result);
      
    } catch (err) {
      setError('An error occurred while fetching tracks');
      console.error('Error fetching tracks:', err);
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
          <h1 className="text-3xl font-bold text-gray-900">Conference Tracks Test</h1>
          <p className="mt-2 text-gray-600">Testing the conference tracks functionality</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Tracks</h3>
            <p className="text-3xl font-bold text-blue-600">{tracks.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">API Status</h3>
            <p className={`text-3xl font-bold ${error ? 'text-red-600' : 'text-green-600'}`}>
              {error ? 'Error' : 'Success'}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Source</h3>
            <p className="text-sm font-bold text-orange-600">Abstract Settings</p>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Tracks List */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">All Conference Tracks</h3>
          {tracks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tracks.map((track, index) => (
                <div key={track.value} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      Track
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">{track.label}</h4>
                  <p className="text-sm text-gray-600">Value: {track.value}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No tracks found.</p>
          )}
        </div>

        {/* API Response */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">API Response Details</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Conference Tracks API (/api/conference-tracks)</h4>
              <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-64">
                {JSON.stringify({ 
                  success: !error, 
                  count: tracks.length, 
                  tracks: tracks.slice(0, 5),
                  ...(tracks.length > 5 && { note: `... and ${tracks.length - 5} more tracks` })
                }, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Test Navigation</h3>
          <div className="space-x-4">
            <a
              href="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
            >
              View Homepage
            </a>
            <a
              href="/conference-sessions"
              className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
            >
              Conference Sessions Page
            </a>
            <a
              href="/api/conference-tracks"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm"
            >
              View API Response
            </a>
            <a
              href="http://localhost:3333/structure/abstractSubmissionSystem;abstractSettings"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded text-sm"
            >
              Sanity Studio
            </a>
          </div>
        </div>
      </div>

      {/* Component Preview */}
      <div className="mb-8">
        <div className="max-w-7xl mx-auto px-4 mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Component Preview</h2>
          <p className="text-gray-600">This is how the component will appear on the homepage:</p>
        </div>
        <ConferenceTracksSection />
      </div>
    </div>
  );
};

export default TestTracksPage;
