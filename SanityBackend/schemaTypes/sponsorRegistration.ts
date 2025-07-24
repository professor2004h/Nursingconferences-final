import { defineField, defineType } from 'sanity';

const sponsorRegistration = defineType({
  name: 'sponsorRegistration',
  title: 'Sponsor Registration',
  type: 'document',
  fields: [
    defineField({
      name: 'registrationId',
      title: 'Registration ID',
      type: 'string',
      validation: (Rule) => Rule.required().custom(async (value, context) => {
        if (!value) return true; // Let required() handle empty values

        // Check for duplicates
        const { getClient } = context;
        const client = getClient({ apiVersion: '2023-01-01' });

        const duplicates = await client.fetch(
          `*[_type == "sponsorRegistration" && registrationId == $registrationId && _id != $currentId]`,
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
      name: 'conference',
      title: 'Conference',
      type: 'reference',
      to: [{ type: 'conferenceEvent' }],
      validation: (Rule) => Rule.required(),
      description: 'The conference being sponsored',
    }),
    defineField({
      name: 'sponsorshipTier',
      title: 'Sponsorship Tier',
      type: 'reference',
      to: [{ type: 'sponsorshipTiers' }],
      description: 'Selected sponsorship tier (null for custom amounts)',
    }),
    defineField({
      name: 'isCustomAmount',
      title: 'Is Custom Amount',
      type: 'boolean',
      description: 'Whether this is a custom sponsorship amount',
      initialValue: false,
    }),
    defineField({
      name: 'customAmount',
      title: 'Custom Amount (USD)',
      type: 'number',
      description: 'Custom sponsorship amount in USD (only if isCustomAmount is true)',
      validation: (Rule) => Rule.min(0),
      hidden: ({ document }) => !document?.isCustomAmount,
    }),
    defineField({
      name: 'companyDetails',
      title: 'Company Details',
      type: 'object',
      fields: [
        {
          name: 'companyName',
          title: 'Company Name',
          type: 'string',
          validation: (Rule) => Rule.required().max(100),
        },
        {
          name: 'industry',
          title: 'Industry',
          type: 'string',
          validation: (Rule) => Rule.max(100),
        },
        {
          name: 'website',
          title: 'Company Website',
          type: 'url',
          validation: (Rule) => Rule.uri({
            scheme: ['http', 'https']
          }),
        },
        {
          name: 'logo',
          title: 'Company Logo',
          type: 'image',
          options: {
            hotspot: true,
          },
          description: 'Company logo for promotional materials',
        },
        {
          name: 'description',
          title: 'Company Description',
          type: 'text',
          rows: 4,
          validation: (Rule) => Rule.max(500),
          description: 'Brief description of the company',
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'contactPerson',
      title: 'Contact Person',
      type: 'object',
      fields: [
        {
          name: 'firstName',
          title: 'First Name',
          type: 'string',
          validation: (Rule) => Rule.required().max(50),
        },
        {
          name: 'lastName',
          title: 'Last Name',
          type: 'string',
          validation: (Rule) => Rule.required().max(50),
        },
        {
          name: 'title',
          title: 'Job Title',
          type: 'string',
          validation: (Rule) => Rule.max(100),
        },
        {
          name: 'email',
          title: 'Email Address',
          type: 'string',
          validation: (Rule) => Rule.required().email(),
        },
        {
          name: 'phone',
          title: 'Phone Number',
          type: 'string',
          validation: (Rule) => Rule.required().regex(/^[\+]?[0-9\s\-\(\)]{7,20}$/).error('A valid phone number is required'),
        },
        {
          name: 'alternateEmail',
          title: 'Alternate Email',
          type: 'string',
          validation: (Rule) => Rule.email(),
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'billingAddress',
      title: 'Billing Address',
      type: 'object',
      fields: [
        {
          name: 'street',
          title: 'Street Address',
          type: 'string',
          validation: (Rule) => Rule.required().max(200),
        },
        {
          name: 'city',
          title: 'City',
          type: 'string',
          validation: (Rule) => Rule.required().max(100),
        },
        {
          name: 'state',
          title: 'State/Province',
          type: 'string',
          validation: (Rule) => Rule.max(100),
        },
        {
          name: 'postalCode',
          title: 'Postal Code',
          type: 'string',
          validation: (Rule) => Rule.max(20),
        },
        {
          name: 'country',
          title: 'Country',
          type: 'string',
          validation: (Rule) => Rule.required().max(100),
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'specialRequests',
      title: 'Special Requests',
      type: 'text',
      rows: 4,
      description: 'Any special requests or additional information',
    }),
    defineField({
      name: 'status',
      title: 'Registration Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending Payment', value: 'pending' },
          { title: 'Payment Processing', value: 'processing' },
          { title: 'Confirmed', value: 'confirmed' },
          { title: 'Cancelled', value: 'cancelled' },
          { title: 'Refunded', value: 'refunded' },
        ],
      },
      initialValue: 'pending',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'paymentDetails',
      title: 'Payment Details',
      type: 'object',
      fields: [
        {
          name: 'paymentId',
          title: 'Payment ID',
          type: 'string',
          description: 'Payment gateway transaction ID',
        },
        {
          name: 'paymentMethod',
          title: 'Payment Method',
          type: 'string',
          options: {
            list: [
              { title: 'Razorpay', value: 'razorpay' },
              { title: 'Stripe', value: 'stripe' },
              { title: 'PayPal', value: 'paypal' },
              { title: 'Bank Transfer', value: 'bank_transfer' },
            ],
          },
        },
        {
          name: 'amount',
          title: 'Paid Amount (USD)',
          type: 'number',
          validation: (Rule) => Rule.min(0),
        },
        {
          name: 'currency',
          title: 'Currency',
          type: 'string',
          initialValue: 'USD',
        },
        {
          name: 'paymentDate',
          title: 'Payment Date',
          type: 'datetime',
        },
        {
          name: 'invoiceNumber',
          title: 'Invoice Number',
          type: 'string',
        },
      ],
    }),
    defineField({
      name: 'submissionDate',
      title: 'Submission Date',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'notes',
      title: 'Internal Notes',
      type: 'text',
      rows: 3,
      description: 'Internal notes for admin use',
    }),
  ],
  orderings: [
    {
      title: 'Submission Date (Newest First)',
      name: 'submissionDateDesc',
      by: [{ field: 'submissionDate', direction: 'desc' }],
    },
    {
      title: 'Company Name',
      name: 'companyNameAsc',
      by: [{ field: 'companyDetails.companyName', direction: 'asc' }],
    },
    {
      title: 'Status',
      name: 'statusAsc',
      by: [{ field: 'status', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      companyName: 'companyDetails.companyName',
      contactName: 'contactPerson.firstName',
      contactLastName: 'contactPerson.lastName',
      status: 'status',
      submissionDate: 'submissionDate',
    },
    prepare(selection) {
      const { companyName, contactName, contactLastName, status, submissionDate } = selection;
      const statusEmoji = {
        pending: '⏳',
        processing: '🔄',
        confirmed: '✅',
        cancelled: '❌',
        refunded: '💰',
      }[status as string] || '❓';
      
      return {
        title: `${statusEmoji} ${companyName || 'Unknown Company'}`,
        subtitle: `Contact: ${contactName} ${contactLastName} | ${new Date(submissionDate).toLocaleDateString()}`,
      };
    },
  },
});

export default sponsorRegistration;
