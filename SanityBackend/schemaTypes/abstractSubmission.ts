import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'abstractSubmission',
  title: 'Abstract Submission',
  type: 'document',
  icon: () => '📄',
  fields: [
    defineField({
      name: 'firstName',
      title: 'First Name',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'lastName',
      title: 'Last Name',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: Rule => Rule.required().email()
    }),
    defineField({
      name: 'phoneNumber',
      title: 'Phone Number',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'organization',
      title: 'Organization/Institution',
      type: 'string',
      validation: Rule => Rule.required().min(2).max(200),
      description: 'Name of your organization, institution, or company',
      placeholder: 'Enter your organization/institution name'
    }),
    defineField({
      name: 'interestedIn',
      title: 'Interested In',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'trackName',
      title: 'Track Name',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'abstractTitle',
      title: 'Abstract Title',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'abstractContent',
      title: 'Abstract Content',
      type: 'text',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'abstractFile',
      title: 'Abstract File (PDF, DOC, DOCX)',
      type: 'file',
      options: {
        accept: '.pdf,.doc,.docx'
      },
      components: {
        input: (props) => {
          const { DocumentFileInput } = require('../components/CustomFileInput.jsx')
          return DocumentFileInput(props)
        },
      },
      validation: Rule => Rule.required(),
      description: 'Abstract document (PDF, DOC, or DOCX) - opens in new tab when downloaded'
    }),
    defineField({
      name: 'submissionDate',
      title: 'Submission Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending Review', value: 'pending' },
          { title: 'Under Review', value: 'reviewing' },
          { title: 'Accepted', value: 'accepted' },
          { title: 'Rejected', value: 'rejected' },
          { title: 'Needs Revision', value: 'revision' }
        ]
      },
      initialValue: 'pending'
    }),
    defineField({
      name: 'reviewNotes',
      title: 'Review Notes',
      type: 'text',
      description: 'Internal notes for review process'
    })
  ],
  preview: {
    select: {
      title: 'abstractTitle',
      subtitle: 'firstName',
      media: 'abstractFile'
    },
    prepare(selection) {
      const { title, subtitle } = selection
      return {
        title: title || 'Untitled Abstract',
        subtitle: `by ${subtitle || 'Unknown'}`
      }
    }
  },
  orderings: [
    {
      title: 'Submission Date, New',
      name: 'submissionDateDesc',
      by: [{ field: 'submissionDate', direction: 'desc' }]
    },
    {
      title: 'Submission Date, Old',
      name: 'submissionDateAsc',
      by: [{ field: 'submissionDate', direction: 'asc' }]
    },
    {
      title: 'Status',
      name: 'status',
      by: [{ field: 'status', direction: 'asc' }]
    }
  ]
})
