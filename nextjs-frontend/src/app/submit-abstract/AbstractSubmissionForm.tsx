'use client'

import { useState } from 'react'
import { countries } from '../utils/countries'

interface AbstractSettings {
  interestedInOptions: Array<{ value: string; label: string }>
  trackNames: Array<{ value: string; label: string }>
}

interface Props {
  settings: AbstractSettings | null
}

export default function AbstractSubmissionForm({ settings }: Props) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    country: '',
    interestedIn: '',
    trackName: '',
    abstractTitle: '',
    abstractContent: '',
    abstractFile: null as File | null
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData(prev => ({
      ...prev,
      abstractFile: file
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: '' })

    try {
      const submitFormData = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          submitFormData.append(key, value)
        }
      })

      const response = await fetch('/api/abstract-submit', {
        method: 'POST',
        body: submitFormData
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'Abstract submitted successfully! We will review your submission and get back to you soon.'
        })
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          country: '',
          interestedIn: '',
          trackName: '',
          abstractTitle: '',
          abstractContent: '',
          abstractFile: null
        })
        // Reset file input
        const fileInput = document.getElementById('abstractFile') as HTMLInputElement
        if (fileInput) fileInput.value = ''
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.error || 'Failed to submit abstract. Please try again.'
        })
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Network error. Please check your connection and try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Status Message */}
      {submitStatus.type && (
        <div className={`p-4 rounded-lg ${
          submitStatus.type === 'success' 
            ? 'bg-green-100 border border-green-400 text-green-700' 
            : 'bg-red-100 border border-red-400 text-red-700'
        }`}>
          {submitStatus.message}
        </div>
      )}

      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="First Name"
          />
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Last Name *
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Last Name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email"
          />
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Phone Number"
          />
        </div>
      </div>

      <div>
        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
          Country *
        </label>
        <select
          id="country"
          name="country"
          value={formData.country}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Country</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="interestedIn" className="block text-sm font-medium text-gray-700 mb-1">
            Interested In *
          </label>
          <select
            id="interestedIn"
            name="interestedIn"
            value={formData.interestedIn}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Category</option>
            {settings?.interestedInOptions?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="trackName" className="block text-sm font-medium text-gray-700 mb-1">
            Track Name *
          </label>
          <select
            id="trackName"
            name="trackName"
            value={formData.trackName}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Track Name</option>
            {settings?.trackNames?.map((track) => (
              <option key={track.value} value={track.value}>
                {track.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="abstractTitle" className="block text-sm font-medium text-gray-700 mb-1">
          Abstract Title *
        </label>
        <input
          type="text"
          id="abstractTitle"
          name="abstractTitle"
          value={formData.abstractTitle}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your abstract title"
        />
      </div>

      <div>
        <label htmlFor="abstractContent" className="block text-sm font-medium text-gray-700 mb-1">
          Abstract Content *
        </label>
        <textarea
          id="abstractContent"
          name="abstractContent"
          value={formData.abstractContent}
          onChange={handleInputChange}
          required
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your abstract content..."
        />
      </div>

      <div>
        <label htmlFor="abstractFile" className="block text-sm font-medium text-gray-700 mb-1">
          Attach your file (Doc or Pdf) *
        </label>
        <input
          type="file"
          id="abstractFile"
          name="abstractFile"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-sm text-gray-500 mt-1">
          File size should not exceed 5MB. Accepted formats: PDF, DOC, DOCX
        </p>
      </div>

      <div className="text-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-8 py-3 rounded-full font-bold text-white transition-colors duration-300 ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-orange-500 hover:bg-orange-600'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Abstract'}
        </button>
      </div>
    </form>
  )
}
