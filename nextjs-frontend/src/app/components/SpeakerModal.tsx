'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { Speaker, SPEAKER_CATEGORIES } from '@/app/types/speakers';

// Simple SVG icon components
const XIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const MailIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const ExternalLinkIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

const AwardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

const BookOpenIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const MicrophoneIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

interface SpeakerModalProps {
  speaker: Speaker;
  isOpen: boolean;
  onClose: () => void;
}

const SpeakerModal: React.FC<SpeakerModalProps> = ({
  speaker,
  isOpen,
  onClose
}) => {
  const defaultImage = '/images/default-profile.svg';

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Early return if not open or no speaker data
  if (!isOpen || !speaker) return null;

  // Validate required speaker fields
  if (!speaker.name || !speaker.title || !speaker.institution || !speaker.country) {
    console.error('SpeakerModal: Missing required speaker data', speaker);
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading Profile</h3>
            <p className="text-gray-600 mb-4">Unable to load speaker information. Some required data is missing.</p>
            <button
              onClick={onClose}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      keynote: 'bg-gradient-to-r from-purple-600 to-purple-700',
      invited: 'bg-gradient-to-r from-blue-600 to-blue-700',
      plenary: 'bg-gradient-to-r from-green-600 to-green-700',
      session: 'bg-gradient-to-r from-orange-600 to-orange-700',
      workshop: 'bg-gradient-to-r from-teal-600 to-teal-700',
      moderator: 'bg-gradient-to-r from-indigo-600 to-indigo-700'
    };
    return colors[category] || 'bg-gradient-to-r from-gray-600 to-gray-700';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
          >
            <XIcon />
          </button>

          {/* Header Section */}
          <div className={`${getCategoryColor(speaker.speakerCategory)} text-white p-6 rounded-t-lg`}>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0">
                <Image
                  src={speaker.profileImageUrl || defaultImage}
                  alt={`${speaker.name} profile photo`}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    console.warn('Failed to load profile image for', speaker.name);
                    const target = e.target as HTMLImageElement;
                    target.src = defaultImage;
                  }}
                  priority={false}
                  sizes="128px"
                />
              </div>
              <div className="text-center md:text-left flex-1">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <h2 className="text-2xl md:text-3xl font-bold">{speaker.name}</h2>
                  {speaker.isKeynote && (
                    <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Keynote
                    </span>
                  )}
                </div>
                <p className="text-blue-100 text-lg mb-2">{speaker.title}</p>
                <p className="text-blue-200 mb-2">{speaker.institution}</p>
                <p className="text-blue-200">{speaker.country}</p>
                <div className="mt-3">
                  <span className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {SPEAKER_CATEGORIES[speaker.speakerCategory]}
                  </span>
                </div>
                {speaker.specialization && (
                  <p className="text-blue-100 mt-2 italic">
                    Specialization: {speaker.specialization}
                  </p>
                )}
                {speaker.yearsOfExperience && (
                  <p className="text-blue-100 mt-1">
                    {speaker.yearsOfExperience} years of experience
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6">
            {/* Session Information */}
            {(speaker.sessionTitle || speaker.sessionAbstract || speaker.sessionDate || speaker.sessionLocation) && (
              <div className="mb-6 bg-gray-50 rounded-lg p-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <MicrophoneIcon />
                  Session Information
                </h3>
                {speaker.sessionTitle && (
                  <div className="mb-3">
                    <h4 className="font-semibold text-gray-800 mb-1">Session Title:</h4>
                    <p className="text-gray-700">{speaker.sessionTitle}</p>
                  </div>
                )}
                {speaker.sessionAbstract && (
                  <div className="mb-3">
                    <h4 className="font-semibold text-gray-800 mb-1">Abstract:</h4>
                    <p className="text-gray-700 leading-relaxed">{speaker.sessionAbstract}</p>
                  </div>
                )}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  {speaker.sessionDate && (
                    <div className="flex items-center gap-1">
                      <CalendarIcon />
                      <span>{formatDate(speaker.sessionDate)}</span>
                    </div>
                  )}
                  {speaker.sessionLocation && (
                    <div className="flex items-center gap-1">
                      <LocationIcon />
                      <span>{speaker.sessionLocation}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Biography */}
            {speaker.bio && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Biography</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {speaker.bio}
                </p>
              </div>
            )}

            {/* Achievements */}
            {speaker.achievements && speaker.achievements.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <AwardIcon />
                  Key Achievements
                </h3>
                <ul className="space-y-2">
                  {speaker.achievements.map((achievement, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Publications */}
            {speaker.publications && speaker.publications.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <BookOpenIcon />
                  Notable Publications
                </h3>
                <ul className="space-y-2">
                  {speaker.publications.map((publication, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700">{publication}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Contact Information */}
            <div className="border-t pt-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact & Links</h3>
              <div className="flex flex-wrap gap-4">
                {speaker.email && (
                  <a
                    href={`mailto:${speaker.email}`}
                    className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    <MailIcon />
                    Email
                  </a>
                )}
                {speaker.linkedinUrl && (
                  <a
                    href={speaker.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    <LinkedinIcon />
                    LinkedIn
                  </a>
                )}
                {speaker.researchGateUrl && (
                  <a
                    href={speaker.researchGateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    <ExternalLinkIcon />
                    ResearchGate
                  </a>
                )}
                {speaker.orcidId && (
                  <a
                    href={`https://orcid.org/${speaker.orcidId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-orange-50 hover:bg-orange-100 text-orange-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    <ExternalLinkIcon />
                    ORCID
                  </a>
                )}
                {speaker.websiteUrl && (
                  <a
                    href={speaker.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    <ExternalLinkIcon />
                    Website
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 rounded-b-lg">
            <button
              onClick={onClose}
              className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeakerModal;
