import { defineField, defineType } from 'sanity'

export const conferencesSectionSettings = defineType({
  name: 'conferencesSectionSettings',
  title: 'Conferences Management',
  type: 'document',
  icon: () => '🎯',
  fields: [
    // Master Control Section
    defineField({
      name: 'masterControl',
      title: 'Master Conference Section Control',
      type: 'object',
      description: 'Global settings that control the entire conferences section',
      fields: [
        defineField({
          name: 'showOnHomepage',
          title: 'Show Conferences Section on Homepage',
          type: 'boolean',
          description: 'MASTER TOGGLE: Turn this OFF to completely hide the entire conferences section from the homepage, regardless of individual event settings.',
          initialValue: true,
        }),
        defineField({
          name: 'title',
          title: 'Section Title',
          type: 'string',
          description: 'Title for the conferences section on the home page',
          initialValue: 'Featured Conferences',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'description',
          title: 'Section Description',
          type: 'array',
          of: [{ type: 'block' }],
          description: 'Description text that appears below the section title',
        }),
      ],
      options: {
        collapsible: false,
      },
    }),
    // Display Settings Section
    defineField({
      name: 'displaySettings',
      title: 'Display & Layout Settings',
      type: 'object',
      description: 'Control how conference events are displayed on the homepage',
      fields: [
        defineField({
          name: 'maxEventsToShow',
          title: 'Maximum Events to Display',
          type: 'number',
          description: 'Maximum number of conference events to show on the homepage',
          validation: (Rule) => Rule.required().min(1).max(20),
          initialValue: 6,
        }),
        defineField({
          name: 'showOnlyActiveEvents',
          title: 'Show Only Active Events',
          type: 'boolean',
          description: 'When enabled, only shows events that have their "Show on Website" toggle turned ON',
          initialValue: true,
        }),
        defineField({
          name: 'sortOrder',
          title: 'Sort Order',
          type: 'string',
          options: {
            list: [
              { title: 'Newest First (Date Descending)', value: 'date_desc' },
              { title: 'Oldest First (Date Ascending)', value: 'date_asc' },
              { title: 'Title A-Z', value: 'title_asc' },
              { title: 'Title Z-A', value: 'title_desc' },
            ],
          },
          initialValue: 'date_desc',
          validation: (Rule) => Rule.required(),
        }),
      ],
      options: {
        collapsible: true,
        collapsed: false,
      },
    }),
  ],
  preview: {
    select: {
      title: 'masterControl.title',
      showOnHomepage: 'masterControl.showOnHomepage',
      maxEvents: 'displaySettings.maxEventsToShow',
    },
    prepare({ title, showOnHomepage, maxEvents }: any) {
      const status = showOnHomepage ? '✅ Section Visible' : '❌ Section Hidden';

      return {
        title: title || 'Conferences Management',
        subtitle: `${status} • Max Events: ${maxEvents || 6}`,
      };
    },
  },

  // Singleton - only one document of this type should exist
  __experimental_singleton: true,
})

export default conferencesSectionSettings;
