'use client';

import React, { useState, useEffect } from 'react';
import { CommitteeMember, CommitteeApiResponse } from '@/app/types/organizingCommittee';
import FeaturedCommitteeMembers from '@/app/components/FeaturedCommitteeMembers';

const TestFeaturedPage: React.FC = () => {
  const [allMembers, setAllMembers] = useState<CommitteeMember[]>([]);
  const [featuredMembers, setFeaturedMembers] = useState<CommitteeMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch all members
      const allResponse = await fetch('/api/organizing-committee');
      const allResult: CommitteeApiResponse = await allResponse.json();
      
      // Fetch featured members
      const featuredResponse = await fetch('/api/featured-committee');
      const featuredResult: CommitteeApiResponse = await featuredResponse.json();
      
      if (allResult.success) {
        setAllMembers(allResult.data);
      }
      
      if (featuredResult.success) {
        setFeaturedMembers(featuredResult.data);
      }
      
      console.log('All members:', allResult.data);
      console.log('Featured members:', featuredResult.data);
      
    } catch (error) {
      console.error('Error fetching data:', error);
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
          <h1 className="text-3xl font-bold text-gray-900">Featured Committee Members Test</h1>
          <p className="mt-2 text-gray-600">Testing the featured committee members functionality</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Members</h3>
            <p className="text-3xl font-bold text-blue-600">{allMembers.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Featured Members</h3>
            <p className="text-3xl font-bold text-orange-600">{featuredMembers.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Non-Featured</h3>
            <p className="text-3xl font-bold text-gray-600">{allMembers.length - featuredMembers.length}</p>
          </div>
        </div>

        {/* Member Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* All Members */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">All Committee Members</h3>
            <div className="space-y-3">
              {allMembers.map((member) => (
                <div key={member._id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <h4 className="font-medium text-gray-900">{member.name}</h4>
                    <p className="text-sm text-gray-600">{member.title}</p>
                    <p className="text-xs text-gray-500">{member.institution}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {member.isChairperson && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold">
                        Chair
                      </span>
                    )}
                    {member.isFeatured && (
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-semibold">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Members Only */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Featured Members Only</h3>
            <div className="space-y-3">
              {featuredMembers.map((member) => (
                <div key={member._id} className="flex items-center justify-between p-3 border border-orange-200 rounded bg-orange-50">
                  <div>
                    <h4 className="font-medium text-gray-900">{member.name}</h4>
                    <p className="text-sm text-gray-600">{member.title}</p>
                    <p className="text-xs text-gray-500">{member.institution}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {member.isChairperson && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold">
                        Chair
                      </span>
                    )}
                    <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      Featured
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* API Responses */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">API Response Details</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">All Members API (/api/organizing-committee)</h4>
              <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-64">
                {JSON.stringify({ count: allMembers.length, members: allMembers }, null, 2)}
              </pre>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Featured Members API (/api/featured-committee)</h4>
              <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-64">
                {JSON.stringify({ count: featuredMembers.length, members: featuredMembers }, null, 2)}
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
              href="/organizing-committee"
              className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
            >
              Full Committee Page
            </a>
            <a
              href="/admin/populate-committee"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm"
            >
              Populate Committee
            </a>
            <a
              href="http://localhost:3333/structure/organizingCommittee"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded text-sm"
            >
              Sanity Studio
            </a>
          </div>
        </div>
      </div>

      {/* Featured Component Preview */}
      <div className="mb-8">
        <div className="max-w-7xl mx-auto px-4 mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Featured Component Preview</h2>
          <p className="text-gray-600">This is how the component will appear on the homepage:</p>
        </div>
        <FeaturedCommitteeMembers />
      </div>
    </div>
  );
};

export default TestFeaturedPage;
