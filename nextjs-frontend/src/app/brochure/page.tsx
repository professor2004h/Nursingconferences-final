import { Metadata } from 'next';
import BrochureDownloadForm from './BrochureDownloadForm';

export const metadata: Metadata = {
  title: 'Download Brochure | Intelli Global Conferences',
  description: 'Download our comprehensive conference brochure to learn more about upcoming events, speakers, and opportunities.',
  keywords: 'conference brochure, download, nursing conferences, medical events, healthcare',
  openGraph: {
    title: 'Download Conference Brochure',
    description: 'Get detailed information about our upcoming conferences and events.',
    type: 'website',
  },
};

export default function BrochurePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Compact Hero Section */}
      <div className="bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold">
              BROCHURE FORM
            </h1>
            <nav className="mt-4 text-sm text-blue-100">
              <span>Home</span>
              <span className="mx-2">»</span>
              <span>Brochure Form</span>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Left Column - Form */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Brochure Form
                </h2>
                <p className="text-gray-600 text-sm">
                  To download the brochure please fill out the below form
                </p>
              </div>

              <BrochureDownloadForm />
            </div>

            {/* Right Column - Download Section */}
            <div className="bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] rounded-lg shadow-lg p-8 text-white">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#f97316] rounded-full mb-6">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4">
                  Download Abstract template here
                </h3>
                <button className="inline-flex items-center px-6 py-3 bg-[#f97316] text-white font-semibold rounded-lg hover:bg-[#ea580c] transition-colors duration-200">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" />
                  </svg>
                  Download Here
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
