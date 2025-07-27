'use client';

import { useState } from 'react';
import { 
  BrochureFormData, 
  BrochureFormErrors, 
  BrochureSubmitResponse,
  COUNTRY_OPTIONS,
  validateBrochureForm,
  hasFormErrors
} from '../types/brochure';

export default function BrochureDownloadForm() {
  const [formData, setFormData] = useState<BrochureFormData>({
    fullName: '',
    email: '',
    phone: '',
    organization: '',
    country: '',
    professionalTitle: '',
  });

  const [errors, setErrors] = useState<BrochureFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [showDownload, setShowDownload] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof BrochureFormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateBrochureForm(formData);
    
    if (hasFormErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrors({});

    try {
      // Prepare form data with defaults for optional fields
      const submitData = {
        ...formData,
        country: formData.country || 'Not specified',
        professionalTitle: formData.professionalTitle || '',
      };

      const response = await fetch('/api/brochure/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const result: BrochureSubmitResponse = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || 'Failed to submit form');
      }

      // Success
      setSubmitStatus('success');
      setDownloadUrl(result.downloadUrl || '');
      setShowDownload(true);

      // Reset form after successful submission
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        organization: '',
        country: '',
        professionalTitle: '',
      });

    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      setErrors({
        general: error instanceof Error ? error.message : 'Failed to submit form. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      // Create a temporary link to trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'conference-brochure.pdf';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      {/* Success Message with Download */}
      {showDownload && submitStatus === 'success' && (
        <div className="mb-6 p-6 bg-green-50 border border-green-200 rounded-lg">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z" />
              </svg>
              <h3 className="text-lg font-semibold text-green-800">Success!</h3>
            </div>
            <p className="text-green-700 text-sm mb-4">
              Form submitted successfully! Your brochure is ready for download.
            </p>
            {downloadUrl && (
              <button
                onClick={handleDownload}
                className="inline-flex items-center px-6 py-3 bg-[#f97316] text-white font-semibold rounded-lg hover:bg-[#ea580c] transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" />
                </svg>
                Download Brochure PDF
              </button>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {errors.general && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
          <div className="flex items-center">
            <svg className="w-4 h-4 text-red-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
            </svg>
            <p className="text-red-700 text-sm">{errors.general}</p>
          </div>
        </div>
      )}

      {/* Compact Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded focus:ring-2 focus:ring-[#2563eb] focus:border-[#2563eb] transition-colors ${
              errors.fullName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Name*"
            disabled={isSubmitting}
          />
          {errors.fullName && (
            <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded focus:ring-2 focus:ring-[#2563eb] focus:border-[#2563eb] transition-colors ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Email*"
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Mobile Number */}
        <div>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded focus:ring-2 focus:ring-[#2563eb] focus:border-[#2563eb] transition-colors ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Mobile Number*"
            disabled={isSubmitting}
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
          )}
        </div>

        {/* Organization */}
        <div>
          <input
            type="text"
            id="organization"
            name="organization"
            value={formData.organization}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded focus:ring-2 focus:ring-[#2563eb] focus:border-[#2563eb] transition-colors ${
              errors.organization ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Organization/Institution*"
            disabled={isSubmitting}
          />
          {errors.organization && (
            <p className="mt-1 text-xs text-red-600">{errors.organization}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#2563eb] text-white font-semibold py-3 px-6 rounded hover:bg-[#1d4ed8] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Submitting...</span>
            </div>
          ) : (
            'Submit to Download'
          )}
        </button>
      </form>
    </div>
  );
}
