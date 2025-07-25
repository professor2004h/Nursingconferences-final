import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'pastConferenceGallery',
  title: 'Conference Gallery',
  type: 'document',
  icon: () => '📸',
  fields: [
    defineField({
      name: 'title',
      title: 'Gallery Title',
      type: 'string',
      validation: Rule => Rule.required().min(5).max(200),
      description: 'Title for this gallery (e.g., "ICMCNM 2023 Conference")'
    }),
    defineField({
      name: 'conferenceDate',
      title: 'Conference Date',
      type: 'date',
      validation: Rule => Rule.required(),
      description: 'Date when the conference took place'
    }),
    defineField({
      name: 'location',
      title: 'Conference Location',
      type: 'string',
      validation: Rule => Rule.required().min(5).max(200),
      description: 'City and country where the conference was held'
    }),
    defineField({
      name: 'galleryImages',
      title: 'Gallery Images',
      type: 'array',
      of: [
        {
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
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'string',
              description: 'Caption describing this image'
            }
          ]
        }
      ],
      validation: Rule => Rule.min(1).max(50),
      description: 'Collection of images from the conference'
    }),
    defineField({
      name: 'isActive',
      title: 'Active Gallery',
      type: 'boolean',
      initialValue: true,
      description: 'Only active galleries will be displayed on the website'
    })
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'location',
      date: 'conferenceDate'
    },
    prepare(selection) {
      const { title, subtitle, date } = selection
      const formattedDate = date ? new Date(date).getFullYear() : 'No date'
      return {
        title: title,
        subtitle: `${formattedDate} - ${subtitle}`
      }
    }
  },
  orderings: [
    {
      title: 'Conference Date (Newest First)',
      name: 'dateDesc',
      by: [{ field: 'conferenceDate', direction: 'desc' }]
    },
    {
      title: 'Title A-Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }]
    }
  ]
})
