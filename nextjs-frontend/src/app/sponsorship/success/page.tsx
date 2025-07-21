'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [invoiceGenerated, setInvoiceGenerated] = useState(false);

  const paymentId = searchParams?.get('paymentId');
  const registrationId = searchParams?.get('registrationId');

  useEffect(() => {
    // Simulate invoice generation process
    const generateInvoice = async () => {
      try {
        // Simulate API call to generate invoice and send email
        await new Promise(resolve => setTimeout(resolve, 3000));
        setInvoiceGenerated(true);
      } catch (error) {
        console.error('Error generating invoice:', error);
      } finally {
        setLoading(false);
      }
    };

    if (paymentId && registrationId) {
      generateInvoice();
    } else {
      setLoading(false);
    }
  }, [paymentId, registrationId]);

  if (!paymentId || !registrationId) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Payment Session</h1>
          <p className="text-gray-600 mb-6">Payment information not found.</p>
          <Link
            href="/sponsorship"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Sponsorship
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          {loading ? (
            <div className="space-y-6">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
              <h1 className="text-2xl font-bold text-gray-900">Processing Your Registration</h1>
              <p className="text-gray-600">
                We're generating your invoice and sending confirmation emails. This may take a few moments...
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Success Icon */}
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              {/* Success Message */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Payment Successful!
                </h1>
                <p className="text-lg text-gray-600 mb-6">
                  Thank you for your sponsorship. Your registration has been confirmed.
                </p>
              </div>

              {/* Payment Details */}
              <div className="bg-gray-50 rounded-lg p-6 text-left max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Registration ID:</span>
                    <span className="font-medium">{registrationId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment ID:</span>
                    <span className="font-medium">{paymentId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="text-green-600 font-medium">Confirmed</span>
                  </div>
                </div>
              </div>

              {/* Invoice Status */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                {invoiceGenerated ? (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-blue-800">
                      <strong>Invoice generated and sent!</strong> Check your email for the invoice and confirmation details.
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <p className="text-blue-800">Generating invoice and sending confirmation email...</p>
                  </div>
                )}
              </div>

              {/* Next Steps */}
              <div className="text-left max-w-2xl mx-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Next?</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">1</span>
                    <p>You will receive a confirmation email with your invoice within the next few minutes.</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">2</span>
                    <p>Our team will contact you within 24-48 hours to discuss sponsorship benefits and logistics.</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">3</span>
                    <p>We'll work with you to maximize your sponsorship benefits and ensure a successful partnership.</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/sponsorship"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  View Sponsorship Info
                </Link>
                <Link
                  href="/"
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Back to Home
                </Link>
              </div>

              {/* Contact Information */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
                <p className="text-gray-600 mb-4">
                  If you have any questions about your sponsorship or need assistance, please contact us:
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
                  <a
                    href="mailto:intelliglobalconferences@gmail.com"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    intelliglobalconferences@gmail.com
                  </a>
                  <span className="hidden sm:inline text-gray-400">|</span>
                  <span className="text-gray-600">Registration ID: {registrationId}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
