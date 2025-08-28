import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'sponsorshipSettings',
  title: 'Sponsorship Settings',
  type: 'document',
  icon: () => '⚙️',
  description: 'Global settings and content for the Sponsorship page',
  fields: [
    defineField({
      name: 'title',
      title: 'Settings Title',
      type: 'string',
      initialValue: 'Sponsorship Settings',
      validation: Rule => Rule.required(),
      description: 'Internal title for this settings configuration',
      readOnly: true
    }),
    
    // Hero Section Settings
    defineField({
      name: 'heroSection',
      title: 'Hero Section',
      type: 'object',
      description: 'Configure the hero section content and appearance',
      fields: [
        defineField({
          name: 'backgroundImage',
          title: 'Hero Background Image',
          type: 'image',
          description: 'Background image for the hero section (recommended: 1920x1080px)',
          options: {
            hotspot: true,
          },
        }),
        defineField({
          name: 'title',
          title: 'Hero Title',
          type: 'string',
          initialValue: 'For Sponsor / Exhibitor',
          description: 'Main heading displayed in the hero section',
        }),
        defineField({
          name: 'description',
          title: 'Hero Description',
          type: 'text',
          rows: 4,
          initialValue: 'Intelli Global Conferences organizes interdisciplinary global conferences to showcase revolutionary basic and applied research outcomes within life sciences including medicine and other diverse roles of science and technology around the world.',
          description: 'Descriptive text displayed below the hero title',
        }),
      ],
    }),
    
    // Main Content Settings
    defineField({
      name: 'mainContent',
      title: 'Main Content Block',
      type: 'object',
      description: 'Configure the main content section',
      fields: [
        defineField({
          name: 'sectionTitle',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Partnership Value Proposition',
          description: 'Optional title for the main content section',
        }),
        defineField({
          name: 'content',
          title: 'Main Content',
          type: 'array',
          of: [
            {
              type: 'block',
              styles: [
                { title: 'Normal', value: 'normal' },
                { title: 'H2', value: 'h2' },
                { title: 'H3', value: 'h3' },
                { title: 'Quote', value: 'blockquote' },
              ],
              marks: {
                decorators: [
                  { title: 'Bold', value: 'strong' },
                  { title: 'Italic', value: 'em' },
                  { title: 'Underline', value: 'underline' },
                ],
                annotations: [
                  {
                    title: 'URL',
                    name: 'link',
                    type: 'object',
                    fields: [
                      {
                        title: 'URL',
                        name: 'href',
                        type: 'url',
                      },
                    ],
                  },
                ],
              },
            },
          ],
          description: 'Rich text content for the main content block',
        }),
        defineField({
          name: 'highlightText',
          title: 'Highlight Text',
          type: 'string',
          initialValue: 'Visualize this partnership through the eyes of world class noble people…!!!',
          description: 'Special highlighted text displayed at the end of the content',
        }),
      ],
    }),
    
    // Call to Action Settings
    defineField({
      name: 'callToAction',
      title: 'Call to Action Section',
      type: 'object',
      description: 'Configure the call to action section',
      fields: [
        defineField({
          name: 'title',
          title: 'CTA Title',
          type: 'string',
          initialValue: 'Ready to Become a Sponsor?',
          description: 'Title for the call to action section',
        }),
        defineField({
          name: 'description',
          title: 'CTA Description',
          type: 'text',
          rows: 2,
          initialValue: 'Join us in supporting groundbreaking research and innovation. Choose your sponsorship package and make a lasting impact.',
          description: 'Description text for the call to action',
        }),
        defineField({
          name: 'buttonText',
          title: 'Button Text',
          type: 'string',
          initialValue: 'Become a Sponsor',
          description: 'Text displayed on the main action button',
        }),
        defineField({
          name: 'buttonLink',
          title: 'Button Link',
          type: 'string',
          initialValue: '/registration',
          description: 'URL where the button should redirect (default: /registration)',
        }),
      ],
    }),
    
    // Page Settings
    defineField({
      name: 'pageSettings',
      title: 'Page Settings',
      type: 'object',
      description: 'General page configuration',
      fields: [
        defineField({
          name: 'showSponsorshipTiers',
          title: 'Show Sponsorship Tiers',
          type: 'boolean',
          initialValue: true,
          description: 'Toggle to show or hide the sponsorship tiers section',
        }),
        defineField({
          name: 'metaTitle',
          title: 'Page Meta Title',
          type: 'string',
          initialValue: 'Sponsorship Opportunities - Intelli Global Conferences',
          description: 'SEO title for the page',
        }),
        defineField({
          name: 'metaDescription',
          title: 'Page Meta Description',
          type: 'text',
          rows: 2,
          initialValue: 'Partner with us to showcase your brand at our global conferences. Explore sponsorship packages and benefits for industry leaders.',
          description: 'SEO description for the page',
        }),
      ],
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
      heroTitle: 'heroSection.title',
      showTiers: 'pageSettings.showSponsorshipTiers'
    },
    prepare({ title, heroTitle, showTiers }) {
      const tiersStatus = showTiers ? 'Tiers: On' : 'Tiers: Off';
      
      return {
        title: title || 'Sponsorship Settings',
        subtitle: `${heroTitle || 'Hero'} | ${tiersStatus}`,
        media: () => '⚙️',
      };
    },
  },
  
  // Singleton - only one settings document should exist
  __experimental_singleton: true,
})
