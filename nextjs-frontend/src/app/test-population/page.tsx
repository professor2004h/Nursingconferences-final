'use client'

import { useState } from 'react'

export default function TestPopulationPage() {
  const [status, setStatus] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>(null)

  const testPopulation = async () => {
    setLoading(true)
    setStatus('🔄 Testing API call to populate Sanity backend...')
    setData(null)
    
    try {
      const response = await fetch('/api/abstract/settings')
      const result = await response.json()
      
      if (response.ok) {
        setStatus('✅ SUCCESS! API call completed. Check the data below and verify in Sanity Studio.')
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
      maxWidth: '900px', 
      margin: '0 auto',
      fontFamily: 'system-ui, sans-serif',
      lineHeight: '1.6'
    }}>
      <h1 style={{ color: '#1f2937', marginBottom: '20px' }}>
        🎯 Test Sanity Backend Population
      </h1>
      
      <div style={{ 
        backgroundColor: '#f3f4f6', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '30px'
      }}>
        <h2 style={{ margin: '0 0 15px 0', color: '#374151' }}>What this test does:</h2>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li>Calls the <code>/api/abstract/settings</code> endpoint</li>
          <li>Automatically populates Sanity backend if arrays are empty</li>
          <li>Returns all dropdown options for the frontend</li>
          <li>Shows detailed logs in browser console</li>
        </ul>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <button 
          onClick={testPopulation}
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
          {loading ? '🔄 Testing...' : '🚀 Test Population API'}
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

      {data && (
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#374151' }}>📊 API Response Data:</h3>
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <p><strong>Document ID:</strong> {data._id || 'Not available'}</p>
            <p><strong>Title:</strong> {data.title}</p>
            <p><strong>Interested In Options:</strong> {data.interestedInOptions?.length || 0} items</p>
            <p><strong>Track Names:</strong> {data.trackNames?.length || 0} items</p>
          </div>
          
          <details style={{ marginBottom: '20px' }}>
            <summary style={{ cursor: 'pointer', fontWeight: '600', marginBottom: '10px' }}>
              📋 View Interested In Options ({data.interestedInOptions?.length || 0} items)
            </summary>
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '15px',
              borderRadius: '6px',
              fontSize: '14px',
              fontFamily: 'monospace'
            }}>
              {data.interestedInOptions?.map((option, index) => (
                <div key={index} style={{ marginBottom: '5px' }}>
                  <strong>{option.value}:</strong> {option.label}
                </div>
              ))}
            </div>
          </details>

          <details style={{ marginBottom: '20px' }}>
            <summary style={{ cursor: 'pointer', fontWeight: '600', marginBottom: '10px' }}>
              🏥 View Track Names ({data.trackNames?.length || 0} items)
            </summary>
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '15px',
              borderRadius: '6px',
              fontSize: '14px',
              fontFamily: 'monospace',
              maxHeight: '300px',
              overflow: 'auto'
            }}>
              {data.trackNames?.map((track, index) => (
                <div key={index} style={{ marginBottom: '5px' }}>
                  <strong>{track.value}:</strong> {track.label}
                </div>
              ))}
            </div>
          </details>
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
            <strong>Check Browser Console:</strong> Open DevTools (F12) to see detailed logs
          </li>
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
            <strong>Expected Result:</strong> Sanity Studio should show populated arrays instead of "No items"
          </li>
        </ol>
      </div>
    </div>
  )
}
