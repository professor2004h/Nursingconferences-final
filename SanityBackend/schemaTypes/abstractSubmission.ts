import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'abstractSubmission',
  title: 'Abstract Submission',
  type: 'document',
  icon: () => '📄',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      options: {
        list: [
          { title: 'Mr', value: 'Mr' },
          { title: 'Ms', value: 'Ms' },
          { title: 'Dr', value: 'Dr' },
          { title: 'Prof', value: 'Prof' },
          { title: 'Mrs', value: 'Mrs' }
        ]
      },
      initialValue: 'N/A',
      description: 'Personal title (Mr, Ms, Dr, Prof, Mrs)'
    }),
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
      title: 'Category',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'Presentation category/type (e.g., Oral Presentation, Poster Presentation)'
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
      description: 'Legacy field - no longer collected in form but preserved for existing data'
    }),
    defineField({
      name: 'abstractFile',
      title: 'Abstract File (PDF, DOC, DOCX)',
      type: 'file',
      options: {
        accept: '.pdf,.doc,.docx'
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
