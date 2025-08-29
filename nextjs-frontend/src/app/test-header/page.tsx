'use client';

import { useState, useEffect } from 'react';
import { shouldShowPastConferencesInMenu } from '../getPastConferencesRedirect';

export default function TestHeaderPage() {
  const [showPastConferences, setShowPastConferences] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🧪 TestHeaderPage: useEffect triggered');
    
    const fetchPastConferencesVisibility = async () => {
      try {
        console.log('🔍 TestHeaderPage: Checking Past Conferences visibility...');
        setLoading(true);
        const shouldShow = await shouldShowPastConferencesInMenu();
        console.log('📊 TestHeaderPage: shouldShowPastConferencesInMenu =', shouldShow);
        setShowPastConferences(shouldShow);
        console.log('✅ TestHeaderPage: State updated to', shouldShow);
        setError(null);
      } catch (err) {
        console.error('❌ TestHeaderPage: Error fetching past conferences visibility:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setShowPastConferences(false);
      } finally {
        setLoading(false);
      }
    };

    fetchPastConferencesVisibility();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Header Test Page</h1>
      
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h2 className="text-lg font-semibold mb-2">Past Conferences Visibility Test</h2>
        
        {loading && <p className="text-blue-600">Loading...</p>}
        
        {error && (
          <div className="text-red-600">
            <p>Error: {error}</p>
          </div>
        )}
        
        {!loading && !error && (
          <div>
            <p className="mb-2">
              <strong>Show Past Conferences:</strong> 
              <span className={`ml-2 px-2 py-1 rounded ${showPastConferences ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                {showPastConferences ? 'TRUE' : 'FALSE'}
              </span>
            </p>
            
            <p className="text-sm text-gray-600">
              {showPastConferences 
                ? '✅ Past Conferences should be visible in the More menu' 
                : '❌ Past Conferences should be hidden from the More menu'
              }
            </p>
          </div>
        )}
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Test More Menu Rendering</h3>
        <div className="border border-gray-300 p-2 rounded">
          <p className="font-medium">More Menu Items:</p>
          <ul className="list-disc list-inside mt-2">
            <li>Conferences</li>
            <li>Speakers</li>
            <li>Sponsorship</li>
            {showPastConferences && (
              <li className="text-green-600 font-semibold">Past Conferences ✅</li>
            )}
            <li>Media Partners</li>
            <li>Speaker Guidelines</li>
            <li>Gallery</li>
            <li>Journal</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
