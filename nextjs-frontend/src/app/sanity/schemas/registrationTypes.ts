import { defineType, defineField } from 'sanity'

export const registrationTypes = defineType({
  name: 'registrationTypes',
  title: 'Registration Types',
  type: 'document',
  icon: () => '🎫',
  fields: [
    defineField({
      name: 'name',
      title: 'Registration Type Name',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Speaker/Poster (In-Person)', value: 'speaker-inperson' },
          { title: 'Speaker/Poster (Virtual)', value: 'speaker-virtual' },
          { title: 'Listener (In-Person)', value: 'listener-inperson' },
          { title: 'Listener (Virtual)', value: 'listener-virtual' },
          { title: 'Student (In-Person)', value: 'student-inperson' },
          { title: 'Student (Virtual)', value: 'student-virtual' },
          { title: 'E-poster (Virtual)', value: 'eposter-virtual' },
          { title: 'Exhibitor', value: 'exhibitor' },
        ],
      },
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Brief description of what this registration type includes',
    }),

    defineField({
      name: 'pricing',
      title: 'Pricing Structure',
      type: 'object',
      fields: [
        {
          name: 'earlyBird',
          title: 'Early Bird Pricing',
          type: 'object',
          fields: [
            {
              name: 'academiaPrice',
              title: 'Academia Price',
              type: 'number',
              validation: Rule => Rule.required().min(0),
            },
            {
              name: 'businessPrice',
              title: 'Business/Industry Price',
              type: 'number',
              validation: Rule => Rule.required().min(0),
            },
          ],
        },
        {
          name: 'nextRound',
          title: 'Next Round Pricing',
          type: 'object',
          fields: [
            {
              name: 'academiaPrice',
              title: 'Academia Price',
              type: 'number',
              validation: Rule => Rule.required().min(0),
            },
            {
              name: 'businessPrice',
              title: 'Business/Industry Price',
              type: 'number',
              validation: Rule => Rule.required().min(0),
            },
          ],
        },
        {
          name: 'spotRegistration',
          title: 'Spot Registration Pricing',
          type: 'object',
          fields: [
            {
              name: 'academiaPrice',
              title: 'Academia Price',
              type: 'number',
              validation: Rule => Rule.required().min(0),
            },
            {
              name: 'businessPrice',
              title: 'Business/Industry Price',
              type: 'number',
              validation: Rule => Rule.required().min(0),
            },
          ],
        },
      ],
    }),

    // Alternative simple pricing structure (for easier data entry)
    defineField({
      name: 'simplePricing',
      title: 'Simple Pricing Structure (Alternative)',
      type: 'object',
      description: 'Use this for quick setup instead of the complex pricing array above',
      fields: [
        defineField({
          name: 'earlyBird',
          title: 'Early Bird Pricing',
          type: 'object',
          fields: [
            defineField({
              name: 'academiaPrice',
              title: 'Academia Price',
              type: 'number',
              validation: Rule => Rule.min(0),
            }),
            defineField({
              name: 'businessPrice',
              title: 'Business Price',
              type: 'number',
              validation: Rule => Rule.min(0),
            }),
          ],
        }),
        defineField({
          name: 'nextRound',
          title: 'Next Round Pricing',
          type: 'object',
          fields: [
            defineField({
              name: 'academiaPrice',
              title: 'Academia Price',
              type: 'number',
              validation: Rule => Rule.min(0),
            }),
            defineField({
              name: 'businessPrice',
              title: 'Business Price',
              type: 'number',
              validation: Rule => Rule.min(0),
            }),
          ],
        }),
        defineField({
          name: 'spotRegistration',
          title: 'Spot Registration Pricing',
          type: 'object',
          fields: [
            defineField({
              name: 'academiaPrice',
              title: 'Academia Price',
              type: 'number',
              validation: Rule => Rule.min(0),
            }),
            defineField({
              name: 'businessPrice',
              title: 'Business Price',
              type: 'number',
              validation: Rule => Rule.min(0),
            }),
          ],
        }),
      ],
    }),

    defineField({
      name: 'benefits',
      title: 'Registration Benefits',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of benefits included with this registration type',
    }),

    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      description: 'Enable/disable this registration type',
      initialValue: true,
    }),

    defineField({
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which this type appears on the registration form',
      validation: Rule => Rule.required().min(0),
    }),

    defineField({
      name: 'maxParticipants',
      title: 'Maximum Participants',
      type: 'number',
      description: 'Maximum number of people who can register for this type (leave empty for unlimited)',
    }),

    defineField({
      name: 'availableFrom',
      title: 'Available From Date',
      type: 'date',
      description: 'Date when this registration type becomes available',
    }),

    defineField({
      name: 'availableUntil',
      title: 'Available Until Date',
      type: 'date',
      description: 'Last date when this registration type is available',
    }),
  ],
  
  orderings: [
    {
      title: 'Display Order',
      name: 'displayOrderAsc',
      by: [{ field: 'displayOrder', direction: 'asc' }],
    },
    {
      title: 'Category',
      name: 'categoryAsc',
      by: [{ field: 'category', direction: 'asc' }],
    },
  ],

  preview: {
    select: {
      title: 'name',
      category: 'category',
      isActive: 'isActive',
      earlyBirdAcademia: 'pricing.earlyBird.academiaPrice',
    },
    prepare({ title, category, isActive, earlyBirdAcademia }) {
      return {
        title: title,
        subtitle: `${category} - $${earlyBirdAcademia} (Early Bird) ${!isActive ? '- INACTIVE' : ''}`,
        media: isActive ? '✅' : '❌',
      }
    },
  },
})
