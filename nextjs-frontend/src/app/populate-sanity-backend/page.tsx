'use client'

import { useState } from 'react'

export default function PopulateSanityBackendPage() {
  const [status, setStatus] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const forcePopulate = async () => {
    setLoading(true)
    setStatus('🚀 Force populating Sanity backend with all dropdown options...')
    setResult(null)
    
    try {
      const response = await fetch('/api/force-populate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        setStatus('✅ SUCCESS! Sanity backend has been populated with all dropdown options!')
        setResult(data)
      } else {
        setStatus(`❌ ERROR: ${data.error}`)
        setResult(data)
      }
    } catch (error) {
      setStatus(`❌ NETWORK ERROR: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testApiCall = async () => {
    setLoading(true)
    setStatus('🔄 Testing API call that should auto-populate...')
    setResult(null)
    
    try {
      const response = await fetch('/api/abstract/settings')
      const data = await response.json()
      
      if (response.ok) {
        setStatus('✅ API call successful! Check if Sanity was populated.')
        setResult({
          success: true,
          message: 'API call completed',
          interestedInOptionsCount: data.interestedInOptions?.length || 0,
          trackNamesCount: data.trackNames?.length || 0,
          data: data
        })
      } else {
        setStatus(`❌ API Error: ${data.error}`)
      }
    } catch (error) {
      setStatus(`❌ Network Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      padding: '40px', 
      maxWidth: '900px', 
      margin: '0 auto',
      fontFamily: 'system-ui, sans-serif',
      lineHeight: '1.6'
    }}>
      <h1 style={{ color: '#1f2937', marginBottom: '20px' }}>
        🎯 Populate Sanity Backend with Dropdown Options
      </h1>
      
      <div style={{ 
        backgroundColor: '#f3f4f6', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '30px'
      }}>
        <h2 style={{ margin: '0 0 15px 0', color: '#374151' }}>Mission:</h2>
        <p style={{ margin: '0 0 15px 0' }}>
          Populate the Abstract Settings document in Sanity Studio with all dropdown options 
          that are currently hardcoded in the frontend.
        </p>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li><strong>Interested In Options</strong>: 4 presentation types (Oral/Poster, In-Person/Virtual)</li>
          <li><strong>Track Names</strong>: 50+ nursing specialties</li>
          <li><strong>Target</strong>: Make these options editable through Sanity Studio</li>
        </ul>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          padding: '20px',
          border: '2px solid #e5e7eb',
          borderRadius: '8px'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#374151' }}>Method 1: Force Populate</h3>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '15px' }}>
            Directly creates/updates the Sanity document with all options.
          </p>
          <button 
            onClick={forcePopulate}
            disabled={loading}
            style={{
              padding: '12px 20px',
              backgroundColor: loading ? '#9ca3af' : '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              width: '100%'
            }}
          >
            {loading ? '🔄 Populating...' : '🚀 Force Populate'}
          </button>
        </div>

        <div style={{
          padding: '20px',
          border: '2px solid #e5e7eb',
          borderRadius: '8px'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#374151' }}>Method 2: Test API</h3>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '15px' }}>
            Calls the API that should auto-populate if arrays are empty.
          </p>
          <button 
            onClick={testApiCall}
            disabled={loading}
            style={{
              padding: '12px 20px',
              backgroundColor: loading ? '#9ca3af' : '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              width: '100%'
            }}
          >
            {loading ? '🔄 Testing...' : '🧪 Test API Call'}
          </button>
        </div>
      </div>

      {status && (
        <div style={{
          padding: '20px',
          backgroundColor: status.includes('SUCCESS') ? '#d1fae5' : status.includes('ERROR') ? '#fee2e2' : '#f3f4f6',
          borderRadius: '8px',
          marginBottom: '20px',
          fontSize: '16px',
          fontWeight: '500'
        }}>
          {status}
        </div>
      )}

      {result && (
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#374151' }}>📊 Results:</h3>
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '14px'
          }}>
            <p><strong>Success:</strong> {result.success ? 'Yes' : 'No'}</p>
            <p><strong>Document ID:</strong> {result.documentId || result.data?._id || 'Not available'}</p>
            <p><strong>Action:</strong> {result.message}</p>
            <p><strong>Interested In Options:</strong> {result.interestedInOptionsCount} items</p>
            <p><strong>Track Names:</strong> {result.trackNamesCount} items</p>
          </div>
        </div>
      )}

      <div style={{ 
        backgroundColor: '#eff6ff', 
        padding: '20px', 
        borderRadius: '8px',
        fontSize: '14px'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#1e40af' }}>📋 Verification Steps:</h3>
        <ol style={{ margin: 0, paddingLeft: '20px' }}>
          <li>
            <strong>Check Sanity Studio:</strong>{' '}
            <a 
              href="http://localhost:3333/structure/abstractSubmissionSystem;abstractSettings" 
              target="_blank"
              style={{ color: '#2563eb' }}
            >
              Open Abstract Settings
            </a>
          </li>
          <li>
            <strong>Verify Arrays:</strong> "Interested In Options" and "Track Names" should show items instead of "No items"
          </li>
          <li>
            <strong>Test Frontend:</strong>{' '}
            <a 
              href="/submit-abstract" 
              target="_blank"
              style={{ color: '#2563eb' }}
            >
              Visit Submit Abstract Page
            </a>
          </li>
          <li>
            <strong>Test Editing:</strong> Try adding/removing options in Sanity Studio
          </li>
        </ol>
        
        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#dbeafe', borderRadius: '4px' }}>
          <strong>Expected Result:</strong> Sanity Studio should show populated dropdown arrays that admin can edit, 
          and frontend should continue displaying all options.
        </div>
      </div>
    </div>
  )
}
