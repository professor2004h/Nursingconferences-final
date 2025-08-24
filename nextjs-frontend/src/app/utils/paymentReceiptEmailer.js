const nodemailer = require('nodemailer');
const { createClient } = require('next-sanity');

// Import jsPDF for PDF generation
let jsPDF;
try {
  jsPDF = require('jspdf').jsPDF;
} catch (error) {
  console.warn('jsPDF not available for PDF generation:', error.message);
}

// Import fetch for Node.js environments that don't have it globally
const fetch = globalThis.fetch || require('node-fetch');

/**
 * Payment Receipt Email Generator with Sanity CMS Integration
 * Features:
 * - Fetches footer logo from Sanity CMS
 * - Generates downloadable PDF receipts
 * - Uses navy blue branding colors (#0f172a, #1e3a8a)
 * - Sends professional receipt emails via contactus@intelliglobalconferences.com only
 */

// Brand colors matching website design
const BRAND_COLORS = {
  navyBlue: '#0f172a',      // slate-900 - Primary navy
  blueAccent: '#1e3a8a',    // blue-800 - Secondary navy
  lightBlue: '#1e40af',     // blue-700 - Accent
  white: '#ffffff',
  gray: '#666666',
  darkGray: '#333333',
  success: '#28a745'
};

// Sanity client configuration - DYNAMIC from environment
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'n3no08m3',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
  useCdn: true,
  token: process.env.SANITY_API_TOKEN, // For authenticated requests
});

// Sanity write client for uploading PDFs
const sanityWriteClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'n3no08m3',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // Required for uploads
});

/**
 * Generate PDF receipt with navy blue branding and gradient background
 */
