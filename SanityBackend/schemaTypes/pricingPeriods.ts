import { defineType, defineField } from 'sanity'

export const pricingPeriods = defineType({
  name: 'pricingPeriods',
  title: 'Pricing Periods',
  type: 'document',
  fields: [
    defineField({
      name: 'periodId',
      title: 'Period ID',
      type: 'string',
      validation: Rule => Rule.required(),
      options: {
        list: [
          { title: 'Early Bird', value: 'earlyBird' },
          { title: 'Next Round', value: 'nextRound' },
          { title: 'Spot Registration', value: 'spotRegistration' },
        ],
      },
    }),

    defineField({
      name: 'title',
      title: 'Period Title',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'Display title for this pricing period',
    }),

    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'datetime',
      validation: Rule => Rule.required(),
      description: 'When this pricing period begins',
    }),

    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'datetime',
      validation: Rule => Rule.required(),
      description: 'When this pricing period ends',
    }),

    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      description: 'Enable/disable this pricing period',
      initialValue: true,
    }),

    defineField({
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      validation: Rule => Rule.required().min(0),
      description: 'Order in which this period appears (lower numbers first)',
    }),

    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Optional description for this pricing period',
    }),

    defineField({
      name: 'highlightColor',
      title: 'Highlight Color',
      type: 'color',
      description: 'Color to highlight this period in the UI',
    }),

    defineField({
      name: 'isCurrentPeriod',
      title: 'Is Current Period',
      type: 'boolean',
      description: 'Automatically determined based on current date vs. start/end dates',
      readOnly: true,
      initialValue: false,
    }),
  ],

  orderings: [
    {
      title: 'Display Order',
      name: 'displayOrderAsc',
      by: [{ field: 'displayOrder', direction: 'asc' }],
    },
    {
      title: 'Start Date',
      name: 'startDateAsc',
      by: [{ field: 'startDate', direction: 'asc' }],
    },
  ],

  preview: {
    select: {
      title: 'title',
      startDate: 'startDate',
      endDate: 'endDate',
      isActive: 'isActive',
      periodId: 'periodId',
    },
    prepare({ title, startDate, endDate, isActive, periodId }) {
      const start = startDate ? new Date(startDate).toLocaleDateString() : 'No start date';
      const end = endDate ? new Date(endDate).toLocaleDateString() : 'No end date';
      
      return {
        title: title || periodId,
        subtitle: `${start} - ${end} ${!isActive ? '(Inactive)' : ''}`,
      }
    },
  },
})
