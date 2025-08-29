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
    title: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    country: '',
    organization: '',
    interestedIn: '',
    trackName: '',
    abstractTitle: '',
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
          title: '',
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          country: '',
          organization: '',
          interestedIn: '',
          trackName: '',
          abstractTitle: '',
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Status Message */}
      {submitStatus.type && (
        <div className={`p-3 rounded-lg border text-sm ${
          submitStatus.type === 'success'
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {submitStatus.message}
        </div>
      )}

      {/* Row 1: Select Title, First Name, Last Name */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <select
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-sm"
          >
            <option value="">Select Title</option>
            <option value="Mr">Mr</option>
            <option value="Ms">Ms</option>
            <option value="Dr">Dr</option>
            <option value="Prof">Prof</option>
            <option value="Mrs">Mrs</option>
          </select>
        </div>

        <div>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
            placeholder="First Name"
          />
        </div>

        <div>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
            placeholder="Last Name"
          />
        </div>
      </div>

      {/* Row 2: Phone Number, Email, Country */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
            placeholder="Phone Number"
          />
        </div>

        <div>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
            placeholder="Email"
          />
        </div>

        <div className="relative">
          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-sm appearance-none"
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Row 3: Organization */}
      <div>
        <input
          type="text"
          id="organization"
          name="organization"
          value={formData.organization}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
          placeholder="Enter your organization/institution name"
        />
      </div>

      {/* Row 4: Category, Track */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <select
            id="interestedInCategory"
            name="interestedIn"
            value={formData.interestedIn}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-sm"
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
          <select
            id="trackName"
            name="trackName"
            value={formData.trackName}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-sm"
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

      {/* Row 5: Abstract Title */}
      <div>
        <input
          type="text"
          id="abstractTitle"
          name="abstractTitle"
          value={formData.abstractTitle}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
          placeholder="Enter your abstract title"
        />
      </div>

      {/* Row 6: File Upload */}
      <div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 font-medium">Attach your File (Doc or Pdf)</span>
          <input
            type="file"
            id="abstractFile"
            name="abstractFile"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
            required
            className="hidden"
          />
          <label
            htmlFor="abstractFile"
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors"
          >
            Choose File
          </label>
          <span className="text-sm text-gray-500">
            {formData.abstractFile ? formData.abstractFile.name : 'No file chosen'}
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <div className="text-center pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-8 py-2.5 rounded-full font-semibold text-white transition-all duration-300 text-sm ${
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
