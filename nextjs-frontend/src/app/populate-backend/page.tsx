'use client'

import { useState } from 'react'

export default function PopulateBackendPage() {
  const [status, setStatus] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const populateBackend = async () => {
    setLoading(true)
    setStatus('🚀 Populating Sanity backend with all dropdown options...')
    setResult(null)
    
    try {
      const response = await fetch('/api/populate-sanity', {
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

  return (
    <div style={{ 
      padding: '40px', 
      maxWidth: '800px', 
      margin: '0 auto',
      fontFamily: 'system-ui, sans-serif',
      lineHeight: '1.6'
    }}>
      <h1 style={{ color: '#1f2937', marginBottom: '20px' }}>
        🎯 Populate Sanity Backend
      </h1>
      
      <div style={{ 
        backgroundColor: '#f3f4f6', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '30px'
      }}>
        <h2 style={{ margin: '0 0 15px 0', color: '#374151' }}>What this will do:</h2>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li><strong>Interested In Options</strong>: Add 4 presentation types (Oral/Poster, In-Person/Virtual)</li>
          <li><strong>Track Names</strong>: Add 50+ nursing specialties (Nursing Education, Clinical Nursing, etc.)</li>
          <li><strong>Target</strong>: Abstract Settings document in Sanity Studio</li>
          <li><strong>Result</strong>: Admin can edit all options through Sanity interface</li>
        </ul>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <button 
          onClick={populateBackend}
          disabled={loading}
          style={{
            padding: '15px 30px',
            backgroundColor: loading ? '#9ca3af' : '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: '600'
          }}
        >
          {loading ? '🔄 Populating...' : '🚀 Populate Sanity Backend'}
        </button>
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
          <h3 style={{ color: '#374151' }}>📊 Population Results:</h3>
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '14px'
          }}>
            <p><strong>Document ID:</strong> {result.documentId}</p>
            <p><strong>Action:</strong> {result.message}</p>
            <p><strong>Interested In Options:</strong> {result.interestedInOptionsCount} items added</p>
            <p><strong>Track Names:</strong> {result.trackNamesCount} items added</p>
          </div>
        </div>
      )}

      <div style={{ 
        backgroundColor: '#eff6ff', 
        padding: '20px', 
        borderRadius: '8px',
        fontSize: '14px'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#1e40af' }}>📋 Next Steps:</h3>
        <ol style={{ margin: 0, paddingLeft: '20px' }}>
          <li>
            <strong>Verify in Sanity Studio:</strong>{' '}
            <a 
              href="http://localhost:3333/structure/abstractSubmissionSystem;abstractSettings" 
              target="_blank"
              style={{ color: '#2563eb' }}
            >
              Open Abstract Settings
            </a>
          </li>
          <li>
            <strong>Check the arrays:</strong> "Interested In Options" and "Track Names" should now show items
          </li>
          <li>
            <strong>Test frontend:</strong>{' '}
            <a 
              href="/submit-abstract" 
              target="_blank"
              style={{ color: '#2563eb' }}
            >
              Visit Submit Abstract Page
            </a>
          </li>
          <li>
            <strong>Edit as needed:</strong> Use Sanity Studio to add, remove, or modify options
          </li>
        </ol>
      </div>
    </div>
  )
}
