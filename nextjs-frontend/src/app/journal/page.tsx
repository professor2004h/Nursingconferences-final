import Link from "next/link";
import { getSiteSettings } from "../getSiteSettings";
import { getJournalContent, getJournalMatterDescription } from "../getJournalContent";
import { getJournalSectionStyling, generateJournalBackgroundStyles, generateJournalOverlayStyles } from "../getJournalSectionStyling";

export const metadata = {
  title: "Journal - Intelli Global Conferences",
  description: "Explore cutting-edge research, academic insights, and scholarly publications from our global network of experts and researchers.",
};

export default async function JournalPage() {
  const siteSettings = await getSiteSettings();
  const journalContent = await getJournalContent();
  const journalStyling = await getJournalSectionStyling();
  
  // Get the journal matter description from the fetched content
  const journalMatter = getJournalMatterDescription(journalContent);
  
  // Generate background and overlay styles
  const backgroundStyles = generateJournalBackgroundStyles(journalStyling);
  const overlayStyles = generateJournalOverlayStyles(journalStyling);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section 
        className="py-16 md:py-24 bg-gradient-to-br from-slate-800 via-blue-900 to-slate-900 relative"
        style={backgroundStyles}
      >
        {/* Overlay for custom background */}
        {journalStyling?.isActive && journalStyling.backgroundImage && (
          <div 
            className="absolute inset-0"
            style={overlayStyles}
          />
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            JOURNAL
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            Explore cutting-edge research, academic insights, and scholarly publications 
            from our global network of experts and researchers.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            {journalMatter ? (
                <div className="text-2xl text-black max-w-3xl mx-auto leading-relaxed whitespace-pre-line">
                    {journalMatter}
                </div>
            ) : (
              <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                  Coming Soon
                </h2>
                <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                  Our journal section is currently under development. We're working to bring you 
                  the latest research papers, academic articles, and scholarly publications from 
                  conferences around the world.
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-6 bg-slate-50 rounded-xl">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Research Papers</h3>
              <p className="text-slate-600">
                Access peer-reviewed research papers from leading academics and researchers.
              </p>
            </div>

            <div className="text-center p-6 bg-slate-50 rounded-xl">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Conference Proceedings</h3>
              <p className="text-slate-600">
                Browse proceedings and presentations from our global conferences.
              </p>
            </div>

            <div className="text-center p-6 bg-slate-50 rounded-xl">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Latest Insights</h3>
              <p className="text-slate-600">
                Stay updated with the latest trends and insights in your field.
              </p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-slate-600 mb-6">
              Want to be notified when our journal goes live?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Contact Us
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/"
                className="inline-flex items-center border-2 border-slate-300 text-slate-700 px-8 py-3 rounded-lg font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-300"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
