import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/app/sanity/client';

// Sample registration settings data
const sampleRegistrationData = {
  _type: 'registrationSettings',
  _id: 'registrationSettings',
  title: 'Registration Settings',
  heroSection: {
    title: 'REGISTRATION',
    subtitle: 'Register for the International Conference on Nursing',
    breadcrumb: 'Home » Registration',
  },
  pricingDates: {
    earlyBirdEnd: '2025-02-28T23:59:59.000Z',
    nextRoundStart: '2025-03-01T00:00:00.000Z',
    nextRoundEnd: '2025-05-31T23:59:59.000Z',
    spotRegistrationStart: '2025-06-01T00:00:00.000Z',
  },
  registrationStatus: {
    isOpen: true,
    closedMessage: 'Registration is currently closed. Please check back later.',
  },
  conferenceDetails: {
    conferenceName: 'International Conference on Nursing',
    conferenceDate: '2025-06-23',
    venue: 'Hotel Indigo Kuala Lumpur On The Park',
    city: 'Kuala Lumpur',
    country: 'Malaysia',
  },
  contactInfo: {
    email: 'intelliglobalconferences@gmail.com',
    phone: '+1-234-567-8900',
    supportEmail: 'support@intelliglobalconferences.com',
  },
  paymentSettings: {
    currency: 'USD',
    currencySymbol: '$',
    paymentMethods: ['card', 'netbanking', 'upi'],
  },
  formSettings: {
    maxParticipants: 10,
    requiredFields: ['firstName', 'lastName', 'email', 'phoneNumber', 'country', 'fullPostalAddress'],
  },
};

export async function POST(request: NextRequest) {
  try {
    console.log('🎯 Creating registration settings...');

    // Check if registration settings already exist
    const existingSettings = await client.fetch(
      `*[_type == "registrationSettings"][0]`
    );

    let result;
    if (existingSettings) {
      console.log('📝 Updating existing registration settings...');
      result = await client
        .patch(existingSettings._id)
        .set(sampleRegistrationData)
        .commit();
    } else {
      console.log('🆕 Creating new registration settings...');
      result = await client.create(sampleRegistrationData);
    }

    console.log('✅ Registration settings created/updated successfully:', result._id);

    return NextResponse.json({
      success: true,
      message: 'Registration settings created successfully',
      documentId: result._id,
      data: result,
    });

  } catch (error) {
    console.error('❌ Error creating registration settings:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        details: 'Failed to create registration settings in Sanity',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Registration Settings Population API',
    usage: 'Send a POST request to create/update registration settings',
    endpoints: {
      POST: '/api/populate-registration-settings - Create or update registration settings',
    },
    sampleData: sampleRegistrationData,
  });
}
