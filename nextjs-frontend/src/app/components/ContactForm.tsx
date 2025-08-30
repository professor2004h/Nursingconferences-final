'use client';

import React, { useState, useEffect } from 'react';
import { getSiteSettings, type SiteSettings } from '../getSiteSettings';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[\+]?[0-9\s\-\(\)]{7,20}$/.test(formData.phone.trim())) {
      errors.phone = 'Please enter a valid phone number';
    }

    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters long';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Reset form on success
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setValidationErrors({});
      setSubmitStatus('success');

      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl md:rounded-2xl p-6 md:p-8 shadow-2xl">
      <div className="text-center mb-6 md:mb-8">
        <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Get in Touch</h3>
        <p className="text-orange-100 text-sm md:text-base">
          Ready to join our next conference? Send us a message and we&apos;ll get back to you soon.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        {/* Full Name Field */}
        <div>
          <input
            type="text"
            name="name"
            placeholder="Full Name *"
            value={formData.name}
            onChange={handleChange}
            required
            className={`w-full px-4 py-3 md:py-4 rounded-lg border-2 transition-all duration-300 focus:outline-none text-gray-900 placeholder-gray-500 text-sm md:text-base ${
              validationErrors.name
                ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                : 'border-gray-300 bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200'
            }`}
          />
          {validationErrors.name && (
            <p className="mt-1 text-sm text-red-600 bg-red-50 px-2 py-1 rounded border border-red-200">{validationErrors.name}</p>
          )}
        </div>

        {/* Email and Phone Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address *"
              value={formData.email}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 md:py-4 rounded-lg border-2 transition-all duration-300 focus:outline-none text-gray-900 placeholder-gray-500 text-sm md:text-base ${
                validationErrors.email
                  ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                  : 'border-gray-300 bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200'
              }`}
            />
            {validationErrors.email && (
              <p className="mt-1 text-sm text-red-600 bg-red-50 px-2 py-1 rounded border border-red-200">{validationErrors.email}</p>
            )}
          </div>
          <div>
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number *"
              value={formData.phone}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 md:py-4 rounded-lg border-2 transition-all duration-300 focus:outline-none text-gray-900 placeholder-gray-500 text-sm md:text-base ${
                validationErrors.phone
                  ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                  : 'border-gray-300 bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200'
              }`}
            />
            {validationErrors.phone && (
              <p className="mt-1 text-sm text-red-600 bg-red-50 px-2 py-1 rounded border border-red-200">{validationErrors.phone}</p>
            )}
          </div>
        </div>

        {/* Subject Field */}
        <div>
          <input
            type="text"
            name="subject"
            placeholder="Subject *"
            value={formData.subject}
            onChange={handleChange}
            required
            className={`w-full px-4 py-3 md:py-4 rounded-lg border-2 transition-all duration-300 focus:outline-none text-gray-900 placeholder-gray-500 text-sm md:text-base ${
              validationErrors.subject
                ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                : 'border-gray-300 bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200'
            }`}
          />
          {validationErrors.subject && (
            <p className="mt-1 text-sm text-red-600 bg-red-50 px-2 py-1 rounded border border-red-200">{validationErrors.subject}</p>
          )}
        </div>

        {/* Message Field */}
        <div>
          <textarea
            name="message"
            placeholder="Your Message *"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            required
            className={`w-full px-4 py-3 md:py-4 rounded-lg border-2 transition-all duration-300 focus:outline-none text-gray-900 placeholder-gray-500 resize-none text-sm md:text-base min-h-[120px] ${
              validationErrors.message
                ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                : 'border-gray-300 bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200'
            }`}
          />
          {validationErrors.message && (
            <p className="mt-1 text-sm text-red-600 bg-red-50 px-2 py-1 rounded border border-red-200">{validationErrors.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-white text-orange-600 font-bold py-3 md:py-4 px-6 rounded-lg hover:bg-gray-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 hover:shadow-lg text-sm md:text-base min-h-[48px] md:min-h-[52px]"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
              <span>Sending Message...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <span>Send Message</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
          )}
        </button>

        {/* Success Message */}
        {submitStatus === 'success' && (
          <div className="bg-green-100 border-2 border-green-400 text-green-800 px-4 py-3 rounded-lg flex items-center space-x-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">Thank you! Your message has been sent successfully. We&apos;ll get back to you soon.</span>
          </div>
        )}

        {/* Error Message */}
        {submitStatus === 'error' && (
          <div className="bg-red-100 border-2 border-red-400 text-red-800 px-4 py-3 rounded-lg flex items-center space-x-2">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">Sorry, there was an error sending your message. Please try again or contact us directly.</span>
          </div>
        )}
      </form>

      {/* Contact Information Footer */}
      <ContactFormFooter />
    </div>
  );
}

// Contact Form Footer Component with Dynamic Contact Info
function ContactFormFooter() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  // Fetch site settings on component mount
  React.useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const settings = await getSiteSettings();
        setSiteSettings(settings);
      } catch (error) {
        console.error('Error fetching site settings for contact form:', error);
      }
    };

    fetchSiteSettings();
  }, []);

  const formatWhatsAppNumber = (phone: string) => {
    // Remove all non-numeric characters except +
    return phone.replace(/[^\d+]/g, '').replace(/^\+/, '');
  };

  return (
    <div className="mt-6 pt-6 border-t border-slate-200">
      <div className="text-center space-y-3">
        <p className="text-slate-600 text-sm">
          Need immediate assistance? Contact us directly:
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
          {/* Email Contact */}
          {siteSettings?.contactInfo?.email && (
            <a
              href={`mailto:${siteSettings.contactInfo.email}`}
              className="flex items-center space-x-2 text-slate-700 font-medium hover:text-orange-500 transition-colors group"
            >
              <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-sm break-all">{siteSettings.contactInfo.email}</span>
            </a>
          )}

          {/* WhatsApp Contact */}
          {siteSettings?.contactInfo?.whatsapp && (
            <a
              href={`https://wa.me/${formatWhatsAppNumber(siteSettings.contactInfo.whatsapp)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg group"
            >
              <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.382"/>
              </svg>
              <span className="text-sm">WhatsApp Chat</span>
            </a>
          )}
        </div>

        {/* Fallback if no dynamic data */}
        {!siteSettings?.contactInfo?.email && !siteSettings?.contactInfo?.whatsapp && (
          <a
            href="mailto:contactus@intelliglobalconferences.com"
            className="text-slate-700 font-medium hover:text-orange-500 transition-colors text-sm break-all"
          >
            contactus@intelliglobalconferences.com
          </a>
        )}
      </div>
    </div>
  );
}
