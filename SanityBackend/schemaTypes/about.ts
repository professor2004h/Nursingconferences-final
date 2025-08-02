// /schemas/about.js
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'about',
  title: 'About Us',
  type: 'document',
  description: 'Manage the About Us page content and organization branding',
  fields: [
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      validation: (Rule) => Rule.required().min(2).max(100),
      description: 'The main title for the About Us page',
      initialValue: 'About Us',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }],
      validation: (Rule) => Rule.required(),
      description: 'The main content/description for the About Us page',
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
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Alternative text for accessibility'
        }
      ],
      description: 'Optional image for the About Us page',
    }),
    defineField({
      name: 'isActive',
      title: 'Show Page',
      type: 'boolean',
      description: 'Toggle to show or hide the About Us page',
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
        title: title || 'About Us',
        subtitle: `${fullBrand}${taglineDisplay} ${isActive ? '(Active)' : '(Inactive)'}`,
        media: () => '📖',
      };
    },
  },
});
