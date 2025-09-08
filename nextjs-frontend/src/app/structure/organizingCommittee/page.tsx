'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { CommitteeMember, CommitteeApiResponse } from '@/app/types/organizingCommittee';
import CommitteeMemberModal from '@/app/components/CommitteeMemberModal';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import ErrorBoundary from '@/app/components/ErrorBoundary';

const OrganizingCommitteePage: React.FC = () => {
  const [committeeMembers, setCommitteeMembers] = useState<CommitteeMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<CommitteeMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCommitteeMembers();
  }, []);

  const fetchCommitteeMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/organizing-committee');
      const data: CommitteeApiResponse = await response.json();
      
      if (data.success) {
        setCommitteeMembers(data.data);
      } else {
        setError(data.error || 'Failed to fetch committee members');
      }
    } catch (err) {
      console.error('Error fetching committee members:', err);
      setError('Failed to load committee members. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = (member: CommitteeMember) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Loading committee members...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Committee</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchCommitteeMembers}
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">ORGANIZING COMMITTEE</h1>
          <nav className="text-sm">
            <span className="text-blue-200">Home</span>
            <span className="mx-2">»</span>
            <span className="text-blue-200">Structure</span>
            <span className="mx-2">»</span>
            <span>Organizing Committee</span>
          </nav>
        </div>
      </div>

      {/* Committee Members Grid */}
      <div className="container mx-auto px-4 py-16">
        {committeeMembers.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-600 mb-4">
              No Committee Members Found
            </h2>
            <p className="text-gray-500">
              Committee members will be displayed here once they are added to the system.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {committeeMembers.map((member) => (
              <CommitteeMemberCard
                key={member._id}
                member={member}
                onViewProfile={handleViewProfile}
              />
            ))}
          </div>
        )}
      </div>

      {/* Committee Member Modal */}
      {isModalOpen && selectedMember && (
        <ErrorBoundary>
          <CommitteeMemberModal
            member={selectedMember}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          />
        </ErrorBoundary>
      )}
    </div>
  );
};

// Committee Member Card Component
interface CommitteeMemberCardProps {
  member: CommitteeMember;
  onViewProfile: (member: CommitteeMember) => void;
}

const CommitteeMemberCard: React.FC<CommitteeMemberCardProps> = ({ member, onViewProfile }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Profile Image */}
      <div className="relative h-48 bg-gray-100 flex items-center justify-center">
        {member.isChairperson && (
          <div className="absolute top-2 right-2 z-10">
            <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
              <svg
                className="w-3 h-3 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z"
                  clipRule="evenodd"
                />
              </svg>
              Chair
            </div>
          </div>
        )}
        
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
        
        {member.profileImageUrl && !imageError ? (
          <Image
            src={member.profileImageUrl}
            alt={member.name}
            fill
            className="object-cover"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : (
          <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2 min-h-[2.5rem]">
          {member.name}
        </h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2 min-h-[2.5rem]">
          {member.title}
        </p>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2 min-h-[2.5rem]">
          {member.institution}
        </p>
        <button
          onClick={() => onViewProfile(member)}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md transition-colors duration-200 text-sm font-medium shadow-sm hover:shadow-md"
        >
          View Profile
        </button>
      </div>
    </div>
  );
};

export default OrganizingCommitteePage;
