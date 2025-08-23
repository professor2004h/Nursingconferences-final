import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/app/sanity/client';

/**
 * Generate Registration Receipt PDF
 * Creates a clean, professional PDF receipt for registration confirmation
 */

interface ReceiptData {
  registrationId: string;
  transactionId?: string;
  orderId?: string;
  amount?: string;
  currency?: string;
  capturedAt?: string;
  registrationDetails?: any;
}

export async function POST(request: NextRequest) {
  try {
    const body: ReceiptData = await request.json();
    const { registrationId, transactionId, orderId, amount, currency, capturedAt } = body;

    if (!registrationId) {
      return NextResponse.json(
        { error: 'Registration ID is required' },
        { status: 400 }
      );
    }

    // Fetch registration details from Sanity
    const registrationDetails = await client.fetch(
      `*[_type == "conferenceRegistration" && registrationId == $registrationId][0]{
        _id,
        registrationId,
        personalDetails,
        selectedRegistrationName,
        sponsorType,
        accommodationType,
        accommodationNights,
        numberOfParticipants,
        pricing,
        paymentStatus,
        registrationDate
      }`,
      { registrationId }
    );

    if (!registrationDetails) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      );
    }

    // Dynamic import to reduce bundle size
    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // Colors
    const primaryBlue = [30, 64, 175];
    const darkGray = [55, 65, 81];
    const lightGray = [156, 163, 175];

    // Header
    doc.setFillColor(...primaryBlue);
    doc.rect(0, 0, pageWidth, 50, 'F');

    // Company Name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Intelli Global Conferences', 20, 30);

    // Receipt Title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text('Registration Receipt', 20, 42);

    // Conference Title
    doc.setTextColor(...darkGray);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('International Nursing Conference 2025', 20, 70);

    let yPosition = 90;

    // Payment Information Section
    if (transactionId) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...primaryBlue);
      doc.text('Payment Information', 20, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...darkGray);

      doc.text(`Transaction ID: ${transactionId}`, 20, yPosition);
      yPosition += 8;

      if (orderId) {
        doc.text(`Order ID: ${orderId}`, 20, yPosition);
        yPosition += 8;
      }

      if (amount && currency) {
        doc.text(`Amount: ${currency} ${amount}`, 20, yPosition);
        yPosition += 8;
      }

      doc.text(`Payment Method: PayPal`, 20, yPosition);
      yPosition += 8;

      const paymentDate = capturedAt ? new Date(capturedAt).toLocaleString() : new Date().toLocaleString();
      doc.text(`Payment Date: ${paymentDate}`, 20, yPosition);
      yPosition += 8;

      doc.text(`Status: Completed`, 20, yPosition);
      yPosition += 20;
    }

    // Registration Details Section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryBlue);
    doc.text('Registration Details', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...darkGray);

    // Personal Information
    doc.text(`Registration ID: ${registrationDetails.registrationId}`, 20, yPosition);
    yPosition += 8;

    const fullName = `${registrationDetails.personalDetails?.title || ''} ${registrationDetails.personalDetails?.firstName || ''} ${registrationDetails.personalDetails?.lastName || ''}`.trim();
    doc.text(`Full Name: ${fullName}`, 20, yPosition);
    yPosition += 8;

    if (registrationDetails.personalDetails?.email) {
      doc.text(`Email: ${registrationDetails.personalDetails.email}`, 20, yPosition);
      yPosition += 8;
    }

    if (registrationDetails.personalDetails?.phoneNumber) {
      doc.text(`Phone: ${registrationDetails.personalDetails.phoneNumber}`, 20, yPosition);
      yPosition += 8;
    }

    if (registrationDetails.personalDetails?.country) {
      doc.text(`Country: ${registrationDetails.personalDetails.country}`, 20, yPosition);
      yPosition += 8;
    }

    if (registrationDetails.personalDetails?.fullPostalAddress) {
      // Split long addresses
      const address = registrationDetails.personalDetails.fullPostalAddress;
      if (address.length > 60) {
        const words = address.split(' ');
        let line1 = '';
        let line2 = '';
        let currentLine = 1;
        
        for (const word of words) {
          if (currentLine === 1 && (line1 + word).length < 60) {
            line1 += (line1 ? ' ' : '') + word;
          } else {
            currentLine = 2;
            line2 += (line2 ? ' ' : '') + word;
          }
        }
        
        doc.text(`Address: ${line1}`, 20, yPosition);
        yPosition += 8;
        if (line2) {
          doc.text(`         ${line2}`, 20, yPosition);
          yPosition += 8;
        }
      } else {
        doc.text(`Address: ${address}`, 20, yPosition);
        yPosition += 8;
      }
    }

    yPosition += 5;

    // Registration Type
    if (registrationDetails.selectedRegistrationName) {
      doc.text(`Registration Type: ${registrationDetails.selectedRegistrationName}`, 20, yPosition);
      yPosition += 8;
    }

    if (registrationDetails.sponsorType) {
      doc.text(`Sponsorship Type: ${registrationDetails.sponsorType}`, 20, yPosition);
      yPosition += 8;
    }

    doc.text(`Number of Participants: ${registrationDetails.numberOfParticipants || 1}`, 20, yPosition);
    yPosition += 8;

    // Accommodation
    if (registrationDetails.accommodationType) {
      doc.text(`Accommodation: ${registrationDetails.accommodationType}`, 20, yPosition);
      yPosition += 8;
    }

    if (registrationDetails.accommodationNights) {
      doc.text(`Accommodation Nights: ${registrationDetails.accommodationNights}`, 20, yPosition);
      yPosition += 8;
    }

    yPosition += 10;

    // Payment Summary
    if (registrationDetails.pricing) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...primaryBlue);
      doc.text('Payment Summary', 20, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...darkGray);

      const pricing = registrationDetails.pricing;
      const curr = pricing.currency || currency || 'USD';

      doc.text(`Registration Fee: ${curr} ${pricing.registrationFee || 0}`, 20, yPosition);
      yPosition += 8;

      if (pricing.accommodationFee > 0) {
        doc.text(`Accommodation Fee: ${curr} ${pricing.accommodationFee}`, 20, yPosition);
        yPosition += 8;
      }

      // Total line
      doc.setFont('helvetica', 'bold');
      doc.text(`Total Amount: ${curr} ${pricing.totalPrice || 0}`, 20, yPosition);
      yPosition += 15;
    }

    // Contact Information
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryBlue);
    doc.text('Contact Information', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...darkGray);
    doc.text('Email: intelliglobalconferences@gmail.com', 20, yPosition);
    yPosition += 8;
    doc.text('Phone: +1 (470) 916-6880', 20, yPosition);
    yPosition += 8;
    doc.text('WhatsApp: +1 (470) 916-6880', 20, yPosition);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(...lightGray);
    doc.text('Thank you for registering for the International Nursing Conference 2025', 20, pageHeight - 20);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, pageHeight - 10);

    // Generate PDF buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Registration_Receipt_${registrationId}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('❌ Error generating registration receipt PDF:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate receipt PDF',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
