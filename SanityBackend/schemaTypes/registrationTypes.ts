import { defineType, defineField } from 'sanity'

// Multi-currency registration types schema - Updated 2025-07-30
export const registrationTypes = defineType({
  name: 'registrationTypes',
  title: 'Registration Types',
  type: 'document',
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

    // USD Pricing (maintain backward compatibility)
    defineField({
      name: 'earlyBirdPrice',
      title: 'Early Bird Registration Price (USD)',
      type: 'number',
      description: 'Price in USD during the early bird registration period',
      validation: Rule => Rule.required().min(0),
    }),

    defineField({
      name: 'nextRoundPrice',
      title: 'Next Round Registration Price (USD)',
      type: 'number',
      description: 'Price in USD during the mid-term registration period',
      validation: Rule => Rule.required().min(0),
    }),

    defineField({
      name: 'onSpotPrice',
      title: 'OnSpot Registration Price (USD)',
      type: 'number',
      description: 'Price in USD during the final/spot registration period',
      validation: Rule => Rule.required().min(0),
    }),

    // EUR Pricing
    defineField({
      name: 'earlyBirdPriceEUR',
      title: 'Early Bird Registration Price (EUR)',
      type: 'number',
      description: 'Price in EUR during the early bird registration period',
      validation: Rule => Rule.required().min(0),
    }),

    defineField({
      name: 'nextRoundPriceEUR',
      title: 'Next Round Registration Price (EUR)',
      type: 'number',
      description: 'Price in EUR during the mid-term registration period',
      validation: Rule => Rule.required().min(0),
    }),

    defineField({
      name: 'onSpotPriceEUR',
      title: 'OnSpot Registration Price (EUR)',
      type: 'number',
      description: 'Price in EUR during the final/spot registration period',
      validation: Rule => Rule.required().min(0),
    }),

    // GBP Pricing
    defineField({
      name: 'earlyBirdPriceGBP',
      title: 'Early Bird Registration Price (GBP)',
      type: 'number',
      description: 'Price in GBP during the early bird registration period',
      validation: Rule => Rule.required().min(0),
    }),

    defineField({
      name: 'nextRoundPriceGBP',
      title: 'Next Round Registration Price (GBP)',
      type: 'number',
      description: 'Price in GBP during the mid-term registration period',
      validation: Rule => Rule.required().min(0),
    }),

    defineField({
      name: 'onSpotPriceGBP',
      title: 'OnSpot Registration Price (GBP)',
      type: 'number',
      description: 'Price in GBP during the final/spot registration period',
      validation: Rule => Rule.required().min(0),
    }),

    // INR Pricing
    defineField({
      name: 'earlyBirdPriceINR',
      title: 'Early Bird Registration Price (INR)',
      type: 'number',
      description: 'Price in INR during the early bird registration period',
      validation: Rule => Rule.required().min(0),
    }),

    defineField({
      name: 'nextRoundPriceINR',
      title: 'Next Round Registration Price (INR)',
      type: 'number',
      description: 'Price in INR during the mid-term registration period',
      validation: Rule => Rule.required().min(0),
    }),

    defineField({
      name: 'onSpotPriceINR',
      title: 'OnSpot Registration Price (INR)',
      type: 'number',
      description: 'Price in INR during the final/spot registration period',
      validation: Rule => Rule.required().min(0),
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
      earlyBirdPrice: 'earlyBirdPrice',
      nextRoundPrice: 'nextRoundPrice',
      onSpotPrice: 'onSpotPrice',
      earlyBirdPriceEUR: 'earlyBirdPriceEUR',
      earlyBirdPriceGBP: 'earlyBirdPriceGBP',
    },
    prepare({ title, category, isActive, earlyBirdPrice, nextRoundPrice, onSpotPrice, earlyBirdPriceEUR, earlyBirdPriceGBP }) {
      const priceDisplay = earlyBirdPrice ?
        `$${earlyBirdPrice}/$${nextRoundPrice}/$${onSpotPrice} USD | €${earlyBirdPriceEUR || 'TBD'} EUR | £${earlyBirdPriceGBP || 'TBD'} GBP` :
        'No prices set';

      return {
        title: title,
        subtitle: `${category} - ${priceDisplay} ${!isActive ? '- INACTIVE' : ''}`,
      }
    },
  },
})
