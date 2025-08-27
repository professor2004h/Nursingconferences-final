import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'posterPresentersSettings',
  title: 'Poster Presenters Settings',
  type: 'document',
  icon: () => '⚙️',
  description: 'Global settings for the Poster Presenters section',
  fields: [
    defineField({
      name: 'title',
      title: 'Settings Title',
      type: 'string',
      initialValue: 'Poster Presenters Settings',
      validation: Rule => Rule.required(),
      description: 'Internal title for this settings configuration',
      readOnly: true
    }),
    defineField({
      name: 'showPosterPresenters',
      title: 'Show Poster Presenters Section',
      type: 'boolean',
      initialValue: true,
      description: 'Toggle to show or hide the Poster Presenters section across the website. When disabled, poster presenters will be hidden from navigation, homepage, and direct access.',
    }),
    defineField({
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'string',
      initialValue: 'Poster Presenters',
      description: 'Title displayed for the poster presenters section on the website',
    }),
    defineField({
      name: 'sectionDescription',
      title: 'Section Description',
      type: 'text',
      rows: 3,
      description: 'Optional description text for the poster presenters section',
      placeholder: 'Meet our distinguished poster presenters showcasing cutting-edge research...'
    }),
    defineField({
      name: 'navigationLabel',
      title: 'Navigation Menu Label',
      type: 'string',
      initialValue: 'Poster Presenters',
      description: 'Label used in navigation menus and links',
    }),
    defineField({
      name: 'showOnHomepage',
      title: 'Show on Homepage',
      type: 'boolean',
      initialValue: true,
      description: 'Display poster presenters section on the homepage (only applies when main toggle is enabled)',
    }),
    defineField({
      name: 'homepageDisplayLimit',
      title: 'Homepage Display Limit',
      type: 'number',
      initialValue: 6,
      validation: Rule => Rule.min(1).max(20),
      description: 'Maximum number of poster presenters to show on homepage (1-20)',
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      readOnly: true,
      description: 'When these settings were last modified',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      showPosterPresenters: 'showPosterPresenters',
      showOnHomepage: 'showOnHomepage'
    },
    prepare({ title, showPosterPresenters, showOnHomepage }) {
      const status = showPosterPresenters ? '✅ Enabled' : '❌ Disabled';
      const homepageStatus = showOnHomepage ? 'Homepage: On' : 'Homepage: Off';
      
      return {
        title: title || 'Poster Presenters Settings',
        subtitle: `${status} | ${homepageStatus}`,
        media: () => '⚙️',
      };
    },
  },
  
  // Singleton - only one settings document should exist
  __experimental_singleton: true,
})
