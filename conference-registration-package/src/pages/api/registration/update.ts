// =============================================================================
// REGISTRATION UPDATE API ROUTE
// =============================================================================

import { NextApiRequest, NextApiResponse } from 'next';
import { RegistrationData } from '@/types/registration';

interface UpdateRegistrationRequest {
  registrationId: string;
  updates: Partial<RegistrationData>;
}

// Update registration in database (placeholder - implement with your database)
async function updateRegistration(
  registrationId: string, 
  updates: Partial<RegistrationData>
): Promise<RegistrationData | null> {
  try {
    // TODO: Implement database update logic here
    // This is where you would update the registration in your database
    
    console.log('📝 Updating registration:', {
      registrationId,
      updates: Object.keys(updates),
    });

    // Example implementation (replace with your database logic):
    /*
    const updatedRegistration = await database.registration.update({
      where: { id: registrationId },
      data: {
        ...updates,
        updatedAt: new Date().toISOString(),
      },
    });
    
    return updatedRegistration;
    */

    // Placeholder return - replace with actual database result
    return {
      id: registrationId,
      ...updates,
      updatedAt: new Date().toISOString(),
    } as RegistrationData;

  } catch (error) {
    console.error('❌ Error updating registration:', error);
    return null;
  }
}

// Get registration by ID (placeholder - implement with your database)
async function getRegistration(registrationId: string): Promise<RegistrationData | null> {
  try {
    // TODO: Implement database get logic here
    // This is where you would retrieve the registration from your database
    
    console.log('📖 Getting registration:', registrationId);

    // Example implementation (replace with your database logic):
    /*
    const registration = await database.registration.findUnique({
      where: { id: registrationId },
    });
    
    return registration;
    */

    // Placeholder return - replace with actual database result
    return null;

  } catch (error) {
    console.error('❌ Error getting registration:', error);
    return null;
  }
}

// Send update notification email (placeholder - implement with your email service)
async function sendUpdateNotificationEmail(
  registrationData: RegistrationData,
  updates: Partial<RegistrationData>
): Promise<boolean> {
  try {
    // TODO: Implement email sending logic here
    // This is where you would send an update notification email
    
    console.log('📧 Sending update notification email to:', registrationData.email);

    // Example implementation (replace with your email service):
    /*
    await emailService.send({
      to: registrationData.email,
      subject: `Registration Updated - ${env.CONFERENCE.NAME}`,
      template: 'registration-update',
      data: {
        name: `${registrationData.firstName} ${registrationData.lastName}`,
        registrationNumber: registrationData.registrationNumber,
        updates,
        conferenceName: env.CONFERENCE.NAME,
      },
    });
    */

    return true;
  } catch (error) {
    console.error('❌ Error sending update notification email:', error);
    return false;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Allow GET and PATCH requests
  if (!['GET', 'PATCH'].includes(req.method || '')) {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    const { registrationId } = req.query;

    if (!registrationId || typeof registrationId !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Registration ID is required',
      });
    }

    // Handle GET request - retrieve registration
    if (req.method === 'GET') {
      const registration = await getRegistration(registrationId);
      
      if (!registration) {
        return res.status(404).json({
          success: false,
          error: 'Registration not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: registration,
      });
    }

    // Handle PATCH request - update registration
    if (req.method === 'PATCH') {
      const { updates }: { updates: Partial<RegistrationData> } = req.body;

      if (!updates || Object.keys(updates).length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Updates are required',
        });
      }

      // Get existing registration
      const existingRegistration = await getRegistration(registrationId);
      if (!existingRegistration) {
        return res.status(404).json({
          success: false,
          error: 'Registration not found',
        });
      }

      // Update registration
      const updatedRegistration = await updateRegistration(registrationId, updates);
      if (!updatedRegistration) {
        return res.status(500).json({
          success: false,
          error: 'Failed to update registration',
        });
      }

      // Send notification email for significant updates
      const significantUpdates = ['paymentStatus', 'status', 'totalAmount'];
      const hasSignificantUpdate = Object.keys(updates).some(key => 
        significantUpdates.includes(key)
      );

      if (hasSignificantUpdate) {
        const emailSent = await sendUpdateNotificationEmail(updatedRegistration, updates);
        if (!emailSent) {
          console.warn('⚠️ Failed to send update notification email');
        }
      }

      // Log successful update
      console.log('✅ Registration updated successfully:', {
        registrationId,
        updates: Object.keys(updates),
      });

      return res.status(200).json({
        success: true,
        data: updatedRegistration,
        message: 'Registration updated successfully',
      });
    }

  } catch (error) {
    console.error('❌ Registration update error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
