'use client'

import { useState } from 'react'

export default function SetupAbstractPage() {
  const [status, setStatus] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const setupSettings = async () => {
    setLoading(true)
    setStatus('Setting up abstract settings...')
    
    try {
      const response = await fetch('/api/setup-abstract-settings', {
        method: 'POST'
      })
      
      const data = await response.json()
      
      if (data.success) {
        setStatus('✅ Abstract settings created successfully! You can now edit them in Sanity Studio.')
      } else {
        setStatus(`⚠️ ${data.message}`)
      }
    } catch (error) {
      setStatus(`❌ Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      padding: '40px', 
      maxWidth: '600px', 
      margin: '0 auto',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1>Abstract Settings Setup</h1>
      <p>
        This page will populate the Sanity backend with default abstract settings 
        including all the "Interested In Options" and "Track Names" that are currently 
        showing on the frontend.
      </p>
      
      <div style={{ margin: '20px 0' }}>
        <button 
          onClick={setupSettings}
          disabled={loading}
          style={{
            padding: '12px 24px',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          {loading ? 'Setting up...' : 'Setup Abstract Settings'}
        </button>
      </div>

      {status && (
        <div style={{
          padding: '16px',
          backgroundColor: '#f3f4f6',
          borderRadius: '6px',
          marginTop: '20px'
        }}>
          {status}
        </div>
      )}

      <div style={{ marginTop: '30px', fontSize: '14px', color: '#666' }}>
        <h3>What this does:</h3>
        <ul>
          <li>Creates an Abstract Settings document in Sanity</li>
          <li>Populates "Interested In Options" with 4 presentation types</li>
          <li>Populates "Track Names" with 50+ nursing specialties</li>
          <li>Sets default page title, subtitle, and other settings</li>
        </ul>
        
        <h3>After setup:</h3>
        <ul>
          <li>Visit Sanity Studio: <a href="http://localhost:3333/structure/abstractSubmissionSystem;abstractSettings" target="_blank">Abstract Settings</a></li>
          <li>Edit the options as needed</li>
          <li>Changes will automatically reflect on the frontend</li>
        </ul>
      </div>
    </div>
  )
}
