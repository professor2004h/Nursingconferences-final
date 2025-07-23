'use client';

import React, { useState, useEffect } from 'react';
import { SpeakerGuidelines, SpeakerGuidelinesApiResponse, PopulateSpeakerGuidelinesResponse } from '@/app/types/speakerGuidelines';

const AdminSpeakerGuidelinesPage: React.FC = () => {
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
    } catch (err) {
      setError('An error occurred while populating speaker guidelines');
      console.error('Error populating guidelines:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
              <h1 className="text-3xl font-bold text-gray-900">Speaker Guidelines Management</h1>
              <p className="mt-2 text-gray-600">Manage speaker guidelines content and settings</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={populateGuidelines}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                {loading ? 'Populating...' : 'Populate Default Guidelines'}
              </button>
              <a
                href="http://localhost:3333/structure/speakerGuidelines"
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Status</h3>
            <p className={`text-sm font-bold ${guidelines ? 'text-green-600' : 'text-red-600'}`}>
              {guidelines ? 'Active' : 'Not Found'}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Last Updated</h3>
            <p className="text-sm text-gray-600">{formatDate(guidelines?.lastUpdated)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sections</h3>
            <p className="text-2xl font-bold text-blue-600">
              {guidelines ? Object.keys(guidelines).filter(key => 
                key.includes('Requirements') || key.includes('Guidelines') || key.includes('Info')
              ).length : 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Source</h3>
            <p className="text-sm font-bold text-orange-600">Sanity CMS</p>
          </div>
        </div>

        {/* Guidelines Overview */}
        {guidelines ? (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Guidelines Overview</h3>
              <p className="text-sm text-gray-600 mt-1">Current speaker guidelines content</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Basic Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Title:</span> {guidelines.title}</div>
                    <div><span className="font-medium">Subtitle:</span> {guidelines.subtitle || 'Not set'}</div>
                    <div><span className="font-medium">Active:</span> {guidelines.isActive ? 'Yes' : 'No'}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Content Sections</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-2 ${guidelines.speakerRequirements ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      Speaker Requirements
                    </div>
                    <div className="flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-2 ${guidelines.posterGuidelines ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      Poster Guidelines
                    </div>
                    <div className="flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-2 ${guidelines.presentationRequirements ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      Presentation Requirements
                    </div>
                    <div className="flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-2 ${guidelines.virtualGuidelines ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      Virtual Guidelines
                    </div>
                    <div className="flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-2 ${guidelines.certificationInfo ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      Certification Info
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
                <div className="mt-6 pt-6 border-t border-gray-200">
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
                    {guidelines.contactInformation.technicalSupport && (
                      <div>
                        <span className="font-medium">Technical Support:</span>
                        <br />
                        <a href={`mailto:${guidelines.contactInformation.technicalSupport}`} className="text-blue-600 hover:text-blue-800">
                          {guidelines.contactInformation.technicalSupport}
                        </a>
                      </div>
                    )}
                    {guidelines.contactInformation.phone && (
                      <div>
                        <span className="font-medium">Phone:</span>
                        <br />
                        <a href={`tel:${guidelines.contactInformation.phone}`} className="text-blue-600 hover:text-blue-800">
                          {guidelines.contactInformation.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No speaker guidelines found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Click "Populate Default Guidelines" to create the speaker guidelines.
            </p>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">How to Manage Speaker Guidelines</h3>
          <div className="space-y-3 text-sm text-blue-800">
            <div className="flex items-start space-x-2">
              <span className="font-medium">1.</span>
              <span>Use "Populate Default Guidelines" to create the initial speaker guidelines with comprehensive content</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-medium">2.</span>
              <span>Click "Edit in Sanity Studio" to customize content, add sections, or update information</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-medium">3.</span>
              <span>Changes in Sanity Studio will automatically appear on the speaker guidelines page</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-medium">4.</span>
              <span>Use rich text fields for detailed content and structured fields for contact information</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-center space-x-4">
          <a
            href="/speaker-guidelines"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            View Speaker Guidelines Page
          </a>
          <a
            href="/api/speaker-guidelines"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            View API Response
          </a>
          <a
            href="/"
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Back to Homepage
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminSpeakerGuidelinesPage;
