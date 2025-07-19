import React from 'react'
import { Card, Stack, Text, Flex, Button, Container } from '@sanity/ui'
import { useClient } from 'sanity'
import { normalizeCountryForDisplay } from '../utils/countryMapping.ts'
import './BrochureTableView.css'

// Theme-aware table view component
export default function BrochureTableView() {
  const [downloads, setDownloads] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const client = useClient({ apiVersion: '2023-01-01' })

  React.useEffect(() => {
    fetchDownloads()
  }, [])

  const fetchDownloads = async () => {
    try {
      setLoading(true)
      const query = `*[_type == "brochureDownload"] | order(downloadTimestamp desc) {
        _id,
        fullName,
        email,
        phone,
        organization,
        country,
        professionalTitle,
        downloadTimestamp
      }`

      const result = await client.fetch(query)
      setDownloads(result)
    } catch (err) {
      console.error('Error fetching downloads:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString()
  }

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Organization', 'Country', 'Title', 'Downloaded']
    const csvContent = [
      headers.join(','),
      ...downloads.map(d => [
        `"${d.fullName || ''}"`,
        `"${d.email || ''}"`,
        `"${d.phone || ''}"`,
        `"${d.organization || ''}"`,
        `"${normalizeCountryForDisplay(d.country)}"`,
        `"${d.professionalTitle || ''}"`,
        `"${formatDate(d.downloadTimestamp)}"`
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `brochure-downloads-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return React.createElement(Card, { padding: 4 },
      React.createElement(Text, null, 'Loading brochure downloads...')
    )
  }

  return React.createElement('div', { className: 'brochure-table-container' },
    React.createElement(Container, { width: 5 },
      React.createElement(Card, { padding: 4 },
      React.createElement(Stack, { space: 4 },
        // Header
        React.createElement(Flex, { align: 'center', justify: 'space-between' },
          React.createElement(Stack, { space: 2 },
            React.createElement(Text, { size: 4, weight: 'bold' },
              `📊 Brochure Downloads (${downloads.length})`
            )
          ),
          React.createElement(Flex, { gap: 2 },
            React.createElement(Button, {
              text: 'Refresh',
              onClick: fetchDownloads,
              mode: 'ghost'
            }),
            React.createElement(Button, {
              text: 'Export CSV',
              onClick: exportCSV,
              tone: 'primary',
              disabled: downloads.length === 0
            })
          )
        ),
        
        // Table
        downloads.length === 0
          ? React.createElement(Card, { padding: 4, tone: 'transparent' },
              React.createElement(Text, { align: 'center', muted: true },
                'No brochure downloads yet'
              )
            )
          : React.createElement('div', { className: 'brochure-table-wrapper' },
            React.createElement('table', { className: 'brochure-table' },
            React.createElement('thead', null,
              React.createElement('tr', null,
                React.createElement('th', null, 'Name'),
                React.createElement('th', null, 'Email'),
                React.createElement('th', null, 'Phone'),
                React.createElement('th', null, 'Organization'),
                React.createElement('th', null, 'Country'),
                React.createElement('th', null, 'Title'),
                React.createElement('th', null, 'Downloaded')
              )
            ),
            React.createElement('tbody', null,
              downloads.map((download) =>
                React.createElement('tr', { key: download._id },
                  React.createElement('td', null, download.fullName || 'N/A'),
                  React.createElement('td', null, download.email || 'N/A'),
                  React.createElement('td', null, download.phone || 'N/A'),
                  React.createElement('td', { className: 'muted' }, download.organization || 'Not provided'),
                  React.createElement('td', null, normalizeCountryForDisplay(download.country)),
                  React.createElement('td', { className: 'muted' }, download.professionalTitle || 'Not provided'),
                  React.createElement('td', null, formatDate(download.downloadTimestamp))
                )
              )
            )
            )
          )
      )
    )
  ))
}
