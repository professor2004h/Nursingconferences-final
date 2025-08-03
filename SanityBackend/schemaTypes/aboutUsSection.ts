import { defineField, defineType } from 'sanity';

export const aboutUsSection = defineType({
  name: 'aboutUsSection',
  title: 'About Organisation',
  type: 'document',
  description: 'Manage the About Us section content displayed on the home page',
  fields: [
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      validation: (Rule) => Rule.required().min(2).max(100),
      description: 'The main title for the About Us section',
      initialValue: 'About Us',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'text',
      validation: (Rule) => Rule.required().min(50).max(2000),
      description: 'The main content/description for the About Us section',
      rows: 8,
    }),
    // Branding fields removed; managed under About Us document (schema: about)
    defineField({
      name: 'isActive',
      title: 'Show Section',
      type: 'boolean',
      description: 'Toggle to show or hide the About Us section on the home page',
      initialValue: true,
    }),
    defineField({
      name: 'showButton',
      title: 'Show Button',
      type: 'boolean',
      description: 'Toggle to show or hide the button in the About Us section',
      initialValue: false,
    }),
    defineField({
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
      description: 'The text to display on the button',
      hidden: ({ parent }) => !parent?.showButton,
    }),
    defineField({
      name: 'buttonUrl',
      title: 'Button URL',
      type: 'url',
      description: 'The URL the button should link to',
      hidden: ({ parent }) => !parent?.showButton,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      isActive: 'isActive',
    },
    prepare(selection) {
      const { title, isActive } = selection as any;
      return {
        title: title || 'About Organisation',
        subtitle: `${isActive ? '(Active)' : '(Inactive)'}`,
        media: () => '📖',
      };
    },
  },
});

export default aboutUsSection;
