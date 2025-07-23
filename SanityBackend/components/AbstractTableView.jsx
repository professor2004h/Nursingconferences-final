import React, {useState, useEffect} from 'react'
import {Card, Stack, Text, Flex, Badge, Button} from '@sanity/ui'
import {DownloadIcon, EyeOpenIcon, RefreshIcon} from '@sanity/icons'
import {useClient} from 'sanity'

const AbstractTableView = () => {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const client = useClient({apiVersion: '2023-05-03'})

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true)
        const query = `*[_type == "abstractSubmission"] | order(submissionDate desc) {
          _id,
          firstName,
          lastName,
          email,
          phoneNumber,
          country,
          interestedIn,
          trackName,
          abstractTitle,
          abstractContent,
          abstractFile{
            asset->{
              url,
              originalFilename
            }
          },
          submissionDate,
          status,
          reviewNotes
        }`

        const submissions = await client.fetch(query)
        console.log('📊 Fetched submissions:', submissions.length)
        setDocuments(submissions)
      } catch (err) {
        console.error('❌ Error fetching submissions:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchSubmissions()
  }, [client])

  if (loading) {
    return (
      <Card padding={4}>
        <Text>Loading submissions...</Text>
      </Card>
    )
  }

  if (error) {
    return (
      <Card padding={4}>
        <Text style={{color: 'red'}}>Error loading submissions: {error}</Text>
      </Card>
    )
  }

  if (!documents || documents.length === 0) {
    return (
      <Card padding={4}>
        <Text>No abstract submissions found. Try submitting a test abstract first.</Text>
      </Card>
    )
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'yellow',
      reviewing: 'blue',
      accepted: 'green',
      rejected: 'red',
      revision: 'orange'
    }
    return colors[status] || 'gray'
  }

  const getStatusText = (status) => {
    const texts = {
      pending: 'Pending Review',
      reviewing: 'Under Review',
      accepted: 'Accepted',
      rejected: 'Rejected',
      revision: 'Revision Required'
    }
    return texts[status] || 'Unknown'
  }

  const downloadFile = (fileUrl, fileName) => {
    if (fileUrl) {
      const link = document.createElement('a')
      link.href = fileUrl
      link.download = fileName || 'abstract.pdf'
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const refreshData = async () => {
    setLoading(true)
    try {
      const query = `*[_type == "abstractSubmission"] | order(submissionDate desc) {
        _id,
        firstName,
        lastName,
        email,
        phoneNumber,
        country,
        interestedIn,
        trackName,
        abstractTitle,
        abstractContent,
        abstractFile{
          asset->{
            url,
            originalFilename
          }
        },
        submissionDate,
        status,
        reviewNotes
      }`

      const submissions = await client.fetch(query)
      console.log('🔄 Refreshed submissions:', submissions.length)
      setDocuments(submissions)
    } catch (err) {
      console.error('❌ Error refreshing submissions:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = () => {
    if (!documents || documents.length === 0) {
      alert('No data to export')
      return
    }

    const headers = [
      'ID',
      'First Name',
      'Last Name',
      'Email',
      'Phone Number',
      'Country',
      'Category',
      'Track',
      'Title',
      'Status',
      'Submission Date',
      'File URL'
    ]

    const csvData = documents.map(doc => [
      doc._id?.slice(-8) || 'N/A',
      doc.firstName || '',
      doc.lastName || '',
      doc.email || '',
      doc.phoneNumber || '',
      doc.country || '',
      doc.interestedIn || '',
      doc.trackName || '',
      doc.abstractTitle || '',
      doc.status || '',
      doc.submissionDate ? new Date(doc.submissionDate).toLocaleDateString() : '',
      doc.abstractFile?.asset?.url || ''
    ])

    const csvContent = [
      headers.join(','),
      ...csvData.map(row =>
        row.map(field =>
          typeof field === 'string' && field.includes(',')
            ? `"${field.replace(/"/g, '""')}"`
            : field
        ).join(',')
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `abstract-submissions-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div style={{
      '--table-border': '1px solid hsl(0, 0%, 85%)',
      '--table-header-bg': 'hsl(0, 0%, 96%)',
      '--table-row-even': 'hsl(0, 0%, 98%)',
      '--table-row-odd': 'hsl(0, 0%, 100%)'
    }}>
      <style>{`
        @media (prefers-color-scheme: dark) {
          :root {
            --table-border: 1px solid hsl(0, 0%, 25%);
            --table-header-bg: hsl(0, 0%, 8%);
            --table-row-even: hsl(0, 0%, 12%);
            --table-row-odd: hsl(0, 0%, 10%);
          }
        }
        [data-scheme="dark"] {
          --table-border: 1px solid hsl(0, 0%, 25%);
          --table-header-bg: hsl(0, 0%, 8%);
          --table-row-even: hsl(0, 0%, 12%);
          --table-row-odd: hsl(0, 0%, 10%);
        }
      `}</style>
    <Card padding={4} tone="default">
      <Stack space={4}>
        <Flex justify="space-between" align="center">
          <Text size={2} weight="semibold">
            Abstract Submissions ({documents.length})
          </Text>
          <Flex gap={2}>
            <Button
              icon={RefreshIcon}
              text="Refresh"
              tone="default"
              onClick={refreshData}
              disabled={loading}
            />
            <Button
              icon={DownloadIcon}
              text="Export CSV"
              tone="primary"
              onClick={exportToCSV}
              disabled={loading || documents.length === 0}
            />
          </Flex>
        </Flex>

        <Card tone="transparent" padding={0} style={{
          overflowX: 'auto',
          borderRadius: '6px',
          border: 'var(--table-border)'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '14px'
          }}>
            <thead>
              <tr style={{
                borderBottom: '2px solid hsl(0, 0%, 85%)',
                backgroundColor: 'var(--table-header-bg)'
              }}>
                <th style={{
                  padding: '12px 8px',
                  textAlign: 'left',
                  fontWeight: '600'
                }}>
                  <Text size={1} weight="semibold">ID</Text>
                </th>
                <th style={{
                  padding: '12px 8px',
                  textAlign: 'left',
                  fontWeight: '600'
                }}>
                  <Text size={1} weight="semibold">Name</Text>
                </th>
                <th style={{
                  padding: '12px 8px',
                  textAlign: 'left',
                  fontWeight: '600'
                }}>
                  <Text size={1} weight="semibold">Email</Text>
                </th>
                <th style={{
                  padding: '12px 8px',
                  textAlign: 'left',
                  fontWeight: '600'
                }}>
                  <Text size={1} weight="semibold">Phone</Text>
                </th>
                <th style={{
                  padding: '12px 8px',
                  textAlign: 'left',
                  fontWeight: '600'
                }}>
                  <Text size={1} weight="semibold">Country</Text>
                </th>
                <th style={{
                  padding: '12px 8px',
                  textAlign: 'left',
                  fontWeight: '600'
                }}>
                  <Text size={1} weight="semibold">Category</Text>
                </th>
                <th style={{
                  padding: '12px 8px',
                  textAlign: 'left',
                  fontWeight: '600'
                }}>
                  <Text size={1} weight="semibold">Track</Text>
                </th>
                <th style={{
                  padding: '12px 8px',
                  textAlign: 'left',
                  fontWeight: '600'
                }}>
                  <Text size={1} weight="semibold">Title</Text>
                </th>
                <th style={{
                  padding: '12px 8px',
                  textAlign: 'left',
                  fontWeight: '600'
                }}>
                  <Text size={1} weight="semibold">Status</Text>
                </th>
                <th style={{
                  padding: '12px 8px',
                  textAlign: 'left',
                  fontWeight: '600'
                }}>
                  <Text size={1} weight="semibold">Date</Text>
                </th>
                <th style={{
                  padding: '12px 8px',
                  textAlign: 'center',
                  fontWeight: '600'
                }}>
                  <Text size={1} weight="semibold">File</Text>
                </th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc, index) => (
                <tr
                  key={doc._id}
                  style={{
                    borderBottom: '1px solid hsl(0, 0%, 90%)',
                    backgroundColor: index % 2 === 0 ? 'var(--table-row-even)' : 'var(--table-row-odd)'
                  }}
                >
                  <td style={{padding: '12px 8px'}}>
                    <Text size={1} style={{fontFamily: 'monospace', fontWeight: '500'}}>
                      {doc._id?.slice(-8) || 'N/A'}
                    </Text>
                  </td>
                  <td style={{padding: '12px 8px'}}>
                    <Text size={1} weight="medium">
                      {doc.firstName} {doc.lastName}
                    </Text>
                  </td>
                  <td style={{padding: '12px 8px'}}>
                    <Text size={1}>{doc.email}</Text>
                  </td>
                  <td style={{padding: '12px 8px'}}>
                    <Text size={1}>{doc.phoneNumber || 'N/A'}</Text>
                  </td>
                  <td style={{padding: '12px 8px'}}>
                    <Text size={1}>{doc.country}</Text>
                  </td>
                  <td style={{padding: '12px 8px'}}>
                    <Text size={1}>{doc.interestedIn}</Text>
                  </td>
                  <td style={{padding: '12px 8px'}}>
                    <Text size={1}>
                      {doc.trackName || 'N/A'}
                    </Text>
                  </td>
                  <td style={{padding: '12px 8px'}}>
                    <Text size={1}>{doc.abstractTitle || 'N/A'}</Text>
                  </td>
                  <td style={{padding: '12px 8px'}}>
                    <Badge 
                      tone={getStatusColor(doc.status)}
                      style={{fontSize: '11px'}}
                    >
                      {getStatusText(doc.status)}
                    </Badge>
                  </td>
                  <td style={{padding: '12px 8px'}}>
                    <Text size={1}>
                      {doc.submissionDate ? 
                        new Date(doc.submissionDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : 'N/A'
                      }
                    </Text>
                  </td>
                  <td style={{padding: '12px 8px', textAlign: 'center'}}>
                    {doc.abstractFile?.asset?.url ? (
                      <Button
                        mode="ghost"
                        tone="primary"
                        icon={DownloadIcon}
                        fontSize={1}
                        padding={2}
                        onClick={() => downloadFile(
                          doc.abstractFile.asset.url,
                          `${doc.firstName}_${doc.lastName}_abstract.pdf`
                        )}
                        title="Download Abstract"
                      />
                    ) : (
                      <Text size={1} muted>No file</Text>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </Stack>
    </Card>
    </div>
  )
}

export default AbstractTableView