async function generateReceiptPDF(paymentData, registrationData, footerLogo) {
  if (!jsPDF) {
    throw new Error('jsPDF not available for PDF generation');
  }

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  // Convert hex colors to RGB for jsPDF - EXACT match to email header colors
  const navyRGB = [15, 23, 42];      // #0f172a (exact dark navy blue from email)
  const blueRGB = [30, 58, 138];     // #1e3a8a (exact blue accent from email)
  const whiteRGB = [255, 255, 255];  // #ffffff
  const grayRGB = [102, 102, 102];   // #666666
  const darkGrayRGB = [51, 51, 51];  // #333333

  // Create EXACT navy blue gradient header background matching email header
  // Header height optimized for compact layout (38px)
  const headerHeight = 38;
  const leftMargin = 12; // Consistent compact left margin

  // Base dark navy blue background (exact match to email)
  doc.setFillColor(...navyRGB);
  doc.rect(0, 0, pageWidth, headerHeight, 'F');

  // Add gradient effect with exact same colors as email header
  for (let i = 0; i < headerHeight; i += 1) {
    const ratio = i / headerHeight;
    const r = Math.round(navyRGB[0] + (blueRGB[0] - navyRGB[0]) * ratio);
    const g = Math.round(navyRGB[1] + (blueRGB[1] - navyRGB[1]) * ratio);
    const b = Math.round(navyRGB[2] + (blueRGB[2] - navyRGB[2]) * ratio);
    doc.setFillColor(r, g, b);
    doc.rect(0, i, pageWidth, 1, 'F');
  }

  // Header layout matching email header EXACTLY - logo and text positioned independently
  doc.setTextColor(...whiteRGB);

  if (footerLogo?.url) {
    try {
      // HIGH QUALITY logo URL for crisp PDF display - enhanced parameters
      let optimizedLogoUrl = footerLogo.url;
      if (footerLogo.url.includes('cdn.sanity.io')) {
        // Maximum quality parameters for crisp logo display
        optimizedLogoUrl = `${footerLogo.url}?w=800&h=300&q=100&fit=max&fm=png`;
      }

      // Load and embed the actual logo image
      const logoResponse = await fetch(optimizedLogoUrl);
      const logoArrayBuffer = await logoResponse.arrayBuffer();
      const logoBase64 = Buffer.from(logoArrayBuffer).toString('base64');

      // Determine image format from URL or content type
      let imageFormat = 'PNG'; // Default to PNG for better quality
      if (footerLogo.url.toLowerCase().includes('.png')) {
        imageFormat = 'PNG';
      } else if (footerLogo.url.toLowerCase().includes('.jpg') || footerLogo.url.toLowerCase().includes('.jpeg')) {
        imageFormat = 'JPEG';
      }

      // Position ENLARGED logo prominently on the left side of header
      const logoX = leftMargin; // Left margin 12px
      const logoHeight = 24; // Enlarged for prominence (fits well in 38px header)
      const logoWidth = 72; // Maintain aspect ratio with larger size
      const logoY = (headerHeight - logoHeight) / 2; // Vertically centered

      // Add the HIGH QUALITY enlarged logo image to PDF
      const logoDataUrl = `data:image/${imageFormat.toLowerCase()};base64,${logoBase64}`;
      doc.addImage(logoDataUrl, imageFormat, logoX, logoY, logoWidth, logoHeight);

      console.log('✅ HIGH QUALITY enlarged logo image embedded in PDF successfully');
    } catch (logoError) {
      console.warn('⚠️  Failed to embed logo image, using text fallback:', logoError.message);
      // Fallback to company name if logo loading fails
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Intelli Global Conferences', leftMargin, headerHeight / 2 + 3);
    }
  } else {
    // No logo available - use company name
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Intelli Global Conferences', leftMargin, headerHeight / 2 + 3);
  }

  // NO "Registration Receipt" text in header - removed for cleaner look

  // Conference title - positioned below the compact 38px header
  doc.setTextColor(...darkGrayRGB);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('International Nursing Conference 2025', 20, headerHeight + 20);

  let yPos = headerHeight + 40; // Start content below compact header

  // Payment Information Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...blueRGB);
  doc.text('Payment Information', 20, yPos);
  yPos += 15;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayRGB);

  // Payment details
  const paymentDetails = [
    ['Transaction ID:', paymentData.transactionId || 'N/A'],
    ['Order ID:', paymentData.orderId || 'N/A'],
    ['Amount:', `${paymentData.currency || 'USD'} ${paymentData.amount || '0.00'}`],
    ['Payment Method:', paymentData.paymentMethod || 'PayPal'],
    ['Payment Date:', paymentData.paymentDate || new Date().toLocaleString()],
    ['Status:', paymentData.status || 'Completed']
  ];

  paymentDetails.forEach(([label, value]) => {
    doc.setTextColor(...grayRGB);
    doc.text(label, 20, yPos);
    doc.setTextColor(...darkGrayRGB);
    doc.text(value, 80, yPos);
    yPos += 12;
  });

  yPos += 10;

  // Registration Details Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...blueRGB);
  doc.text('Registration Details', 20, yPos);
  yPos += 15;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  const registrationDetails = [
    ['Registration ID:', registrationData.registrationId || 'N/A'],
    ['Full Name:', registrationData.fullName || 'N/A'],
    ['Email:', registrationData.email || 'N/A'],
    ['Phone:', registrationData.phone || 'N/A'],
    ['Country:', registrationData.country || 'N/A'],
    ['Address:', registrationData.address || 'N/A'],
    ['Registration Type:', registrationData.registrationType || 'Regular Registration'],
    ['Participants:', String(registrationData.numberOfParticipants || 1)]
  ];

  registrationDetails.forEach(([label, value]) => {
    doc.setTextColor(...grayRGB);
    doc.text(label, 20, yPos);
    doc.setTextColor(...darkGrayRGB);
    doc.text(value, 80, yPos);
    yPos += 12;
  });

  yPos += 20; // Extra spacing before contact info

  // Contact Information
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...blueRGB);
  doc.text('Contact Information', 20, yPos);
  yPos += 15;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...darkGrayRGB);
  doc.text('Email: contactus@intelliglobalconferences.com', 20, yPos);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(...grayRGB);
  doc.text('© 2025 International Nursing Conference 2025', 20, pageHeight - 20);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, pageHeight - 10);

  // Convert to buffer
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  return pdfBuffer;
}

/**
 * Upload PDF buffer to Sanity CMS as an asset
 */
