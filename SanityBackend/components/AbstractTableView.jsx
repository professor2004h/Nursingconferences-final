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

  // Alternative download method using fetch to get proper content type
  const downloadFileWithFetch = async (fileUrl, fileName, fallbackName = 'abstract') => {
    try {
      console.log('🔍 Fetch Download Debug:', { fileUrl, fileName, fallbackName })

      const response = await fetch(fileUrl)
      const contentType = response.headers.get('content-type')
      const blob = await response.blob()

      console.log('🔍 Response headers:', {
        contentType,
        contentDisposition: response.headers.get('content-disposition')
      })

      // Determine extension from content type
      let extension = '.pdf' // default
      if (contentType) {
        if (contentType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
          extension = '.docx'
        } else if (contentType.includes('application/msword')) {
          extension = '.doc'
        } else if (contentType.includes('application/pdf')) {
          extension = '.pdf'
        }
      }

      // Create filename with correct extension
      let downloadFileName = fileName
      if (!downloadFileName || !downloadFileName.includes('.')) {
        downloadFileName = `${fallbackName}${extension}`
      } else {
        // Replace extension if it's wrong
        const nameWithoutExt = downloadFileName.split('.')[0]
        downloadFileName = `${nameWithoutExt}${extension}`
      }

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      link.download = downloadFileName

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Clean up
      window.URL.revokeObjectURL(url)

      console.log(`📄 Downloaded file via fetch: ${downloadFileName} (Content-Type: ${contentType})`)
    } catch (error) {
      console.error('❌ Fetch download failed, falling back to direct download:', error)
      downloadFile(fileUrl, fileName, fallbackName)
    }
  }

  const downloadFile = (fileUrl, fileName, fallbackName = 'abstract') => {
    if (fileUrl) {
      console.log('🔍 Download Debug Info:', {
        fileUrl,
        fileName,
        fallbackName,
        urlIncludes: {
          pdf: fileUrl.toLowerCase().includes('.pdf'),
          docx: fileUrl.toLowerCase().includes('.docx'),
          doc: fileUrl.toLowerCase().includes('.doc')
        }
      })

      const link = document.createElement('a')
      link.href = fileUrl
      link.target = '_blank'  // Force new tab
      link.rel = 'noopener noreferrer'  // Security

      // ENHANCED URL-BASED EXTENSION DETECTION
      let downloadFileName
      const urlLower = fileUrl.toLowerCase()

      // Extract actual file extension from Sanity URL
      // Sanity URLs typically look like: https://cdn.sanity.io/files/project/dataset/filename.ext
      const urlParts = fileUrl.split('/')
      const lastPart = urlParts[urlParts.length - 1]
      const urlExtension = lastPart.includes('.') ? lastPart.split('.').pop().toLowerCase() : null

      console.log('🔍 URL Analysis:', {
        urlParts,
        lastPart,
        urlExtension,
        detectedType: urlExtension
      })

      // Use URL extension to determine correct file type
      if (urlExtension === 'docx') {
        downloadFileName = fileName && fileName.includes('.') ? fileName : `${fallbackName}.docx`
        // Force correct extension
        if (fileName && !fileName.toLowerCase().endsWith('.docx')) {
          const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "")
          downloadFileName = `${nameWithoutExt}.docx`
        }
      } else if (urlExtension === 'doc') {
        downloadFileName = fileName && fileName.includes('.') ? fileName : `${fallbackName}.doc`
        // Force correct extension
        if (fileName && !fileName.toLowerCase().endsWith('.doc')) {
          const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "")
          downloadFileName = `${nameWithoutExt}.doc`
        }
      } else if (urlExtension === 'pdf') {
        downloadFileName = fileName && fileName.includes('.') ? fileName : `${fallbackName}.pdf`
        // Force correct extension
        if (fileName && !fileName.toLowerCase().endsWith('.pdf')) {
          const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "")
          downloadFileName = `${nameWithoutExt}.pdf`
        }
      } else {
        // Fallback to old method if URL parsing fails
        if (urlLower.includes('.docx')) {
          downloadFileName = `${fallbackName}.docx`
        } else if (urlLower.includes('.doc')) {
          downloadFileName = `${fallbackName}.doc`
        } else {
          downloadFileName = fileName || `${fallbackName}.pdf`
        }
      }

      link.download = downloadFileName

      // Add to DOM, click, and remove
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      console.log(`📄 Downloaded file: ${downloadFileName} (URL-based detection)`)
    }
  }

  const getFileIcon = (fileName) => {
    if (!fileName) return '📄'
    const ext = fileName.toLowerCase().split('.').pop()
    switch (ext) {
      case 'pdf': return '📄'
      case 'doc': return '📝'
      case 'docx': return '📝'
      default: return '📄'
    }
  }

  const getFileTypeLabel = (fileName) => {
    if (!fileName) return 'Document'
    const ext = fileName.toLowerCase().split('.').pop()
    switch (ext) {
      case 'pdf': return 'PDF'
      case 'doc': return 'DOC'
      case 'docx': return 'DOCX'
      default: return 'File'
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
        organization,
        interestedIn,
        trackName,
        abstractTitle,
        abstractContent,
        abstractFile{
          asset->{
            _id,
            url,
            originalFilename,
            mimeType,
            extension,
            size
          }
        },
        submissionDate,
        status,
        reviewNotes
      }`

      const submissions = await client.fetch(query)
      console.log('🔄 Refreshed submissions:', submissions.length)
      console.log('🔍 Sample submission with file:', submissions.find(s => s.abstractFile?.asset))
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
      'Organization',
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
      doc.organization || 'ABC',
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
                  <Text size={1} weight="semibold">Organization</Text>
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
                    <Text size={1}>{doc.organization || 'ABC'}</Text>
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
                      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}>
                        <Text size={1}>
                          {getFileIcon(doc.abstractFile.asset.originalFilename)}
                        </Text>
                        <Button
                          mode="ghost"
                          tone="primary"
                          icon={DownloadIcon}
                          text={getFileTypeLabel(doc.abstractFile.asset.originalFilename)}
                          fontSize={1}
                          padding={2}
                          onClick={() => {
                            console.log('🔍 File Data Debug:', {
                              url: doc.abstractFile.asset.url,
                              originalFilename: doc.abstractFile.asset.originalFilename,
                              fallback: `${doc.firstName}_${doc.lastName}_abstract`,
                              fullAsset: doc.abstractFile.asset
                            })
                            downloadFileWithFetch(
                              doc.abstractFile.asset.url,
                              doc.abstractFile.asset.originalFilename,
                              `${doc.firstName}_${doc.lastName}_abstract`
                            )
                          }}
                          title={`Download ${getFileTypeLabel(doc.abstractFile.asset.originalFilename)} (opens in new tab)`}
                        />
                      </div>
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
