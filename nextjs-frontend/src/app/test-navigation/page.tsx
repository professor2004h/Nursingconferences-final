import { shouldShowPastConferencesInMenu } from '../getPastConferencesRedirect';

export default async function TestNavigationPage() {
  const showPastConferences = await shouldShowPastConferencesInMenu();
  
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Navigation Toggle Test</h1>
      
      <div className="bg-gray-100 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Current State</h2>
        <div className="space-y-2">
          <p><strong>shouldShowPastConferencesInMenu():</strong> {showPastConferences.toString()}</p>
          <p><strong>Expected Behavior:</strong> {showPastConferences ? 'Past Conferences VISIBLE' : 'Past Conferences HIDDEN'}</p>
        </div>
      </div>
      
      <div className="bg-blue-50 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Test Instructions</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Check the main navigation menu on this page</li>
          <li>Look for "Past Conferences" link in the header</li>
          <li>Check both desktop and mobile navigation</li>
          <li>Check the "More" dropdown menu</li>
          <li>If toggle is OFF (false), Past Conferences should be hidden</li>
          <li>If toggle is ON (true), Past Conferences should be visible</li>
        </ol>
      </div>
      
      <div className="bg-yellow-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Troubleshooting</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>If Past Conferences is still visible when it should be hidden, wait up to 30 seconds for auto-refresh</li>
          <li>Check browser console for any JavaScript errors</li>
          <li>Verify the Sanity CMS toggle at: http://localhost:3333/structure/pastConference;1a421eed-4d9d-4b7e-a818-5de03792babd</li>
          <li>The "Show in Navigation Menu" toggle controls visibility</li>
        </ul>
      </div>
    </div>
  );
}
