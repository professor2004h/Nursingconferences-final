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

  const backgroundStyle = settings?.backgroundImage?.asset?.url 
    ? {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${settings.backgroundImage.asset.url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }
    : {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }

  return (
    <div className="min-h-screen" style={backgroundStyle}>
      {/* Header Section */}
      <div className="pt-20 pb-8 text-center text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {settings?.title || 'ABSTRACT SUBMISSION'}
          </h1>
          <nav className="text-sm">
            <span>Home</span>
            <span className="mx-2">»</span>
            <span>Abstract Submission</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-20">
        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
          {/* Form Section */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                {settings?.subtitle || 'Submit Your Abstract'}
              </h2>
              <AbstractSubmissionForm settings={settings} />
            </div>
          </div>

          {/* Template Download Section */}
          <div className="lg:w-1/3">
            <div className="bg-blue-900 rounded-lg p-8 text-white text-center">
              <div className="mb-6">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-blue-900" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4">
                {settings?.templateDownloadText || 'Download Abstract Template Here'}
              </h3>
              {settings?.abstractTemplate?.asset?.url ? (
                <a
                  href={settings.abstractTemplate.asset.url}
                  download
                  className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300"
                >
                  Download Now
                </a>
              ) : (
                <p className="text-blue-200">Template not available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
