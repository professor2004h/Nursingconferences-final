import { defineType, defineField } from 'sanity'

export const paymentRecord = defineType({
  name: 'paymentRecord',
  title: 'Payment Records',
  type: 'document',
  icon: () => '💳',
  fields: [
    defineField({
      name: 'registrationId',
      title: 'Registration ID',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'Associated registration identifier',
    }),



    defineField({
      name: 'paymentId',
      title: 'Payment ID',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'Payment gateway transaction ID',
    }),

    defineField({
      name: 'orderId',
      title: 'Order ID',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'Payment gateway order ID',
    }),

    defineField({
      name: 'amount',
      title: 'Amount',
      type: 'number',
      validation: Rule => Rule.required().min(0),
      description: 'Payment amount',
    }),

    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      initialValue: 'USD',
      options: {
        list: [
          { title: 'USD', value: 'USD' },
          { title: 'EUR', value: 'EUR' },
          { title: 'GBP', value: 'GBP' },
          { title: 'INR', value: 'INR' },
        ],
      },
    }),

    defineField({
      name: 'paymentMethod',
      title: 'Payment Method',
      type: 'string',
      options: {
        list: [
          { title: 'Razorpay', value: 'razorpay' },
          { title: 'CCAvenue', value: 'ccavenue' },
          { title: 'Test Payment', value: 'test_payment' },
          { title: 'Bank Transfer', value: 'bank_transfer' },
          { title: 'Other', value: 'other' },
        ],
      },
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
      name: 'paymentDate',
      title: 'Payment Date',
      type: 'datetime',
      validation: Rule => Rule.required(),
      description: 'When the payment was processed',
    }),

    defineField({
      name: 'isTestPayment',
      title: 'Test Payment',
      type: 'boolean',
      description: 'Is this a test payment?',
      initialValue: false,
    }),

    // Customer information for easy reference
    defineField({
      name: 'customerName',
      title: 'Customer Name',
      type: 'string',
      description: 'Customer full name for table display',
      readOnly: true,
    }),

    defineField({
      name: 'customerEmail',
      title: 'Customer Email',
      type: 'email',
      description: 'Customer email for table display',
      readOnly: true,
    }),

    // Formatted fields for table display
    defineField({
      name: 'formattedAmount',
      title: 'Formatted Amount',
      type: 'string',
      description: 'Formatted amount with currency for table display',
      readOnly: true,
    }),

    defineField({
      name: 'paymentStatusDisplay',
      title: 'Payment Status Display',
      type: 'string',
      description: 'Formatted payment status for table display',
      readOnly: true,
    }),

    // Gateway specific fields
    defineField({
      name: 'gatewayResponse',
      title: 'Gateway Response',
      type: 'object',
      description: 'Raw response from payment gateway',
      fields: [
        {
          name: 'signature',
          title: 'Payment Signature',
          type: 'string',
        },
        {
          name: 'rawResponse',
          title: 'Raw Response Data',
          type: 'text',
        },
      ],
    }),

    defineField({
      name: 'notes',
      title: 'Payment Notes',
      type: 'text',
      description: 'Additional notes about the payment',
    }),

    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      validation: Rule => Rule.required(),
      initialValue: () => new Date().toISOString(),
    }),

    defineField({
      name: 'updatedAt',
      title: 'Updated At',
      type: 'datetime',
      validation: Rule => Rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
  ],

  orderings: [
    {
      title: 'Payment Date (Newest First)',
      name: 'paymentDateDesc',
      by: [{ field: 'paymentDate', direction: 'desc' }],
    },
    {
      title: 'Payment Status',
      name: 'paymentStatusAsc',
      by: [{ field: 'paymentStatus', direction: 'asc' }],
    },
    {
      title: 'Amount (Highest First)',
      name: 'amountDesc',
      by: [{ field: 'amount', direction: 'desc' }],
    },
  ],

  preview: {
    select: {
      customerName: 'customerName',
      customerEmail: 'customerEmail',
      amount: 'amount',
      currency: 'currency',
      paymentStatus: 'paymentStatus',
      isTestPayment: 'isTestPayment',
      paymentMethod: 'paymentMethod',
    },
    prepare({ customerName, customerEmail, amount, currency, paymentStatus, isTestPayment, paymentMethod }) {
      const statusEmojiMap = {
        pending: '⏳',
        completed: '✅',
        failed: '❌',
        refunded: '🔄',
      } as const;

      const statusEmoji = statusEmojiMap[paymentStatus as keyof typeof statusEmojiMap] || '❓';
      const testLabel = isTestPayment ? ' (TEST)' : '';
      const methodLabel = paymentMethod === 'test_payment' ? ' 🧪' : '';

      return {
        title: `${customerName || 'Unknown Customer'}${testLabel}`,
        subtitle: `${customerEmail} - ${statusEmoji} ${paymentStatus.toUpperCase()} - ${currency} ${amount}${methodLabel}`,
      }
    },
  },
})
