'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';
import { CancellationPolicy, CancellationPolicyApiResponse } from '@/app/types/cancellationPolicy';

const CancellationPolicyPage: React.FC = () => {
  const [policy, setPolicy] = useState<CancellationPolicy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCancellationPolicy();
  }, []);

  const fetchCancellationPolicy = async () => {
    try {
      setLoading(true);
      console.log('📋 Fetching cancellation policy...');
      
      const response = await fetch('/api/cancellation-policy');
      const result: CancellationPolicyApiResponse = await response.json();

      if (result.success && result.data) {
        setPolicy(result.data);
        console.log('✅ Cancellation policy loaded successfully');
      } else {
        setError(result.error || 'Failed to fetch cancellation policy');
        console.error('❌ API error:', result.error);
      }
    } catch (err) {
      const errorMessage = 'An error occurred while fetching cancellation policy';
      setError(errorMessage);
      console.error('❌ Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '📌';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
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
            <p className="mt-4">Loading cancellation policy...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !policy) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Cancellation Policy</h1>
            <p className="text-xl text-red-300">
              {error || 'Cancellation policy not available'}
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
            <span className="text-orange-400 font-semibold text-lg tracking-wide uppercase mb-4 block">
              Conference Policies
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {policy.title}
            </h1>
            {policy.subtitle && (
              <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                {policy.subtitle}
              </p>
            )}
          </div>

          {/* Breadcrumb */}
          <nav className="flex justify-center" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link href="/" className="text-blue-200 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-blue-100 ml-1 md:ml-2">Cancellation Policy</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        {policy.introduction && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <div className="prose prose-lg max-w-none">
              <PortableText value={policy.introduction} />
            </div>
          </div>
        )}

        {/* Important Notes */}
        {policy.importantNotes && policy.importantNotes.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex items-center mb-6">
              <span className="text-2xl mr-3">⚠️</span>
              <h2 className="text-2xl font-bold text-gray-900">Important Notes</h2>
            </div>
            <div className="space-y-4">
              {policy.importantNotes.map((note, index) => (
                <div key={index} className={`p-4 rounded-lg border-l-4 ${
                  note.priority === 'high' ? 'bg-red-50 border-red-500' :
                  note.priority === 'medium' ? 'bg-yellow-50 border-yellow-500' :
                  'bg-green-50 border-green-500'
                }`}>
                  <div className="flex items-start">
                    <span className="text-lg mr-2 mt-0.5">{getPriorityIcon(note.priority)}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{note.title}</h3>
                      <div className="prose prose-sm">
                        <PortableText value={note.content} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Name Change Policy */}
        {policy.nameChangePolicy && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex items-center mb-6">
              <span className="text-2xl mr-3">✏️</span>
              <h2 className="text-2xl font-bold text-gray-900">{policy.nameChangePolicy.title}</h2>
            </div>
            <div className="prose prose-lg max-w-none">
              <PortableText value={policy.nameChangePolicy.content} />
            </div>
            {policy.nameChangePolicy.deadline && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 font-medium">
                  📅 Deadline: {policy.nameChangePolicy.deadline} days before the conference
                </p>
              </div>
            )}
          </div>
        )}

        {/* Refund Policy */}
        {policy.refundPolicy && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex items-center mb-6">
              <span className="text-2xl mr-3">💰</span>
              <h2 className="text-2xl font-bold text-gray-900">{policy.refundPolicy.title}</h2>
            </div>
            
            {/* General Policy */}
            <div className="prose prose-lg max-w-none mb-6">
              <PortableText value={policy.refundPolicy.generalPolicy} />
            </div>

            {/* Refund Tiers */}
            {policy.refundPolicy.refundTiers && policy.refundPolicy.refundTiers.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Refund Schedule</h3>
                <div className="space-y-3">
                  {policy.refundPolicy.refundTiers
                    .sort((a, b) => b.daysBeforeConference - a.daysBeforeConference)
                    .map((tier, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className="text-2xl font-bold text-blue-600 mr-4">
                            {tier.refundPercentage}%
                          </span>
                          <div>
                            <p className="font-medium text-gray-900">
                              {tier.daysBeforeConference > 0 
                                ? `${tier.daysBeforeConference}+ days before conference`
                                : 'Less than 45 days before conference'
                              }
                            </p>
                            {tier.description && (
                              <p className="text-sm text-gray-600">{tier.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Terms */}
            {policy.refundPolicy.additionalTerms && (
              <div className="prose prose-lg max-w-none">
                <PortableText value={policy.refundPolicy.additionalTerms} />
              </div>
            )}
          </div>
        )}

        {/* Transfer Policy */}
        {policy.transferPolicy && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex items-center mb-6">
              <span className="text-2xl mr-3">🔄</span>
              <h2 className="text-2xl font-bold text-gray-900">{policy.transferPolicy.title}</h2>
            </div>
            
            <div className="space-y-6">
              {/* Person Transfer */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Transfer to Another Person</h3>
                <div className="prose prose-lg max-w-none">
                  <PortableText value={policy.transferPolicy.personTransfer} />
                </div>
              </div>

              {/* Conference Transfer */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Transfer to Another Conference</h3>
                <div className="prose prose-lg max-w-none">
                  <PortableText value={policy.transferPolicy.conferenceTransfer} />
                </div>
              </div>

              {/* Transfer Limitations */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Transfer Limitations</h3>
                <div className="prose prose-lg max-w-none">
                  <PortableText value={policy.transferPolicy.transferLimitations} />
                </div>
              </div>

              {policy.transferPolicy.transferDeadline && (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-orange-800 font-medium">
                    ⏰ Transfer Deadline: {policy.transferPolicy.transferDeadline} days before the conference
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Natural Disaster Policy */}
        {policy.naturalDisasterPolicy && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex items-center mb-6">
              <span className="text-2xl mr-3">🌪️</span>
              <h2 className="text-2xl font-bold text-gray-900">{policy.naturalDisasterPolicy.title}</h2>
            </div>
            
            <div className="space-y-6">
              <div className="prose prose-lg max-w-none">
                <PortableText value={policy.naturalDisasterPolicy.content} />
              </div>

              {policy.naturalDisasterPolicy.organizerRights && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Organizer Rights</h3>
                  <div className="prose prose-lg max-w-none">
                    <PortableText value={policy.naturalDisasterPolicy.organizerRights} />
                  </div>
                </div>
              )}

              {policy.naturalDisasterPolicy.liabilityDisclaimer && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-red-900 mb-3">Liability Disclaimer</h3>
                  <div className="prose prose-lg max-w-none text-red-800">
                    <PortableText value={policy.naturalDisasterPolicy.liabilityDisclaimer} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Postponement Policy */}
        {policy.postponementPolicy && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex items-center mb-6">
              <span className="text-2xl mr-3">📅</span>
              <h2 className="text-2xl font-bold text-gray-900">{policy.postponementPolicy.title}</h2>
            </div>
            <div className="prose prose-lg max-w-none">
              <PortableText value={policy.postponementPolicy.content} />
            </div>
            {policy.postponementPolicy.creditValidityPeriod && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-medium">
                  ⏳ Credit Validity: {policy.postponementPolicy.creditValidityPeriod} months from postponement date
                </p>
              </div>
            )}
          </div>
        )}

        {/* Visa Policy */}
        {policy.visaPolicy && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex items-center mb-6">
              <span className="text-2xl mr-3">🛂</span>
              <h2 className="text-2xl font-bold text-gray-900">{policy.visaPolicy.title}</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">General Advice</h3>
                <div className="prose prose-lg max-w-none">
                  <PortableText value={policy.visaPolicy.generalAdvice} />
                </div>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-900 mb-3">Failed Visa Applications</h3>
                <div className="prose prose-lg max-w-none text-yellow-800">
                  <PortableText value={policy.visaPolicy.failedVisaPolicy} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contact Information */}
        {policy.contactInformation && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex items-center mb-6">
              <span className="text-2xl mr-3">📞</span>
              <h2 className="text-2xl font-bold text-gray-900">{policy.contactInformation.title}</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {policy.contactInformation.primaryEmail && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                  <a 
                    href={`mailto:${policy.contactInformation.primaryEmail}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {policy.contactInformation.primaryEmail}
                  </a>
                </div>
              )}
              
              {policy.contactInformation.phone && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
                  <a 
                    href={`tel:${policy.contactInformation.phone}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {policy.contactInformation.phone}
                  </a>
                </div>
              )}
            </div>

            <div className="prose prose-lg max-w-none">
              <PortableText value={policy.contactInformation.instructions} />
            </div>
          </div>
        )}

        {/* Policy Information */}
        <div className="bg-gray-100 rounded-lg p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">Last Updated:</span> {formatDate(policy.lastUpdated)}
            </div>
            {policy.effectiveDate && (
              <div>
                <span className="font-medium">Effective Date:</span> {formatDate(policy.effectiveDate)}
              </div>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Questions About Our Policies?</h3>
            <p className="text-orange-100 mb-6">
              Contact our team for clarification on any cancellation or refund policies
            </p>
            <div className="space-x-4">
              <Link
                href="/contact-us"
                className="inline-block bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Contact Us
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

export default CancellationPolicyPage;
