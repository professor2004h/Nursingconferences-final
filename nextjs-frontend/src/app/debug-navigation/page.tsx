'use client';

import { useState, useEffect } from 'react';
import { shouldShowPastConferencesInMenu } from '../getPastConferencesRedirect';

export default function DebugNavigationPage() {
  const [showPastConferences, setShowPastConferences] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<string>('');

  const checkNavigationState = async () => {
    try {
      setError(null);
      console.log('🔍 Checking navigation state...');
      const shouldShow = await shouldShowPastConferencesInMenu();
      console.log('📊 Result:', shouldShow);
      setShowPastConferences(shouldShow);
      setLastChecked(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('❌ Error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  useEffect(() => {
    // Initial check
    checkNavigationState();

    // Set up periodic refresh every 10 seconds for testing
    const interval = setInterval(checkNavigationState, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Debug Navigation Toggle</h1>
      
      <div className="bg-gray-100 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Live Navigation State</h2>
        <div className="space-y-2">
          <p><strong>Show Past Conferences:</strong> 
            <span className={`ml-2 px-2 py-1 rounded ${
              showPastConferences === null ? 'bg-gray-200' : 
              showPastConferences ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
            }`}>
              {showPastConferences === null ? 'Loading...' : showPastConferences.toString()}
            </span>
          </p>
          <p><strong>Last Checked:</strong> {lastChecked}</p>
          {error && (
            <p className="text-red-600"><strong>Error:</strong> {error}</p>
          )}
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Manual Test</h2>
        <button 
          onClick={checkNavigationState}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Check Navigation State Now
        </button>
      </div>

      <div className="bg-yellow-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Expected Behavior</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>If value is <strong>false</strong>: Past Conferences should be HIDDEN in navigation</li>
          <li>If value is <strong>true</strong>: Past Conferences should be VISIBLE in navigation</li>
          <li>This page auto-refreshes every 10 seconds</li>
          <li>Check browser console for detailed logs</li>
        </ul>
      </div>
    </div>
  );
}
