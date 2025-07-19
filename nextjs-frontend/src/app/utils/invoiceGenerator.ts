interface InvoiceData {
  invoiceNumber: string;
  paymentData: {
    paymentId: string;
    orderId: string;
    timestamp: string;
  };
  sponsorshipData: {
    companyName: string;
    contactPerson: string;
    email: string;
    phone: string;
    website?: string;
    companyAddress?: string;
    conferenceName: string;
    tierName: string;
    amount: number;
    registrationId: string;
  };
  customerEmail: string;
}

export async function generateInvoicePDF(data: InvoiceData): Promise<Buffer> {
  // Dynamic import to reduce initial bundle size
  const { default: jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  // const pageHeight = doc.internal.pageSize.height;

  // Colors (defined inline where used)
  // const primaryColor = '#1e40af';
  // const secondaryColor = '#64748b';
  // const lightGray = '#f1f5f9';
  
  // Header
  doc.setFillColor(30, 64, 175); // Primary blue
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  // Company Logo/Name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Intelli Global Conferences', 20, 25);
  
  // Invoice title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text('SPONSORSHIP INVOICE', pageWidth - 20, 25, { align: 'right' });
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  // Invoice details section
  let yPos = 60;
  
  // Invoice number and date
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Invoice Number:', 20, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(data.invoiceNumber, 70, yPos);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Date:', pageWidth - 80, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date(data.paymentData.timestamp).toLocaleDateString(), pageWidth - 50, yPos, { align: 'right' });
  
  yPos += 10;
  doc.setFont('helvetica', 'bold');
  doc.text('Payment ID:', 20, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(data.paymentData.paymentId, 70, yPos);
  
  yPos += 20;
  
  // Bill to section
  doc.setFillColor(241, 245, 249); // Light gray
  doc.rect(20, yPos, pageWidth - 40, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('BILL TO:', 25, yPos + 6);
  
  yPos += 20;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(data.sponsorshipData.companyName, 25, yPos);
  
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.text(`Contact: ${data.sponsorshipData.contactPerson}`, 25, yPos);
  
  yPos += 6;
  doc.text(`Email: ${data.sponsorshipData.email}`, 25, yPos);
  
  yPos += 6;
  doc.text(`Phone: ${data.sponsorshipData.phone}`, 25, yPos);
  
  if (data.sponsorshipData.website) {
    yPos += 6;
    doc.text(`Website: ${data.sponsorshipData.website}`, 25, yPos);
  }
  
  if (data.sponsorshipData.companyAddress) {
    yPos += 6;
    doc.text(`Address: ${data.sponsorshipData.companyAddress}`, 25, yPos);
  }
  
  yPos += 25;
  
  // Services table header
  doc.setFillColor(30, 64, 175);
  doc.rect(20, yPos, pageWidth - 40, 12, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('DESCRIPTION', 25, yPos + 8);
  doc.text('CONFERENCE', 100, yPos + 8);
  doc.text('AMOUNT', pageWidth - 25, yPos + 8, { align: 'right' });
  
  // Services table content
  yPos += 12;
  doc.setTextColor(0, 0, 0);
  doc.setFillColor(249, 250, 251);
  doc.rect(20, yPos, pageWidth - 40, 15, 'F');
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`${data.sponsorshipData.tierName} Sponsorship`, 25, yPos + 6);
  doc.text(data.sponsorshipData.conferenceName, 100, yPos + 6);
  doc.text(`$${data.sponsorshipData.amount.toFixed(2)}`, pageWidth - 25, yPos + 6, { align: 'right' });
  
  yPos += 15;
  
  // Total section
  doc.setFillColor(241, 245, 249);
  doc.rect(pageWidth - 100, yPos, 80, 25, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('TOTAL:', pageWidth - 95, yPos + 8);
  doc.setFontSize(14);
  doc.text(`$${data.sponsorshipData.amount.toFixed(2)}`, pageWidth - 25, yPos + 8, { align: 'right' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Amount Paid', pageWidth - 95, yPos + 18);
  doc.text(`$${data.sponsorshipData.amount.toFixed(2)}`, pageWidth - 25, yPos + 18, { align: 'right' });
  
  yPos += 40;
  
  // Payment information
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('PAYMENT INFORMATION', 20, yPos);
  
  yPos += 10;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Registration ID: ${data.sponsorshipData.registrationId}`, 20, yPos);
  
  yPos += 6;
  doc.text(`Payment Method: Online Payment (Razorpay - UPI/Cards/Net Banking)`, 20, yPos);

  yPos += 6;
  doc.text(`Transaction ID: ${data.paymentData.paymentId}`, 20, yPos);

  yPos += 6;
  doc.text(`Order ID: ${data.paymentData.orderId}`, 20, yPos);

  yPos += 6;
  doc.text(`Payment Status: PAID ✓`, 20, yPos);

  yPos += 6;
  doc.text(`Payment Date: ${new Date(data.paymentData.timestamp).toLocaleString()}`, 20, yPos);
  
  yPos += 20;
  
  // Footer
  doc.setFillColor(241, 245, 249);
  doc.rect(20, yPos, pageWidth - 40, 30, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Thank you for your sponsorship!', 25, yPos + 10);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('For any questions regarding this invoice, please contact:', 25, yPos + 18);
  doc.text('Email: intelliglobalconferences@gmail.com', 25, yPos + 25);
  
  // Convert to buffer
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  return pdfBuffer;
}
