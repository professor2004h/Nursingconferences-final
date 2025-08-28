# 📄 PDF New Tab Configuration for Sanity CMS

## 🎯 Overview

This configuration ensures that **ALL PDF files** throughout the Sanity Studio interface open in new browser tabs when administrators click download links. This prevents administrators from losing their current work session when reviewing or downloading PDF documents.

## 🔧 Implementation Components

### **1. Custom File Input Components**
- **Location**: `SanityBackend/components/CustomFileInput.jsx`
- **Components**:
  - `CustomFileInput` - General file input with new tab support
  - `PDFFileInput` - PDF-specific input with enhanced preview
  - `ReceiptFileInput` - Receipt-specific input with special styling

### **2. Global PDF Handler**
- **Location**: `SanityBackend/components/GlobalPDFHandler.js`
- **Functions**:
  - `handlePDFDownload()` - Core PDF download with new tab
  - `viewPDFInNewTab()` - PDF viewer in new tab
  - `downloadMultiplePDFs()` - Batch PDF downloads
  - `initializeGlobalPDFHandler()` - Global event listener

### **3. Enhanced Table Views**
- **Registration Table**: `SanityBackend/components/RegistrationTableView.js`
- **Abstract Table**: `SanityBackend/components/AbstractTableView.jsx`
- **Enhanced CSS**: `SanityBackend/components/RegistrationTableView.css`

## 📋 Affected Schemas

### **✅ Conference Registration Schema**
```typescript
// SanityBackend/schemaTypes/conferenceRegistration.ts
defineField({
  name: 'pdfReceipt',
  title: 'PDF Receipt',
  type: 'file',
  options: { accept: '.pdf' },
  components: {
    input: (props) => {
      const { ReceiptFileInput } = require('../components/CustomFileInput.jsx')
      return ReceiptFileInput(props)
    },
  },
  description: 'Generated PDF receipt - opens in new tab when downloaded',
})
```

### **✅ Abstract Submission Schema**
```typescript
// SanityBackend/schemaTypes/abstractSubmission.ts
defineField({
  name: 'abstractFile',
  title: 'Abstract File (PDF)',
  type: 'file',
  options: { accept: '.pdf' },
  components: {
    input: (props) => {
      const { PDFFileInput } = require('../components/CustomFileInput.jsx')
      return PDFFileInput(props)
    },
  },
  description: 'Abstract PDF document - opens in new tab when downloaded'
})
```

### **✅ Brochure Settings Schema**
```typescript
// SanityBackend/schemaTypes/brochureSettings.ts
defineField({
  name: 'pdfFile',
  title: 'PDF Brochure File',
  type: 'file',
  options: { accept: '.pdf' },
  components: {
    input: (props) => {
      const { PDFFileInput } = require('../components/CustomFileInput.jsx')
      return PDFFileInput(props)
    },
  },
  description: 'Upload the PDF brochure file - opens in new tab',
})
```

### **✅ Abstract Settings Schema**
```typescript
// SanityBackend/schemaTypes/abstractSettings.ts
defineField({
  name: 'abstractTemplate',
  title: 'Abstract Template File',
  type: 'file',
  options: { accept: '.pdf,.doc,.docx' },
  components: {
    input: (props) => {
      const { CustomFileInput } = require('../components/CustomFileInput.jsx')
      return CustomFileInput(props)
    },
  },
  description: 'Template file - PDFs open in new tab'
})
```

## 🎨 Visual Enhancements

### **PDF Download Button Styling**
- **Tooltip**: "Opens in new tab" on hover
- **Icon**: PDF icon with visual enhancement
- **Animation**: Subtle hover effects
- **Theme Support**: Light and dark theme compatibility

### **CSS Classes**
```css
.pdf-download-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.pdf-download-btn::after {
  content: "Opens in new tab";
  /* Tooltip styling */
}
```

## 🔒 Security Features

### **Link Security Attributes**
```javascript
link.target = '_blank'
link.rel = 'noopener noreferrer'
```

### **Benefits**:
- **`target="_blank"`** - Opens in new tab
- **`rel="noopener"`** - Prevents access to `window.opener`
- **`rel="noreferrer"`** - Prevents referrer information leakage

## 🚀 Usage Examples

### **Download PDF Receipt**
```javascript
const downloadPDF = (registration) => {
  const pdfUrl = registration.pdfReceipt?.asset?.url
  if (pdfUrl) {
    const fileName = `receipt_${registration.registrationId}.pdf`
    const link = document.createElement('a')
    link.href = pdfUrl
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
```

### **View PDF in New Tab**
```javascript
const viewPDF = (fileUrl, fileName) => {
  window.open(
    fileUrl, 
    '_blank', 
    'noopener,noreferrer,width=1200,height=800,scrollbars=yes,resizable=yes'
  )
}
```

## 📊 Enhanced Table Features

### **Registration Management Table**
- ✅ PDF receipt downloads open in new tabs
- ✅ Batch PDF download functionality
- ✅ Visual indicators for PDF availability
- ✅ Hover tooltips with download information

### **Abstract Submissions Table**
- ✅ Abstract PDF downloads open in new tabs
- ✅ File type detection and handling
- ✅ Enhanced download buttons with icons
- ✅ Responsive design for mobile devices

## 🔧 Configuration Files

### **Global Configuration**
```typescript
// SanityBackend/sanity.config.ts
import './components/GlobalPDFHandler'  // Initialize global PDF handler
```

### **Component Registration**
All file input components are automatically registered through schema definitions using the `components.input` property.

## ✅ Benefits

### **For Administrators**
1. **Session Preservation** - Never lose current work when downloading PDFs
2. **Multi-tasking** - Can review PDFs while continuing admin tasks
3. **Better UX** - Clear visual indicators for PDF downloads
4. **Consistent Behavior** - All PDFs behave the same way

### **For System**
1. **Security** - Proper `rel` attributes prevent security issues
2. **Performance** - Efficient download handling
3. **Accessibility** - Clear tooltips and visual cues
4. **Maintainability** - Centralized PDF handling logic

## 🎯 Coverage

This configuration applies to:

- ✅ **Registration Receipt PDFs** - Payment receipts from registrations
- ✅ **Abstract Submission PDFs** - Academic abstract documents
- ✅ **Brochure PDFs** - Conference brochure downloads
- ✅ **Template PDFs** - Abstract submission templates
- ✅ **Any Future PDF Fields** - Automatically inherits new tab behavior

## 🔄 Maintenance

### **Adding New PDF Fields**
When adding new PDF file fields to schemas, use this pattern:

```typescript
defineField({
  name: 'yourPdfField',
  title: 'Your PDF Field',
  type: 'file',
  options: { accept: '.pdf' },
  components: {
    input: (props) => {
      const { PDFFileInput } = require('../components/CustomFileInput.jsx')
      return PDFFileInput(props)
    },
  },
  description: 'Your PDF description - opens in new tab when downloaded',
})
```

### **Global Handler Updates**
The global PDF handler automatically catches any PDF links that don't have explicit new tab behavior, ensuring comprehensive coverage.

---

## 🎉 Result

**All PDF downloads throughout the Sanity Studio now open in new browser tabs, preserving administrator work sessions and providing a seamless document review experience.**
