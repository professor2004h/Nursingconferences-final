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
      const response = await fetch('/api/organizing-committee');
      const result: CommitteeApiResponse = await response.json();

      if (result.success) {
        setCommitteeMembers(result.data);
      } else {
        setError(result.error || 'Failed to fetch committee members');
      }
    } catch (err) {
      setError('An error occurred while fetching committee members');
      console.error('Error fetching committee members:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = (member: CommitteeMember) => {
    console.log('Opening modal for member:', member);

    // Validate member data before opening modal
    if (!member || !member.name || !member.title) {
      console.error('Invalid member data:', member);
      setError('Unable to load member profile. Invalid data received.');
      return;
    }

    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white py-20">
          <div className="absolute inset-0 bg-black opacity-30"></div>
          <div className="relative container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">COMMITTEE MEMBERS</h1>
            <nav className="text-sm">
              <span className="text-blue-200">Home</span>
              <span className="mx-2">»</span>
              <span>Committee Members</span>
            </nav>
          </div>
        </div>
        <div className="container mx-auto px-4 py-16">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white py-20">
          <div className="absolute inset-0 bg-black opacity-30"></div>
          <div className="relative container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">COMMITTEE MEMBERS</h1>
            <nav className="text-sm">
              <span className="text-blue-200">Home</span>
              <span className="mx-2">»</span>
              <span>Committee Members</span>
            </nav>
          </div>
        </div>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">COMMITTEE MEMBERS</h1>
          <nav className="text-sm">
            <span className="text-blue-200">Home</span>
            <span className="mx-2">»</span>
            <span>Committee Members</span>
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

      {/* Profile Modal */}
      {selectedMember && (
        <ErrorBoundary
          fallback={
            <div className="fixed inset-0 z-[99999] overflow-y-auto">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={closeModal} />
              <div className="flex min-h-full items-center justify-center p-4 pt-24">
                <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                  <h3 className="text-lg font-semibold text-red-600 mb-2">Modal Error</h3>
                  <p className="text-gray-600 mb-4">
                    Unable to display the committee member profile. There may be an issue with the data or component.
                  </p>
                  <button
                    onClick={closeModal}
                    className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          }
        >
          <CommitteeMemberModal
            member={selectedMember}
            isOpen={isModalOpen}
            onClose={closeModal}
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
  const defaultImage = '/images/default-profile.svg';

  // Validate member data
  if (!member || !member.name) {
    console.error('CommitteeMemberCard: Invalid member data', member);
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600 text-sm">Invalid member data</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative aspect-square">
        <Image
          src={member.profileImageUrl || defaultImage}
          alt={`${member.name} profile photo`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          onError={(e) => {
            console.warn('Failed to load image for', member.name);
            const target = e.target as HTMLImageElement;
            target.src = defaultImage;
          }}
        />
        {member.isChairperson && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-md">
            Chair
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
