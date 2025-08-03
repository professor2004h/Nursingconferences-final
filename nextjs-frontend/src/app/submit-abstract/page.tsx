'use client'

import { useState, useEffect } from 'react'
import AbstractSubmissionForm from './AbstractSubmissionForm'

interface AbstractSettings {
  title: string
  subtitle: string
  backgroundImage?: {
    asset: {
      url: string
    }
  }
  abstractTemplate?: {
    asset: {
      url: string
    }
  }
  templateDownloadText: string
  submissionEnabled: boolean
  submissionDeadline?: string
  contactEmail?: string
  interestedInOptions: Array<{ value: string; label: string }>
  trackNames: Array<{ value: string; label: string }>
}

export default function AbstractSubmissionPage() {
  const [settings, setSettings] = useState<AbstractSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/abstract/settings')
      if (!response.ok) {
        throw new Error('Failed to fetch settings')
      }
      const data = await response.json()
      setSettings(data)
    } catch (err) {
      setError('Failed to load page settings')
      console.error('Error fetching settings:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
          <button 
            onClick={fetchSettings}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!settings?.submissionEnabled) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Abstract Submission Closed</h1>
          <p className="text-gray-600">Abstract submission is currently not available.</p>
          {settings?.contactEmail && (
            <p className="mt-4 text-gray-600">
              For inquiries, please contact: 
              <a href={`mailto:${settings.contactEmail}`} className="text-blue-600 hover:underline ml-1">
                {settings.contactEmail}
              </a>
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-28 md:pt-32">
      {/* Main Content - Compact Layout */}
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="flex flex-col lg:flex-row">
                {/* Form Section */}
                <div className="lg:w-3/5 p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Submit Your Abstract
                  </h2>
                  <AbstractSubmissionForm settings={settings} />
                </div>

                {/* Template Download Section */}
                <div className="lg:w-2/5 bg-gradient-to-br from-blue-800 to-blue-900 p-8 text-white flex flex-col justify-center">
                  <div className="text-center">
                    <div className="mb-6">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-4">
                      Download Abstract template here
                    </h3>
                    {settings?.abstractTemplate?.asset?.url ? (
                      <a
                        href={settings.abstractTemplate.asset.url}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300"
                      >
                        📥 Download Here
                      </a>
                    ) : (
                      <button className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300">
                        📥 Download Here
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
