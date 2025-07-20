import { defineType, defineField } from 'sanity'

export const sponsorshipTiers = defineType({
  name: 'sponsorshipTiers',
  title: 'Sponsorship Tiers',
  type: 'document',
  icon: () => '🏆',
  fields: [
    defineField({
      name: 'tierName',
      title: 'Tier Name',
      type: 'string',
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'tierLevel',
      title: 'Tier Level',
      type: 'string',
      options: {
        list: [
          { title: 'Platinum', value: 'platinum' },
          { title: 'Gold', value: 'gold' },
          { title: 'Silver', value: 'silver' },
          { title: 'Bronze', value: 'bronze' },
          { title: 'Supporting', value: 'supporting' },
          { title: 'Custom', value: 'custom' },
        ],
      },
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'price',
      title: 'Sponsorship Price',
      type: 'number',
      validation: Rule => Rule.required().min(0),
    }),

    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Brief description of the sponsorship tier',
    }),

    defineField({
      name: 'benefits',
      title: 'Sponsorship Benefits',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'benefit',
              title: 'Benefit',
              type: 'string',
              validation: Rule => Rule.required(),
            },
            {
              name: 'description',
              title: 'Benefit Description',
              type: 'text',
            },
          ],
        },
      ],
    }),

    defineField({
      name: 'inclusions',
      title: 'Package Inclusions',
      type: 'object',
      fields: [
        {
          name: 'registrationIncluded',
          title: 'Registration Included',
          type: 'boolean',
          description: 'Does this sponsorship include conference registration?',
          initialValue: true,
        },
        {
          name: 'accommodationIncluded',
          title: 'Accommodation Included',
          type: 'boolean',
          description: 'Does this sponsorship include accommodation?',
          initialValue: true,
        },
        {
          name: 'numberOfRegistrations',
          title: 'Number of Registrations Included',
          type: 'number',
          description: 'How many conference registrations are included',
          validation: Rule => Rule.min(0),
          initialValue: 2,
        },
        {
          name: 'accommodationNights',
          title: 'Accommodation Nights Included',
          type: 'number',
          description: 'Number of accommodation nights included',
          validation: Rule => Rule.min(0),
          initialValue: 3,
        },
      ],
    }),

    defineField({
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which this tier appears (lower numbers first)',
      validation: Rule => Rule.required().min(0),
    }),

    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      description: 'Enable/disable this sponsorship tier',
      initialValue: true,
    }),

    defineField({
      name: 'maxSponsors',
      title: 'Maximum Sponsors',
      type: 'number',
      description: 'Maximum number of sponsors for this tier (leave empty for unlimited)',
    }),

    defineField({
      name: 'currentSponsors',
      title: 'Current Sponsors Count',
      type: 'number',
      description: 'Current number of sponsors (auto-updated by system)',
      readOnly: true,
      initialValue: 0,
    }),

    defineField({
      name: 'availableFrom',
      title: 'Available From Date',
      type: 'date',
      description: 'Date when this sponsorship tier becomes available',
    }),

    defineField({
      name: 'availableUntil',
      title: 'Available Until Date',
      type: 'date',
      description: 'Last date when this sponsorship tier is available',
    }),

    defineField({
      name: 'highlightColor',
      title: 'Highlight Color',
      type: 'string',
      options: {
        list: [
          { title: 'Gold', value: 'gold' },
          { title: 'Silver', value: 'silver' },
          { title: 'Bronze', value: 'bronze' },
          { title: 'Blue', value: 'blue' },
          { title: 'Green', value: 'green' },
          { title: 'Purple', value: 'purple' },
        ],
      },
      description: 'Color theme for this tier in the UI',
    }),
  ],

  orderings: [
    {
      title: 'Display Order',
      name: 'displayOrderAsc',
      by: [{ field: 'displayOrder', direction: 'asc' }],
    },
    {
      title: 'Price (High to Low)',
      name: 'priceDesc',
      by: [{ field: 'price', direction: 'desc' }],
    },
  ],

  preview: {
    select: {
      title: 'tierName',
      tierLevel: 'tierLevel',
      price: 'price',
      isActive: 'isActive',
      currentSponsors: 'currentSponsors',
      maxSponsors: 'maxSponsors',
    },
    prepare({ title, tierLevel, price, isActive, currentSponsors, maxSponsors }) {
      const availability = maxSponsors ? `${currentSponsors}/${maxSponsors}` : `${currentSponsors}`;
      return {
        title: title,
        subtitle: `${tierLevel} - $${price} (${availability} sponsors) ${!isActive ? '- INACTIVE' : ''}`,
        media: isActive ? '🏆' : '❌',
      }
    },
  },
})
