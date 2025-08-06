import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'exhibitors',
  title: 'Exhibitors',
  type: 'document',
  icon: () => '🏢',
  fields: [
    defineField({
      name: 'companyName',
      title: 'Company Name',
      type: 'string',
      validation: Rule => Rule.required().min(2).max(200),
      description: 'Name of the exhibitor organization'
    }),
    defineField({
      name: 'logo',
      title: 'Company Logo',
      type: 'image',
      options: {
        hotspot: true
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Alternative text for accessibility'
        }
      ],
      validation: Rule => Rule.required(),
      description: 'Company logo image'
    }),
    defineField({
      name: 'website',
      title: 'Website URL',
      type: 'url',
      description: 'Company website URL (optional)'
    }),
    defineField({
      name: 'description',
      title: 'About the Company',
      type: 'text',
      validation: Rule => Rule.max(300),
      description: 'Brief description about the company'
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
      validation: Rule => Rule.min(0)
    }),
    defineField({
      name: 'isActive',
      title: 'Active Exhibitor',
      type: 'boolean',
      initialValue: true,
      description: 'Only active exhibitors will be displayed on the website'
    })
  ],
  preview: {
    select: {
      title: 'companyName',
      media: 'logo'
    },
    prepare(selection) {
      const { title, media } = selection
      return {
        title: title,
        subtitle: 'Exhibitor',
        media: media
      }
    }
  },
  orderings: [
    {
      title: 'Company Name A-Z',
      name: 'companyNameAsc',
      by: [{ field: 'companyName', direction: 'asc' }]
    },
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }]
    }
  ]
})
