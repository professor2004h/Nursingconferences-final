import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'gallerySettings',
  title: 'Gallery Settings',
  type: 'document',
  icon: () => '⚙️',
  description: 'Global settings for the Conference Gallery section',
  fields: [
    defineField({
      name: 'title',
      title: 'Settings Title',
      type: 'string',
      initialValue: 'Gallery Settings',
      validation: Rule => Rule.required(),
      description: 'Internal title for this settings configuration',
      readOnly: true
    }),
    defineField({
      name: 'showGallery',
      title: 'Show Gallery in Navigation',
      type: 'boolean',
      initialValue: true,
      description: 'Toggle to show or hide the Gallery link in the More dropdown menu. When disabled, the gallery will be hidden from navigation.',
    }),
    defineField({
      name: 'navigationLabel',
      title: 'Navigation Label',
      type: 'string',
      initialValue: 'Gallery',
      validation: Rule => Rule.required().min(1).max(50),
      description: 'The text displayed in the navigation menu for the gallery link',
    }),
    defineField({
      name: 'showOnHomepage',
      title: 'Show on Homepage',
      type: 'boolean',
      initialValue: false,
      description: 'Toggle to show or hide the Gallery section on the homepage',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      showGallery: 'showGallery',
      showOnHomepage: 'showOnHomepage',
      navigationLabel: 'navigationLabel'
    },
    prepare({ title, showGallery, showOnHomepage, navigationLabel }) {
      const status = showGallery ? '✅ Enabled' : '❌ Disabled';
      const homepageStatus = showOnHomepage ? 'Homepage: On' : 'Homepage: Off';
      
      return {
        title: title || 'Gallery Settings',
        subtitle: `${status} | ${homepageStatus} | Label: "${navigationLabel}"`,
        media: () => '⚙️',
      };
    },
  },
  
  // Singleton - only one settings document should exist
  __experimental_singleton: true,
})

