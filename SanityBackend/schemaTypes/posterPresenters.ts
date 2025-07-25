import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'posterPresenters',
  title: 'Poster Presenter',
  type: 'document',
  icon: () => '📋',
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: Rule => Rule.required().min(2).max(100)
    }),
    defineField({
      name: 'title',
      title: 'Title/Position',
      type: 'string',
      validation: Rule => Rule.required().min(2).max(150),
      description: 'Professional title or position (e.g., "PhD Student", "Research Fellow", "Professor")'
    }),
    defineField({
      name: 'institution',
      title: 'Institution/Affiliation',
      type: 'string',
      validation: Rule => Rule.required().min(2).max(200),
      description: 'University, hospital, or organization name'
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'string',
      validation: Rule => Rule.required().min(2).max(100),
      description: 'Country of affiliation'
    }),
    defineField({
      name: 'profileImage',
      title: 'Profile Image',
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
      ]
    }),
    defineField({
      name: 'bio',
      title: 'Biography',
      type: 'text',
      validation: Rule => Rule.required().min(50).max(2000),
      description: 'Professional biography and background'
    }),
    defineField({
      name: 'posterTitle',
      title: 'Poster Title',
      type: 'string',
      validation: Rule => Rule.required().min(5).max(300),
      description: 'Title of the research poster'
    }),
    defineField({
      name: 'posterAbstract',
      title: 'Poster Abstract',
      type: 'text',
      validation: Rule => Rule.required().min(100).max(3000),
      description: 'Abstract or summary of the poster presentation'
    }),
    defineField({
      name: 'researchArea',
      title: 'Research Area/Field',
      type: 'string',
      validation: Rule => Rule.required().min(2).max(150),
      description: 'Primary research area or field of study'
    }),
    defineField({
      name: 'keywords',
      title: 'Keywords',
      type: 'array',
      of: [{ type: 'string' }],
      validation: Rule => Rule.min(1).max(10),
      description: 'Research keywords (3-8 keywords recommended)'
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
      validation: Rule => Rule.email(),
      description: 'Contact email address'
    }),
    defineField({
      name: 'linkedinUrl',
      title: 'LinkedIn Profile URL',
      type: 'url',
      validation: Rule => Rule.uri({
        scheme: ['http', 'https']
      }),
      description: 'LinkedIn profile link (optional)'
    }),
    defineField({
      name: 'orcidId',
      title: 'ORCID ID',
      type: 'string',
      validation: Rule => Rule.regex(/^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{3}[0-9X]$/, {
        name: 'ORCID ID',
        invert: false
      }),
      description: 'ORCID identifier (format: 0000-0000-0000-0000)'
    }),
    defineField({
      name: 'researchGateUrl',
      title: 'ResearchGate Profile URL',
      type: 'url',
      validation: Rule => Rule.uri({
        scheme: ['http', 'https']
      }),
      description: 'ResearchGate profile link (optional)'
    }),
    defineField({
      name: 'posterFile',
      title: 'Poster File (PDF)',
      type: 'file',
      options: {
        accept: '.pdf'
      },
      description: 'Upload the poster as a PDF file (optional)'
    }),
    defineField({
      name: 'presentationDate',
      title: 'Presentation Date',
      type: 'datetime',
      description: 'Date and time of poster presentation'
    }),
    defineField({
      name: 'sessionTrack',
      title: 'Session Track',
      type: 'string',
      options: {
        list: [
          { title: 'Clinical Research', value: 'clinical-research' },
          { title: 'Basic Science', value: 'basic-science' },
          { title: 'Public Health', value: 'public-health' },
          { title: 'Technology & Innovation', value: 'technology-innovation' },
          { title: 'Education & Training', value: 'education-training' },
          { title: 'Quality Improvement', value: 'quality-improvement' },
          { title: 'Other', value: 'other' }
        ]
      },
      description: 'Conference session track for the poster'
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      validation: Rule => Rule.required().min(1),
      description: 'Order in which this presenter appears on the page (1 = first)'
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured Presenter',
      type: 'boolean',
      initialValue: false,
      description: 'Mark as featured to highlight this presenter'
    }),
    defineField({
      name: 'isActive',
      title: 'Active Presenter',
      type: 'boolean',
      initialValue: true,
      description: 'Only active presenters will be displayed on the website'
    }),
    defineField({
      name: 'awards',
      title: 'Awards & Recognition',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of awards, honors, or recognitions received'
    }),
    defineField({
      name: 'publications',
      title: 'Recent Publications',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of recent publications or research papers'
    }),
    defineField({
      name: 'collaborators',
      title: 'Co-authors/Collaborators',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Names of co-authors or research collaborators'
    })
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'posterTitle',
      media: 'profileImage',
      institution: 'institution',
      isFeatured: 'isFeatured'
    },
    prepare(selection) {
      const { title, subtitle, media, institution, isFeatured } = selection
      return {
        title: isFeatured ? `⭐ ${title}` : title,
        subtitle: `${subtitle} - ${institution}`,
        media: media
      }
    }
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'displayOrder',
      by: [{ field: 'displayOrder', direction: 'asc' }]
    },
    {
      title: 'Name A-Z',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }]
    },
    {
      title: 'Presentation Date',
      name: 'presentationDate',
      by: [{ field: 'presentationDate', direction: 'asc' }]
    },
    {
      title: 'Research Area',
      name: 'researchArea',
      by: [{ field: 'researchArea', direction: 'asc' }]
    }
  ]
})
