import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'exhibitorsSettings',
  title: 'Exhibitors Settings',
  type: 'document',
  icon: () => '⚙️',
  description: 'Global settings for the Exhibitors section',
  fields: [
    defineField({
      name: 'title',
      title: 'Settings Title',
      type: 'string',
      initialValue: 'Exhibitors Settings',
      validation: Rule => Rule.required(),
      description: 'Internal title for this settings configuration',
      readOnly: true
    }),
    defineField({
      name: 'showExhibitors',
      title: 'Show Exhibitors Section',
      type: 'boolean',
      initialValue: true,
      description: 'Toggle to show or hide the Exhibitors section across the website. When disabled, exhibitors will be hidden from navigation, homepage, and direct access.',
    }),
    defineField({
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'string',
      initialValue: 'Exhibitors',
      description: 'Title displayed for the exhibitors section on the website',
    }),
    defineField({
      name: 'sectionDescription',
      title: 'Section Description',
      type: 'text',
      rows: 3,
      description: 'Optional description text for the exhibitors section',
      placeholder: 'Discover our valued exhibitors showcasing innovative products and services...'
    }),
    defineField({
      name: 'navigationLabel',
      title: 'Navigation Menu Label',
      type: 'string',
      initialValue: 'Exhibitors',
      description: 'Label used in navigation menus and links',
    }),
    defineField({
      name: 'showOnHomepage',
      title: 'Show on Homepage',
      type: 'boolean',
      initialValue: true,
      description: 'Display exhibitors section on the homepage (only applies when main toggle is enabled)',
    }),
    defineField({
      name: 'homepageDisplayLimit',
      title: 'Homepage Display Limit',
      type: 'number',
      initialValue: 6,
      validation: Rule => Rule.min(1).max(20),
      description: 'Maximum number of exhibitors to show on homepage (1-20)',
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
      showExhibitors: 'showExhibitors',
      showOnHomepage: 'showOnHomepage'
    },
    prepare({ title, showExhibitors, showOnHomepage }) {
      const status = showExhibitors ? '✅ Enabled' : '❌ Disabled';
      const homepageStatus = showOnHomepage ? 'Homepage: On' : 'Homepage: Off';
      
      return {
        title: title || 'Exhibitors Settings',
        subtitle: `${status} | ${homepageStatus}`,
        media: () => '⚙️',
      };
    },
  },
  
  // Singleton - only one settings document should exist
  __experimental_singleton: true,
})
