import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'participationBenefits',
  title: 'Participation Benefits',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      description: 'Main title for the benefits section (e.g., "Participation Benefits")',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      description: 'Show this benefits section on the website',
      initialValue: true
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      description: 'Optional subtitle or description for the benefits section'
    }),
    defineField({
      name: 'benefits',
      title: 'Benefits List',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'benefit',
          title: 'Benefit',
          fields: [
            defineField({
              name: 'title',
              title: 'Benefit Title',
              type: 'string',
              description: 'Main benefit text',
              validation: Rule => Rule.required()
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              description: 'Optional detailed description of the benefit'
            }),
            defineField({
              name: 'icon',
              title: 'Icon Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Check Mark', value: 'check' },
                  { title: 'Arrow Right', value: 'arrow' },
                  { title: 'Star', value: 'star' },
                  { title: 'Gift', value: 'gift' },
                  { title: 'Certificate', value: 'certificate' },
                  { title: 'Book', value: 'book' },
                  { title: 'Coffee', value: 'coffee' },
                  { title: 'Food', value: 'food' },
                  { title: 'Network', value: 'network' },
                  { title: 'Badge', value: 'badge' }
                ]
              },
              initialValue: 'check',
              description: 'Icon to display next to the benefit'
            }),
            defineField({
              name: 'isHighlighted',
              title: 'Highlight Benefit',
              type: 'boolean',
              description: 'Highlight this benefit with special styling',
              initialValue: false
            }),
            defineField({
              name: 'displayOrder',
              title: 'Display Order',
              type: 'number',
              description: 'Order in which this benefit appears (lower numbers first)',
              initialValue: 1
            })
          ],
          preview: {
            select: {
              title: 'title',
              icon: 'icon',
              isHighlighted: 'isHighlighted',
              displayOrder: 'displayOrder'
            },
            prepare({ title, icon, isHighlighted, displayOrder }) {
              const iconMap = {
                check: '✅',
                arrow: '➡️',
                star: '⭐',
                gift: '🎁',
                certificate: '📜',
                book: '📚',
                coffee: '☕',
                food: '🍽️',
                network: '🤝',
                badge: '🏆'
              }
              return {
                title: title,
                subtitle: `${iconMap[icon] || '✅'} • Order: ${displayOrder}${isHighlighted ? ' • Highlighted' : ''}`,
                media: iconMap[icon] || '✅'
              }
            }
          }
        }
      ],
      validation: Rule => Rule.required().min(1)
    }),
    defineField({
      name: 'maxHeight',
      title: 'Maximum Height',
      type: 'string',
      description: 'CSS max-height value for scrollable content (e.g., "400px", "50vh")',
      initialValue: '400px'
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      options: {
        list: [
          { title: 'White', value: 'white' },
          { title: 'Light Gray', value: 'gray-50' },
          { title: 'Light Green', value: 'green-50' },
          { title: 'Light Blue', value: 'blue-50' }
        ]
      },
      initialValue: 'white',
      description: 'Background color for the benefits section'
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which this benefits section appears (lower numbers first)',
      initialValue: 1
    })
  ],
  preview: {
    select: {
      title: 'title',
      isActive: 'isActive',
      benefitsCount: 'benefits.length'
    },
    prepare({ title, isActive, benefitsCount }) {
      return {
        title: title,
        subtitle: `${isActive ? 'Active' : 'Inactive'} • ${benefitsCount || 0} benefits`,
        media: isActive ? '🎯' : '🎯'
      }
    }
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'displayOrder',
      by: [{ field: 'displayOrder', direction: 'asc' }]
    }
  ]
})
