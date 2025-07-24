'use client';

import React, { useState, useEffect } from 'react';
import { CancellationPolicy, CancellationPolicyApiResponse, PopulateCancellationPolicyResponse } from '@/app/types/cancellationPolicy';

const AdminCancellationPolicyPage: React.FC = () => {
  const [policy, setPolicy] = useState<CancellationPolicy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchCancellationPolicy();
  }, []);

  const fetchCancellationPolicy = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/cancellation-policy');
      const result: CancellationPolicyApiResponse = await response.json();
      
      if (result.success && result.data) {
        setPolicy(result.data);
      } else {
        setError(result.error || 'Failed to fetch cancellation policy');
      }
    } catch (err) {
      setError('An error occurred while fetching cancellation policy');
      console.error('Error fetching cancellation policy:', err);
    } finally {
      setLoading(false);
    }
  };

  const populateCancellationPolicy = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const response = await fetch('/api/populate-cancellation-policy');
      const result: PopulateCancellationPolicyResponse = await response.json();
      
      if (result.success) {
        setSuccess(result.message);
        await fetchCancellationPolicy(); // Refresh the policy
      } else {
        setError(result.error || 'Failed to populate cancellation policy');
      }
    } catch (err) {
      setError('An error occurred while populating cancellation policy');
      console.error('Error populating cancellation policy:', err);
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
              <h1 className="text-3xl font-bold text-gray-900">Cancellation Policy Management</h1>
              <p className="mt-2 text-gray-600">Manage cancellation and refund policies</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={populateCancellationPolicy}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                {loading ? 'Populating...' : 'Populate Default Policy'}
              </button>
              <a
                href="http://localhost:3333/structure/cancellationPolicy"
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
            <p className={`text-sm font-bold ${policy ? 'text-green-600' : 'text-red-600'}`}>
              {policy ? (policy.isActive ? 'Active' : 'Inactive') : 'Not Found'}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Last Updated</h3>
            <p className="text-sm text-gray-600">{formatDate(policy?.lastUpdated)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Refund Tiers</h3>
            <p className="text-2xl font-bold text-blue-600">
              {policy?.refundPolicy?.refundTiers?.length || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Source</h3>
            <p className="text-sm font-bold text-orange-600">Sanity CMS</p>
          </div>
        </div>

        {/* Policy Overview */}
        {policy ? (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Cancellation Policy Overview</h3>
              <p className="text-sm text-gray-600 mt-1">Current policy configuration</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Basic Information */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Basic Information</h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Title:</span>
                      <p className="text-gray-900">{policy.title}</p>
                    </div>
                    {policy.subtitle && (
                      <div>
                        <span className="font-medium text-gray-700">Subtitle:</span>
                        <p className="text-gray-900">{policy.subtitle}</p>
                      </div>
                    )}
                    <div>
                      <span className="font-medium text-gray-700">Active:</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                        policy.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {policy.isActive ? 'Yes' : 'No'}
                      </span>
                    </div>
                    {policy.effectiveDate && (
                      <div>
                        <span className="font-medium text-gray-700">Effective Date:</span>
                        <p className="text-gray-900">{formatDate(policy.effectiveDate)}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Policy Sections */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Policy Sections</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-3 ${policy.nameChangePolicy ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      Name Change Policy
                    </div>
                    <div className="flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-3 ${policy.refundPolicy ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      Refund Policy ({policy.refundPolicy?.refundTiers?.length || 0} tiers)
                    </div>
                    <div className="flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-3 ${policy.transferPolicy ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      Transfer Policy
                    </div>
                    <div className="flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-3 ${policy.naturalDisasterPolicy ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      Natural Disaster Policy
                    </div>
                    <div className="flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-3 ${policy.postponementPolicy ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      Postponement Policy
                    </div>
                    <div className="flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-3 ${policy.visaPolicy ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      Visa Policy
                    </div>
                    <div className="flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-3 ${policy.contactInformation ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      Contact Information
                    </div>
                    <div className="flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-3 ${policy.importantNotes?.length ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      Important Notes ({policy.importantNotes?.length || 0} items)
                    </div>
                  </div>
                </div>
              </div>

              {/* Refund Tiers */}
              {policy.refundPolicy?.refundTiers && policy.refundPolicy.refundTiers.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-4">Refund Schedule</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {policy.refundPolicy.refundTiers
                      .sort((a, b) => b.daysBeforeConference - a.daysBeforeConference)
                      .map((tier, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600 mb-1">
                            {tier.refundPercentage}%
                          </div>
                          <div className="text-sm text-gray-600">
                          {tier.daysBeforeConference > 0 
                          ? `${tier.daysBeforeConference}+ days before`
                          : &quot;Less than 45 days&quot;
                          }
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Information */}
              {policy.contactInformation && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-4">Contact Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {policy.contactInformation.primaryEmail && (
                      <div>
                        <span className="font-medium text-gray-700">Email:</span>
                        <p className="text-gray-900">{policy.contactInformation.primaryEmail}</p>
                      </div>
                    )}
                    {policy.contactInformation.phone && (
                      <div>
                        <span className="font-medium text-gray-700">Phone:</span>
                        <p className="text-gray-900">{policy.contactInformation.phone}</p>
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No cancellation policy found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Click "Populate Default Policy" to create the cancellation policy.
            </p>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">How to Manage Cancellation Policy</h3>
          <div className="space-y-3 text-sm text-blue-800">
            <div className="flex items-start space-x-2">
              <span className="font-medium">1.</span>
              <span>Use "Populate Default Policy" to create initial cancellation policy with comprehensive terms</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-medium">2.</span>
              <span>Click "Edit in Sanity Studio" to customize refund tiers, deadlines, and policy terms</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-medium">3.</span>
              <span>Changes in Sanity Studio will automatically appear on the cancellation policy page</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-medium">4.</span>
              <span>Configure refund percentages, deadlines, and contact information as needed</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-center space-x-4">
          <a
            href="/cancellation-policy"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            View Policy Page
          </a>
          <a
            href="/api/cancellation-policy"
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

export default AdminCancellationPolicyPage;
