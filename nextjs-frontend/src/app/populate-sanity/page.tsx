'use client'

import { useState } from 'react'

export default function PopulateSanityPage() {
  const [status, setStatus] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const populateSanity = async () => {
    setLoading(true)
    setStatus('🚀 Populating Sanity with all frontend options...')
    setResult(null)
    
    try {
      const response = await fetch('/api/populate-sanity-options', {
        method: 'POST'
      })
      
      const data = await response.json()
      
      if (data.success) {
        setStatus('✅ SUCCESS! All options have been added to Sanity!')
        setResult(data)
      } else {
        setStatus(`❌ Error: ${data.error}`)
        setResult(data)
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
      maxWidth: '800px', 
      margin: '0 auto',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1>🎯 Populate Sanity Backend</h1>
      <p>
        This will add ALL the dropdown options from the frontend directly to your Sanity backend.
        After running this, you'll be able to edit all options through Sanity Studio.
      </p>
      
      <div style={{
        backgroundColor: '#f0f9ff',
        border: '1px solid #0ea5e9',
        borderRadius: '8px',
        padding: '16px',
        margin: '20px 0'
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#0369a1' }}>📋 What will be added:</h3>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li><strong>Interested In Options:</strong> 4 presentation types</li>
          <li><strong>Track Names:</strong> 50+ nursing specialties</li>
        </ul>
      </div>
      
      <div style={{ margin: '30px 0' }}>
        <button 
          onClick={populateSanity}
          disabled={loading}
          style={{
            padding: '16px 32px',
            backgroundColor: loading ? '#9ca3af' : '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '18px',
            fontWeight: 'bold'
          }}
        >
          {loading ? '⏳ Adding Options...' : '🚀 ADD ALL OPTIONS TO SANITY'}
        </button>
      </div>

      {status && (
        <div style={{
          padding: '20px',
          backgroundColor: status.includes('SUCCESS') ? '#dcfce7' : '#fef2f2',
          border: `1px solid ${status.includes('SUCCESS') ? '#16a34a' : '#dc2626'}`,
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
            {status}
          </div>
        </div>
      )}

      {result && result.success && (
        <div style={{
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '20px',
          marginTop: '20px'
        }}>
          <h3>📊 Population Results:</h3>
          <ul>
            <li><strong>Action:</strong> {result.action === 'created' ? 'Created new document' : 'Updated existing document'}</li>
            <li><strong>Document ID:</strong> {result.documentId}</li>
            <li><strong>Interested In Options:</strong> {result.interestedInCount} items added</li>
            <li><strong>Track Names:</strong> {result.trackNamesCount} items added</li>
          </ul>
        </div>
      )}

      <div style={{ 
        marginTop: '40px', 
        padding: '20px',
        backgroundColor: '#fffbeb',
        border: '1px solid #f59e0b',
        borderRadius: '8px'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#92400e' }}>🎯 Next Steps:</h3>
        <ol style={{ margin: 0, paddingLeft: '20px' }}>
          <li>
            <strong>Check Sanity Studio:</strong>{' '}
            <a 
              href="http://localhost:3333/structure/abstractSubmissionSystem;abstractSettings" 
              target="_blank"
              style={{ color: '#2563eb', textDecoration: 'underline' }}
            >
              Open Abstract Settings
            </a>
          </li>
          <li><strong>Verify Options:</strong> You should see all options populated in both arrays</li>
          <li><strong>Edit as Needed:</strong> Add, remove, or modify options through Sanity Studio</li>
          <li><strong>Test Frontend:</strong> Visit the abstract submission form to see the options</li>
        </ol>
      </div>

      <div style={{ 
        marginTop: '30px', 
        fontSize: '14px', 
        color: '#6b7280',
        textAlign: 'center'
      }}>
        <p>
          After population, the frontend will pull options from Sanity instead of hardcoded values.
          <br />
          Admin can manage all options through Sanity Studio interface.
        </p>
      </div>
    </div>
  )
}
