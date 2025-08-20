import { NextRequest, NextResponse } from 'next/server';
import { writeClient } from '@/app/sanity/client';

/**
 * Update Registration with PayPal Order ID
 * This endpoint updates a registration's ID from temporary to PayPal order ID
 */

interface UpdatePayPalIdRequest {
  tempRegistrationId: string;
  paypalOrderId: string;
  paymentStatus?: string;
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Updating registration with PayPal order ID...');

    const body: UpdatePayPalIdRequest = await request.json();
    const { tempRegistrationId, paypalOrderId, paymentStatus = 'pending' } = body;

    // Validate request data
    if (!tempRegistrationId || !paypalOrderId) {
      return NextResponse.json(
        { error: 'Missing required fields: tempRegistrationId, paypalOrderId' },
        { status: 400 }
      );
    }

    // Validate PayPal order ID format (should be PayPal's format)
    if (!paypalOrderId.match(/^[A-Z0-9]{17}$/)) {
      console.log('⚠️ PayPal order ID format validation relaxed for:', paypalOrderId);
      // Don't fail, just log - PayPal IDs can have different formats
    }

    // Find the registration with the temporary ID
    const existingRegistration = await writeClient.fetch(
      `*[_type == "conferenceRegistration" && registrationId == $tempRegistrationId][0]`,
      { tempRegistrationId }
    );

    if (!existingRegistration) {
      console.error('❌ Registration not found with temp ID:', tempRegistrationId);
      return NextResponse.json(
        { error: 'Registration not found with provided temporary ID' },
        { status: 404 }
      );
    }

    // Check if PayPal order ID is already in use
    const duplicateCheck = await writeClient.fetch(
      `*[_type == "conferenceRegistration" && registrationId == $paypalOrderId][0]`,
      { paypalOrderId }
    );

    if (duplicateCheck) {
      console.error('❌ PayPal order ID already in use:', paypalOrderId);
      return NextResponse.json(
        { error: 'PayPal order ID already exists in system' },
        { status: 409 }
      );
    }

    // Update the registration with PayPal order ID
    const updateResult = await writeClient
      .patch(existingRegistration._id)
      .set({
        registrationId: paypalOrderId,
        paymentStatus: paymentStatus,
        paypalOrderId: paypalOrderId,
        updatedAt: new Date().toISOString(),
        paymentInitiatedAt: new Date().toISOString()
      })
      .commit();

    console.log('✅ Registration updated with PayPal order ID:', {
      documentId: existingRegistration._id,
      oldId: tempRegistrationId,
      newId: paypalOrderId,
      paymentStatus
    });

    return NextResponse.json({
      success: true,
      message: 'Registration updated with PayPal order ID',
      data: {
        documentId: updateResult._id,
        oldRegistrationId: tempRegistrationId,
        newRegistrationId: paypalOrderId,
        paymentStatus,
        updatedAt: updateResult.updatedAt
      }
    });

  } catch (error) {
    console.error('❌ Error updating registration with PayPal order ID:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to update registration with PayPal order ID',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
