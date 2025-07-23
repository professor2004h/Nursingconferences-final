'use client';

import React, { useState } from 'react';
import CommitteeMemberModal from '@/app/components/CommitteeMemberModal';
import ErrorBoundary from '@/app/components/ErrorBoundary';
import { CommitteeMember } from '@/app/types/organizingCommittee';

const TestModalPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Test data with all required fields
  const testMember: CommitteeMember = {
    _id: 'test-id-123',
    name: 'Dr. Test Member',
    title: 'Professor of Test Studies',
    institution: 'Test University',
    country: 'Test Country',
    profileImageUrl: '/images/default-profile.svg',
    bio: 'This is a test biography for the committee member modal. It contains enough text to test the display and formatting of the biography section in the modal component.',
    specialization: 'Test Specialization',
    email: 'test@example.com',
    linkedinUrl: 'https://linkedin.com/in/test',
    orcidId: '0000-0000-0000-0000',
    researchGateUrl: 'https://researchgate.net/profile/test',
    displayOrder: 1,
    isChairperson: true,
    yearsOfExperience: 15,
    achievements: [
      'Test Achievement 1',
      'Test Achievement 2',
      'Test Achievement 3'
    ],
    publications: [
      'Test Publication 1 (2023)',
      'Test Publication 2 (2022)'
    ]
  };

  // Test data with minimal required fields only
  const minimalMember: CommitteeMember = {
    _id: 'minimal-test-id',
    name: 'Dr. Minimal Test',
    title: 'Basic Title',
    institution: 'Basic Institution',
    country: 'Basic Country',
    bio: 'Minimal bio for testing.',
    displayOrder: 2,
    isChairperson: false
  };

  // Test data with missing required fields (should trigger error handling)
  const invalidMember = {
    _id: 'invalid-test-id',
    name: '', // Missing name
    title: '', // Missing title
    institution: '',
    country: '',
    bio: '',
    displayOrder: 3,
    isChairperson: false
  } as CommitteeMember;

  const [selectedMember, setSelectedMember] = useState<CommitteeMember>(testMember);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Committee Member Modal Test</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Test Different Data Scenarios</h2>
          
          <div className="space-y-4">
            <div>
              <button
                onClick={() => {
                  setSelectedMember(testMember);
                  setIsModalOpen(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg mr-4"
              >
                Test Complete Data
              </button>
              <span className="text-gray-600">Full member data with all fields populated</span>
            </div>
            
            <div>
              <button
                onClick={() => {
                  setSelectedMember(minimalMember);
                  setIsModalOpen(true);
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg mr-4"
              >
                Test Minimal Data
              </button>
              <span className="text-gray-600">Only required fields populated</span>
            </div>
            
            <div>
              <button
                onClick={() => {
                  setSelectedMember(invalidMember);
                  setIsModalOpen(true);
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg mr-4"
              >
                Test Invalid Data
              </button>
              <span className="text-gray-600">Missing required fields (should show error)</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Current Test Data</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(selectedMember, null, 2)}
          </pre>
        </div>

        {/* Console Log Display */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Open browser developer tools (F12) to see console logs</li>
            <li>Click the test buttons above to open the modal with different data</li>
            <li>Check for any JavaScript errors in the console</li>
            <li>Test the modal functionality (close button, escape key, backdrop click)</li>
            <li>Verify that all sections render correctly</li>
          </ul>
        </div>
      </div>

      {/* Modal with Error Boundary */}
      <ErrorBoundary
        fallback={
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsModalOpen(false)} />
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <h3 className="text-lg font-semibold text-red-600 mb-2">Modal Test Error</h3>
                <p className="text-gray-600 mb-4">
                  The modal component encountered an error during testing.
                </p>
                <button
                  onClick={() => setIsModalOpen(false)}
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
          onClose={() => setIsModalOpen(false)}
        />
      </ErrorBoundary>
    </div>
  );
};

export default TestModalPage;
