import { getConferenceEvents } from "../getconferences";

export default async function DebugConferencesPage() {
  let events = [];
  let error = null;

  try {
    events = await getConferenceEvents(10);
  } catch (err) {
    error = err;
    console.error('Error fetching conferences:', err);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Debug: Conference Data</h1>
        <p className="text-sm text-gray-500 mb-4">Last updated: {new Date().toLocaleString()}</p>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>Error:</strong> {error.message}
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Raw Conference Data</h2>
          <p className="text-gray-600 mb-4">Total events found: {events.length}</p>
          
          {events.length > 0 ? (
            <div className="space-y-6">
              {events.map((event, index) => (
                <div key={event._id || index} className="border border-gray-200 rounded p-4">
                  <h3 className="font-bold text-lg mb-2">Event #{index + 1}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>ID:</strong> {event._id || 'N/A'}
                    </div>
                    <div>
                      <strong>Title:</strong> {event.title || 'N/A'}
                    </div>
                    <div>
                      <strong>Slug:</strong> {event.slug?.current || 'N/A'}
                    </div>
                    <div>
                      <strong>Date:</strong> {event.date || 'N/A'}
                    </div>
                    <div>
                      <strong>Location:</strong> {event.location || 'N/A'}
                    </div>
                    <div>
                      <strong>Email:</strong> {event.email || 'N/A'}
                    </div>
                    <div>
                      <strong>Image URL:</strong> {event.imageUrl ? 'Available' : 'Not set'}
                    </div>
                    <div>
                      <strong>Image Link URL:</strong>
                      <span className={event.imageLinkUrl ? 'text-green-600' : 'text-red-600'}>
                        {event.imageLinkUrl || 'Not set'}
                      </span>
                      {event.imageLinkUrl && (
                        <div className="mt-1">
                          <a href={event.imageLinkUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                            Test Link →
                          </a>
                        </div>
                      )}
                    </div>
                    <div>
                      <strong>Register Now URL:</strong> {event.registerNowUrl || 'Not set'}
                    </div>
                    <div>
                      <strong>Submit Abstract URL:</strong> {event.submitAbstractUrl || 'Not set'}
                    </div>
                    <div>
                      <strong>Is Active:</strong> {event.isActive !== undefined ? String(event.isActive) : 'N/A'}
                    </div>
                    <div className="col-span-2 mt-4 p-3 bg-gray-50 rounded">
                      <strong>Link Behavior (External URLs Only):</strong>
                      <div className="mt-2 text-sm">
                        {event.imageLinkUrl && event.imageLinkUrl.trim() !== '' ? (
                          <span className="text-green-600">✅ EXTERNAL URL: {event.imageLinkUrl}</span>
                        ) : (
                          <span className="text-gray-600">❌ NON-CLICKABLE (no Image Link URL set)</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {event.imageUrl && (
                    <div className="mt-4">
                      <strong>Image Preview:</strong>
                      <img 
                        src={event.imageUrl} 
                        alt={event.title} 
                        className="mt-2 max-w-xs h-32 object-cover rounded"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                      <div style={{display: 'none'}} className="mt-2 text-red-500 text-sm">
                        Failed to load image
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 text-center py-8">
              No conference events found
            </div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Instructions:</h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• Check if conference events exist in Sanity</li>
            <li>• Verify that mainConferenceUrl, registerNowUrl, and submitAbstractUrl fields are populated</li>
            <li>• Ensure images are uploaded and accessible</li>
            <li>• Make sure isActive is set to true for events you want to display</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
