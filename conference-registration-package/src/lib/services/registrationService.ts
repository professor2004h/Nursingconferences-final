// =============================================================================
// REGISTRATION SERVICE
// =============================================================================

import { v4 as uuidv4 } from 'uuid';
import { RegistrationFormData, RegistrationData, RegistrationResponse } from '@/types/registration';
import { validateRegistrationForm } from '@/lib/utils/validation';
import { formatRegistrationNumber } from '@/lib/utils/formatting';
import { env } from '@/lib/config/environment';

class RegistrationService {
  // Generate unique registration number
  private generateRegistrationNumber(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `REG-${timestamp}-${random}`;
  }

  // Calculate registration amount based on type and date
  private calculateRegistrationAmount(registrationType: string): number {
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

  // Create new registration
  async createRegistration(formData: RegistrationFormData): Promise<RegistrationResponse> {
    try {
      // Validate form data
      const validation = validateRegistrationForm(formData);
      if (!validation.isValid) {
        return {
          success: false,
          error: 'Validation failed',
          message: validation.errors.map(e => e.message).join(', '),
        };
      }

      // Generate registration data
      const registrationId = uuidv4();
      const registrationNumber = this.generateRegistrationNumber();
      const totalAmount = this.calculateRegistrationAmount(formData.registrationType);
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

      // Save to database (implement with your database)
      const saveSuccess = await this.saveToDatabase(registrationData);
      if (!saveSuccess) {
        return {
          success: false,
          error: 'Failed to save registration',
        };
      }

      // Send confirmation email (optional)
      await this.sendConfirmationEmail(registrationData);

      return {
        success: true,
        data: registrationData,
        message: 'Registration created successfully',
      };

    } catch (error) {
      console.error('❌ Registration creation error:', error);
      return {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Update existing registration
  async updateRegistration(registrationId: string, updates: Partial<RegistrationData>): Promise<RegistrationResponse> {
    try {
      // Get existing registration
      const existingRegistration = await this.getFromDatabase(registrationId);
      if (!existingRegistration) {
        return {
          success: false,
          error: 'Registration not found',
        };
      }

      // Merge updates
      const updatedRegistration: RegistrationData = {
        ...existingRegistration,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      // Save to database
      const saveSuccess = await this.saveToDatabase(updatedRegistration);
      if (!saveSuccess) {
        return {
          success: false,
          error: 'Failed to update registration',
        };
      }

      return {
        success: true,
        data: updatedRegistration,
        message: 'Registration updated successfully',
      };

    } catch (error) {
      console.error('❌ Registration update error:', error);
      return {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Get registration by ID
  async getRegistration(registrationId: string): Promise<RegistrationResponse> {
    try {
      const registration = await this.getFromDatabase(registrationId);
      
      if (!registration) {
        return {
          success: false,
          error: 'Registration not found',
        };
      }

      return {
        success: true,
        data: registration,
      };

    } catch (error) {
      console.error('❌ Registration get error:', error);
      return {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Save registration to database (placeholder - implement with your database)
  private async saveToDatabase(registrationData: RegistrationData): Promise<boolean> {
    try {
      // TODO: Implement database save logic here
      console.log('📝 Saving registration to database:', {
        id: registrationData.id,
        email: registrationData.email,
        registrationNumber: registrationData.registrationNumber,
      });

      // Example implementation (replace with your database logic):
      /*
      await database.registration.upsert({
        where: { id: registrationData.id },
        update: registrationData,
        create: registrationData,
      });
      */

      return true;
    } catch (error) {
      console.error('❌ Error saving to database:', error);
      return false;
    }
  }

  // Get registration from database (placeholder - implement with your database)
  private async getFromDatabase(registrationId: string): Promise<RegistrationData | null> {
    try {
      // TODO: Implement database get logic here
      console.log('📖 Getting registration from database:', registrationId);

      // Example implementation (replace with your database logic):
      /*
      const registration = await database.registration.findUnique({
        where: { id: registrationId },
      });
      
      return registration;
      */

      return null;
    } catch (error) {
      console.error('❌ Error getting from database:', error);
      return null;
    }
  }

  // Send confirmation email (placeholder - implement with your email service)
  private async sendConfirmationEmail(registrationData: RegistrationData): Promise<boolean> {
    try {
      // TODO: Implement email sending logic here
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

  // Validate registration deadline
  isRegistrationOpen(): boolean {
    const now = new Date();
    const deadline = new Date(env.CONFERENCE.REGULAR_DEADLINE);
    return now <= deadline;
  }

  // Get available registration types
  getAvailableRegistrationTypes(): Array<{ value: string; label: string; price: number }> {
    const now = new Date();
    const earlyBirdDeadline = new Date(env.CONFERENCE.EARLY_BIRD_DEADLINE);
    const regularDeadline = new Date(env.CONFERENCE.REGULAR_DEADLINE);

    const types = [];

    if (now <= earlyBirdDeadline) {
      types.push({
        value: 'early-bird',
        label: 'Early Bird',
        price: env.PRICING.EARLY_BIRD,
      });
    }

    if (now <= regularDeadline) {
      types.push({
        value: 'regular',
        label: 'Regular',
        price: env.PRICING.REGULAR,
      });
      
      types.push({
        value: 'student',
        label: 'Student',
        price: env.PRICING.REGULAR - env.PRICING.STUDENT_DISCOUNT,
      });
      
      types.push({
        value: 'speaker',
        label: 'Speaker',
        price: 0,
      });
    }

    return types;
  }

  // Get registration statistics (placeholder)
  async getRegistrationStats(): Promise<any> {
    try {
      // TODO: Implement database query for statistics
      console.log('📊 Getting registration statistics');

      // Example implementation (replace with your database logic):
      /*
      const stats = await database.registration.aggregate({
        _count: { id: true },
        _sum: { totalAmount: true },
        where: { status: 'confirmed' },
      });
      
      return {
        totalRegistrations: stats._count.id,
        totalRevenue: stats._sum.totalAmount,
        // Add more statistics as needed
      };
      */

      return {
        totalRegistrations: 0,
        totalRevenue: 0,
      };
    } catch (error) {
      console.error('❌ Error getting registration statistics:', error);
      return null;
    }
  }
}

// Export singleton instance
export const registrationService = new RegistrationService();
export default registrationService;
