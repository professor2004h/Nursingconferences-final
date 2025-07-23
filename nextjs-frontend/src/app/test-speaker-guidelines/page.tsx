'use client';

import React, { useState, useEffect } from 'react';
import { SpeakerGuidelines, SpeakerGuidelinesApiResponse, PopulateSpeakerGuidelinesResponse } from '@/app/types/speakerGuidelines';

const TestSpeakerGuidelinesPage: React.FC = () => {
  const [guidelines, setGuidelines] = useState<SpeakerGuidelines | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchGuidelines();
  }, []);

  const fetchGuidelines = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/speaker-guidelines');
      const result: SpeakerGuidelinesApiResponse = await response.json();
      
      if (result.success && result.data) {
        setGuidelines(result.data);
      } else {
        setError(result.error || 'Failed to fetch speaker guidelines');
      }
      
      console.log('Speaker Guidelines API Response:', result);
      
    } catch (err) {
      setError('An error occurred while fetching speaker guidelines');
      console.error('Error fetching guidelines:', err);
    } finally {
      setLoading(false);
    }
  };

  const populateGuidelines = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const response = await fetch('/api/populate-speaker-guidelines');
      const result: PopulateSpeakerGuidelinesResponse = await response.json();
      
      if (result.success) {
        setSuccess(result.message);
        await fetchGuidelines(); // Refresh the guidelines
      } else {
        setError(result.error || 'Failed to populate speaker guidelines');
      }
      
      console.log('Populate API Response:', result);
      
    } catch (err) {
      setError('An error occurred while populating speaker guidelines');
      console.error('Error populating guidelines:', err);
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
          <h1 className="text-3xl font-bold text-gray-900">Speaker Guidelines Test</h1>
          <p className="mt-2 text-gray-600">Testing the speaker guidelines functionality</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Guidelines Status</h3>
            <p className={`text-3xl font-bold ${guidelines ? 'text-green-600' : 'text-red-600'}`}>
              {guidelines ? 'Found' : 'Not Found'}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">API Status</h3>
            <p className={`text-3xl font-bold ${error ? 'text-red-600' : 'text-green-600'}`}>
              {error ? 'Error' : 'Success'}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Source</h3>
            <p className="text-sm font-bold text-orange-600">Sanity CMS</p>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Success</h3>
            <p className="text-green-600">{success}</p>
          </div>
        )}

        {/* Guidelines Overview */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Speaker Guidelines Overview</h3>
            <button
              onClick={populateGuidelines}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              {loading ? 'Populating...' : 'Populate Guidelines'}
            </button>
          </div>
          
          {guidelines ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Basic Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Title:</span> {guidelines.title}</div>
                    <div><span className="font-medium">Subtitle:</span> {guidelines.subtitle || 'Not set'}</div>
                    <div><span className="font-medium">Active:</span> {guidelines.isActive ? 'Yes' : 'No'}</div>
                    <div><span className="font-medium">Last Updated:</span> {guidelines.lastUpdated ? new Date(guidelines.lastUpdated).toLocaleDateString() : 'Not set'}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Content Sections</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-2 ${guidelines.speakerRequirements ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      Speaker Requirements ({guidelines.speakerRequirements?.requirements?.length || 0} items)
                    </div>
                    <div className="flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-2 ${guidelines.posterGuidelines ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      Poster Guidelines ({guidelines.posterGuidelines?.guidelines?.length || 0} items)
                    </div>
                    <div className="flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-2 ${guidelines.presentationRequirements ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      Presentation Requirements ({guidelines.presentationRequirements?.requirements?.length || 0} items)
                    </div>
                    <div className="flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-2 ${guidelines.virtualGuidelines ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      Virtual Guidelines ({guidelines.virtualGuidelines?.guidelines?.length || 0} items)
                    </div>
                    <div className="flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-2 ${guidelines.certificationInfo ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      Certification Info ({guidelines.certificationInfo?.information?.length || 0} items)
                    </div>
                    <div className="flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-2 ${guidelines.contactInformation ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      Contact Information
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information Preview */}
              {guidelines.contactInformation && (
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {guidelines.contactInformation.programEnquiry && (
                      <div>
                        <span className="font-medium">Program Enquiry:</span>
                        <br />
                        <a href={`mailto:${guidelines.contactInformation.programEnquiry}`} className="text-blue-600 hover:text-blue-800">
                          {guidelines.contactInformation.programEnquiry}
                        </a>
                      </div>
                    )}
                    {guidelines.contactInformation.generalQueries && (
                      <div>
                        <span className="font-medium">General Queries:</span>
                        <br />
                        <a href={`mailto:${guidelines.contactInformation.generalQueries}`} className="text-blue-600 hover:text-blue-800">
                          {guidelines.contactInformation.generalQueries}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500">No speaker guidelines found. Click "Populate Guidelines" to create them.</p>
          )}
        </div>

        {/* API Response */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">API Response Details</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Speaker Guidelines API (/api/speaker-guidelines)</h4>
              <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-64">
                {JSON.stringify({ 
                  success: !!guidelines, 
                  hasData: !!guidelines,
                  title: guidelines?.title,
                  sectionsCount: guidelines ? Object.keys(guidelines).filter(key => 
                    key.includes('Requirements') || key.includes('Guidelines') || key.includes('Info')
                  ).length : 0
                }, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Test Navigation</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href="/speaker-guidelines"
              className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm text-center"
            >
              View Guidelines Page
            </a>
            <a
              href="/admin/speaker-guidelines"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm text-center"
            >
              Admin Management
            </a>
            <a
              href="/api/speaker-guidelines"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm text-center"
            >
              View API Response
            </a>
            <a
              href="http://localhost:3333/structure/speakerGuidelines"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded text-sm text-center"
            >
              Sanity Studio
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestSpeakerGuidelinesPage;
