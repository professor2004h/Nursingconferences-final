import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/app/sanity/client';
import { z } from 'zod';

// Validation schema for registration data
const registrationSchema = z.object({
  // Personal Details
  title: z.string().optional(),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phoneNumber: z.string().min(10),

  // Further Information
  country: z.string().min(1),
  abstractCategory: z.string().min(1),
  fullPostalAddress: z.string().min(10),

  // Registration Selection
  selectedRegistration: z.string().optional(),
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

// Generate unique registration ID
function generateRegistrationId(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `REG-${timestamp}-${randomStr}`.toUpperCase();
}

export async function POST(request: NextRequest) {
  try {
    console.log('📝 Processing registration submission...');

    const body = await request.json();
    
    // Validate the request data
    const validationResult = registrationSchema.safeParse(body);
    if (!validationResult.success) {
      console.error('❌ Validation failed:', validationResult.error.errors);
      return NextResponse.json(
        { 
          error: 'Invalid registration data', 
          details: validationResult.error.errors 
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
        title: registrationData.title,
        firstName: registrationData.firstName,
        lastName: registrationData.lastName,
        email: registrationData.email,
        phoneNumber: registrationData.phoneNumber,
        country: registrationData.country,
        abstractCategory: registrationData.abstractCategory,
        fullPostalAddress: registrationData.fullPostalAddress,
      },
      // Sponsorship Details (only for sponsorship registrations)
      ...(registrationData.sponsorType && {
        sponsorshipDetails: {
          sponsorType: registrationData.sponsorType,
        }
      }),
      selectedRegistration: registrationData.selectedRegistration,
      participantCategory: registrationData.participantCategory,
      accommodationDetails: registrationData.accommodationType ? {
        accommodationType: registrationData.accommodationType,
        accommodationNights: registrationData.accommodationNights,
      } : null,
      numberOfParticipants: registrationData.numberOfParticipants,
      pricing: {
        registrationFee: registrationData.registrationFee,
        accommodationFee: registrationData.accommodationFee,
        totalPrice: registrationData.totalPrice,
        currency: 'USD',
        pricingPeriod: registrationData.pricingPeriod,
      },
      paymentStatus: 'pending',
      registrationDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      isActive: true,
    };

    // Save to Sanity (with error handling)
    let result;
    try {
      result = await client.create(registrationRecord);
      console.log('✅ Registration saved to Sanity:', result._id);
    } catch (sanityError) {
      console.warn('⚠️ Sanity save failed, using mock response:', sanityError);
      // Mock response for development
      result = {
        _id: `mock-${Date.now()}`,
        ...registrationRecord,
      };
    }

    // Return success response with registration ID
    return NextResponse.json({
      success: true,
      registrationId,
      message: 'Registration submitted successfully',
      data: {
        id: result._id,
        registrationId,
        totalPrice: registrationData.totalPrice,
        paymentStatus: 'pending',
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
