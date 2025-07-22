import { defineType, defineField } from 'sanity'

export const conferenceRegistration = defineType({
  name: 'conferenceRegistration',
  title: 'Conference Registration',
  type: 'document',
  icon: () => '📝',
  // Note: Table view configuration is handled by the table plugin
  // The table plugin will automatically detect and display document fields
  fields: [
    defineField({
      name: 'registrationId',
      title: 'Registration ID',
      type: 'string',
      validation: Rule => Rule.required().unique(),
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
        {
          name: 'organization',
          title: 'Organization/Institution',
          type: 'string',
        },
        {
          name: 'designation',
          title: 'Designation/Position',
          type: 'string',
        },
        {
          name: 'specialDietaryRequirements',
          title: 'Special Dietary Requirements',
          type: 'text',
        },
      ],
    }),

    // Sponsorship Details (only for sponsorship registrations)
    defineField({
      name: 'sponsorshipDetails',
      title: 'Sponsorship Details',
      type: 'object',
      hidden: ({ document }) => document?.registrationType !== 'sponsorship',
      fields: [
        {
          name: 'sponsorshipTier',
          title: 'Sponsorship Tier',
          type: 'reference',
          to: [{ type: 'sponsorshipTiers' }],
        },
        {
          name: 'companyName',
          title: 'Company Name',
          type: 'string',
        },
        {
          name: 'companyWebsite',
          title: 'Company Website',
          type: 'url',
        },
        {
          name: 'companyLogo',
          title: 'Company Logo',
          type: 'image',
        },
        {
          name: 'sponsorshipBenefitsIncluded',
          title: 'Sponsorship Benefits Included',
          type: 'array',
          of: [{ type: 'string' }],
          readOnly: true,
        },
      ],
    }),

    defineField({
      name: 'selectedRegistrationType',
      title: 'Selected Registration Type',
      type: 'reference',
      to: [{ type: 'registrationTypes' }],
      description: 'Selected registration type (only for regular registrations)',
      hidden: ({ document }) => document?.registrationType === 'sponsorship',
    }),

    defineField({
      name: 'selectedRegistrationName',
      title: 'Registration Type Name',
      type: 'string',
      description: 'Display name of the selected registration type for table view',
    }),

    defineField({
      name: 'accommodationOption',
      title: 'Accommodation Option',
      type: 'object',
      fields: [
        {
          name: 'hotel',
          title: 'Selected Hotel',
          type: 'reference',
          to: [{ type: 'accommodationOptions' }],
        },
        {
          name: 'roomType',
          title: 'Room Type',
          type: 'string',
          options: {
            list: [
              { title: 'Single Occupancy', value: 'single' },
              { title: 'Double Occupancy', value: 'double' },
              { title: 'Triple Occupancy', value: 'triple' },
            ],
          },
        },
        {
          name: 'nights',
          title: 'Number of Nights',
          type: 'number',
          options: {
            list: [
              { title: '2 Nights', value: 2 },
              { title: '3 Nights', value: 3 },
              { title: '5 Nights', value: 5 },
            ],
          },
        },
        {
          name: 'checkInDate',
          title: 'Check-in Date',
          type: 'date',
        },
        {
          name: 'checkOutDate',
          title: 'Check-out Date',
          type: 'date',
        },
      ],
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
          name: 'registrationPrice',
          title: 'Registration Price',
          type: 'number',
          validation: Rule => Rule.required().min(0),
        },
        {
          name: 'accommodationPrice',
          title: 'Accommodation Price',
          type: 'number',
          validation: Rule => Rule.min(0),
          initialValue: 0,
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
          initialValue: 'USD',
        },
        {
          name: 'pricingPeriod',
          title: 'Pricing Period',
          type: 'string',
          options: {
            list: [
              { title: 'Early Bird', value: 'earlyBird' },
              { title: 'Next Round', value: 'nextRound' },
              { title: 'Spot Registration', value: 'spotRegistration' },
            ],
          },
        },
        {
          name: 'participantCategory',
          title: 'Participant Category',
          type: 'string',
          options: {
            list: [
              { title: 'Academia', value: 'academia' },
              { title: 'Business/Industry', value: 'business' },
            ],
          },
          description: 'Category affecting pricing (Academia vs Business/Industry)',
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
      name: 'paymentId',
      title: 'Payment ID',
      type: 'string',
      description: 'Payment gateway transaction ID',
    }),

    defineField({
      name: 'razorpayOrderId',
      title: 'Razorpay Order ID',
      type: 'string',
      description: 'Razorpay order identifier',
    }),

    defineField({
      name: 'paymentMethod',
      title: 'Payment Method',
      type: 'string',
      description: 'Method used for payment (razorpay, test_payment, etc.)',
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

    // Computed fields for better table display
    defineField({
      name: 'fullName',
      title: 'Full Name',
      type: 'string',
      description: 'Computed full name for table display',
      readOnly: true,
    }),

    defineField({
      name: 'formattedTotalPrice',
      title: 'Formatted Total Price',
      type: 'string',
      description: 'Formatted price with currency for table display',
      readOnly: true,
    }),

    defineField({
      name: 'registrationSummary',
      title: 'Registration Summary',
      type: 'object',
      description: 'Summary information for quick filtering and display',
      readOnly: true,
      fields: [
        {
          name: 'registrationTypeDisplay',
          title: 'Registration Type Display',
          type: 'string',
        },
        {
          name: 'accommodationSummary',
          title: 'Accommodation Summary',
          type: 'string',
        },
        {
          name: 'totalParticipants',
          title: 'Total Participants',
          type: 'number',
        },
        {
          name: 'paymentStatusDisplay',
          title: 'Payment Status Display',
          type: 'string',
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
    },
    prepare({ firstName, lastName, email, paymentStatus, totalPrice, currency }) {
      const statusEmojiMap = {
        pending: '⏳',
        completed: '✅',
        failed: '❌',
        refunded: '🔄',
      } as const;

      const statusEmoji = statusEmojiMap[paymentStatus as keyof typeof statusEmojiMap] || '❓';

      return {
        title: `${firstName} ${lastName}`,
        subtitle: `${email} - ${statusEmoji} ${paymentStatus.toUpperCase()} - ${currency} ${totalPrice}`,
      }
    },
  },
})
