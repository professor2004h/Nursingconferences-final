'use client'

import { useState } from 'react'

export default function TestPopulatePage() {
  const [status, setStatus] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>(null)

  const testPopulate = async () => {
    setLoading(true)
    setStatus('Testing API call to populate Sanity...')
    
    try {
      const response = await fetch('/api/abstract-settings')
      const result = await response.json()
      
      if (response.ok) {
        setStatus('✅ API call successful! Check the data below and verify in Sanity Studio.')
        setData(result)
      } else {
        setStatus(`❌ API Error: ${result.error}`)
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
      <h1>Test Sanity Population</h1>
      <p>
        This will call the abstract-settings API which should automatically populate 
        the Sanity backend if the arrays are empty.
      </p>
      
      <div style={{ margin: '20px 0' }}>
        <button 
          onClick={testPopulate}
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
          {loading ? 'Testing...' : 'Test API Call'}
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

      {data && (
        <div style={{ marginTop: '20px' }}>
          <h3>Returned Data:</h3>
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '16px',
            borderRadius: '6px',
            fontSize: '12px',
            fontFamily: 'monospace',
            maxHeight: '400px',
            overflow: 'auto'
          }}>
            <p><strong>Interested In Options:</strong> {data.interestedInOptions?.length || 0} items</p>
            <p><strong>Track Names:</strong> {data.trackNames?.length || 0} items</p>
            <details>
              <summary>View Full Data</summary>
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </details>
          </div>
        </div>
      )}

      <div style={{ marginTop: '30px', fontSize: '14px', color: '#666' }}>
        <h3>After testing:</h3>
        <ul>
          <li>Check Sanity Studio: <a href="http://localhost:3333/structure/abstractSubmissionSystem;abstractSettings" target="_blank">Abstract Settings</a></li>
          <li>Verify that "Interested In Options" and "Track Names" are populated</li>
          <li>Test the frontend: <a href="/submit-abstract" target="_blank">Submit Abstract Page</a></li>
        </ul>
      </div>
    </div>
  )
}
