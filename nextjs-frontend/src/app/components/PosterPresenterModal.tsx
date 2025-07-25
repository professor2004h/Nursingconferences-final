'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { PosterPresenter } from '@/app/types/posterPresenters';

interface PosterPresenterModalProps {
  presenter: PosterPresenter | null;
  isOpen: boolean;
  onClose: () => void;
}

// Close icon component
const XIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// External link icon component
const ExternalLinkIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

// Download icon component
const DownloadIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const PosterPresenterModal: React.FC<PosterPresenterModalProps> = ({
  presenter,
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

  // Early return if not open or no presenter data
  if (!isOpen || !presenter) return null;

  // Validate required presenter fields
  if (!presenter.name || !presenter.title || !presenter.institution || !presenter.country) {
    console.error('PosterPresenterModal: Missing required presenter data', presenter);
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading Profile</h3>
            <p className="text-gray-600 mb-4">Unable to load presenter information. Some required data is missing.</p>
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

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
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
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0">
                <Image
                  src={presenter.profileImageUrl || defaultImage}
                  alt={`${presenter.name} profile photo`}
                  fill
                  className="object-cover"
                  priority={false}
                  sizes="128px"
                />
              </div>
              <div className="text-center md:text-left flex-1">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <h2 className="text-2xl md:text-3xl font-bold">{presenter.name}</h2>
                  {presenter.isFeatured && (
                    <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-blue-100 text-lg mb-2">{presenter.title}</p>
                <p className="text-blue-200 mb-2">{presenter.institution}</p>
                <p className="text-blue-200">{presenter.country}</p>
                {presenter.researchArea && (
                  <p className="text-blue-100 mt-2 italic">
                    Research Area: {presenter.researchArea}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 md:p-8 space-y-8">
            {/* Poster Information */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                📋 Poster Presentation
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Title:</h4>
                  <p className="text-gray-700">{presenter.posterTitle}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Abstract:</h4>
                  <p className="text-gray-700 leading-relaxed">{presenter.posterAbstract}</p>
                </div>
                {presenter.keywords && presenter.keywords.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Keywords:</h4>
                    <div className="flex flex-wrap gap-2">
                      {presenter.keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {presenter.presentationDate && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Presentation Date:</h4>
                    <p className="text-gray-700">{formatDate(presenter.presentationDate)}</p>
                  </div>
                )}
                {presenter.sessionTrack && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Session Track:</h4>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      {presenter.sessionTrack.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Biography */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Biography</h3>
              <p className="text-gray-700 leading-relaxed">{presenter.bio}</p>
            </div>

            {/* Collaborators */}
            {presenter.collaborators && presenter.collaborators.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Co-authors & Collaborators</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {presenter.collaborators.map((collaborator, index) => (
                    <li key={index}>{collaborator}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Awards */}
            {presenter.awards && presenter.awards.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Awards & Recognition</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {presenter.awards.map((award, index) => (
                    <li key={index}>{award}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Publications */}
            {presenter.publications && presenter.publications.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Publications</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {presenter.publications.map((publication, index) => (
                    <li key={index}>{publication}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Contact & Links */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact & Links</h3>
              <div className="flex flex-wrap gap-3">
                {presenter.email && (
                  <a
                    href={`mailto:${presenter.email}`}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    📧 Email
                  </a>
                )}
                {presenter.linkedinUrl && (
                  <a
                    href={presenter.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    LinkedIn <ExternalLinkIcon />
                  </a>
                )}
                {presenter.researchGateUrl && (
                  <a
                    href={presenter.researchGateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    ResearchGate <ExternalLinkIcon />
                  </a>
                )}
                {presenter.orcidId && (
                  <a
                    href={`https://orcid.org/${presenter.orcidId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    ORCID <ExternalLinkIcon />
                  </a>
                )}
                {presenter.posterFileUrl && (
                  <a
                    href={presenter.posterFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <DownloadIcon /> Download Poster
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PosterPresenterModal;
