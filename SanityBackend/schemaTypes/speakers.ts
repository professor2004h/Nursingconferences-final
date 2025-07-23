import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'speakers',
  title: 'Conference Speaker',
  type: 'document',
  icon: () => '🎤',
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
      description: 'Professional title or position (e.g., "Professor", "Director", "Chief Scientist")'
    }),
    defineField({
      name: 'institution',
      title: 'Institution/Affiliation',
      type: 'string',
      validation: Rule => Rule.required().min(2).max(200),
      description: 'University, company, or organization name'
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
      name: 'speakerCategory',
      title: 'Speaker Category',
      type: 'string',
      options: {
        list: [
          { title: 'Keynote Speaker', value: 'keynote' },
          { title: 'Invited Speaker', value: 'invited' },
          { title: 'Plenary Speaker', value: 'plenary' },
          { title: 'Session Speaker', value: 'session' },
          { title: 'Workshop Leader', value: 'workshop' },
          { title: 'Panel Moderator', value: 'moderator' }
        ]
      },
      validation: Rule => Rule.required(),
      description: 'Type of speaker role at the conference'
    }),
    defineField({
      name: 'sessionTitle',
      title: 'Session/Talk Title',
      type: 'string',
      validation: Rule => Rule.max(200),
      description: 'Title of the presentation, session, or workshop'
    }),
    defineField({
      name: 'sessionAbstract',
      title: 'Session Abstract',
      type: 'text',
      rows: 4,
      validation: Rule => Rule.max(1000),
      description: 'Brief description of the presentation or session content'
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
      name: 'websiteUrl',
      title: 'Personal/Professional Website',
      type: 'url',
      validation: Rule => Rule.uri({
        scheme: ['http', 'https']
      }),
      description: 'Personal or professional website URL'
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      validation: Rule => Rule.required().min(1),
      description: 'Order in which this speaker appears on the page (1 = first)'
    }),
    defineField({
      name: 'isKeynote',
      title: 'Is Keynote Speaker',
      type: 'boolean',
      initialValue: false,
      description: 'Mark as true if this is a keynote speaker'
    }),
    defineField({
      name: 'isActive',
      title: 'Active Speaker',
      type: 'boolean',
      initialValue: true,
      description: 'Only active speakers will be displayed on the website'
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured on Homepage',
      type: 'boolean',
      initialValue: false,
      description: 'Display this speaker in the Featured Speakers section on the homepage'
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
    }),
    defineField({
      name: 'sessionDate',
      title: 'Session Date',
      type: 'datetime',
      description: 'Date and time of the speaker\'s session (optional)'
    }),
    defineField({
      name: 'sessionLocation',
      title: 'Session Location',
      type: 'string',
      validation: Rule => Rule.max(100),
      description: 'Room or venue location for the session (optional)'
    })
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'title',
      media: 'profileImage',
      institution: 'institution',
      isKeynote: 'isKeynote',
      speakerCategory: 'speakerCategory'
    },
    prepare(selection) {
      const { title, subtitle, media, institution, isKeynote, speakerCategory } = selection
      const categoryEmoji = {
        keynote: '🎯',
        invited: '⭐',
        plenary: '🎪',
        session: '💬',
        workshop: '🛠️',
        moderator: '🎭'
      }
      const emoji = isKeynote ? '🎯' : (categoryEmoji[speakerCategory] || '🎤')
      return {
        title: `${emoji} ${title}`,
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
      title: 'Speaker Category',
      name: 'speakerCategory',
      by: [{ field: 'speakerCategory', direction: 'asc' }]
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
