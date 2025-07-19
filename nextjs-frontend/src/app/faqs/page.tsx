import { getSiteSettingsFresh } from '../getSiteSettings';
// import { PortableText } from '@portabletext/react';
// import Link from 'next/link';
import FAQClient from './FAQClient';

interface FAQ {
  question: string;
  answer: any[];
}

export default async function FAQsPage() {
  console.log('🔍 Server: FAQ page rendering...');

  let faqs: FAQ[] = [];
  let debugInfo = '';

  try {
    console.log('🔍 Server: Starting FAQ fetch process...');
    console.log('⏰ Server: Timestamp:', new Date().toISOString());

    const siteSettings = await getSiteSettingsFresh();
    console.log('📊 Server: Site Settings received:', !!siteSettings);
    console.log('🔗 Server: Footer Content exists:', !!siteSettings?.footerContent);

    if (siteSettings?.footerContent) {
      console.log('📋 Server: Footer Content keys:', Object.keys(siteSettings.footerContent));
    }

    const faqsData = siteSettings?.footerContent?.faqs || [];
    console.log('❓ Server: FAQs Data type:', Array.isArray(faqsData) ? 'Array' : typeof faqsData);
    console.log('📝 Server: FAQs Count:', faqsData.length);
    console.log('🔍 Server: Raw FAQs Data:', JSON.stringify(faqsData, null, 2));

    if (faqsData.length > 0) {
      console.log('✅ Server: Setting FAQs with data:', faqsData);
      faqsData.forEach((faq, index) => {
        console.log(`Server FAQ ${index + 1}:`, {
          question: faq.question,
          hasAnswer: !!faq.answer,
          answerType: Array.isArray(faq.answer) ? 'Array' : typeof faq.answer
        });
      });
    } else {
      console.log('⚠️ Server: No FAQ data found - will show fallback');
    }

    faqs = faqsData;
    debugInfo = `Server rendered: ${new Date().toLocaleTimeString()} - FAQs: ${faqsData.length}`;
    console.log('✅ Server: FAQ data processed');
  } catch (error) {
    console.error('❌ Server: Error fetching FAQs:', error);
    debugInfo = `Server error: ${error instanceof Error ? error.message : String(error)}`;
  }

  return (
    <>
      {/* Header Spacer */}
      <div className="h-20"></div>

      {/* FAQs Content */}
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Find answers to common questions about our conferences and services.
            </p>
          </div>

          {/* Pass data to client component */}
          <FAQClient faqs={faqs} />
        </div>
      </div>
    </>
  );
}
