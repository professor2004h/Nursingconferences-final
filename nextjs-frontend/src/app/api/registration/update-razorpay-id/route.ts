import { NextRequest, NextResponse } from 'next/server';
import { writeClient } from '@/app/sanity/client';

interface UpdateRazorpayIdRequest {
  tempRegistrationId: string;
  razorpayOrderId: string;
  paymentStatus?: string;
}

/**
 * Update registration with Razorpay order ID
 * Similar to PayPal update-paypal-id endpoint for feature parity
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Updating registration with Razorpay order ID...');

    const body: UpdateRazorpayIdRequest = await request.json();
    const { tempRegistrationId, razorpayOrderId, paymentStatus = 'pending' } = body;

    // Validate request data
    if (!tempRegistrationId || !razorpayOrderId) {
      return NextResponse.json(
        { error: 'Missing required fields: tempRegistrationId, razorpayOrderId' },
        { status: 400 }
      );
    }

    // Validate Razorpay order ID format (should be Razorpay's format)
    if (!razorpayOrderId.match(/^order_[A-Za-z0-9]{14}$/)) {
      console.log('⚠️ Razorpay order ID format validation relaxed for:', razorpayOrderId);
      // Don't fail, just log - Razorpay IDs can have different formats
    }

    // Find existing registration by temp ID
    const existingRegistration = await writeClient.fetch(
      `*[_type == "conferenceRegistration" && registrationId == $tempId][0]{
        _id,
        registrationId,
        personalDetails,
        pricing
      }`,
      { tempId: tempRegistrationId }
    );

    if (!existingRegistration) {
      console.error('❌ Registration not found for temp ID:', tempRegistrationId);
      return NextResponse.json(
        { error: 'Registration not found for the provided temporary ID' },
        { status: 404 }
      );
    }

    // Check if Razorpay order ID is already in use
    const duplicateCheck = await writeClient.fetch(
      `*[_type == "conferenceRegistration" && registrationId == $razorpayId][0]`,
      { razorpayId: razorpayOrderId }
    );

    if (duplicateCheck) {
      console.error('❌ Razorpay order ID already in use:', razorpayOrderId);
      return NextResponse.json(
        { error: 'Razorpay order ID already exists in system' },
        { status: 409 }
      );
    }

    // Update the registration with Razorpay order ID
    const updateResult = await writeClient
      .patch(existingRegistration._id)
      .set({
        registrationId: razorpayOrderId,
        paymentStatus: paymentStatus,
        razorpayOrderId: razorpayOrderId,
        updatedAt: new Date().toISOString(),
        paymentInitiatedAt: new Date().toISOString()
      })
      .commit();

    console.log('✅ Registration updated with Razorpay order ID:', {
      documentId: existingRegistration._id,
      oldId: tempRegistrationId,
      newId: razorpayOrderId,
      paymentStatus
    });

    return NextResponse.json({
      success: true,
      message: 'Registration updated with Razorpay order ID',
      data: {
        documentId: updateResult._id,
        oldRegistrationId: tempRegistrationId,
        newRegistrationId: razorpayOrderId,
        paymentStatus,
        updatedAt: updateResult.updatedAt
      }
    });

  } catch (error) {
    console.error('❌ Error updating registration with Razorpay order ID:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to update registration with Razorpay order ID',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Razorpay registration update endpoint',
    usage: 'POST with tempRegistrationId and razorpayOrderId to update registration',
    example: {
      tempRegistrationId: 'TEMP-REG-XXXXX',
      razorpayOrderId: 'order_XXXXXXXXXXXXXX',
      paymentStatus: 'pending'
    }
  });
}
