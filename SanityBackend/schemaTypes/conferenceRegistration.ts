import { defineField, defineType } from 'sanity';
import { ReceiptFileInput } from '../components/CustomFileInput.jsx';

export const conferenceRegistration = defineType({
  name: 'conferenceRegistration',
  title: 'Conference Registrations',
  type: 'document',
  icon: () => '📝',
  fields: [
    defineField({
      name: 'registrationId',
      title: 'Registration ID',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'Unique registration identifier',
    }),

    defineField({
      name: 'registrationType',
      title: 'Registration Type',
      type: 'string',
      description: 'Type of registration (regular, speaker, etc.)',
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
        },
        {
          name: 'firstName',
          title: 'First Name',
          type: 'string',
          validation: Rule => Rule.required(),
        },
        {
          name: 'lastName',
          title: 'Last Name',
          type: 'string',
          validation: Rule => Rule.required(),
        },
        {
          name: 'fullName',
          title: 'Full Name',
          type: 'string',
        },
        {
          name: 'email',
          title: 'Email',
          type: 'string',
          validation: Rule => Rule.required().email(),
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
          name: 'abstractCategory',
          title: 'Abstract Category',
          type: 'string',
        },
        {
          name: 'fullPostalAddress',
          title: 'Full Postal Address',
          type: 'text',
        },
      ],
    }),

    defineField({
      name: 'selectedRegistration',
      title: 'Selected Registration',
      type: 'string',
      description: 'Selected registration type name',
    }),

    defineField({
      name: 'selectedRegistrationName',
      title: 'Selected Registration Name',
      type: 'string',
      description: 'Display name of selected registration',
    }),

    defineField({
      name: 'participantCategory',
      title: 'Participant Category',
      type: 'string',
      description: 'Category of participant (academic, industry, etc.)',
    }),

    defineField({
      name: 'sponsorType',
      title: 'Sponsor Type',
      type: 'string',
      description: 'Type of sponsorship if applicable',
    }),

    defineField({
      name: 'accommodationType',
      title: 'Accommodation Type',
      type: 'string',
      description: 'Selected accommodation option',
    }),

    defineField({
      name: 'accommodationNights',
      title: 'Accommodation Nights',
      type: 'string',
      description: 'Number of accommodation nights',
    }),

    defineField({
      name: 'numberOfParticipants',
      title: 'Number of Participants',
      type: 'number',
      validation: Rule => Rule.required().min(1),
      description: 'Total number of participants',
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
          validation: Rule => Rule.required().min(0),
        },
        {
          name: 'accommodationFee',
          title: 'Accommodation Fee',
          type: 'number',
          validation: Rule => Rule.min(0),
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
          validation: Rule => Rule.required(),
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
          name: 'formattedTotalPrice',
          title: 'Formatted Total Price',
          type: 'string',
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
    }),

    defineField({
      name: 'paypalTransactionId',
      title: 'PayPal Transaction ID',
      type: 'string',
      description: 'PayPal transaction identifier',
    }),

    defineField({
      name: 'razorpayPaymentId',
      title: 'Razorpay Payment ID',
      type: 'string',
      description: 'Razorpay payment identifier',
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
      options: {
        list: [
          { title: 'PayPal', value: 'paypal' },
          { title: 'Razorpay', value: 'razorpay' },
          { title: 'Manual', value: 'manual' },
        ],
      },
    }),

    defineField({
      name: 'registrationDate',
      title: 'Registration Date',
      type: 'datetime',
      validation: Rule => Rule.required(),
      initialValue: () => new Date().toISOString(),
    }),

    defineField({
      name: 'paymentDate',
      title: 'Payment Date',
      type: 'datetime',
      description: 'When payment was completed',
    }),

    defineField({
      name: 'receiptEmailSent',
      title: 'Receipt Email Sent',
      type: 'boolean',
      description: 'Whether receipt email was sent',
      initialValue: false,
    }),

    defineField({
      name: 'receiptEmailSentAt',
      title: 'Receipt Email Sent At',
      type: 'datetime',
      description: 'When receipt email was sent',
    }),

    defineField({
      name: 'receiptEmailRecipient',
      title: 'Receipt Email Recipient',
      type: 'string',
      description: 'Email address where receipt was sent',
    }),

    defineField({
      name: 'pdfReceipt',
      title: 'PDF Receipt',
      type: 'file',
      options: {
        accept: '.pdf',
      },
      components: {
        input: ReceiptFileInput,
      },
      description: 'Generated PDF receipt - opens in new tab when downloaded',
    }),

    defineField({
      name: 'pdfReceiptGenerated',
      title: 'PDF Receipt Generated',
      type: 'boolean',
      description: 'Whether PDF receipt was generated',
      initialValue: false,
    }),

    defineField({
      name: 'pdfReceiptStoredInSanity',
      title: 'PDF Receipt Stored in Sanity',
      type: 'boolean',
      description: 'Whether PDF receipt was uploaded to Sanity',
      initialValue: false,
    }),

    defineField({
      name: 'webhookProcessed',
      title: 'Webhook Processed',
      type: 'boolean',
      description: 'Whether payment webhook was processed',
      initialValue: false,
    }),

    // Missing fields that were found in the data
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      description: 'Whether this registration is active',
      initialValue: true,
    }),

    defineField({
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'datetime',
      description: 'When this registration was last updated',
    }),

    defineField({
      name: 'paidAmount',
      title: 'Paid Amount',
      type: 'number',
      description: 'Amount actually paid',
    }),

    defineField({
      name: 'paidCurrency',
      title: 'Paid Currency',
      type: 'string',
      description: 'Currency of the paid amount',
    }),

    defineField({
      name: 'paymentCapturedAt',
      title: 'Payment Captured At',
      type: 'datetime',
      description: 'When payment was captured',
    }),

    defineField({
      name: 'paymentInitiatedAt',
      title: 'Payment Initiated At',
      type: 'datetime',
      description: 'When payment was initiated',
    }),

    defineField({
      name: 'paypalOrderId',
      title: 'PayPal Order ID',
      type: 'string',
      description: 'PayPal order identifier',
    }),

    defineField({
      name: 'registrationTable',
      title: 'Registration Table Data',
      type: 'object',
      description: 'Additional registration table data',
      fields: [
        {
          name: 'pdfReceiptFile',
          title: 'PDF Receipt File',
          type: 'file',
          options: {
            accept: '.pdf',
          },
        },
      ],
    }),

    defineField({
      name: 'updatedAt',
      title: 'Updated At',
      type: 'datetime',
      description: 'Last update timestamp',
    }),

    defineField({
      name: 'notes',
      title: 'Internal Notes',
      type: 'text',
      description: 'Internal notes for admin use',
    }),

    defineField({
      name: 'status',
      title: 'Registration Status',
      type: 'string',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Submitted', value: 'submitted' },
          { title: 'Confirmed', value: 'confirmed' },
          { title: 'Cancelled', value: 'cancelled' },
        ],
      },
      initialValue: 'draft',
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
      title: 'Registration ID',
      name: 'registrationIdAsc',
      by: [{ field: 'registrationId', direction: 'asc' }],
    },
  ],

  preview: {
    select: {
      title: 'personalDetails.fullName',
      subtitle: 'registrationId',
      media: 'personalDetails.email',
    },
    prepare(selection) {
      const { title, subtitle, media } = selection;
      return {
        title: title || 'Unnamed Registration',
        subtitle: `${subtitle} - ${media}`,
      };
    },
  },
});

export default conferenceRegistration;
