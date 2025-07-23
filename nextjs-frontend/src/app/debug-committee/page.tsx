'use client';

import React, { useState, useEffect } from 'react';
import { CommitteeMember, CommitteeApiResponse } from '@/app/types/organizingCommittee';

const DebugCommitteePage: React.FC = () => {
  const [apiData, setApiData] = useState<CommitteeApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching committee data...');
      
      const response = await fetch('/api/organizing-committee');
      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
      
      const data = await response.json();
      console.log('📊 Raw API response:', data);
      
      setApiData(data);
      
      if (data.success && data.data) {
        console.log('✅ Committee members found:', data.data.length);
        data.data.forEach((member: CommitteeMember, index: number) => {
          console.log(`👤 Member ${index + 1}:`, member);
          
          // Validate each member
          const requiredFields = ['_id', 'name', 'title', 'institution', 'country', 'bio'];
          const missingFields = requiredFields.filter(field => !member[field as keyof CommitteeMember]);
          
          if (missingFields.length > 0) {
            console.warn(`⚠️ Member ${member.name || 'Unknown'} missing fields:`, missingFields);
          }
        });
      } else {
        console.error('❌ API returned error:', data.error);
        setError(data.error || 'Unknown API error');
      }
    } catch (err) {
      console.error('❌ Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Unknown fetch error');
    } finally {
      setLoading(false);
    }
  };

  const validateMember = (member: CommitteeMember) => {
    const issues = [];
    
    if (!member._id) issues.push('Missing _id');
    if (!member.name) issues.push('Missing name');
    if (!member.title) issues.push('Missing title');
    if (!member.institution) issues.push('Missing institution');
    if (!member.country) issues.push('Missing country');
    if (!member.bio) issues.push('Missing bio');
    if (typeof member.displayOrder !== 'number') issues.push('Invalid displayOrder');
    if (typeof member.isChairperson !== 'boolean') issues.push('Invalid isChairperson');
    
    return issues;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Committee Data Debug</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* API Response */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">API Response</h2>
              <button
                onClick={fetchData}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
              >
                Refresh
              </button>
            </div>
            
            {loading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading...</p>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
                <h3 className="font-semibold text-red-800">Error</h3>
                <p className="text-red-600">{error}</p>
              </div>
            )}
            
            {apiData && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="font-semibold mb-2">Response Summary</h3>
                  <ul className="text-sm space-y-1">
                    <li><strong>Success:</strong> {apiData.success ? '✅ Yes' : '❌ No'}</li>
                    <li><strong>Count:</strong> {apiData.count}</li>
                    <li><strong>Data Length:</strong> {apiData.data?.length || 0}</li>
                    {apiData.error && <li><strong>Error:</strong> {apiData.error}</li>}
                  </ul>
                </div>
                
                <details className="bg-gray-50 p-4 rounded">
                  <summary className="cursor-pointer font-semibold">Raw JSON Response</summary>
                  <pre className="mt-2 text-xs overflow-auto max-h-96 bg-white p-2 rounded border">
                    {JSON.stringify(apiData, null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </div>
          
          {/* Member Validation */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Member Validation</h2>
            
            {apiData?.data && apiData.data.length > 0 ? (
              <div className="space-y-4">
                {apiData.data.map((member, index) => {
                  const issues = validateMember(member);
                  return (
                    <div key={member._id || index} className="border rounded p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">
                          {member.name || `Member ${index + 1}`}
                          {member.isChairperson && ' 👑'}
                        </h3>
                        <span className={`px-2 py-1 rounded text-xs ${
                          issues.length === 0 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {issues.length === 0 ? 'Valid' : `${issues.length} issues`}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-2">
                        <p><strong>Title:</strong> {member.title || 'N/A'}</p>
                        <p><strong>Institution:</strong> {member.institution || 'N/A'}</p>
                        <p><strong>Country:</strong> {member.country || 'N/A'}</p>
                        <p><strong>Display Order:</strong> {member.displayOrder}</p>
                      </div>
                      
                      {issues.length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded p-2">
                          <h4 className="font-semibold text-red-800 text-sm">Issues:</h4>
                          <ul className="text-red-600 text-xs list-disc list-inside">
                            {issues.map((issue, i) => (
                              <li key={i}>{issue}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <details className="mt-2">
                        <summary className="cursor-pointer text-xs text-gray-500">View Raw Data</summary>
                        <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                          {JSON.stringify(member, null, 2)}
                        </pre>
                      </details>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500">No committee members found.</p>
            )}
          </div>
        </div>
        
        {/* Instructions */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">Debug Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Check the browser console (F12) for detailed logs</li>
            <li>Verify that the API is returning valid data structure</li>
            <li>Look for any missing required fields in the member validation</li>
            <li>Test the modal with the validated data</li>
            <li>If issues persist, check the Sanity backend data</li>
          </ol>
          
          <div className="mt-4 space-x-4">
            <a
              href="/organizing-committee"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
            >
              View Committee Page
            </a>
            <a
              href="/test-modal"
              className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
            >
              Test Modal
            </a>
            <a
              href="http://localhost:3333"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm"
            >
              Sanity Studio
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugCommitteePage;
