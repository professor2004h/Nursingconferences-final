import { defineField, defineType } from 'sanity';

export const customContentSection = defineType({
  name: 'customContentSection',
  title: 'Custom Content Section',
  type: 'document',
  description: 'Manage content for the Custom Content section - edit the main heading, insights content, and targets content',
  fields: [
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      description: 'Internal title for this configuration (not displayed on frontend)',
      initialValue: 'Custom Content Section',
      validation: (Rule) => Rule.required(),
    }),

    // Toggle to show/hide section
    defineField({
      name: 'showOnHomepage',
      title: 'Show on Homepage',
      type: 'boolean',
      description: 'Toggle to show or hide this section on the homepage',
      initialValue: true,
      validation: (Rule) => Rule.required(),
    }),

    // Primary Text Field
    defineField({
      name: 'primaryText',
      title: 'Primary Text (Main Heading)',
      type: 'string',
      description: 'The main heading/title text that will be displayed prominently at the top of the Custom Content section',
      initialValue: 'INSIGHTS',
      validation: (Rule) => Rule.required().max(100),
    }),

    // Insights Text Field
    defineField({
      name: 'insights',
      title: 'Insights Content',
      type: 'text',
      description: 'Content for the left column (Insights section). This will be displayed under the "INSIGHTS" heading.',
      initialValue: 'Being part of a Scientific Seminar is a professionally very rewarding and enriching experience. Apart from socializing with the greatest kinds from across the Globe, we get the insights to the realm of new global trends, the talking shapes in the Global research laboratories. These sessions inspire many a practitioner minds for new beginnings that have the potential to transform the way we live today. As individuals we constantly seeking to advance our careers, these knowledge sharing sessions function as gateways to a new realm of opportunities unseen before.',
      validation: (Rule) => Rule.required().max(1500),
      rows: 8,
    }),

    // Targets Text Field
    defineField({
      name: 'targets',
      title: 'Targets Content',
      type: 'text',
      description: 'Content for the right column (Targets section). This will be displayed under the "TARGETS" heading.',
      initialValue: 'We are the pioneers in connecting people – bringing in the best minds to the table to resolve complex global human concerns to deliver simple usable solutions. We are in the critical path of bringing scientific innovations to the masses by enabling an ecosystem to key stake holders to express themselves their research findings. These research findings are the Critical links to shaping our future living – seen or unseen.',
      validation: (Rule) => Rule.required().max(1500),
      rows: 8,
    }),
  ],

  preview: {
    select: {
      title: 'title',
      primaryText: 'primaryText',
      insights: 'insights',
      targets: 'targets',
      showOnHomepage: 'showOnHomepage',
    },
    prepare({ title, primaryText, insights, targets, showOnHomepage }) {
      const status = showOnHomepage ? '✅ Section Visible' : '❌ Section Hidden';
      const contentPreview = primaryText ? `"${primaryText}"` : 'No primary text';
      const insightsPreview = insights ? `Insights: ${insights.substring(0, 20)}...` : 'No insights';
      const targetsPreview = targets ? `Targets: ${targets.substring(0, 20)}...` : 'No targets';

      return {
        title: title || 'Custom Content Section',
        subtitle: `${status} • ${contentPreview} • ${insightsPreview} • ${targetsPreview}`,
      };
    },
  },

  // Singleton - only one document of this type should exist
  __experimental_singleton: true,
});

export default customContentSection;
