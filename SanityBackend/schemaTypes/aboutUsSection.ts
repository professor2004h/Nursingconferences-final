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
    defineField({
      name: 'primaryBrandName',
      title: 'Primary Brand Name',
      type: 'string',
      description: 'The primary brand name that appears in the About Us section (e.g., "Nursing")',
      placeholder: 'Nursing',
      initialValue: 'Nursing',
      validation: (Rule) => Rule.required().min(2).max(50).error('Primary brand name is required and should be 2-50 characters'),
    }),
    defineField({
      name: 'secondaryBrandText',
      title: 'Secondary Brand Text',
      type: 'string',
      description: 'The secondary brand text that complements the primary brand (e.g., "Conference 2026")',
      placeholder: 'Conference 2026',
      initialValue: 'Conference 2026',
      validation: (Rule) => Rule.required().min(2).max(50).error('Secondary brand text is required and should be 2-50 characters'),
    }),
    defineField({
      name: 'brandTagline',
      title: 'Brand Tagline (Optional)',
      type: 'string',
      description: 'Optional brand tagline or subtitle that appears below the main branding',
      placeholder: 'Connecting minds, sharing knowledge',
      validation: (Rule) => Rule.max(150).error('Brand tagline should be under 150 characters'),
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
      primaryBrandName: 'primaryBrandName',
      secondaryBrandText: 'secondaryBrandText',
      brandTagline: 'brandTagline',
      isActive: 'isActive',
    },
    prepare(selection) {
      const { title, primaryBrandName, secondaryBrandText, brandTagline, isActive } = selection;
      const fullBrand = `${primaryBrandName || 'Nursing'} ${secondaryBrandText || 'Conference 2026'}`;
      const taglineDisplay = brandTagline ? ` - ${brandTagline}` : '';
      return {
        title: title || 'About Organisation',
        subtitle: `${fullBrand}${taglineDisplay} ${isActive ? '(Active)' : '(Inactive)'}`,
        media: () => '📖',
      };
    },
  },
});

export default aboutUsSection;
