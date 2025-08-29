const nodemailer = require('nodemailer');
const { createClient } = require('next-sanity');

// Import jsPDF for PDF generation
let jsPDF;
try {
  jsPDF = require('jspdf').jsPDF;
} catch (error) {
  console.warn('jsPDF not available for PDF generation:', error.message);
}

// Sanity client configuration
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'n3no08m3',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

/**
 * UNIFIED BLUE HEADER PDF GENERATION
 * This is the ONLY PDF template that should be used for client receipts
 */
async function generateBlueHeaderReceiptPDF(paymentData, registrationData, receiptSettings = null) {
  if (!jsPDF) {
    throw new Error('jsPDF not available for PDF generation');
  }

  // Fetch receipt settings if not provided
  if (!receiptSettings) {
    receiptSettings = await getReceiptSettings();
  }

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  // Layout constants for single-page design
  const LAYOUT = {
    margins: { left: 20, right: 20, top: 15, bottom: 20 },
    spacing: { sectionGap: 12, lineHeight: 8, headerGap: 10, fieldGap: 6 },
    header: { height: 50, titleY: 25, subtitleY: 40 }
  };

  // Blue header colors (matching the correct template)
  const headerColor = receiptSettings.receiptTemplate?.headerColor?.hex || '#4267B2';
  const headerRGB = hexToRgb(headerColor);
  
  const colors = {
    headerBg: headerRGB,
    headerText: [255, 255, 255],
    sectionHeader: headerRGB,
    labelText: [102, 102, 102],
    valueText: [51, 51, 51],
    footerText: [102, 102, 102]
  };

  // BLUE HEADER SECTION - This is the correct template
  doc.setFillColor(...colors.headerBg);
  doc.rect(0, 0, pageWidth, LAYOUT.header.height, 'F');

  // Company name in header
  doc.setTextColor(...colors.headerText);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(receiptSettings.companyName || 'Intelli Global Conferences', LAYOUT.margins.left, LAYOUT.header.titleY);

  // Registration Receipt subtitle
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Registration Receipt', LAYOUT.margins.left, LAYOUT.header.subtitleY);

  let yPos = LAYOUT.header.height + LAYOUT.spacing.headerGap + 10;

  // Conference Title
  doc.setTextColor(...colors.valueText);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(receiptSettings.conferenceTitle || 'International Nursing Conference 2025', LAYOUT.margins.left, yPos);
  yPos += LAYOUT.spacing.sectionGap + 5;

  // Payment Information Section
  yPos = addSection(doc, 'Payment Information', yPos, colors, LAYOUT);
  
  const paymentInfo = [
    ['Transaction ID:', paymentData.transactionId || 'N/A'],
    ['Order ID:', paymentData.orderId || 'N/A'],
    ['Amount:', `${paymentData.currency || 'USD'} ${paymentData.amount || '0.00'}`],
    ['Payment Method:', paymentData.paymentMethod || 'PayPal'],
    ['Payment Date:', formatDate(paymentData.paymentDate)],
    ['Status:', paymentData.status || 'Completed']
  ];

  yPos = addInfoFields(doc, paymentInfo, yPos, colors, LAYOUT);

  // Registration Details Section
  yPos = addSection(doc, 'Registration Details', yPos, colors, LAYOUT);
  
  const registrationInfo = [
    ['Registration ID:', registrationData.registrationId || registrationData._id || 'N/A'],
    ['Full Name:', getFullName(registrationData)],
    ['Email:', registrationData.email || registrationData.personalDetails?.email || 'N/A'],
    ['Phone:', registrationData.phone || registrationData.personalDetails?.phone || 'N/A'],
    ['Country:', registrationData.country || registrationData.personalDetails?.country || 'N/A'],
    ['Address:', getAddress(registrationData)],
    ['Registration Type:', registrationData.registrationType || registrationData.selectedType?.name || 'N/A'],
    ['Number of Participants:', registrationData.numberOfParticipants || '1']
  ];

  yPos = addInfoFields(doc, registrationInfo, yPos, colors, LAYOUT);

  // Payment Summary Section
  yPos = addSection(doc, 'Payment Summary', yPos, colors, LAYOUT);
  
  const summaryInfo = [
    ['Registration Fee:', `${paymentData.currency || 'USD'} ${paymentData.amount || '0.00'}`],
    ['Total Amount:', `${paymentData.currency || 'USD'} ${paymentData.amount || '0.00'}`]
  ];

  yPos = addInfoFields(doc, summaryInfo, yPos, colors, LAYOUT);

  // Contact Information Section
  yPos = addSection(doc, 'Contact Information', yPos, colors, LAYOUT);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...colors.valueText);
  doc.text(`Email: ${receiptSettings.contactInformation?.supportEmail || 'contactus@intelliglobalconferences.com'}`, LAYOUT.margins.left, yPos);

  // Footer
  const footerY = pageHeight - LAYOUT.margins.bottom - 10;
  doc.setFontSize(8);
  doc.setTextColor(...colors.footerText);
  doc.text(`© 2025 ${receiptSettings.conferenceTitle || 'International Nursing Conference 2025'}`, pageWidth / 2, footerY, { align: 'center' });
  doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth / 2, footerY + 6, { align: 'center' });

  return Buffer.from(doc.output('arraybuffer'));
}

// Helper functions
function addSection(doc, title, yPos, colors, layout) {
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.sectionHeader);
  doc.text(title, layout.margins.left, yPos);
  return yPos + layout.spacing.sectionGap;
}

function addInfoFields(doc, fields, yPos, colors, layout) {
  doc.setFontSize(9);
  
  fields.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.labelText);
    doc.text(label, layout.margins.left, yPos);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.valueText);
    doc.text(value, layout.margins.left + 60, yPos);
    
    yPos += layout.spacing.lineHeight;
  });
  
  return yPos + layout.spacing.fieldGap;
}

function getFullName(registrationData) {
  if (registrationData.fullName) return registrationData.fullName;
  if (registrationData.personalDetails) {
    const { title, firstName, lastName } = registrationData.personalDetails;
    return `${title || ''} ${firstName || ''} ${lastName || ''}`.trim();
  }
  return 'N/A';
}

function getAddress(registrationData) {
  if (registrationData.address) return registrationData.address;
  if (registrationData.personalDetails?.address) return registrationData.personalDetails.address;
  return 'N/A';
}

function formatDate(dateString) {
  if (!dateString) return new Date().toLocaleString();
  try {
    return new Date(dateString).toLocaleString();
  } catch {
    return dateString;
  }
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : [66, 103, 178]; // Default blue
}

/**
 * Get receipt settings from Sanity
 */
async function getReceiptSettings() {
  try {
    const query = `*[_type == "receiptSettings" && isActive == true][0]`;
    const settings = await sanityClient.fetch(query);
    
    if (!settings) {
      console.log('⚠️ No receipt settings found, using defaults');
      return getDefaultReceiptSettings();
    }
    
    return settings;
  } catch (error) {
    console.error('❌ Error fetching receipt settings:', error);
    return getDefaultReceiptSettings();
  }
}

function getDefaultReceiptSettings() {
  return {
    conferenceTitle: 'International Nursing Conference 2025',
    companyName: 'Intelli Global Conferences',
    receiptTemplate: {
      useBlueHeader: true,
      headerColor: { hex: '#4267B2' }
    },
    contactInformation: {
      supportEmail: 'contactus@intelliglobalconferences.com'
    }
  };
}

module.exports = {
  generateBlueHeaderReceiptPDF,
  getReceiptSettings
};
