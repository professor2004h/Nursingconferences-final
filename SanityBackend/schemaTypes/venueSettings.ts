import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'venueSettings',
  title: 'Venue Settings',
  type: 'document',
  icon: () => '🏨',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Venue & Hospitality',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'subtitle',
      title: 'Page Subtitle',
      type: 'string',
      initialValue: 'Conference venue and accommodation information'
    }),
    defineField({
      name: 'venueName',
      title: 'Venue Name',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'Name of the conference venue/hotel'
    }),
    defineField({
      name: 'venueAddress',
      title: 'Venue Address',
      type: 'object',
      fields: [
        {
          name: 'streetAddress',
          title: 'Street Address',
          type: 'string',
          validation: Rule => Rule.required()
        },
        {
          name: 'city',
          title: 'City',
          type: 'string',
          validation: Rule => Rule.required()
        },
        {
          name: 'state',
          title: 'State/Prefecture',
          type: 'string'
        },
        {
          name: 'postalCode',
          title: 'Postal Code',
          type: 'string'
        },
        {
          name: 'country',
          title: 'Country',
          type: 'string',
          validation: Rule => Rule.required()
        }
      ]
    }),
    defineField({
      name: 'contactInformation',
      title: 'Contact Information',
      type: 'object',
      fields: [
        {
          name: 'phone',
          title: 'Phone Number',
          type: 'string'
        },
        {
          name: 'email',
          title: 'Email',
          type: 'string',
          validation: Rule => Rule.email()
        },
        {
          name: 'website',
          title: 'Website',
          type: 'url'
        },
        {
          name: 'organizerNote',
          title: 'Organizer Note',
          type: 'text',
          description: 'Special note when contacting the venue (e.g., mention organizer name)'
        }
      ]
    }),
    defineField({
      name: 'checkInOut',
      title: 'Check-in/Check-out Information',
      type: 'object',
      fields: [
        {
          name: 'checkInTime',
          title: 'Check-in Time',
          type: 'string',
          initialValue: '2:00 PM'
        },
        {
          name: 'checkOutTime',
          title: 'Check-out Time',
          type: 'string',
          initialValue: '11:00 AM'
        },
        {
          name: 'groupRateNote',
          title: 'Group Rate Note',
          type: 'text',
          description: 'Information about group rates and special offers'
        }
      ]
    }),
    defineField({
      name: 'amenities',
      title: 'Room Amenities and Services',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of amenities and services provided'
    }),
    defineField({
      name: 'venueImages',
      title: 'Venue Images',
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
              description: 'Image caption or description'
            }
          ]
        }
      ],
      description: 'Gallery of venue and location images'
    }),
    defineField({
      name: 'locationDescription',
      title: 'Location Description',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Rich text description of the location and surrounding area'
    }),
    defineField({
      name: 'mapConfiguration',
      title: 'Map Configuration',
      type: 'object',
      fields: [
        {
          name: 'latitude',
          title: 'Latitude',
          type: 'number',
          validation: Rule => Rule.required().min(-90).max(90)
        },
        {
          name: 'longitude',
          title: 'Longitude',
          type: 'number',
          validation: Rule => Rule.required().min(-180).max(180)
        },
        {
          name: 'zoomLevel',
          title: 'Zoom Level',
          type: 'number',
          initialValue: 15,
          validation: Rule => Rule.min(1).max(20)
        },
        {
          name: 'markerTitle',
          title: 'Map Marker Title',
          type: 'string'
        }
      ]
    }),
    defineField({
      name: 'transportation',
      title: 'Transportation Information',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Transportation'
        },
        {
          name: 'options',
          title: 'Transportation Options',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'type',
                  title: 'Transportation Type',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Airport Shuttle', value: 'airport-shuttle' },
                      { title: 'Public Transit', value: 'public-transit' },
                      { title: 'Taxi/Rideshare', value: 'taxi-rideshare' },
                      { title: 'Car Rental', value: 'car-rental' },
                      { title: 'Walking', value: 'walking' },
                      { title: 'Other', value: 'other' }
                    ]
                  }
                },
                {
                  name: 'title',
                  title: 'Title',
                  type: 'string'
                },
                {
                  name: 'description',
                  title: 'Description',
                  type: 'text'
                },
                {
                  name: 'duration',
                  title: 'Duration/Distance',
                  type: 'string'
                },
                {
                  name: 'cost',
                  title: 'Estimated Cost',
                  type: 'string'
                }
              ]
            }
          ]
        }
      ]
    }),
    defineField({
      name: 'localAttractions',
      title: 'Local Attractions',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Local Attractions'
        },
        {
          name: 'attractions',
          title: 'Attractions List',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'name',
                  title: 'Attraction Name',
                  type: 'string'
                },
                {
                  name: 'description',
                  title: 'Description',
                  type: 'text'
                },
                {
                  name: 'distance',
                  title: 'Distance from Venue',
                  type: 'string'
                },
                {
                  name: 'category',
                  title: 'Category',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Restaurant', value: 'restaurant' },
                      { title: 'Shopping', value: 'shopping' },
                      { title: 'Cultural Site', value: 'cultural' },
                      { title: 'Entertainment', value: 'entertainment' },
                      { title: 'Nature/Parks', value: 'nature' },
                      { title: 'Historical', value: 'historical' },
                      { title: 'Other', value: 'other' }
                    ]
                  }
                }
              ]
            }
          ]
        }
      ]
    }),
    defineField({
      name: 'additionalInformation',
      title: 'Additional Information',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Any additional venue or location information'
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      initialValue: true,
      description: 'Toggle to show/hide this venue page'
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      description: 'When this venue information was last updated'
    })
  ],
  preview: {
    select: {
      title: 'venueName',
      subtitle: 'venueAddress.city',
      media: 'venueImages.0'
    },
    prepare(selection) {
      const { title, subtitle, media } = selection
      return {
        title: title || 'Venue Settings',
        subtitle: subtitle ? `${subtitle}` : 'Conference venue information',
        media: media
      }
    }
  }
})
