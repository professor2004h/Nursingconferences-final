import { defineType, defineField } from 'sanity'

export const registrationSettings = defineType({
  name: 'registrationSettings',
  title: 'Registration Settings',
  type: 'document',
  icon: () => '⚙️',
  fields: [
    defineField({
      name: 'title',
      title: 'Settings Title',
      type: 'string',
      initialValue: 'Conference Registration Settings',
      readOnly: true,
    }),
    
    // Date Settings
    defineField({
      name: 'pricingDates',
      title: 'Pricing Period Dates',
      type: 'object',
      fields: [
        {
          name: 'earlyBirdEnd',
          title: 'Early Bird End Date',
          type: 'date',
          description: 'Last date for early bird pricing',
          validation: Rule => Rule.required(),
        },
        {
          name: 'nextRoundStart',
          title: 'Next Round Start Date',
          type: 'date',
          description: 'Start date for next round pricing',
          validation: Rule => Rule.required(),
        },
        {
          name: 'nextRoundEnd',
          title: 'Next Round End Date',
          type: 'date',
          description: 'Last date for next round pricing',
          validation: Rule => Rule.required(),
        },
        {
          name: 'spotRegistrationStart',
          title: 'Spot Registration Start Date',
          type: 'date',
          description: 'Start date for spot registration pricing',
          validation: Rule => Rule.required(),
        },
      ],
    }),

    // Registration Status
    defineField({
      name: 'registrationStatus',
      title: 'Registration Status',
      type: 'object',
      fields: [
        {
          name: 'isOpen',
          title: 'Registration Open',
          type: 'boolean',
          description: 'Enable/disable registration system',
          initialValue: true,
        },
        {
          name: 'closedMessage',
          title: 'Closed Message',
          type: 'text',
          description: 'Message to show when registration is closed',
          initialValue: 'Registration is currently closed. Please check back later.',
        },
      ],
    }),

    // Conference Details
    defineField({
      name: 'conferenceDetails',
      title: 'Conference Details',
      type: 'object',
      fields: [
        {
          name: 'conferenceName',
          title: 'Conference Name',
          type: 'string',
          validation: Rule => Rule.required(),
        },
        {
          name: 'conferenceDate',
          title: 'Conference Date',
          type: 'date',
          validation: Rule => Rule.required(),
        },
        {
          name: 'venue',
          title: 'Venue',
          type: 'string',
          validation: Rule => Rule.required(),
        },
        {
          name: 'city',
          title: 'City',
          type: 'string',
          validation: Rule => Rule.required(),
        },
        {
          name: 'country',
          title: 'Country',
          type: 'string',
          validation: Rule => Rule.required(),
        },
      ],
    }),

    // Contact Information
    defineField({
      name: 'contactInfo',
      title: 'Contact Information',
      type: 'object',
      fields: [
        {
          name: 'email',
          title: 'Contact Email',
          type: 'email',
          validation: Rule => Rule.required(),
        },
        {
          name: 'phone',
          title: 'Contact Phone',
          type: 'string',
          validation: Rule => Rule.required(),
        },
        {
          name: 'supportEmail',
          title: 'Support Email',
          type: 'email',
        },
      ],
    }),

    // Payment Settings
    defineField({
      name: 'paymentSettings',
      title: 'Payment Settings',
      type: 'object',
      fields: [
        {
          name: 'currency',
          title: 'Currency',
          type: 'string',
          options: {
            list: [
              { title: 'USD - US Dollar', value: 'USD' },
              { title: 'EUR - Euro', value: 'EUR' },
              { title: 'GBP - British Pound', value: 'GBP' },
              { title: 'INR - Indian Rupee', value: 'INR' },
              { title: 'AUD - Australian Dollar', value: 'AUD' },
            ],
          },
          initialValue: 'USD',
          validation: Rule => Rule.required(),
        },
        {
          name: 'currencySymbol',
          title: 'Currency Symbol',
          type: 'string',
          initialValue: '$',
          validation: Rule => Rule.required(),
        },
        {
          name: 'paymentMethods',
          title: 'Enabled Payment Methods',
          type: 'array',
          of: [
            {
              type: 'string',
              options: {
                list: [
                  { title: 'Credit Card', value: 'card' },
                  { title: 'Net Banking', value: 'netbanking' },
                  { title: 'UPI', value: 'upi' },
                  { title: 'Wallet', value: 'wallet' },
                ],
              },
            },
          ],
          initialValue: ['card', 'netbanking', 'upi'],
        },
      ],
    }),

    // Form Settings
    defineField({
      name: 'formSettings',
      title: 'Form Settings',
      type: 'object',
      fields: [
        {
          name: 'maxParticipants',
          title: 'Maximum Participants per Registration',
          type: 'number',
          initialValue: 10,
          validation: Rule => Rule.required().min(1).max(50),
        },
        {
          name: 'requiredFields',
          title: 'Required Fields',
          type: 'array',
          of: [
            {
              type: 'string',
              options: {
                list: [
                  { title: 'Title', value: 'title' },
                  { title: 'First Name', value: 'firstName' },
                  { title: 'Last Name', value: 'lastName' },
                  { title: 'Email', value: 'email' },
                  { title: 'Phone Number', value: 'phoneNumber' },
                  { title: 'Country', value: 'country' },

                  { title: 'Full Postal Address', value: 'fullPostalAddress' },
                ],
              },
            },
          ],
          initialValue: ['firstName', 'lastName', 'email', 'phoneNumber', 'country', 'fullPostalAddress'],
        },

      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      conferenceName: 'conferenceDetails.conferenceName',
    },
    prepare({ title, conferenceName }) {
      return {
        title: title || 'Registration Settings',
        subtitle: conferenceName || 'Conference Registration Configuration',
      }
    },
  },
})