async function uploadPDFToSanity(pdfBuffer, filename) {
  try {
    console.log(`📤 Uploading PDF to Sanity: ${filename}`);

    if (!process.env.SANITY_API_TOKEN) {
      console.warn('⚠️  SANITY_API_TOKEN not found, cannot upload PDF');
      return null;
    }

    // Upload the PDF as an asset
    const asset = await sanityWriteClient.assets.upload('file', pdfBuffer, {
      filename: filename,
      contentType: 'application/pdf'
    });

    console.log(`✅ PDF uploaded to Sanity successfully: ${asset._id}`);
    return asset;

  } catch (error) {
    console.error('❌ Failed to upload PDF to Sanity:', error.message);
    return null;
  }
}

/**
 * Update registration record with PDF receipt asset
 */
async function updateRegistrationWithPDF(registrationId, pdfAsset) {
  try {
    console.log(`🔄 Updating registration ${registrationId} with PDF asset...`);

    if (!pdfAsset || !process.env.SANITY_API_TOKEN) {
      console.warn('⚠️  Cannot update registration: missing PDF asset or API token');
      return false;
    }

    // Find the registration document
    const registration = await sanityWriteClient.fetch(
      `*[_type == "conferenceRegistration" && (_id == $id || registrationId == $regId)][0]`,
      { id: registrationId, regId: registrationId }
    );

    if (!registration) {
      console.warn(`⚠️  Registration not found: ${registrationId}`);
      return false;
    }

    // Update the registration with PDF asset
    const updateData = {
      pdfReceipt: {
        _type: 'file',
        asset: {
          _type: 'reference',
          _ref: pdfAsset._id
        }
      },
      // Also update the registrationTable data
      'registrationTable.pdfReceiptFile': {
        _type: 'file',
        asset: {
          _type: 'reference',
          _ref: pdfAsset._id
        }
      },
      lastUpdated: new Date().toISOString()
    };

    await sanityWriteClient.patch(registration._id).set(updateData).commit();

    console.log(`✅ Registration updated with PDF asset: ${registration._id}`);
    return true;

  } catch (error) {
    console.error('❌ Failed to update registration with PDF:', error.message);
    return false;
  }
}

/**
 * Fetch dynamic site settings from Sanity CMS
 */
async function getSiteSettings() {
  try {
    const query = `*[_type == "siteSettings"][0]{
      _id,
      logo{
        asset->{
          _id,
          url
        },
        alt
      },
      contactInfo{
        email,
        phone,
        address
      },
      footerContent{
        footerLogo{
          asset->{
            _id,
            url
          },
          alt
        }
      },
      adminSettings{
        emailSettings{
          smtpHost,
          smtpPort,
          smtpUser,
          smtpSecure,
          fromEmail,
          fromName
        }
      }
    }`;

    const siteSettings = await sanityClient.fetch(query);
    console.log('✅ Site settings fetched from Sanity CMS');
    return siteSettings;
  } catch (error) {
    console.error('⚠️  Failed to fetch site settings from Sanity:', error.message);
    return null;
  }
}

/**
 * Get footer logo from site settings
 */
async function getFooterLogo() {
  try {
    const siteSettings = await getSiteSettings();
    const footerLogo = siteSettings?.footerContent?.footerLogo;

    if (footerLogo?.asset?.url) {
      return {
        url: footerLogo.asset.url,
        alt: footerLogo.alt || 'Intelli Global Conferences Logo'
      };
    }

    return null;
  } catch (error) {
    console.error('⚠️  Failed to fetch footer logo from Sanity:', error.message);
    return null;
  }
}

/**
 * Get dynamic email configuration from Sanity CMS or environment
 */
