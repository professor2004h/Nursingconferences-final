import React from 'react'
import { FileInput } from 'sanity'
import { Card, Stack, Text, Button, Flex } from '@sanity/ui'
import { DownloadIcon, DocumentPdfIcon } from '@sanity/icons'

// Utility function to ensure proper file extension
const ensureFileExtension = (fileName, fileUrl) => {
  if (!fileName) {
    fileName = 'document'
  }

  // If filename already has extension, return as-is
  if (fileName.includes('.')) {
    return fileName
  }

  // Try to detect extension from URL
  const urlLower = fileUrl.toLowerCase()
  if (urlLower.includes('.pdf')) {
    return `${fileName}.pdf`
  } else if (urlLower.includes('.docx')) {
    return `${fileName}.docx`
  } else if (urlLower.includes('.doc')) {
    return `${fileName}.doc`
  } else {
    return `${fileName}.pdf` // Default fallback
  }
}

// Custom file input component that ensures PDFs open in new tabs
export default function CustomFileInput(props) {
  const { value, onChange, ...restProps } = props

  // Custom download handler that opens files in new tabs
  const handleDownload = (fileUrl, fileName) => {
    if (fileUrl) {
      // Create a temporary link element
      const link = document.createElement('a')
      link.href = fileUrl
      link.target = '_blank'  // Force new tab
      link.rel = 'noopener noreferrer'  // Security best practice

      // Ensure proper file extension
      const downloadFileName = ensureFileExtension(fileName, fileUrl)
      link.download = downloadFileName

      // Add to DOM, click, and remove
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      console.log(`📄 Downloaded file: ${downloadFileName}`)
    }
  }

  // Custom preview component for file display
  const CustomFilePreview = ({ file }) => {
    if (!file || !file.asset) return null

    const fileUrl = file.asset.url
    const fileName = file.asset.originalFilename || 'document.pdf'
    const isPDF = fileName.toLowerCase().endsWith('.pdf')

    return (
      <Card padding={3} tone="transparent" border>
        <Stack space={3}>
          <Flex align="center" gap={2}>
            {isPDF && <DocumentPdfIcon />}
            <Text size={1} weight="medium">
              {fileName}
            </Text>
          </Flex>
          
          {fileUrl && (
            <Flex gap={2}>
              <Button
                mode="ghost"
                tone="primary"
                icon={DownloadIcon}
                text="Download"
                fontSize={1}
                onClick={() => handleDownload(fileUrl, fileName)}
                title={`Download ${fileName} (opens in new tab)`}
              />
              
              {isPDF && (
                <Button
                  mode="ghost"
                  tone="default"
                  text="View"
                  fontSize={1}
                  onClick={() => window.open(fileUrl, '_blank', 'noopener,noreferrer')}
                  title={`View ${fileName} in new tab`}
                />
              )}
            </Flex>
          )}
        </Stack>
      </Card>
    )
  }

  return (
    <Stack space={3}>
      <FileInput
        {...restProps}
        value={value}
        onChange={onChange}
      />
      
      {value && <CustomFilePreview file={value} />}
    </Stack>
  )
}

// Enhanced file input specifically for PDF documents
export function PDFFileInput(props) {
  const { value, onChange, ...restProps } = props

  const handleDownload = (fileUrl, fileName) => {
    if (fileUrl) {
      const link = document.createElement('a')
      link.href = fileUrl
      link.target = '_blank'
      link.rel = 'noopener noreferrer'

      // For PDF files, ensure .pdf extension
      let downloadFileName = fileName || 'document.pdf'
      if (!downloadFileName.includes('.')) {
        downloadFileName += '.pdf'
      }

      link.download = downloadFileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      console.log(`📄 Downloaded PDF: ${downloadFileName}`)
    }
  }

  const PDFPreview = ({ file }) => {
    if (!file || !file.asset) return null

    const fileUrl = file.asset.url
    const fileName = file.asset.originalFilename || 'document.pdf'

    return (
      <Card padding={3} tone="positive" border>
        <Stack space={3}>
          <Flex align="center" gap={2}>
            <DocumentPdfIcon />
            <Text size={1} weight="medium">
              📄 {fileName}
            </Text>
          </Flex>
          
          <Text size={1} muted>
            PDF Document - Will open in new tab when downloaded
          </Text>
          
          {fileUrl && (
            <Flex gap={2}>
              <Button
                mode="ghost"
                tone="positive"
                icon={DownloadIcon}
                text="Download PDF"
                fontSize={1}
                onClick={() => handleDownload(fileUrl, fileName)}
                title={`Download ${fileName} (opens in new tab)`}
              />
              
              <Button
                mode="ghost"
                tone="primary"
                text="View PDF"
                fontSize={1}
                onClick={() => window.open(fileUrl, '_blank', 'noopener,noreferrer')}
                title={`View ${fileName} in new tab`}
              />
            </Flex>
          )}
        </Stack>
      </Card>
    )
  }

  return (
    <Stack space={3}>
      <FileInput
        {...restProps}
        value={value}
        onChange={onChange}
        accept=".pdf"
      />
      
      {value && <PDFPreview file={value} />}
    </Stack>
  )
}

