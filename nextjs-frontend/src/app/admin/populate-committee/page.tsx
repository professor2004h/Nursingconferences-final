'use client';

import { useState } from 'react';

interface CommitteeMember {
  name: string;
  id: string;
  displayOrder: number;
  isChairperson: boolean;
}

interface PopulateResponse {
  success: boolean;
  message: string;
  results?: CommitteeMember[];
  existingMembers?: { name: string; displayOrder: number }[];
  errors?: { name: string; error: string }[];
  summary?: {
    totalCreated: number;
    chairperson: string;
    nextSteps: string[];
  };
}

export default function PopulateCommitteePage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [response, setResponse] = useState<PopulateResponse | null>(null);
  const [existingData, setExistingData] = useState<any>(null);

  const checkExistingData = async () => {
    try {
      const res = await fetch('/api/organizing-committee');
      const data = await res.json();
      setExistingData(data);
    } catch (error) {
      console.error('Error checking existing data:', error);
    }
  };

  const populateCommitteeData = async () => {
    setStatus('loading');
    setResponse(null);

    try {
      const res = await fetch('/api/populate-committee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data: PopulateResponse = await res.json();
      setResponse(data);
      setStatus(data.success ? 'success' : 'error');
      
      // Refresh existing data after population
      if (data.success) {
        await checkExistingData();
      }
    } catch (error) {
      setResponse({
        success: false,
        message: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
      setStatus('error');
    }
  };

  // Check existing data on component mount
  useState(() => {
    checkExistingData();
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
            🏥 Populate Organizing Committee Data
          </h1>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">📋 What this will create:</h3>
            <ul className="text-blue-800 space-y-1">
              <li><strong>8 Committee Members</strong> with complete profiles</li>
              <li><strong>1 Chairperson</strong> (Dr. Sarah Johnson)</li>
              <li><strong>International representation</strong> from 5 countries</li>
              <li><strong>Complete data</strong> including achievements and publications</li>
            </ul>
          </div>

          {/* Existing Data Check */}
          <div className="mb-8">
            <button
              onClick={checkExistingData}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium mr-4"
            >
              🔍 Check Existing Data
            </button>

            {existingData && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Current Committee Data:</h4>
                {existingData.success && existingData.count > 0 ? (
                  <div className="space-y-2">
                    <p className="text-gray-700">Found {existingData.count} committee members:</p>
                    {existingData.data.map((member: any, index: number) => (
                      <div
                        key={index}
                        className={`p-3 rounded border-l-4 ${
                          member.isChairperson
                            ? 'bg-yellow-50 border-yellow-400'
                            : 'bg-gray-50 border-blue-400'
                        }`}
                      >
                        {member.isChairperson && '👑 '}
                        <strong>{member.name}</strong> - {member.title}
                        <br />
                        <small className="text-gray-600">
                          {member.institution}, {member.country}
                        </small>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No committee members found. Ready to populate!</p>
                )}
              </div>
            )}
          </div>

          {/* Populate Button */}
          <div className="text-center mb-8">
            <button
              onClick={populateCommitteeData}
              disabled={status === 'loading'}
              className={`px-8 py-4 rounded-lg font-medium text-lg ${
                status === 'loading'
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              {status === 'loading' ? '⏳ Creating committee members...' : '🚀 Populate Committee Data'}
            </button>
          </div>

          {/* Results */}
          {response && (
            <div className={`p-6 rounded-lg mb-8 ${
              response.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <h3 className={`text-lg font-semibold mb-3 ${
                response.success ? 'text-green-900' : 'text-red-900'
              }`}>
                {response.success ? '✅ Success!' : '❌ Error'}
              </h3>
              
              <p className={response.success ? 'text-green-800' : 'text-red-800'}>
                {response.message}
              </p>

              {response.results && response.results.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold text-green-900 mb-2">Created Members:</h4>
                  <div className="space-y-2">
                    {response.results.map((member, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded ${
                          member.isChairperson ? 'bg-yellow-100' : 'bg-green-100'
                        }`}
                      >
                        {member.isChairperson && '👑 '}
                        {member.name} (Order: {member.displayOrder})
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {response.existingMembers && (
                <div className="mt-4">
                  <h4 className="font-semibold text-red-900 mb-2">Existing Members Found:</h4>
                  <div className="space-y-1">
                    {response.existingMembers.map((member, index) => (
                      <div key={index} className="p-2 bg-red-100 rounded">
                        {member.name} (Order: {member.displayOrder})
                      </div>
                    ))}
                  </div>
                  <p className="text-red-800 mt-2">
                    💡 Delete existing members in Sanity Studio first to avoid duplicates.
                  </p>
                </div>
              )}

              {response.summary && (
                <div className="mt-4">
                  <h4 className="font-semibold text-green-900 mb-2">🔄 Next Steps:</h4>
                  <ul className="text-green-800 space-y-1">
                    {response.summary.nextSteps.map((step, index) => (
                      <li key={index}>• {step}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Verification Links */}
          {status === 'success' && (
            <div className="text-center space-x-4">
              <a
                href="http://localhost:3333"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium"
              >
                🎛️ Open Sanity Studio
              </a>
              <a
                href="/organizing-committee"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
              >
                👥 View Committee Page
              </a>
              <a
                href="/api/organizing-committee"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium"
              >
                🔧 Test API
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
