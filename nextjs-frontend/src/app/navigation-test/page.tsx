'use client';

import React from 'react';
import Link from 'next/link';

export default function NavigationTest() {
  const mainNavigationLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/brochure', label: 'Brochure' },
    { href: '/organizing-committee', label: 'Committee' },
    { href: '/registration', label: 'Registration' },
    { href: '/contact', label: 'Contact Us' },
  ];

  const moreDropdownLinks = [
    { href: '/conferences', label: 'Conferences' },
    { href: '/speakers', label: 'Speakers' },
    { href: '/venue', label: 'Venue' },
    { href: '/sponsorship', label: 'Sponsorship' },
    { href: '/past-conferences', label: 'Past Conferences' },
    { href: '/media-partners', label: 'Media Partners' },
    { href: '/submit-abstract', label: 'Submit Abstract' },
    { href: '/speaker-guidelines', label: 'Speaker Guidelines' },
    { href: '/poster-presenters', label: 'Poster Presenters' },
    { href: '/past-conference-gallery', label: 'Gallery' },
    { href: '/journal', label: 'Journal (conditional)' },
  ];

  const testLink = (href: string, label: string) => {
    // Simple test to check if the route exists
    return fetch(href, { method: 'HEAD' })
      .then(response => ({
        href,
        label,
        status: response.status,
        exists: response.status < 400
      }))
      .catch(() => ({
        href,
        label,
        status: 'Error',
        exists: false
      }));
  };

  const [linkTests, setLinkTests] = React.useState<any[]>([]);
  const [testing, setTesting] = React.useState(false);

  const runTests = async () => {
    setTesting(true);
    const allLinks = [...mainNavigationLinks, ...moreDropdownLinks];
    const results = await Promise.all(
      allLinks.map(link => testLink(link.href, link.label))
    );
    setLinkTests(results);
    setTesting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Navigation Test Page</h1>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Navigation Reorganization Summary</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-blue-900 mb-2">✅ Main Navigation Bar (Always Visible)</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Logo (leftmost position)</li>
                <li>• Home link</li>
                <li>• About Us link</li>
                <li>• Brochure link</li>
                <li>• Committee link</li>
                <li>• Registration button (green)</li>
                <li>• Contact Us button (orange)</li>
              </ul>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">📋 More Dropdown Menu</h3>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Conferences</li>
                <li>• Speakers</li>
                <li>• Venue</li>
                <li>• Sponsorship</li>
                <li>• Past Conferences</li>
                <li>• Media Partners</li>
                <li>• Submit Abstract</li>
                <li>• Speaker Guidelines</li>
                <li>• Poster Presenters</li>
                <li>• Gallery</li>
                <li>• Journal (conditional)</li>
              </ul>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Link Accessibility Test</h2>
            <button
              onClick={runTests}
              disabled={testing}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {testing ? 'Testing Links...' : 'Test All Navigation Links'}
            </button>
          </div>

          {linkTests.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Test Results</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Main Navigation Links</h4>
                  <div className="space-y-2">
                    {linkTests.slice(0, mainNavigationLinks.length).map((test, index) => (
                      <div key={index} className={`flex items-center justify-between p-2 rounded ${test.exists ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                        <Link href={test.href} className="text-blue-600 hover:text-blue-800">
                          {test.label}
                        </Link>
                        <span className={`text-xs px-2 py-1 rounded ${test.exists ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {test.exists ? '✅ OK' : '❌ Error'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">More Dropdown Links</h4>
                  <div className="space-y-2">
                    {linkTests.slice(mainNavigationLinks.length).map((test, index) => (
                      <div key={index} className={`flex items-center justify-between p-2 rounded ${test.exists ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                        <Link href={test.href} className="text-blue-600 hover:text-blue-800">
                          {test.label}
                        </Link>
                        <span className={`text-xs px-2 py-1 rounded ${test.exists ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {test.exists ? '✅ OK' : '❌ Error'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Features Implemented</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Desktop Features</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>✅ Accessible dropdown with keyboard navigation</li>
                  <li>✅ Click outside to close dropdown</li>
                  <li>✅ Escape key to close dropdown</li>
                  <li>✅ Hover effects and smooth transitions</li>
                  <li>✅ Proper ARIA attributes</li>
                  <li>✅ Focus management</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Mobile Features</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>✅ Organized sections with dividers</li>
                  <li>✅ Main links at top</li>
                  <li>✅ 'More' section clearly labeled</li>
                  <li>✅ Action buttons at bottom</li>
                  <li>✅ Scrollable for long lists</li>
                  <li>✅ Responsive design</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-900 mb-2">Testing Instructions</h4>
            <div className="text-sm text-yellow-800 space-y-1">
              <p><strong>Desktop:</strong> Look for the "More" dropdown in the main navigation. Click it to see all additional links.</p>
              <p><strong>Mobile:</strong> Tap the hamburger menu to see the reorganized mobile navigation with sections.</p>
              <p><strong>Keyboard:</strong> Use Tab to navigate to the "More" button, then Enter/Space to open the dropdown.</p>
              <p><strong>Accessibility:</strong> Test with screen readers to ensure proper ARIA labels and navigation.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