async function getEmailConfig() {
  try {
    const siteSettings = await getSiteSettings();
    const emailSettings = siteSettings?.adminSettings?.emailSettings;

    // Use Sanity settings if available, otherwise fall back to environment variables
    return {
      host: emailSettings?.smtpHost || process.env.SMTP_HOST || 'smtp.hostinger.com',
      port: parseInt(emailSettings?.smtpPort || process.env.SMTP_PORT || '465'),
      secure: emailSettings?.smtpSecure !== false && (process.env.SMTP_SECURE === 'true' || true),
      user: emailSettings?.smtpUser || process.env.SMTP_USER || 'contactus@intelliglobalconferences.com',
      pass: process.env.SMTP_PASS, // Always from environment for security
      fromEmail: emailSettings?.fromEmail || process.env.EMAIL_FROM || 'contactus@intelliglobalconferences.com',
      fromName: emailSettings?.fromName || process.env.EMAIL_FROM_NAME || 'Intelli Global Conferences'
    };
  } catch (error) {
    console.error('⚠️  Failed to fetch email config from Sanity, using environment defaults:', error.message);
    return {
      host: process.env.SMTP_HOST || 'smtp.hostinger.com',
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: process.env.SMTP_SECURE === 'true' || true,
      user: process.env.SMTP_USER || 'contactus@intelliglobalconferences.com',
      pass: process.env.SMTP_PASS,
      fromEmail: process.env.EMAIL_FROM || 'contactus@intelliglobalconferences.com',
      fromName: process.env.EMAIL_FROM_NAME || 'Intelli Global Conferences'
    };
  }
}

/**
 * Send payment receipt email with footer logo
 * @param {Object} paymentData - Payment information
 * @param {Object} registrationData - Registration information
 * @param {string} recipientEmail - Email address to send receipt to
 */
