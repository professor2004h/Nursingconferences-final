'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { CommitteeMember, CommitteeApiResponse } from '@/app/types/organizingCommittee';
import CommitteeMemberModal from '@/app/components/CommitteeMemberModal';
import ErrorBoundary from '@/app/components/ErrorBoundary';

const FeaturedCommitteeMembers: React.FC = () => {
  const [featuredMembers, setFeaturedMembers] = useState<CommitteeMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<CommitteeMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchFeaturedMembers();
  }, []);

  const fetchFeaturedMembers = async () => {
    try {
      setLoading(true);
      console.log('🌟 Fetching featured committee members for homepage...');
      
      const response = await fetch('/api/featured-committee');
      const result: CommitteeApiResponse = await response.json();

      if (result.success) {
        setFeaturedMembers(result.data);
        console.log(`✅ Loaded ${result.data.length} featured members`);
      } else {
        setError(result.error || 'Failed to fetch featured committee members');
        console.error('❌ API error:', result.error);
      }
    } catch (err) {
      const errorMessage = 'An error occurred while fetching featured committee members';
      setError(errorMessage);
      console.error('❌ Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = (member: CommitteeMember) => {
    console.log('Opening modal for featured member:', member.name);
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  // Don't render anything if loading, error, or no featured members
  if (loading) {
    return (
      <section className="relative py-16 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-white">Loading featured committee members...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || featuredMembers.length === 0) {
    // Don't render the section if there are no featured members or an error
    return null;
  }

  return (
    <section className="relative py-16 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>
      
      {/* Background pattern/texture */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
      </div>

      <div className="relative container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-orange-500 font-semibold text-sm uppercase tracking-wider mb-2">
            OUR LEADERSHIP TEAM
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Featured
            <span className="text-orange-500 ml-2">Committee Members</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Meet our distinguished committee members who bring expertise and leadership to advance nursing education and practice.
          </p>
        </div>

        {/* Featured Members Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {featuredMembers.map((member) => (
            <FeaturedMemberCard
              key={member._id}
              member={member}
              onViewProfile={handleViewProfile}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <a
            href="/organizing-committee"
            className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            View All Committee Members
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>

      {/* Profile Modal */}
      {selectedMember && (
        <ErrorBoundary
          fallback={
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={closeModal} />
              <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                  <h3 className="text-lg font-semibold text-red-600 mb-2">Modal Error</h3>
                  <p className="text-gray-600 mb-4">
                    Unable to display the committee member profile.
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
    </section>
  );
};

// Featured Member Card Component
interface FeaturedMemberCardProps {
  member: CommitteeMember;
  onViewProfile: (member: CommitteeMember) => void;
}

const FeaturedMemberCard: React.FC<FeaturedMemberCardProps> = ({ member, onViewProfile }) => {
  const defaultImage = '/images/default-profile.svg';

  return (
    <div className="group relative bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl border border-white/20">
      {/* Profile Image */}
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={member.profileImageUrl || defaultImage}
          alt={`${member.name} profile photo`}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
          sizes="(max-width: 768px) 50vw, 25vw"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = defaultImage;
          }}
        />
        
        {/* Chairperson Badge */}
        {member.isChairperson && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
            Chair
          </div>
        )}
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* View Profile Button */}
        <button
          onClick={() => onViewProfile(member)}
          className="absolute bottom-2 left-2 right-2 bg-orange-500 hover:bg-orange-600 text-white py-2 px-3 rounded text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
        >
          View Profile
        </button>
      </div>

      {/* Member Info */}
      <div className="p-4">
        <h3 className="font-semibold text-white text-sm mb-1 line-clamp-2 min-h-[2rem]">
          {member.name}
        </h3>
        <p className="text-gray-300 text-xs mb-1 line-clamp-2 min-h-[2rem]">
          {member.title}
        </p>
        <p className="text-gray-400 text-xs line-clamp-1">
          {member.institution}
        </p>
      </div>
    </div>
  );
};

export default FeaturedCommitteeMembers;
