import { client } from './sanity/client';

export interface RegistrationSettingsType {
  _id: string;
  title: string;

  pricingDates: {
    earlyBirdEnd: string;
    nextRoundStart: string;
    nextRoundEnd: string;
    spotRegistrationStart: string;
  };
  registrationStatus: {
    isOpen: boolean;
    closedMessage: string;
  };
  conferenceDetails: {
    conferenceName: string;
    conferenceDate: string;
    venue: string;
    city: string;
    country: string;
  };
  contactInfo: {
    email: string;
    phone: string;
    supportEmail?: string;
  };
  paymentSettings: {
    currency: string;
    currencySymbol: string;
    paymentMethods: string[];
  };
  formSettings: {
    maxParticipants: number;
    requiredFields: string[];
  };
}

// Get the registration settings
export async function getRegistrationSettings(): Promise<RegistrationSettingsType | null> {
  try {
    // Try specific document ID first
    let query = `*[_id == "Zv40Z5ggwujmDSMbbmCqTW"][0]{
      _id,
      title,

      pricingDates{
        earlyBirdEnd,
        nextRoundStart,
        nextRoundEnd,
        spotRegistrationStart
      },
      registrationStatus{
        isOpen,
        closedMessage
      },
      conferenceDetails{
        conferenceName,
        conferenceDate,
        venue,
        city,
        country
      },
      contactInfo{
        email,
        phone,
        supportEmail
      },
      paymentSettings{
        currency,
        currencySymbol,
        paymentMethods
      },
      formSettings{
        maxParticipants,
        requiredFields
      }
    }`;

    let data = await client.fetch(query, {}, {
      next: {
        revalidate: 300, // Cache for 5 minutes
        tags: ['registration-settings']
      }
    });

    // If specific ID doesn't work, try by type
    if (!data) {
      query = `*[
        _type == "registrationSettings"
      ][0]{
        _id,
        title,

        pricingDates{
          earlyBirdEnd,
          nextRoundStart,
          nextRoundEnd,
          spotRegistrationStart
        },
        registrationStatus{
          isOpen,
          closedMessage
        },
        conferenceDetails{
          conferenceName,
          conferenceDate,
          venue,
          city,
          country
        },
        contactInfo{
          email,
          phone,
          supportEmail
        },
        paymentSettings{
          currency,
          currencySymbol,
          paymentMethods
        },
        formSettings{
          maxParticipants,
          requiredFields
        }
      }`;

      data = await client.fetch(query, {}, {
        next: {
          revalidate: 300, // Cache for 5 minutes
          tags: ['registration-settings']
        }
      });
    }

    return data || null;
  } catch (error) {
    console.error('Error fetching registration settings:', error);
    return null;
  }
}

// Get default registration settings (fallback)
export function getDefaultRegistrationSettings(): RegistrationSettingsType {
  return {
    _id: 'default',
    title: 'Registration Settings',

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
}

// Get registration settings with fallback
export async function getRegistrationSettingsWithFallback(): Promise<RegistrationSettingsType> {
  const settings = await getRegistrationSettings();
  return settings || getDefaultRegistrationSettings();
}
