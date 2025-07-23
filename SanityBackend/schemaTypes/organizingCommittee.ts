import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'organizingCommittee',
  title: 'Organizing Committee Member',
  type: 'document',
  icon: () => '👥',
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
      description: 'Professional title or position (e.g., "Professor", "Director", "Chief Nurse")'
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
      validation: Rule => Rule.required().min(2).max(100)
    }),
    defineField({
      name: 'profileImage',
      title: 'Profile Image',
      type: 'image',
      options: {
        hotspot: true,
        crop: true
      },
      validation: Rule => Rule.required(),
      description: 'Professional headshot photo (recommended: square aspect ratio, min 400x400px)'
    }),
    defineField({
      name: 'bio',
      title: 'Biography',
      type: 'text',
      rows: 6,
      validation: Rule => Rule.required().min(50).max(2000),
      description: 'Detailed professional biography and achievements'
    }),
    defineField({
      name: 'specialization',
      title: 'Area of Specialization',
      type: 'string',
      validation: Rule => Rule.max(200),
      description: 'Primary area of expertise or specialization'
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
      validation: Rule => Rule.email(),
      description: 'Professional email address (optional)'
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
        name: 'ORCID ID format',
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
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      validation: Rule => Rule.required().min(1),
      description: 'Order in which this member appears on the page (1 = first)'
    }),
    defineField({
      name: 'isChairperson',
      title: 'Is Chairperson',
      type: 'boolean',
      initialValue: false,
      description: 'Mark as true if this person is the committee chairperson'
    }),
    defineField({
      name: 'isActive',
      title: 'Active Member',
      type: 'boolean',
      initialValue: true,
      description: 'Only active members will be displayed on the website'
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured on Homepage',
      type: 'boolean',
      initialValue: false,
      description: 'Display this member in the Featured Committee Members section on the homepage'
    }),
    defineField({
      name: 'yearsOfExperience',
      title: 'Years of Experience',
      type: 'number',
      validation: Rule => Rule.min(0).max(60),
      description: 'Total years of professional experience'
    }),
    defineField({
      name: 'achievements',
      title: 'Key Achievements',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of notable achievements, awards, or recognitions'
    }),
    defineField({
      name: 'publications',
      title: 'Notable Publications',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of important publications or research papers'
    })
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'title',
      media: 'profileImage',
      institution: 'institution',
      isChairperson: 'isChairperson'
    },
    prepare(selection) {
      const { title, subtitle, media, institution, isChairperson } = selection
      return {
        title: isChairperson ? `👑 ${title}` : title,
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
      title: 'Institution',
      name: 'institution',
      by: [{ field: 'institution', direction: 'asc' }]
    }
  ]
})
