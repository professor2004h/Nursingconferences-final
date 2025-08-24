import { defineType, defineField } from 'sanity'

export const conferenceRegistration = defineType({
  name: 'conferenceRegistration',
  title: 'Conference Registration',
  type: 'document',
  icon: () => '📝',
  fields: [
    defineField({
      name: 'registrationId',
      title: 'Registration ID',
      type: 'string',
      validation: Rule => Rule.required().custom(async (value, context) => {
        if (!value) return true; // Let required() handle empty values

        // Check for duplicates
        const { getClient } = context;
        const client = getClient({ apiVersion: '2023-01-01' });

        const duplicates = await client.fetch(
          `*[_type == "conferenceRegistration" && registrationId == $registrationId && _id != $currentId]`,
          {
            registrationId: value,
            currentId: context.document?._id || ''
          }
        );

        if (duplicates.length > 0) {
          return 'Registration ID must be unique. This ID already exists.';
        }

        return true;
      }),
      description: 'Unique registration identifier',
      readOnly: true,
    }),

    defineField({
      name: 'registrationType',
      title: 'Registration Type',
      type: 'string',
      options: {
        list: [
          { title: 'Regular Registration', value: 'regular' },
          { title: 'Sponsorship Registration', value: 'sponsorship' },
        ],
      },
      validation: Rule => Rule.required(),
      description: 'Type of registration - regular or sponsorship',
    }),

    defineField({
      name: 'personalDetails',
      title: 'Personal Details',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
          options: {
            list: [
              { title: 'Mr', value: 'Mr' },
              { title: 'Ms', value: 'Ms' },
              { title: 'Mrs', value: 'Mrs' },
              { title: 'Prof', value: 'Prof' },
              { title: 'Dr', value: 'Dr' },
            ],
          },
        },
        {
          name: 'firstName',
          title: 'First Name',
          type: 'string',
          validation: Rule => Rule.required().min(2),
        },
        {
          name: 'lastName',
          title: 'Last Name',
          type: 'string',
          validation: Rule => Rule.required().min(2),
        },
        {
          name: 'email',
          title: 'Email',
          type: 'email',
          validation: Rule => Rule.required(),
        },
        {
          name: 'phoneNumber',
          title: 'Phone Number',
          type: 'string',
          validation: Rule => Rule.required(),
        },
        {
          name: 'country',
          title: 'Country',
          type: 'string',
          validation: Rule => Rule.required(),
        },
        {
          name: 'fullPostalAddress',
          title: 'Full Postal Address',
          type: 'text',
          validation: Rule => Rule.required().min(10),
        },
      ],
    }),

    // Removed unnecessary fields:
    // - selectedRegistration (removed as requested)
    // - selectedRegistrationName (removed as requested)

    // Sponsorship Selection (for sponsorship registrations)
    defineField({
      name: 'sponsorType',
      title: 'Sponsorship Type',
      type: 'string',
      options: {
        list: [
          { title: 'Gold', value: 'Gold' },
          { title: 'Diamond', value: 'Diamond' },
          { title: 'Platinum', value: 'Platinum' },
        ],
      },
      description: 'Selected sponsorship tier (Gold, Diamond, Platinum)',
      hidden: ({ document }) => document?.registrationType !== 'sponsorship',
    }),

    // Accommodation Details
    defineField({
      name: 'accommodationType',
      title: 'Accommodation Type',
      type: 'string',
      description: 'Selected accommodation (hotelId-roomType-nights format)',
    }),

    defineField({
      name: 'accommodationNights',
      title: 'Accommodation Nights',
      type: 'string',
      description: 'Number of nights for accommodation',
    }),

    defineField({
      name: 'numberOfParticipants',
      title: 'Number of Participants',
      type: 'number',
      validation: Rule => Rule.required().min(1).max(50),
      initialValue: 1,
    }),

    defineField({
      name: 'pricing',
      title: 'Pricing Details',
      type: 'object',
      fields: [
        {
          name: 'registrationFee',
          title: 'Registration Fee',
          type: 'number',
          validation: Rule => Rule.min(0),
          description: 'Registration fee per participant',
        },
        {
          name: 'accommodationFee',
          title: 'Accommodation Fee',
          type: 'number',
          validation: Rule => Rule.min(0),
          description: 'Total accommodation fee',
        },
        {
          name: 'totalPrice',
          title: 'Total Price',
          type: 'number',
          validation: Rule => Rule.required().min(0),
        },
        {
          name: 'currency',
          title: 'Currency',
          type: 'string',
          options: {
            list: [
              { title: 'US Dollar (USD)', value: 'USD' },
              { title: 'Euro (EUR)', value: 'EUR' },
              { title: 'Indian Rupee (INR)', value: 'INR' },
              { title: 'British Pound (GBP)', value: 'GBP' },
              { title: 'Canadian Dollar (CAD)', value: 'CAD' },
              { title: 'Australian Dollar (AUD)', value: 'AUD' },
              { title: 'Japanese Yen (JPY)', value: 'JPY' },
            ],
          },
          initialValue: 'USD',
          validation: Rule => Rule.required(),
          description: 'Currency used for payment processing',
        },
        {
          name: 'pricingPeriod',
          title: 'Pricing Period',
          type: 'string',
          description: 'The pricing period when registration was made',
        },
      ],
    }),

    defineField({
      name: 'paymentStatus',
      title: 'Payment Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Completed', value: 'completed' },
          { title: 'Failed', value: 'failed' },
          { title: 'Refunded', value: 'refunded' },
        ],
      },
      initialValue: 'pending',
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'paypalTransactionId',
      title: 'PayPal Transaction ID',
      type: 'string',
      description: 'PayPal transaction ID from successful payment capture',
      validation: Rule => Rule.custom((value, context) => {
        const paymentStatus = context.document?.paymentStatus;
        if (paymentStatus === 'completed' && !value) {
          return 'PayPal Transaction ID is required for completed payments';
        }
        return true;
      }),
    }),

    defineField({
      name: 'paypalOrderId',
      title: 'PayPal Order ID',
      type: 'string',
      description: 'PayPal order identifier from payment processing',
    }),

    defineField({
      name: 'paymentMethod',
      title: 'Payment Method',
      type: 'string',
      options: {
        list: [
          { title: 'PayPal', value: 'paypal' },
          { title: 'Test Payment', value: 'test_payment' },
        ],
      },
      initialValue: 'paypal',
      description: 'Payment method used for transaction',
    }),

    defineField({
      name: 'paymentDate',
      title: 'Payment Date',
      type: 'datetime',
      description: 'When the payment was completed',
    }),

    defineField({
      name: 'isTestPayment',
      title: 'Test Payment',
      type: 'boolean',
      initialValue: false,
      description: 'Whether this is a test payment (no actual charges)',
    }),

    defineField({
      name: 'registrationDate',
      title: 'Registration Date',
      type: 'datetime',
      validation: Rule => Rule.required(),
      initialValue: () => new Date().toISOString(),
    }),

    defineField({
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'datetime',
      validation: Rule => Rule.required(),
      initialValue: () => new Date().toISOString(),
    }),

    defineField({
      name: 'notes',
      title: 'Admin Notes',
      type: 'text',
      description: 'Internal notes for admin use',
    }),

    defineField({
      name: 'isActive',
      title: 'Active Registration',
      type: 'boolean',
      description: 'Is this registration active?',
      initialValue: true,
    }),

    // PDF Receipt Storage
    defineField({
      name: 'pdfReceipt',
      title: 'PDF Receipt',
      type: 'file',
      options: {
        accept: '.pdf',
      },
      description: 'Generated PDF receipt for this registration',
    }),

    // Registration Management Table Data
    defineField({
      name: 'registrationTable',
      title: 'Registration Table Data',
      type: 'object',
      description: 'Structured data for registration management table view',
      fields: [
        {
          name: 'paypalTransactionId',
          title: 'PayPal Transaction ID',
          type: 'string',
          description: 'PayPal transaction identifier',
        },
        {
          name: 'registrationType',
          title: 'Registration Type',
          type: 'string',
          description: 'Type of registration',
        },
        {
          name: 'participantName',
          title: 'Participant Name',
          type: 'string',
          description: 'Full name of the participant',
        },
        {
          name: 'phoneNumber',
          title: 'Phone Number',
          type: 'string',
          description: 'Contact phone number',
        },
        {
          name: 'emailAddress',
          title: 'Email Address',
          type: 'email',
          description: 'Contact email address',
        },
        {
          name: 'paymentAmount',
          title: 'Payment Amount',
          type: 'number',
          description: 'Total payment amount',
        },
        {
          name: 'currency',
          title: 'Currency',
          type: 'string',
          options: {
            list: [
              { title: 'USD', value: 'USD' },
              { title: 'EUR', value: 'EUR' },
              { title: 'INR', value: 'INR' },
              { title: 'GBP', value: 'GBP' },
              { title: 'CAD', value: 'CAD' },
              { title: 'AUD', value: 'AUD' },
              { title: 'JPY', value: 'JPY' },
            ],
          },
          description: 'Payment currency',
        },
        {
          name: 'paymentStatus',
          title: 'Payment Status',
          type: 'string',
          options: {
            list: [
              { title: 'Pending', value: 'pending' },
              { title: 'Successful', value: 'successful' },
              { title: 'Failed', value: 'failed' },
            ],
          },
          description: 'Current payment status',
        },
        {
          name: 'registrationDate',
          title: 'Registration Date',
          type: 'datetime',
          description: 'Date and time of registration',
        },
        {
          name: 'pdfReceiptFile',
          title: 'PDF Receipt File',
          type: 'file',
          options: {
            accept: '.pdf',
          },
          description: 'PDF receipt file for download',
        },
      ],
    }),
  ],

  orderings: [
    {
      title: 'Registration Date (Newest First)',
      name: 'registrationDateDesc',
      by: [{ field: 'registrationDate', direction: 'desc' }],
    },
    {
      title: 'Payment Status',
      name: 'paymentStatusAsc',
      by: [{ field: 'paymentStatus', direction: 'asc' }],
    },
    {
      title: 'Last Name',
      name: 'lastNameAsc',
      by: [{ field: 'personalDetails.lastName', direction: 'asc' }],
    },
  ],

  preview: {
    select: {
      firstName: 'personalDetails.firstName',
      lastName: 'personalDetails.lastName',
      email: 'personalDetails.email',
      paymentStatus: 'paymentStatus',
      totalPrice: 'pricing.totalPrice',
      currency: 'pricing.currency',
      sponsorType: 'sponsorType',
      registrationType: 'registrationType',
    },
    prepare({ firstName, lastName, email, paymentStatus, totalPrice, currency, sponsorType, registrationType }) {
      const statusEmojiMap = {
        pending: '⏳',
        completed: '✅',
        failed: '❌',
        refunded: '🔄',
      } as const;

      const statusEmoji = statusEmojiMap[paymentStatus as keyof typeof statusEmojiMap] || '❓';
      
      let typeDisplay = registrationType;
      if (registrationType === 'sponsorship' && sponsorType) {
        typeDisplay = `Sponsorship-${sponsorType}`;
      }

      return {
        title: `${firstName} ${lastName}`,
        subtitle: `${email} - ${typeDisplay} - ${statusEmoji} ${paymentStatus.toUpperCase()} - ${currency} ${totalPrice}`,
      }
    },
  },
})
