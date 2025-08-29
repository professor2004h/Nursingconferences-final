import { Metadata } from 'next';
import { redirect, notFound } from 'next/navigation';
import { getPastConferencesRedirectUrl, shouldShowPastConferencesInMenu } from '../getPastConferencesRedirect';

export const metadata: Metadata = {
  title: 'Past Conferences | Intelli Global Conferences',
  description: 'Explore our successful past conferences and events.',
  keywords: ['past conferences', 'nursing conferences', 'healthcare events'],
};

export default async function PastConferencesPage() {
  // Check if Past Conferences should be visible
  const shouldShow = await shouldShowPastConferencesInMenu();

  // If Past Conferences is hidden, show 404
  if (!shouldShow) {
    notFound();
  }

  // Get the redirect URL from Sanity
  const redirectUrl = await getPastConferencesRedirectUrl();

  // If redirect is configured and active, redirect to external URL
  if (redirectUrl) {
    redirect(redirectUrl);
  }

  // Fallback content if no redirect is configured
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-6">
          Past Conferences
        </h1>
        <p className="text-lg text-slate-600 mb-8">
          We&apos;re currently updating our past conferences section. Please check back soon or contact us for information about our previous events.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/"
            className="inline-flex items-center bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Home
          </a>
          <a
            href="/conferences"
            className="inline-flex items-center bg-white text-slate-700 px-8 py-4 rounded-xl font-semibold border-2 border-slate-300 hover:border-orange-500 hover:text-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
            </svg>
            View Upcoming Conferences
          </a>
        </div>
      </div>
    </div>
  );
}