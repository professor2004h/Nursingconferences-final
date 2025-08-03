import { defineField, defineType } from 'sanity'
import { CalendarIcon } from '@sanity/icons'

export default defineType({
  name: 'eventSchedule',
  title: 'Event Schedule',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Schedule Title',
      type: 'string',
      description: 'Main title for the schedule section (e.g., "Schedule")',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      description: 'Show this schedule on the website',
      initialValue: true
    }),
    defineField({
      name: 'days',
      title: 'Conference Days',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'day',
          title: 'Day',
          fields: [
            defineField({
              name: 'dayNumber',
              title: 'Day Number',
              type: 'number',
              description: 'Day number (1, 2, 3, etc.)',
              validation: Rule => Rule.required().min(1)
            }),
            defineField({
              name: 'date',
              title: 'Date',
              type: 'date',
              description: 'Conference date',
              validation: Rule => Rule.required()
            }),
            defineField({
              name: 'displayDate',
              title: 'Display Date',
              type: 'string',
              description: 'How the date should appear (e.g., "August 04, 2025")',
              validation: Rule => Rule.required()
            }),
            defineField({
              name: 'sessions',
              title: 'Sessions',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'session',
                  title: 'Session',
                  fields: [
                    defineField({
                      name: 'startTime',
                      title: 'Start Time',
                      type: 'string',
                      description: 'Session start time (e.g., "08:00")',
                      validation: Rule => Rule.required()
                    }),
                    defineField({
                      name: 'endTime',
                      title: 'End Time',
                      type: 'string',
                      description: 'Session end time (e.g., "09:00")',
                      validation: Rule => Rule.required()
                    }),
                    defineField({
                      name: 'title',
                      title: 'Session Title',
                      type: 'string',
                      description: 'Name of the session or event',
                      validation: Rule => Rule.required()
                    }),
                    defineField({
                      name: 'description',
                      title: 'Description',
                      type: 'text',
                      description: 'Optional session description'
                    }),
                    defineField({
                      name: 'type',
                      title: 'Session Type',
                      type: 'string',
                      options: {
                        list: [
                          { title: 'Registration', value: 'registration' },
                          { title: 'Opening Ceremony', value: 'opening' },
                          { title: 'Keynote Session', value: 'keynote' },
                          { title: 'Plenary Session', value: 'plenary' },
                          { title: 'Break', value: 'break' },
                          { title: 'Lunch', value: 'lunch' },
                          { title: 'Workshop', value: 'workshop' },
                          { title: 'Panel Discussion', value: 'panel' },
                          { title: 'Networking', value: 'networking' },
                          { title: 'Closing Ceremony', value: 'closing' },
                          { title: 'Other', value: 'other' }
                        ]
                      },
                      initialValue: 'other'
                    }),
                    defineField({
                      name: 'isHighlighted',
                      title: 'Highlight Session',
                      type: 'boolean',
                      description: 'Highlight this session with special styling',
                      initialValue: false
                    })
                  ],
                  preview: {
                    select: {
                      title: 'title',
                      startTime: 'startTime',
                      endTime: 'endTime',
                      type: 'type'
                    },
                    prepare({ title, startTime, endTime, type }) {
                      return {
                        title: title,
                        subtitle: `${startTime}-${endTime} • ${type}`
                      }
                    }
                  }
                }
              ]
            })
          ],
          preview: {
            select: {
              dayNumber: 'dayNumber',
              displayDate: 'displayDate',
              sessionsCount: 'sessions.length'
            },
            prepare({ dayNumber, displayDate, sessionsCount }) {
              return {
                title: `Day ${dayNumber}`,
                subtitle: `${displayDate} • ${sessionsCount || 0} sessions`
              }
            }
          }
        }
      ],
      validation: Rule => Rule.required().min(1)
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which this schedule appears (lower numbers first)',
      initialValue: 1
    })
  ],
  preview: {
    select: {
      title: 'title',
      isActive: 'isActive',
      daysCount: 'days.length',
    },
    prepare({ title, isActive, daysCount }) {
      return {
        title: title,
        subtitle: `${isActive ? 'Active' : 'Inactive'} • ${daysCount || 0} days`,
        media: CalendarIcon
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
