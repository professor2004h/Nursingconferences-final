import { getSiteSettings, getFullBrandName } from '../getSiteSettings';
import { PortableText } from '@portabletext/react';
import Link from 'next/link';

export default async function TermsPage() {
  let siteSettings = null;

  try {
    siteSettings = await getSiteSettings();
  } catch (error) {
    console.error('Error fetching site settings for terms page:', error);
  }

  const termsContent = siteSettings?.footerContent?.termsAndConditions;

  return (
    <>
      {/* Header Spacer */}
      <div className="h-20"></div>

      {/* Terms & Conditions Content */}
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms & Conditions</h1>
            <p className="text-lg text-gray-600">
              Please read these terms and conditions carefully before using our services.
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            {termsContent && termsContent.length > 0 ? (
              <div className="prose prose-lg max-w-none">
                <PortableText value={termsContent} />
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Terms & Conditions</h3>
                <p className="text-gray-600 mb-6">
                  The terms and conditions content is being updated. Please check back soon or contact us for more information.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            )}
          </div>

          {/* Back to Home */}
          <div className="text-center mt-8">
            <Link
              href="/"
              className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export async function generateMetadata() {
  let siteSettings = null;

  try {
    siteSettings = await getSiteSettings();
  } catch (error) {
    console.error('Error fetching site settings for terms metadata:', error);
  }

  const fullBrandName = getFullBrandName(siteSettings);

  return {
    title: `Terms & Conditions - ${fullBrandName}`,
    description: 'Terms and conditions for using our conference services and website.',
  };
}
