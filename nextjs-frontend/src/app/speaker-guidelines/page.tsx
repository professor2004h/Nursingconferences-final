'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';
import { SpeakerGuidelines, SpeakerGuidelinesApiResponse } from '@/app/types/speakerGuidelines';

const SpeakerGuidelinesPage: React.FC = () => {
  const [guidelines, setGuidelines] = useState<SpeakerGuidelines | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGuidelines();
  }, []);

  const fetchGuidelines = async () => {
    try {
      setLoading(true);
      console.log('🎤 Fetching speaker guidelines...');
      
      const response = await fetch('/api/speaker-guidelines');
      const result: SpeakerGuidelinesApiResponse = await response.json();

      if (result.success && result.data) {
        setGuidelines(result.data);
        console.log('✅ Speaker guidelines loaded successfully');
      } else {
        setError(result.error || 'Failed to fetch speaker guidelines');
        console.error('❌ API error:', result.error);
      }
    } catch (err) {
      const errorMessage = 'An error occurred while fetching speaker guidelines';
      setError(errorMessage);
      console.error('❌ Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4">Loading speaker guidelines...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !guidelines) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Speaker Guidelines</h1>
            <p className="text-xl text-red-300">
              {error || 'Speaker guidelines not available'}
            </p>
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              {guidelines.title}
            </h1>
            {guidelines.subtitle && (
              <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                {guidelines.subtitle}
              </p>
            )}
          </div>

          {/* Breadcrumb */}
          <nav className="flex justify-center" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 sm:space-x-2 md:space-x-3 text-sm sm:text-base">
              <li className="inline-flex items-center">
                <Link href="/" className="text-blue-200 hover:text-white transition-colors whitespace-nowrap">
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-300 mx-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-blue-100 whitespace-nowrap">Speaker Guidelines</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        {guidelines.introduction && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <div className="prose prose-lg max-w-none">
              <PortableText value={guidelines.introduction} />
            </div>
          </div>
        )}

        {/* Quick Navigation */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Quick Navigation</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            {guidelines.speakerRequirements && (
              <a href="#speakers" className="text-blue-700 hover:text-blue-900 transition-colors">
                • Speaker Requirements
              </a>
            )}
            {guidelines.posterGuidelines && (
              <a href="#posters" className="text-blue-700 hover:text-blue-900 transition-colors">
                • Poster Guidelines
              </a>
            )}
            {guidelines.presentationRequirements && (
              <a href="#presentation" className="text-blue-700 hover:text-blue-900 transition-colors">
                • Presentation Requirements
              </a>
            )}
            {guidelines.virtualGuidelines && (
              <a href="#virtual" className="text-blue-700 hover:text-blue-900 transition-colors">
                • Virtual Guidelines
              </a>
            )}
            {guidelines.certificationInfo && (
              <a href="#certification" className="text-blue-700 hover:text-blue-900 transition-colors">
                • Certification
              </a>
            )}
            {guidelines.contactInformation && (
              <a href="#contact" className="text-blue-700 hover:text-blue-900 transition-colors">
                • Contact Information
              </a>
            )}
          </div>
        </div>

        {/* Guidelines Sections */}
        <div className="space-y-8">
          {/* Speaker Requirements */}
          {guidelines.speakerRequirements && (
            <GuidelinesSection
              id="speakers"
              title={guidelines.speakerRequirements.title}
              items={guidelines.speakerRequirements.requirements}
              icon="🎤"
            />
          )}

          {/* Poster Guidelines */}
          {guidelines.posterGuidelines && (
            <GuidelinesSection
              id="posters"
              title={guidelines.posterGuidelines.title}
              items={guidelines.posterGuidelines.guidelines}
              icon="📋"
            />
          )}

          {/* Presentation Requirements */}
          {guidelines.presentationRequirements && (
            <div id="presentation" className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="flex items-center mb-6">
                <span className="text-2xl mr-3">💻</span>
                <h2 className="text-2xl font-bold text-gray-900">
                  {guidelines.presentationRequirements.title}
                </h2>
              </div>
              
              {guidelines.presentationRequirements.formats && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Accepted Formats:</h3>
                  <div className="flex flex-wrap gap-2">
                    {guidelines.presentationRequirements.formats.map((format, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {format}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {guidelines.presentationRequirements.requirements && (
                <ul className="space-y-3">
                  {guidelines.presentationRequirements.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-orange-500 mr-3 mt-1">•</span>
                      <span className="text-gray-700">{requirement}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Virtual Guidelines */}
          {guidelines.virtualGuidelines && (
            <GuidelinesSection
              id="virtual"
              title={guidelines.virtualGuidelines.title}
              items={guidelines.virtualGuidelines.guidelines}
              icon="🌐"
            />
          )}

          {/* Technical Specifications */}
          {guidelines.technicalSpecifications && (
            <div id="technical" className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="flex items-center mb-6">
                <span className="text-2xl mr-3">⚙️</span>
                <h2 className="text-2xl font-bold text-gray-900">
                  {guidelines.technicalSpecifications.title}
                </h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {guidelines.technicalSpecifications.audioVisual && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Audio Visual:</h3>
                    <ul className="space-y-2">
                      {guidelines.technicalSpecifications.audioVisual.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-3 mt-1">✓</span>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {guidelines.technicalSpecifications.equipment && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Equipment Provided:</h3>
                    <ul className="space-y-2">
                      {guidelines.technicalSpecifications.equipment.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-3 mt-1">✓</span>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Submission Deadlines */}
          {guidelines.submissionDeadlines && guidelines.submissionDeadlines.deadlines && (
            <div id="deadlines" className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="flex items-center mb-6">
                <span className="text-2xl mr-3">📅</span>
                <h2 className="text-2xl font-bold text-gray-900">
                  {guidelines.submissionDeadlines.title}
                </h2>
              </div>
              
              <div className="space-y-4">
                {guidelines.submissionDeadlines.deadlines.map((deadline, index) => (
                  <div key={index} className="border-l-4 border-orange-500 pl-4 py-2">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{deadline.item}</h3>
                        {deadline.description && (
                          <p className="text-gray-600 text-sm">{deadline.description}</p>
                        )}
                      </div>
                      <div className="mt-2 md:mt-0">
                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                          {formatDate(deadline.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certification */}
          {guidelines.certificationInfo && (
            <GuidelinesSection
              id="certification"
              title={guidelines.certificationInfo.title}
              items={guidelines.certificationInfo.information}
              icon="🏆"
            />
          )}

          {/* Contact Information */}
          {guidelines.contactInformation && (
            <div id="contact" className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="flex items-center mb-6">
                <span className="text-2xl mr-3">📞</span>
                <h2 className="text-2xl font-bold text-gray-900">
                  {guidelines.contactInformation.title}
                </h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {guidelines.contactInformation.programEnquiry && (
                    <div>
                      <h3 className="font-semibold text-gray-900">Program Enquiry:</h3>
                      <a 
                        href={`mailto:${guidelines.contactInformation.programEnquiry}`}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        {guidelines.contactInformation.programEnquiry}
                      </a>
                    </div>
                  )}
                  
                  {guidelines.contactInformation.generalQueries && (
                    <div>
                      <h3 className="font-semibold text-gray-900">General Queries:</h3>
                      <a 
                        href={`mailto:${guidelines.contactInformation.generalQueries}`}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        {guidelines.contactInformation.generalQueries}
                      </a>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  {guidelines.contactInformation.technicalSupport && (
                    <div>
                      <h3 className="font-semibold text-gray-900">Technical Support:</h3>
                      <a 
                        href={`mailto:${guidelines.contactInformation.technicalSupport}`}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        {guidelines.contactInformation.technicalSupport}
                      </a>
                    </div>
                  )}
                  
                  {guidelines.contactInformation.phone && (
                    <div>
                      <h3 className="font-semibold text-gray-900">Phone:</h3>
                      <a 
                        href={`tel:${guidelines.contactInformation.phone}`}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        {guidelines.contactInformation.phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Additional Notes */}
          {guidelines.additionalNotes && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-8">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">📝</span>
                <h2 className="text-xl font-bold text-orange-900">Additional Notes</h2>
              </div>
              <div className="prose prose-orange max-w-none">
                <PortableText value={guidelines.additionalNotes} />
              </div>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Present?</h3>
            <p className="text-orange-100 mb-6">
              Submit your abstract and join our prestigious nursing conference
            </p>
            <div className="space-x-4">
              <Link
                href="/submit-abstract"
                className="inline-block bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Submit Abstract
              </Link>
              <Link
                href="/registration"
                className="inline-block border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors"
              >
                Register Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Guidelines Section Component
interface GuidelinesSectionProps {
  id: string;
  title: string;
  items?: string[];
  icon: string;
}

const GuidelinesSection: React.FC<GuidelinesSectionProps> = ({ id, title, items, icon }) => {
  if (!items || items.length === 0) return null;

  return (
    <div id={id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="flex items-center mb-6">
        <span className="text-2xl mr-3">{icon}</span>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      </div>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex items-start">
            <span className="text-orange-500 mr-3 mt-1">•</span>
            <span className="text-gray-700">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SpeakerGuidelinesPage;
