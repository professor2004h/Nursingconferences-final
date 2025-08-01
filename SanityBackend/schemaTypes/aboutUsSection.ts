import { defineField, defineType } from 'sanity';

export const aboutUsSection = defineType({
  name: 'aboutUsSection',
  title: 'About Us Section',
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
    defineField({
      name: 'isActive',
      title: 'Show Section',
      type: 'boolean',
      description: 'Toggle to show or hide the About Us section on the home page',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      isActive: 'isActive',
    },
    prepare(selection) {
      const { title, isActive } = selection;
      return {
        title: title || 'About Us Section',
        subtitle: isActive ? 'Active' : 'Inactive',
        media: () => '📖',
      };
    },
  },
});

export default aboutUsSection;
