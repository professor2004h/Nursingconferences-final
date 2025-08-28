// Global PDF download handler for Sanity Studio
// Ensures all PDF downloads open in new tabs

export const handlePDFDownload = (fileUrl, fileName = 'document.pdf', options = {}) => {
  if (!fileUrl) {
    console.warn('No file URL provided for PDF download')
    return false
  }

  try {
    // Create a temporary link element
    const link = document.createElement('a')
    
    // Set link properties for new tab opening
    link.href = fileUrl
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    link.download = fileName
    
    // Add additional attributes if provided
    if (options.title) {
      link.title = options.title
    }
    
    // Style the link to be invisible
    link.style.display = 'none'
    link.style.visibility = 'hidden'
    
    // Add to DOM, trigger click, and remove
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // Log successful download
    console.log(`📄 PDF download initiated: ${fileName}`)
    return true
    
  } catch (error) {
    console.error('Error downloading PDF:', error)
    return false
  }
}

// Enhanced PDF viewer that opens in new tab
export const viewPDFInNewTab = (fileUrl, fileName = 'document.pdf') => {
  if (!fileUrl) {
    console.warn('No file URL provided for PDF viewing')
    return false
  }

  try {
    // Open PDF in new tab with security attributes
    const newWindow = window.open(
      fileUrl, 
      '_blank', 
      'noopener,noreferrer,width=1200,height=800,scrollbars=yes,resizable=yes'
    )
    
    if (newWindow) {
      // Set window title if possible
      newWindow.document.title = fileName
      console.log(`👁️ PDF opened in new tab: ${fileName}`)
      return true
    } else {
      console.warn('Popup blocked - falling back to download')
      return handlePDFDownload(fileUrl, fileName)
    }
    
  } catch (error) {
    console.error('Error opening PDF in new tab:', error)
    return handlePDFDownload(fileUrl, fileName)
  }
}

// Batch PDF download handler
export const downloadMultiplePDFs = async (pdfList, delay = 500) => {
  if (!Array.isArray(pdfList) || pdfList.length === 0) {
    console.warn('No PDFs provided for batch download')
    return false
  }

  console.log(`📦 Starting batch download of ${pdfList.length} PDFs`)
  
  let successCount = 0
  
  for (let i = 0; i < pdfList.length; i++) {
    const pdf = pdfList[i]
    
    if (pdf.url) {
      const fileName = pdf.fileName || pdf.name || `document_${i + 1}.pdf`
      
      setTimeout(() => {
        if (handlePDFDownload(pdf.url, fileName)) {
          successCount++
        }
      }, i * delay)
    }
  }
  
  // Log completion after all downloads are initiated
  setTimeout(() => {
    console.log(`✅ Batch download completed: ${successCount}/${pdfList.length} PDFs`)
  }, pdfList.length * delay + 1000)
  
  return true
}

// Utility function to check if a file is a PDF
export const isPDFFile = (fileName) => {
  if (!fileName) return false
  return fileName.toLowerCase().endsWith('.pdf')
}

// Utility function to check if a file is a Word document
export const isWordDocument = (fileName) => {
  if (!fileName) return false
  const ext = fileName.toLowerCase()
  return ext.endsWith('.doc') || ext.endsWith('.docx')
}

// Utility function to check if a file should open in new tab
export const shouldOpenInNewTab = (fileName) => {
  if (!fileName) return false
  return isPDFFile(fileName) || isWordDocument(fileName)
}

// Utility function to get file extension
export const getFileExtension = (fileName) => {
  if (!fileName) return ''
  return fileName.split('.').pop().toLowerCase()
}

// Utility function to get file type description
export const getFileTypeDescription = (fileName) => {
  if (!fileName) return 'Document'
  const ext = getFileExtension(fileName)
  switch (ext) {
    case 'pdf': return 'PDF Document'
    case 'doc': return 'Word Document (.doc)'
    case 'docx': return 'Word Document (.docx)'
    default: return 'Document'
  }
}

// Enhanced file download handler for any file type
export const handleFileDownload = (fileUrl, fileName, forceNewTab = false) => {
  if (!fileUrl) {
    console.warn('No file URL provided for download')
    return false
  }

  const isPDF = isPDFFile(fileName)
  const isWord = isWordDocument(fileName)

  // Always open PDFs and Word docs in new tab, or if explicitly requested
  if (isPDF || isWord || forceNewTab) {
    return handlePDFDownload(fileUrl, fileName)
  }

  // For other files, use standard download
  try {
    const link = document.createElement('a')
    link.href = fileUrl
    link.download = fileName || 'document'
    link.style.display = 'none'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    console.log(`📁 File download initiated: ${fileName}`)
    return true

  } catch (error) {
    console.error('Error downloading file:', error)
    return false
  }
}

// Global event listener to intercept document clicks (PDF, DOC, DOCX)
export const initializeGlobalDocumentHandler = () => {
  // Add global click listener for document links
  document.addEventListener('click', (event) => {
    const target = event.target

    // Check if clicked element is a link to a document
    if (target.tagName === 'A' && target.href) {
      const href = target.href.toLowerCase()

      // Check for PDF, DOC, or DOCX files
      const isDocumentFile = href.includes('.pdf') || href.includes('.doc') || href.includes('.docx')

      // If it's a document link and doesn't already have target="_blank"
      if (isDocumentFile && target.target !== '_blank') {
        event.preventDefault()

        const fileName = target.download || target.textContent || 'document'
        handlePDFDownload(target.href, fileName)
      }
    }
  }, true) // Use capture phase to catch events early

  console.log('🔧 Global document handler initialized (PDF, DOC, DOCX)')
}

// Backward compatibility alias
export const initializeGlobalPDFHandler = initializeGlobalDocumentHandler

// Initialize on module load
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGlobalDocumentHandler)
  } else {
    initializeGlobalDocumentHandler()
  }
}
