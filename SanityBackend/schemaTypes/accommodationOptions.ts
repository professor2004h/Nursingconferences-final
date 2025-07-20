import { defineType, defineField } from 'sanity'

export const accommodationOptions = defineType({
  name: 'accommodationOptions',
  title: 'Accommodation Options',
  type: 'document',
  icon: () => '🏨',
  fields: [
    defineField({
      name: 'hotelName',
      title: 'Hotel Name',
      type: 'string',
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'hotelCategory',
      title: 'Hotel Category',
      type: 'string',
      options: {
        list: [
          { title: '5 Star', value: '5star' },
          { title: '4 Star', value: '4star' },
          { title: '3 Star', value: '3star' },
          { title: 'Budget', value: 'budget' },
        ],
      },
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'description',
      title: 'Hotel Description',
      type: 'text',
      description: 'Brief description of the hotel and its amenities',
    }),

    defineField({
      name: 'location',
      title: 'Location Details',
      type: 'object',
      fields: [
        {
          name: 'address',
          title: 'Hotel Address',
          type: 'text',
          validation: Rule => Rule.required(),
        },
        {
          name: 'distanceFromVenue',
          title: 'Distance from Conference Venue',
          type: 'string',
          description: 'e.g., "2 km", "Walking distance", "15 minutes by car"',
        },
        {
          name: 'transportationIncluded',
          title: 'Transportation Included',
          type: 'boolean',
          description: 'Is transportation to/from venue included?',
          initialValue: false,
        },
      ],
    }),

    defineField({
      name: 'roomOptions',
      title: 'Room Options',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'roomType',
              title: 'Room Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Single Occupancy', value: 'single' },
                  { title: 'Double Occupancy', value: 'double' },
                  { title: 'Triple Occupancy', value: 'triple' },
                ],
              },
              validation: Rule => Rule.required(),
            },
            {
              name: 'pricePerNight',
              title: 'Price Per Night',
              type: 'number',
              validation: Rule => Rule.required().min(0),
            },
            {
              name: 'roomDescription',
              title: 'Room Description',
              type: 'text',
              description: 'Description of room amenities and features',
            },
            {
              name: 'maxGuests',
              title: 'Maximum Guests',
              type: 'number',
              validation: Rule => Rule.required().min(1),
            },
            {
              name: 'isAvailable',
              title: 'Available',
              type: 'boolean',
              initialValue: true,
            },
          ],
          preview: {
            select: {
              roomType: 'roomType',
              pricePerNight: 'pricePerNight',
              isAvailable: 'isAvailable',
            },
            prepare({ roomType, pricePerNight, isAvailable }) {
              return {
                title: roomType,
                subtitle: `$${pricePerNight}/night ${!isAvailable ? '- UNAVAILABLE' : ''}`,
              }
            },
          },
        },
      ],
      validation: Rule => Rule.required().min(1),
    }),

    defineField({
      name: 'packageOptions',
      title: 'Package Options',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'packageName',
              title: 'Package Name',
              type: 'string',
              validation: Rule => Rule.required(),
            },
            {
              name: 'nights',
              title: 'Number of Nights',
              type: 'number',
              options: {
                list: [
                  { title: '2 Nights', value: 2 },
                  { title: '3 Nights', value: 3 },
                  { title: '5 Nights', value: 5 },
                ],
              },
              validation: Rule => Rule.required(),
            },
            {
              name: 'checkInDate',
              title: 'Check-in Date',
              type: 'date',
              validation: Rule => Rule.required(),
            },
            {
              name: 'checkOutDate',
              title: 'Check-out Date',
              type: 'date',
              validation: Rule => Rule.required(),
            },
            {
              name: 'inclusions',
              title: 'Package Inclusions',
              type: 'array',
              of: [{ type: 'string' }],
              description: 'What is included in this package (breakfast, wifi, etc.)',
            },
            {
              name: 'isActive',
              title: 'Active Package',
              type: 'boolean',
              initialValue: true,
            },
          ],
          preview: {
            select: {
              packageName: 'packageName',
              nights: 'nights',
              isActive: 'isActive',
            },
            prepare({ packageName, nights, isActive }) {
              return {
                title: packageName,
                subtitle: `${nights} nights ${!isActive ? '- INACTIVE' : ''}`,
              }
            },
          },
        },
      ],
    }),

    defineField({
      name: 'amenities',
      title: 'Hotel Amenities',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of hotel amenities (WiFi, Pool, Gym, etc.)',
    }),

    defineField({
      name: 'images',
      title: 'Hotel Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              validation: Rule => Rule.required(),
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'string',
            },
          ],
        },
      ],
    }),

    defineField({
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which this hotel appears',
      validation: Rule => Rule.required().min(0),
    }),

    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      description: 'Enable/disable this accommodation option',
      initialValue: true,
    }),

    defineField({
      name: 'bookingDeadline',
      title: 'Booking Deadline',
      type: 'date',
      description: 'Last date for booking this accommodation',
    }),

    defineField({
      name: 'cancellationPolicy',
      title: 'Cancellation Policy',
      type: 'text',
      description: 'Hotel cancellation policy details',
    }),
  ],

  orderings: [
    {
      title: 'Display Order',
      name: 'displayOrderAsc',
      by: [{ field: 'displayOrder', direction: 'asc' }],
    },
    {
      title: 'Hotel Category',
      name: 'categoryDesc',
      by: [{ field: 'hotelCategory', direction: 'desc' }],
    },
  ],

  preview: {
    select: {
      title: 'hotelName',
      category: 'hotelCategory',
      isActive: 'isActive',
      media: 'images.0',
    },
    prepare({ title, category, isActive, media }) {
      return {
        title: title,
        subtitle: `${category} ${!isActive ? '- INACTIVE' : ''}`,
        media: media || '🏨',
      }
    },
  },
})
