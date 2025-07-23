import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'cancellationPolicy',
  title: 'Cancellation Policy',
  type: 'document',
  icon: () => '📋',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: Rule => Rule.required(),
      initialValue: 'Cancellation Policy'
    }),
    defineField({
      name: 'subtitle',
      title: 'Page Subtitle',
      type: 'string',
      description: 'Optional subtitle for the cancellation policy page'
    }),
    defineField({
      name: 'introduction',
      title: 'Introduction',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Introduction text for the cancellation policy'
    }),
    defineField({
      name: 'nameChangePolicy',
      title: 'Name Change Policy',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Name Changes'
        },
        {
          name: 'content',
          title: 'Policy Content',
          type: 'array',
          of: [{ type: 'block' }]
        },
        {
          name: 'deadline',
          title: 'Deadline (days before conference)',
          type: 'number',
          description: 'Number of days before conference when name changes are allowed'
        }
      ]
    }),
    defineField({
      name: 'refundPolicy',
      title: 'Refund Policy',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Refund Policy'
        },
        {
          name: 'generalPolicy',
          title: 'General Refund Policy',
          type: 'array',
          of: [{ type: 'block' }]
        },
        {
          name: 'refundTiers',
          title: 'Refund Tiers',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'daysBeforeConference',
                  title: 'Days Before Conference',
                  type: 'number',
                  validation: Rule => Rule.required()
                },
                {
                  name: 'refundPercentage',
                  title: 'Refund Percentage',
                  type: 'number',
                  validation: Rule => Rule.required().min(0).max(100)
                },
                {
                  name: 'description',
                  title: 'Description',
                  type: 'string'
                }
              ],
              preview: {
                select: {
                  days: 'daysBeforeConference',
                  percentage: 'refundPercentage'
                },
                prepare(selection) {
                  const { days, percentage } = selection
                  return {
                    title: `${days} days before: ${percentage}% refund`
                  }
                }
              }
            }
          ]
        },
        {
          name: 'additionalTerms',
          title: 'Additional Terms',
          type: 'array',
          of: [{ type: 'block' }]
        }
      ]
    }),
    defineField({
      name: 'naturalDisasterPolicy',
      title: 'Natural Disaster/Force Majeure Policy',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Natural Disasters/Calamities Policy'
        },
        {
          name: 'content',
          title: 'Policy Content',
          type: 'array',
          of: [{ type: 'block' }]
        },
        {
          name: 'organizerRights',
          title: 'Organizer Rights',
          type: 'array',
          of: [{ type: 'block' }]
        },
        {
          name: 'liabilityDisclaimer',
          title: 'Liability Disclaimer',
          type: 'array',
          of: [{ type: 'block' }]
        }
      ]
    }),
    defineField({
      name: 'postponementPolicy',
      title: 'Postponement Policy',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Postponement Policy'
        },
        {
          name: 'content',
          title: 'Policy Content',
          type: 'array',
          of: [{ type: 'block' }]
        },
        {
          name: 'creditValidityPeriod',
          title: 'Credit Validity Period (months)',
          type: 'number',
          description: 'How long credits are valid for use'
        }
      ]
    }),
    defineField({
      name: 'transferPolicy',
      title: 'Registration Transfer Policy',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Transfer of Registration'
        },
        {
          name: 'personTransfer',
          title: 'Person Transfer Policy',
          type: 'array',
          of: [{ type: 'block' }]
        },
        {
          name: 'conferenceTransfer',
          title: 'Conference Transfer Policy',
          type: 'array',
          of: [{ type: 'block' }]
        },
        {
          name: 'transferDeadline',
          title: 'Transfer Deadline (days before conference)',
          type: 'number',
          description: 'Minimum days before conference for transfers'
        },
        {
          name: 'transferLimitations',
          title: 'Transfer Limitations',
          type: 'array',
          of: [{ type: 'block' }]
        }
      ]
    }),
    defineField({
      name: 'visaPolicy',
      title: 'Visa Information & Policy',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Visa Information'
        },
        {
          name: 'generalAdvice',
          title: 'General Visa Advice',
          type: 'array',
          of: [{ type: 'block' }]
        },
        {
          name: 'failedVisaPolicy',
          title: 'Failed Visa Application Policy',
          type: 'array',
          of: [{ type: 'block' }]
        }
      ]
    }),
    defineField({
      name: 'contactInformation',
      title: 'Contact Information for Cancellations',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Contact Information'
        },
        {
          name: 'primaryEmail',
          title: 'Primary Contact Email',
          type: 'string',
          validation: Rule => Rule.email()
        },
        {
          name: 'phone',
          title: 'Contact Phone',
          type: 'string'
        },
        {
          name: 'instructions',
          title: 'Contact Instructions',
          type: 'array',
          of: [{ type: 'block' }]
        }
      ]
    }),
    defineField({
      name: 'importantNotes',
      title: 'Important Notes',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Note Title',
              type: 'string'
            },
            {
              name: 'content',
              title: 'Note Content',
              type: 'array',
              of: [{ type: 'block' }]
            },
            {
              name: 'priority',
              title: 'Priority Level',
              type: 'string',
              options: {
                list: [
                  { title: 'High', value: 'high' },
                  { title: 'Medium', value: 'medium' },
                  { title: 'Low', value: 'low' }
                ]
              },
              initialValue: 'medium'
            }
          ],
          preview: {
            select: {
              title: 'title',
              priority: 'priority'
            },
            prepare(selection) {
              const { title, priority } = selection
              const priorityIcon = priority === 'high' ? '🔴' : priority === 'medium' ? '🟡' : '🟢'
              return {
                title: `${priorityIcon} ${title}`
              }
            }
          }
        }
      ]
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'datetime',
      description: 'When this policy was last updated',
      validation: Rule => Rule.required(),
      initialValue: () => new Date().toISOString()
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      description: 'Whether this cancellation policy is currently active',
      initialValue: true
    }),
    defineField({
      name: 'effectiveDate',
      title: 'Effective Date',
      type: 'date',
      description: 'Date when this policy becomes effective'
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      description: 'Title for search engines (optional)'
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      description: 'Description for search engines (optional)',
      rows: 3
    })
  ],
  preview: {
    select: {
      title: 'title',
      lastUpdated: 'lastUpdated',
      isActive: 'isActive'
    },
    prepare(selection) {
      const { title, lastUpdated, isActive } = selection
      const status = isActive ? '✅' : '❌'
      const date = lastUpdated ? new Date(lastUpdated).toLocaleDateString() : 'Not set'
      return {
        title: `${status} ${title}`,
        subtitle: `Last updated: ${date}`
      }
    }
  }
})