async function sendPaymentReceiptEmail(paymentData, registrationData, recipientEmail) {
  try {
    // Fetch footer logo from Sanity
    const footerLogo = await getFooterLogo();

    // Generate PDF receipt
    let pdfBuffer = null;
    try {
      pdfBuffer = await generateReceiptPDF(paymentData, registrationData, footerLogo);
      console.log('✅ PDF receipt generated successfully');
    } catch (pdfError) {
      console.warn('⚠️  PDF generation failed, continuing with email only:', pdfError.message);
    }
    
    // Configure SMTP transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.hostinger.com',
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: process.env.SMTP_SECURE === 'true' || true,
      auth: {
        user: process.env.SMTP_USER || 'contactus@intelliglobalconferences.com',
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const mailOptions = {
      from: `"Intelli Global Conferences" <${process.env.SMTP_USER || 'contactus@intelliglobalconferences.com'}>`,
      to: recipientEmail,
      subject: '✅ Payment Receipt - International Nursing Conference 2025',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Payment Receipt</title>
          <style>
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f5f5f5;">
          
          <!-- Receipt Container -->
          <div id="receipt" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            
            <!-- Header with Navy Blue Branding -->
            <div style="background: linear-gradient(135deg, ${BRAND_COLORS.navyBlue} 0%, ${BRAND_COLORS.blueAccent} 50%, ${BRAND_COLORS.navyBlue} 100%); color: white; padding: 30px 20px; text-align: left;">
              ${footerLogo ? `
                <img src="${footerLogo.url}" alt="${footerLogo.alt}"
                     style="height: 60px; width: auto; max-width: 300px; object-fit: contain; margin-bottom: 10px; display: block;
                            border: none; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic;" />
              ` : `
                <h1 style="margin: 0; font-size: 24px; font-weight: bold;">Intelli Global Conferences</h1>
              `}
              <p style="margin: 8px 0 0 0; font-size: 16px; opacity: 0.9;">Registration Receipt</p>
            </div>
            
            <!-- Conference Title -->
            <div style="padding: 20px; background-color: #ffffff;">
              <h2 style="margin: 0; font-size: 18px; color: #333; font-weight: bold;">International Nursing Conference 2025</h2>
            </div>
            
            <!-- Payment Information -->
            <div style="padding: 0 20px 20px 20px;">
              <h3 style="color: ${BRAND_COLORS.blueAccent}; font-size: 16px; margin: 0 0 15px 0; font-weight: bold;">Payment Information</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                <tr>
                  <td style="padding: 6px 0; color: #666; width: 140px;">Transaction ID:</td>
                  <td style="padding: 6px 0; color: #333; font-weight: normal;">${paymentData.transactionId || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #666;">Order ID:</td>
                  <td style="padding: 6px 0; color: #333;">${paymentData.orderId || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #666;">Amount:</td>
                  <td style="padding: 6px 0; color: #333; font-weight: bold;">${paymentData.currency || 'USD'} ${paymentData.amount || '0.00'}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #666;">Payment Method:</td>
                  <td style="padding: 6px 0; color: #333;">${paymentData.paymentMethod || 'PayPal'}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #666;">Payment Date:</td>
                  <td style="padding: 6px 0; color: #333;">${paymentData.paymentDate || new Date().toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #666;">Status:</td>
                  <td style="padding: 6px 0; color: #28a745; font-weight: bold;">${paymentData.status || 'Completed'}</td>
                </tr>
              </table>
            </div>
            
            <!-- Registration Details -->
            <div style="padding: 0 20px 20px 20px;">
              <h3 style="color: ${BRAND_COLORS.blueAccent}; font-size: 16px; margin: 0 0 15px 0; font-weight: bold;">Registration Details</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                <tr>
                  <td style="padding: 6px 0; color: #666; width: 140px;">Registration ID:</td>
                  <td style="padding: 6px 0; color: #333; font-family: monospace; font-size: 11px;">${registrationData.registrationId || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #666;">Full Name:</td>
                  <td style="padding: 6px 0; color: #333;">${registrationData.fullName || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #666;">Email:</td>
                  <td style="padding: 6px 0; color: #333;">${registrationData.email || recipientEmail}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #666;">Phone:</td>
                  <td style="padding: 6px 0; color: #333;">${registrationData.phone || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #666;">Country:</td>
                  <td style="padding: 6px 0; color: #333;">${registrationData.country || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #666;">Address:</td>
                  <td style="padding: 6px 0; color: #333;">${registrationData.address || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #666;">Registration Type:</td>
                  <td style="padding: 6px 0; color: #333;">${registrationData.registrationType || 'Regular Registration'}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #666;">Number of Participants:</td>
                  <td style="padding: 6px 0; color: #333;">${String(registrationData.numberOfParticipants || 1)}</td>
                </tr>
              </table>
            </div>
            
            <!-- Payment Summary -->
            <div style="padding: 0 20px 20px 20px;">
              <h3 style="color: ${BRAND_COLORS.blueAccent}; font-size: 16px; margin: 0 0 15px 0; font-weight: bold;">Payment Summary</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                <tr>
                  <td style="padding: 6px 0; color: #666; width: 140px;">Registration Fee:</td>
                  <td style="padding: 6px 0; color: #333;">${paymentData.currency || 'USD'} ${paymentData.amount || '0.00'}</td>
                </tr>
                <tr style="border-top: 1px solid #ddd;">
                  <td style="padding: 10px 0 6px 0; color: #666; font-weight: bold;">Total Amount:</td>
                  <td style="padding: 10px 0 6px 0; color: #333; font-weight: bold; font-size: 14px;">${paymentData.currency || 'USD'} ${paymentData.amount || '0.00'}</td>
                </tr>
              </table>
            </div>
            
            <!-- Contact Information -->
            <div style="padding: 0 20px 30px 20px;">
              <h3 style="color: ${BRAND_COLORS.blueAccent}; font-size: 14px; margin: 0 0 10px 0; font-weight: bold;">Contact Information</h3>
              <p style="margin: 0; font-size: 12px; color: ${BRAND_COLORS.darkGray};">
                Email: <a href="mailto:contactus@intelliglobalconferences.com" style="color: ${BRAND_COLORS.blueAccent};">contactus@intelliglobalconferences.com</a>
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f8f9fa; padding: 15px 20px; text-align: center; border-top: 1px solid #dee2e6;">
              <p style="margin: 0 0 5px 0; font-size: 10px; color: #666;">© 2025 International Nursing Conference 2025</p>
              <p style="margin: 0; font-size: 10px; color: #999;">Generated on: ${new Date().toLocaleString()}</p>
            </div>
            
          </div>
          

          
        </body>
        </html>
      `,
      text: `
PAYMENT RECEIPT - International Nursing Conference 2025

PAYMENT INFORMATION:
Transaction ID: ${paymentData.transactionId || 'N/A'}
Order ID: ${paymentData.orderId || 'N/A'}
Amount: ${paymentData.currency || 'USD'} ${paymentData.amount || '0.00'}
Payment Method: ${paymentData.paymentMethod || 'PayPal'}
Payment Date: ${paymentData.paymentDate || new Date().toLocaleString()}
Status: ${paymentData.status || 'Completed'}

REGISTRATION DETAILS:
Registration ID: ${registrationData.registrationId || 'N/A'}
Full Name: ${registrationData.fullName || 'N/A'}
Email: ${registrationData.email || recipientEmail}
Phone: ${registrationData.phone || 'N/A'}
Country: ${registrationData.country || 'N/A'}
Address: ${registrationData.address || 'N/A'}
Registration Type: ${registrationData.registrationType || 'Regular Registration'}
Number of Participants: ${String(registrationData.numberOfParticipants || 1)}

PAYMENT SUMMARY:
Registration Fee: ${paymentData.currency || 'USD'} ${paymentData.amount || '0.00'}
Total Amount: ${paymentData.currency || 'USD'} ${paymentData.amount || '0.00'}

CONTACT INFORMATION:
Email: contactus@intelliglobalconferences.com

© 2025 International Nursing Conference 2025
Generated on: ${new Date().toLocaleString()}
      `,
      attachments: pdfBuffer ? [
        {
          filename: `Payment_Receipt_${paymentData.transactionId || 'Receipt'}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        }
      ] : []
    };

    const result = await transporter.sendMail(mailOptions);

    // Upload PDF to Sanity CMS after successful email sending
    let pdfUploaded = false;
    let pdfAssetId = null;

    if (pdfBuffer && registrationData._id) {
      const filename = `receipt_${registrationData.registrationId || 'unknown'}_${Date.now()}.pdf`;
      const pdfAsset = await uploadPDFToSanity(pdfBuffer, filename);

      if (pdfAsset) {
        const updateSuccess = await updateRegistrationWithPDF(registrationData._id, pdfAsset);
        pdfUploaded = updateSuccess;
        pdfAssetId = pdfAsset._id;

        if (updateSuccess) {
          console.log(`✅ PDF receipt stored in Sanity for registration: ${registrationData._id}`);
        }
      }
    }

    return {
      success: true,
      messageId: result.messageId,
      logoUsed: !!footerLogo,
      logoUrl: footerLogo?.url || null,
      pdfGenerated: !!pdfBuffer,
      pdfSize: pdfBuffer ? pdfBuffer.length : 0,
      pdfUploaded: pdfUploaded,
      pdfAssetId: pdfAssetId
    };

  } catch (error) {
    console.error('❌ Failed to send payment receipt email:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Send payment receipt email with REAL dynamic data from PayPal and Sanity CMS
 * @param {Object} paymentData - REAL payment information from PayPal
 * @param {Object} registrationData - REAL registration information from Sanity
 * @param {string} recipientEmail - Email address to send receipt to
 */
async function sendPaymentReceiptEmailWithRealData(paymentData, registrationData, recipientEmail) {
  try {
    console.log('🚀 Sending payment receipt with REAL dynamic data...');

    // Validate that we have real payment data (not test values)
    if (!paymentData.transactionId || paymentData.transactionId.includes('test') || paymentData.transactionId.includes('TEST')) {
      console.warn('⚠️  Warning: Payment data appears to be test data');
    }

    // Fetch dynamic content from Sanity CMS
    const [footerLogo, emailConfig, siteSettings] = await Promise.all([
      getFooterLogo(),
      getEmailConfig(),
      getSiteSettings()
    ]);

    // Generate PDF receipt with real data
    let pdfBuffer = null;
    try {
      pdfBuffer = await generateReceiptPDF(paymentData, registrationData, footerLogo);
      console.log('✅ PDF receipt generated successfully with real data');
    } catch (pdfError) {
      console.warn('⚠️  PDF generation failed, continuing with email only:', pdfError.message);
    }

    // Configure SMTP transporter with dynamic settings
    const transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: {
        user: emailConfig.user,
        pass: emailConfig.pass,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    console.log('📧 Using email configuration:', {
      host: emailConfig.host,
      port: emailConfig.port,
      user: emailConfig.user,
      fromEmail: emailConfig.fromEmail
    });

    const mailOptions = {
      from: `"${emailConfig.fromName}" <${emailConfig.fromEmail}>`,
      to: recipientEmail,
      subject: '✅ Payment Receipt - International Nursing Conference 2025',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Payment Receipt</title>
          <style>
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f5f5f5;">

          <!-- Receipt Container -->
          <div id="receipt" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

            <!-- Header with Navy Blue Branding -->
            <div style="background: linear-gradient(135deg, ${BRAND_COLORS.navyBlue} 0%, ${BRAND_COLORS.blueAccent} 50%, ${BRAND_COLORS.navyBlue} 100%); color: white; padding: 30px 20px; text-align: left;">
              ${footerLogo ? `
                <img src="${footerLogo.url}" alt="${footerLogo.alt}"
                     style="height: 60px; width: auto; max-width: 300px; object-fit: contain; margin-bottom: 10px; display: block;
                            border: none; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic;" />
              ` : `
                <h1 style="margin: 0; font-size: 24px; font-weight: bold;">Intelli Global Conferences</h1>
              `}
              <p style="margin: 8px 0 0 0; font-size: 16px; opacity: 0.9;">Registration Receipt</p>
            </div>

            <!-- Conference Title -->
            <div style="padding: 20px; background-color: #ffffff;">
              <h2 style="margin: 0; font-size: 18px; color: #333; font-weight: bold;">International Nursing Conference 2025</h2>
            </div>

            <!-- Payment Information -->
            <div style="padding: 0 20px 20px 20px;">
              <h3 style="color: ${BRAND_COLORS.blueAccent}; font-size: 16px; margin: 0 0 15px 0; font-weight: bold;">Payment Information</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                <tr>
                  <td style="padding: 6px 0; color: #666; width: 140px;">Transaction ID:</td>
                  <td style="padding: 6px 0; color: #333; font-weight: normal;">${paymentData.transactionId || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #666;">Order ID:</td>
                  <td style="padding: 6px 0; color: #333;">${paymentData.orderId || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #666;">Amount:</td>
                  <td style="padding: 6px 0; color: #333; font-weight: bold;">${paymentData.currency || 'USD'} ${paymentData.amount || '0.00'}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #666;">Payment Method:</td>
                  <td style="padding: 6px 0; color: #333;">${paymentData.paymentMethod || 'PayPal'}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #666;">Payment Date:</td>
                  <td style="padding: 6px 0; color: #333;">${paymentData.paymentDate || new Date().toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #666;">Status:</td>
                  <td style="padding: 6px 0; color: #28a745; font-weight: bold;">${paymentData.status || 'Completed'}</td>
                </tr>
              </table>
            </div>

            <!-- Registration Details -->
            <div style="padding: 0 20px 20px 20px;">
              <h3 style="color: ${BRAND_COLORS.blueAccent}; font-size: 16px; margin: 0 0 15px 0; font-weight: bold;">Registration Details</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                <tr>
                  <td style="padding: 6px 0; color: #666; width: 140px;">Registration ID:</td>
                  <td style="padding: 6px 0; color: #333; font-family: monospace; font-size: 11px;">${registrationData.registrationId || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #666;">Full Name:</td>
                  <td style="padding: 6px 0; color: #333;">${registrationData.fullName || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #666;">Email:</td>
                  <td style="padding: 6px 0; color: #333;">${registrationData.email || recipientEmail}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #666;">Phone:</td>
                  <td style="padding: 6px 0; color: #333;">${registrationData.phone || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #666;">Country:</td>
                  <td style="padding: 6px 0; color: #333;">${registrationData.country || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #666;">Address:</td>
                  <td style="padding: 6px 0; color: #333;">${registrationData.address || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #666;">Registration Type:</td>
                  <td style="padding: 6px 0; color: #333;">${registrationData.registrationType || 'Regular Registration'}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #666;">Number of Participants:</td>
                  <td style="padding: 6px 0; color: #333;">${String(registrationData.numberOfParticipants || 1)}</td>
                </tr>
              </table>
            </div>

            <!-- Contact Information -->
            <div style="padding: 0 20px 30px 20px;">
              <h3 style="color: ${BRAND_COLORS.blueAccent}; font-size: 14px; margin: 0 0 10px 0; font-weight: bold;">Contact Information</h3>
              <p style="margin: 0; font-size: 12px; color: ${BRAND_COLORS.darkGray};">
                Email: <a href="mailto:${emailConfig.fromEmail}" style="color: ${BRAND_COLORS.blueAccent};">${emailConfig.fromEmail}</a>
              </p>
            </div>

            <!-- Footer -->
            <div style="background-color: #f8f9fa; padding: 15px 20px; text-align: center; border-top: 1px solid #dee2e6;">
              <p style="margin: 0 0 5px 0; font-size: 10px; color: #666;">© 2025 International Nursing Conference 2025</p>
              <p style="margin: 0; font-size: 10px; color: #999;">Generated on: ${new Date().toLocaleString()}</p>
            </div>

          </div>

        </body>
        </html>
      `,
      text: `
PAYMENT RECEIPT - International Nursing Conference 2025

PAYMENT INFORMATION:
Transaction ID: ${paymentData.transactionId || 'N/A'}
Order ID: ${paymentData.orderId || 'N/A'}
Amount: ${paymentData.currency || 'USD'} ${paymentData.amount || '0.00'}
Payment Method: ${paymentData.paymentMethod || 'PayPal'}
Payment Date: ${paymentData.paymentDate || new Date().toLocaleString()}
Status: ${paymentData.status || 'Completed'}

REGISTRATION DETAILS:
Registration ID: ${registrationData.registrationId || 'N/A'}
Full Name: ${registrationData.fullName || 'N/A'}
Email: ${registrationData.email || recipientEmail}
Phone: ${registrationData.phone || 'N/A'}
Country: ${registrationData.country || 'N/A'}
Address: ${registrationData.address || 'N/A'}
Registration Type: ${registrationData.registrationType || 'Regular Registration'}
Number of Participants: ${String(registrationData.numberOfParticipants || 1)}

CONTACT INFORMATION:
Email: ${emailConfig.fromEmail}

© 2025 International Nursing Conference 2025
Generated on: ${new Date().toLocaleString()}
      `,
      attachments: pdfBuffer ? [
        {
          filename: `Payment_Receipt_${paymentData.transactionId || 'Receipt'}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        }
      ] : []
    };

    const result = await transporter.sendMail(mailOptions);

    // Upload PDF to Sanity CMS after successful email sending
    let pdfUploaded = false;
    let pdfAssetId = null;

    if (pdfBuffer && registrationData._id) {
      const filename = `receipt_${registrationData.registrationId || 'unknown'}_${Date.now()}.pdf`;
      const pdfAsset = await uploadPDFToSanity(pdfBuffer, filename);

      if (pdfAsset) {
        const updateSuccess = await updateRegistrationWithPDF(registrationData._id, pdfAsset);
        pdfUploaded = updateSuccess;
        pdfAssetId = pdfAsset._id;

        if (updateSuccess) {
          console.log(`✅ PDF receipt stored in Sanity for registration: ${registrationData._id}`);
        }
      }
    }

    return {
      success: true,
      messageId: result.messageId,
      logoUsed: !!footerLogo,
      logoUrl: footerLogo?.url || null,
      pdfGenerated: !!pdfBuffer,
      pdfSize: pdfBuffer ? pdfBuffer.length : 0,
      pdfUploaded: pdfUploaded,
      pdfAssetId: pdfAssetId,
      emailConfig: {
        host: emailConfig.host,
        fromEmail: emailConfig.fromEmail
      }
    };

  } catch (error) {
    console.error('❌ Failed to send payment receipt email with real data:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  sendPaymentReceiptEmail,
  sendPaymentReceiptEmailWithRealData,
  getFooterLogo,
  getSiteSettings,
  getEmailConfig,
  generateReceiptPDF
};