// Document file input component for multiple file types (PDF, DOC, DOCX)
export function DocumentFileInput(props) {
  const { value, onChange, ...restProps } = props

  const handleDownload = (fileUrl, fileName) => {
    if (fileUrl) {
      const link = document.createElement('a')
      link.href = fileUrl
      link.target = '_blank'
      link.rel = 'noopener noreferrer'

      // Ensure proper file extension using utility function
      const downloadFileName = ensureFileExtension(fileName, fileUrl)
      link.download = downloadFileName

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      console.log(`📄 Downloaded document: ${downloadFileName}`)
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
      case 'pdf': return 'PDF Document'
      case 'doc': return 'Word Document (.doc)'
      case 'docx': return 'Word Document (.docx)'
      default: return 'Document'
    }
  }

  const DocumentPreview = ({ file }) => {
    if (!file || !file.asset) return null

    const fileUrl = file.asset.url
    const fileName = file.asset.originalFilename || 'document'
    const fileIcon = getFileIcon(fileName)
    const fileTypeLabel = getFileTypeLabel(fileName)

    return (
      <Card padding={3} tone="primary" border>
        <Stack space={3}>
          <Flex align="center" gap={2}>
            <Text size={2}>{fileIcon}</Text>
            <Text size={1} weight="medium">
              {fileName}
            </Text>
          </Flex>

          <Text size={1} muted>
            {fileTypeLabel} - Will open in new tab when downloaded
          </Text>

          {fileUrl && (
            <Flex gap={2}>
              <Button
                mode="ghost"
                tone="primary"
                icon={DownloadIcon}
                text="Download"
                fontSize={1}
                onClick={() => handleDownload(fileUrl, fileName)}
                title={`Download ${fileName} (opens in new tab)`}
              />

              <Button
                mode="ghost"
                tone="default"
                text="View"
                fontSize={1}
                onClick={() => window.open(fileUrl, '_blank', 'noopener,noreferrer')}
                title={`View ${fileName} in new tab`}
              />
            </Flex>
          )}
        </Stack>
      </Card>
    )
  }

  return (
    <Stack space={3}>
      <FileInput
        {...restProps}
        value={value}
        onChange={onChange}
        accept=".pdf,.doc,.docx"
      />

      {value && <DocumentPreview file={value} />}
    </Stack>
  )
}

// Receipt-specific file input component
export function ReceiptFileInput(props) {
  const { value, onChange, ...restProps } = props

  const handleDownload = (fileUrl, fileName) => {
    if (fileUrl) {
      const link = document.createElement('a')
      link.href = fileUrl
      link.target = '_blank'
      link.rel = 'noopener noreferrer'

      // For receipts, default to PDF but preserve original extension if provided
      let downloadFileName = fileName || 'receipt.pdf'
      if (!downloadFileName.includes('.')) {
        downloadFileName += '.pdf'
      }

      link.download = downloadFileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      console.log(`📄 Downloaded receipt: ${downloadFileName}`)
    }
  }

  const ReceiptPreview = ({ file }) => {
    if (!file || !file.asset) return null

    const fileUrl = file.asset.url
    const fileName = file.asset.originalFilename || 'receipt.pdf'

    return (
      <Card padding={3} tone="caution" border>
        <Stack space={3}>
          <Flex align="center" gap={2}>
            <DocumentPdfIcon />
            <Text size={1} weight="medium">
              🧾 {fileName}
            </Text>
          </Flex>
          
          <Text size={1} muted>
            Payment Receipt - Will open in new tab when downloaded
          </Text>
          
          {fileUrl && (
            <Flex gap={2}>
              <Button
                mode="ghost"
                tone="caution"
                icon={DownloadIcon}
                text="Download Receipt"
                fontSize={1}
                onClick={() => handleDownload(fileUrl, fileName)}
                title={`Download ${fileName} (opens in new tab)`}
              />
              
              <Button
                mode="ghost"
                tone="primary"
                text="View Receipt"
                fontSize={1}
                onClick={() => window.open(fileUrl, '_blank', 'noopener,noreferrer')}
                title={`View ${fileName} in new tab`}
              />
            </Flex>
          )}
        </Stack>
      </Card>
    )
  }

  return (
    <Stack space={3}>
      <FileInput
        {...restProps}
        value={value}
        onChange={onChange}
        accept=".pdf"
      />
      
      {value && <ReceiptPreview file={value} />}
    </Stack>
  )
}
