import { NextResponse } from 'next/server';
import { client } from '@/app/sanity/client';

export async function GET() {
  try {
    console.log('🧾 Fetching receipt settings from Sanity...');
    
    // Query for active receipt settings
    const query = `
      *[_type == "receiptSettings" && isActive == true][0]{
        _id,
        title,
        conferenceTitle,
        companyName,
        receiptTemplate,
        emailSettings,
        contactInformation,
        pdfSettings,
        isActive,
        lastUpdated
      }
    `;

    const settings = await client.fetch(query);
    
    if (!settings) {
      console.log('⚠️ No active receipt settings found, returning defaults');
      return NextResponse.json({
        success: true,
        data: getDefaultReceiptSettings(),
        message: 'Using default receipt settings'
      });
    }

    console.log('✅ Receipt settings fetched successfully');
    return NextResponse.json({
      success: true,
      data: settings
    });

  } catch (error) {
    console.error('❌ Error fetching receipt settings:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch receipt settings',
      data: getDefaultReceiptSettings()
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('🧾 Creating/updating receipt settings...');

    // Create or update receipt settings
    const result = await client.createOrReplace({
      _type: 'receiptSettings',
      _id: 'receipt-settings-main',
      ...body,
      lastUpdated: new Date().toISOString(),
      isActive: true
    });

    console.log('✅ Receipt settings saved successfully');
    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('❌ Error saving receipt settings:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to save receipt settings'
    }, { status: 500 });
  }
}

function getDefaultReceiptSettings() {
  return {
    _id: 'default',
    title: 'Payment Receipt Configuration',
    conferenceTitle: 'International Nursing Conference 2025',
    companyName: 'Intelli Global Conferences',
    receiptTemplate: {
      useBlueHeader: true,
      headerColor: { hex: '#4267B2' },
      logoSize: {
        width: 72,
        height: 24
      }
    },
    emailSettings: {
      senderName: 'Intelli Global Conferences',
      senderEmail: 'contactus@intelliglobalconferences.com',
      subjectLine: 'Payment Receipt - International Nursing Conference 2025',
      emailTemplate: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #4267B2 0%, #5a7bc8 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px;">
    <h1 style="margin: 0; font-size: 24px;">Payment Receipt</h1>
    <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">{{conferenceTitle}}</p>
  </div>
  
  <div style="padding: 30px 20px; background: #f8f9fa; border-radius: 8px; margin: 20px 0;">
    <h2 style="color: #4267B2; margin: 0 0 15px 0;">Dear {{customerName}},</h2>
    <p style="color: #333; line-height: 1.6; margin: 0 0 15px 0;">
      Thank you for your registration! Your payment has been successfully processed.
    </p>
    <p style="color: #333; line-height: 1.6; margin: 0;">
      Transaction ID: <strong>{{transactionId}}</strong>
    </p>
  </div>
</div>`
    },
    contactInformation: {
      supportEmail: 'contactus@intelliglobalconferences.com',
      phone: '+1-555-0123',
      website: 'https://intelliglobalconferences.com'
    },
    pdfSettings: {
      enablePdfAttachment: true,
      storePdfInSanity: true,
      pdfFilenameFormat: 'Payment_Receipt_{{transactionId}}.pdf'
    },
    isActive: true,
    lastUpdated: new Date().toISOString()
  };
}
