import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'speakerGuidelines',
  title: 'Speaker Guidelines',
  type: 'document',
  icon: () => '🎤',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Speaker Guidelines',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'subtitle',
      title: 'Page Subtitle',
      type: 'string',
      initialValue: 'Comprehensive guidelines for conference speakers and presenters'
    }),
    defineField({
      name: 'introduction',
      title: 'Introduction',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Introduction text for the speaker guidelines page'
    }),
    defineField({
      name: 'speakerRequirements',
      title: 'Speaker Requirements',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'For Speakers'
        },
        {
          name: 'requirements',
          title: 'Requirements List',
          type: 'array',
          of: [{ type: 'text' }],
          description: 'List of requirements for speakers'
        }
      ]
    }),
    defineField({
      name: 'posterGuidelines',
      title: 'Poster Guidelines',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'For Posters'
        },
        {
          name: 'guidelines',
          title: 'Poster Guidelines List',
          type: 'array',
          of: [{ type: 'text' }],
          description: 'List of guidelines for poster presentations'
        }
      ]
    }),
    defineField({
      name: 'presentationRequirements',
      title: 'Basic Presentation Requirements',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Basic Presentation Requirements'
        },
        {
          name: 'formats',
          title: 'Accepted Formats',
          type: 'array',
          of: [{ type: 'string' }],
          description: 'List of accepted presentation formats'
        },
        {
          name: 'requirements',
          title: 'Technical Requirements',
          type: 'array',
          of: [{ type: 'text' }],
          description: 'List of technical requirements for presentations'
        }
      ]
    }),
    defineField({
      name: 'virtualGuidelines',
      title: 'Virtual Presentation Guidelines',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Virtual Presentation Guidelines'
        },
        {
          name: 'guidelines',
          title: 'Virtual Guidelines List',
          type: 'array',
          of: [{ type: 'text' }],
          description: 'List of guidelines for virtual presentations'
        }
      ]
    }),
    defineField({
      name: 'certificationInfo',
      title: 'Certification Information',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Certification'
        },
        {
          name: 'information',
          title: 'Certification Details',
          type: 'array',
          of: [{ type: 'text' }],
          description: 'Information about certificates and awards'
        }
      ]
    }),
    defineField({
      name: 'technicalSpecifications',
      title: 'Technical Specifications',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Technical Specifications'
        },
        {
          name: 'audioVisual',
          title: 'Audio Visual Requirements',
          type: 'array',
          of: [{ type: 'text' }]
        },
        {
          name: 'equipment',
          title: 'Equipment Provided',
          type: 'array',
          of: [{ type: 'text' }]
        }
      ]
    }),
    defineField({
      name: 'submissionDeadlines',
      title: 'Submission Deadlines',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Important Deadlines'
        },
        {
          name: 'deadlines',
          title: 'Deadline List',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'item',
                  title: 'Deadline Item',
                  type: 'string'
                },
                {
                  name: 'date',
                  title: 'Date',
                  type: 'datetime'
                },
                {
                  name: 'description',
                  title: 'Description',
                  type: 'text'
                }
              ]
            }
          ]
        }
      ]
    }),
    defineField({
      name: 'contactInformation',
      title: 'Contact Information',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Contact Information'
        },
        {
          name: 'programEnquiry',
          title: 'Program Enquiry Email',
          type: 'string',
          validation: Rule => Rule.email()
        },
        {
          name: 'generalQueries',
          title: 'General Queries Email',
          type: 'string',
          validation: Rule => Rule.email()
        },
        {
          name: 'technicalSupport',
          title: 'Technical Support Email',
          type: 'string',
          validation: Rule => Rule.email()
        },
        {
          name: 'phone',
          title: 'Phone Number',
          type: 'string'
        }
      ]
    }),
    defineField({
      name: 'additionalNotes',
      title: 'Additional Notes',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Any additional information or notes for speakers'
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      initialValue: true,
      description: 'Toggle to show/hide this guidelines page'
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      description: 'When these guidelines were last updated'
    })
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle'
    },
    prepare(selection) {
      const { title, subtitle } = selection
      return {
        title: title || 'Speaker Guidelines',
        subtitle: subtitle || 'Conference speaker guidelines and requirements'
      }
    }
  }
})
