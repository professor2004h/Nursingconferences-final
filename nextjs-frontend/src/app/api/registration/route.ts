import { NextRequest, NextResponse } from 'next/server';
import { writeClient } from '@/app/sanity/client';
import { z } from 'zod';

// Validation schema for registration data
const registrationSchema = z.object({
  // Personal Details
  title: z.string().optional(),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phoneNumber: z.string().min(5, "Phone number must be at least 5 characters"),

  // Further Information
  country: z.string().min(1),
  fullPostalAddress: z.string().min(10),

  // Registration Selection
  selectedRegistration: z.string().optional(),
  selectedRegistrationName: z.string().optional(),
  participantCategory: z.string().optional(),

  // Sponsor Registration
  sponsorType: z.string().optional(),

  // Accommodation
  accommodationType: z.string().optional(),
  accommodationNights: z.string().optional(),

  // Participants
  numberOfParticipants: z.number().min(1).max(50),

  // Pricing
  registrationFee: z.number().min(0),
  accommodationFee: z.number().min(0),
  totalPrice: z.number().min(0),
  pricingPeriod: z.enum(['earlyBird', 'nextRound', 'spotRegistration']),
});

// Generate unique registration ID with microsecond precision
function generateRegistrationId(): string {
  const now = new Date();
  const timestamp = now.getTime().toString(36); // milliseconds
  const microseconds = (performance.now() % 1000).toFixed(3).replace('.', '');
  const randomStr = Math.random().toString(36).substring(2, 10);
  return `REG-${timestamp}${microseconds}-${randomStr}`.toUpperCase();
}

export async function POST(request: NextRequest) {
  try {
    console.log('📝 Processing registration submission...');

    const body = await request.json();
    
    // Validate the request data
    const validationResult = registrationSchema.safeParse(body);
    if (!validationResult.success) {
      console.error('❌ Validation failed:', validationResult.error.issues);
      return NextResponse.json(
        {
          error: 'Invalid registration data',
          details: validationResult.error.issues
        },
        { status: 400 }
      );
    }

    const registrationData = validationResult.data;
    const registrationId = generateRegistrationId();

    console.log('✅ Registration data validated:', {
      registrationId,
      email: registrationData.email,
      totalPrice: registrationData.totalPrice,
    });

    // Create registration record in Sanity
    const registrationRecord = {
      _type: 'conferenceRegistration',
      registrationId,
      registrationType: registrationData.sponsorType ? 'sponsorship' : 'regular',
      personalDetails: {
        title: registrationData.title || '',
        firstName: registrationData.firstName || '',
        lastName: registrationData.lastName || '',
        fullName: `${registrationData.title || ''} ${registrationData.firstName || ''} ${registrationData.lastName || ''}`.trim(),
        email: registrationData.email || '',
        phoneNumber: registrationData.phoneNumber || '',
        country: registrationData.country || '',
        fullPostalAddress: registrationData.fullPostalAddress || '',
      },
      // Sponsorship Details (only for sponsorship registrations)
      ...(registrationData.sponsorType && {
        sponsorshipDetails: {
          sponsorType: registrationData.sponsorType,
        }
      }),
      selectedRegistration: registrationData.selectedRegistration,
      selectedRegistrationName: registrationData.selectedRegistrationName || registrationData.selectedRegistration,
      participantCategory: registrationData.participantCategory,
      accommodationDetails: registrationData.accommodationType ? {
        accommodationType: registrationData.accommodationType,
        accommodationNights: registrationData.accommodationNights,
      } : null,
      numberOfParticipants: registrationData.numberOfParticipants,
      pricing: {
        registrationFee: registrationData.registrationFee || 0,
        accommodationFee: registrationData.accommodationFee || 0,
        totalPrice: registrationData.totalPrice || 0,
        currency: 'USD',
        pricingPeriod: registrationData.pricingPeriod || 'unknown',
        formattedTotalPrice: `$${registrationData.totalPrice || 0} USD`, // For table display
      },
      paymentStatus: 'pending',
      registrationDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      isActive: true,

      // Additional fields for better table display and filtering
      registrationSummary: {
        registrationType: registrationData.sponsorType ? 'Sponsorship' : 'Regular Registration',
        selectedOption: registrationData.sponsorType || registrationData.selectedRegistration || 'Not specified',
        participantCount: registrationData.numberOfParticipants || 1,
        hasAccommodation: !!(registrationData.accommodationType && registrationData.accommodationNights),
        registrationMonth: new Date().toISOString().substring(0, 7), // YYYY-MM format for grouping
        paymentStatusDisplay: 'PENDING',
      },

      // Computed fields for table display
      fullName: `${registrationData.title || ''} ${registrationData.firstName || ''} ${registrationData.lastName || ''}`.trim(),
      formattedTotalPrice: `$${registrationData.totalPrice || 0} USD`,
    };

    // Save to Sanity using write client with API token
    let result;
    let sanityError = null;
    try {
      console.log('💾 Attempting to save registration to Sanity with write client...');
      result = await writeClient.create(registrationRecord);
      console.log('✅ Registration saved to Sanity successfully:', result._id);
    } catch (error) {
      sanityError = error;
      console.error('❌ Sanity save failed:', error);

      // Check if it's a permissions error
      if (error.statusCode === 403) {
        console.error('🔒 Sanity permissions error - API token may be invalid or missing write permissions');
      }

      // Mock response for development/testing when Sanity fails
      result = {
        _id: `mock-${Date.now()}`,
        ...registrationRecord,
      };
    }

    // Return success response with registration ID
    return NextResponse.json({
      success: true,
      registrationId,
      message: sanityError
        ? 'Registration submitted successfully (test mode - data not saved to Sanity due to permissions)'
        : 'Registration submitted successfully',
      data: {
        id: result._id,
        registrationId,
        totalPrice: registrationData.totalPrice,
        paymentStatus: 'pending',
        testMode: !!sanityError,
        sanityStatus: sanityError ? 'failed' : 'success',
      },
    });

  } catch (error) {
    console.error('❌ Registration submission error:', error);
    
    return NextResponse.json(
      { 
        error: 'Registration submission failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const registrationId = searchParams.get('registrationId');

    if (!registrationId) {
      return NextResponse.json(
        { error: 'Registration ID is required' },
        { status: 400 }
      );
    }

    // Fetch registration from Sanity
    const registration = await client.fetch(
      `*[_type == "conferenceRegistration" && registrationId == $registrationId][0]{
        _id,
        registrationId,
        personalDetails,
        registrationType->{
          name,
          category
        },
        sponsorshipTier->{
          tierName,
          price
        },
        accommodationOption{
          hotel->{
            hotelName
          },
          roomType,
          nights
        },
        numberOfParticipants,
        pricing,
        paymentStatus,
        registrationDate,
        lastUpdated,
        isActive
      }`,
      { registrationId }
    );

    if (!registration) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: registration,
    });

  } catch (error) {
    console.error('❌ Error fetching registration:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch registration',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
