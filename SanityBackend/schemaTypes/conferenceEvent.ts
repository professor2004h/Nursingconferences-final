import { defineField, defineType } from 'sanity'

export const conferenceEvent = defineType({
  name: 'conferenceEvent',
  title: 'Conferences Redirect',
  type: 'document',
  icon: () => '🔗',
  description: 'Configure where visitors should be redirected when they click on Conferences links',
  fields: [
    defineField({
      name: 'title',
      title: 'Configuration Title',
      type: 'string',
      initialValue: 'Conferences Redirect Configuration',
      validation: (Rule) => Rule.required(),
      description: 'Internal title for this configuration (not displayed on frontend)',
    }),
    defineField({
      name: 'redirectUrl',
      title: 'Conferences URL',
      type: 'url',
      validation: (Rule) =>
        Rule.required()
          .uri({
            scheme: ['http', 'https'],
            allowRelative: false
          })
          .error('Please enter a valid URL starting with http:// or https://'),
      description: 'The external URL where visitors will be redirected when they click on Conferences links',
      placeholder: 'https://example.com/conferences',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Optional description of what visitors will find at the redirect URL',
      placeholder: 'This link will take you to our external website where you can view all conference details...',
    }),
    defineField({
      name: 'isActive',
      title: 'Enable Redirect',
      type: 'boolean',
      initialValue: true,
      description: 'Toggle to enable or disable the redirect functionality',
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      readOnly: true,
      description: 'When this configuration was last modified',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      redirectUrl: 'redirectUrl',
      isActive: 'isActive',
    },
    prepare({ title, redirectUrl, isActive }: any) {
      const status = isActive ? '✅ Active' : '❌ Inactive';
      let domain = 'No URL';

      if (redirectUrl) {
        try {
          domain = new URL(redirectUrl).hostname;
        } catch (error) {
          domain = 'Invalid URL';
        }
      }

      return {
        title: title || 'Conferences Redirect',
        subtitle: `${status} → ${domain}`,
        media: () => '🔗',
      };
    },
  },

  // Singleton - only one document of this type should exist
  __experimental_singleton: true,
})

export default conferenceEvent;
