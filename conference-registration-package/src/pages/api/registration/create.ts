// =============================================================================
// REGISTRATION CREATE API ROUTE
// =============================================================================

import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import { RegistrationFormData, RegistrationData } from '@/types/registration';
import { validateRegistrationForm } from '@/lib/utils/validation';
import { formatRegistrationNumber } from '@/lib/utils/formatting';
import { env } from '@/lib/config/environment';

// Generate registration number
function generateRegistrationNumber(): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `REG-${timestamp}-${random}`;
}

// Calculate registration amount based on type and date
function calculateRegistrationAmount(registrationType: string): number {
  const now = new Date();
  const earlyBirdDeadline = new Date(env.CONFERENCE.EARLY_BIRD_DEADLINE);
  const regularDeadline = new Date(env.CONFERENCE.REGULAR_DEADLINE);

  switch (registrationType) {
    case 'student':
      return env.PRICING.REGULAR - env.PRICING.STUDENT_DISCOUNT;
    case 'speaker':
      return 0; // Speakers get free registration
    case 'early-bird':
      return now <= earlyBirdDeadline ? env.PRICING.EARLY_BIRD : env.PRICING.REGULAR;
    case 'regular':
      return env.PRICING.REGULAR;
    default:
      return env.PRICING.REGULAR;
  }
}

// Save registration to database (placeholder - implement with your database)
async function saveRegistration(registrationData: RegistrationData): Promise<boolean> {
  try {
    // TODO: Implement database save logic here
    // This is where you would save the registration to your database
    
    console.log('📝 Saving registration:', {
      id: registrationData.id,
      email: registrationData.email,
      registrationNumber: registrationData.registrationNumber,
      amount: registrationData.totalAmount,
    });

    // Example implementation (replace with your database logic):
    /*
    await database.registration.create({
      data: {
        id: registrationData.id,
        registrationNumber: registrationData.registrationNumber,
        title: registrationData.title,
        firstName: registrationData.firstName,
        lastName: registrationData.lastName,
        email: registrationData.email,
        phone: registrationData.phone,
        country: registrationData.country,
        organization: registrationData.organization,
        jobTitle: registrationData.jobTitle,
        address: registrationData.address,
        city: registrationData.city,
        state: registrationData.state,
        zipCode: registrationData.zipCode,
        registrationType: registrationData.registrationType,
        attendanceType: registrationData.attendanceType,
        dietaryRequirements: registrationData.dietaryRequirements,
        accessibilityNeeds: registrationData.accessibilityNeeds,
        emergencyContact: registrationData.emergencyContact,
        marketingConsent: registrationData.marketingConsent,
        newsletterSubscription: registrationData.newsletterSubscription,
        specialRequests: registrationData.specialRequests,
        status: registrationData.status,
        paymentStatus: registrationData.paymentStatus,
        totalAmount: registrationData.totalAmount,
        currency: registrationData.currency,
        createdAt: registrationData.createdAt,
        updatedAt: registrationData.updatedAt,
      },
    });
    */

    return true;
  } catch (error) {
    console.error('❌ Error saving registration:', error);
    return false;
  }
}

// Send confirmation email (placeholder - implement with your email service)
async function sendConfirmationEmail(registrationData: RegistrationData): Promise<boolean> {
  try {
    // TODO: Implement email sending logic here
    // This is where you would send a confirmation email to the registrant
    
    console.log('📧 Sending confirmation email to:', registrationData.email);

    // Example implementation (replace with your email service):
    /*
    await emailService.send({
      to: registrationData.email,
      subject: `Registration Confirmation - ${env.CONFERENCE.NAME}`,
      template: 'registration-confirmation',
      data: {
        name: `${registrationData.firstName} ${registrationData.lastName}`,
        registrationNumber: registrationData.registrationNumber,
        conferenceName: env.CONFERENCE.NAME,
        conferenceDate: env.CONFERENCE.DATE,
        conferenceLocation: env.CONFERENCE.LOCATION,
        totalAmount: registrationData.totalAmount,
        currency: registrationData.currency,
        paymentStatus: registrationData.paymentStatus,
      },
    });
    */

    return true;
  } catch (error) {
    console.error('❌ Error sending confirmation email:', error);
    return false;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    const formData: RegistrationFormData = req.body;

    // Validate form data
    const validation = validateRegistrationForm(formData);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        errors: validation.errors,
      });
    }

    // Generate registration data
    const registrationId = uuidv4();
    const registrationNumber = generateRegistrationNumber();
    const totalAmount = calculateRegistrationAmount(formData.registrationType);
    const now = new Date().toISOString();

    const registrationData: RegistrationData = {
      ...formData,
      id: registrationId,
      registrationNumber,
      status: totalAmount > 0 ? 'pending' : 'confirmed',
      paymentStatus: totalAmount > 0 ? 'pending' : 'completed',
      totalAmount,
      currency: 'USD',
      createdAt: now,
      updatedAt: now,
      confirmedAt: totalAmount === 0 ? now : undefined,
    };

    // Save registration to database
    const saveSuccess = await saveRegistration(registrationData);
    if (!saveSuccess) {
      return res.status(500).json({
        success: false,
        error: 'Failed to save registration',
      });
    }

    // Send confirmation email (don't fail if email fails)
    const emailSent = await sendConfirmationEmail(registrationData);
    if (!emailSent) {
      console.warn('⚠️ Failed to send confirmation email, but registration was saved');
    }

    // Log successful registration
    console.log('✅ Registration created successfully:', {
      id: registrationId,
      registrationNumber,
      email: formData.email,
      amount: totalAmount,
      status: registrationData.status,
    });

    return res.status(201).json({
      success: true,
      data: registrationData,
      message: 'Registration created successfully',
      emailSent,
    });

  } catch (error) {
    console.error('❌ Registration creation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
