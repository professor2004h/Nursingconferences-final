import { defineField, defineType } from 'sanity';

export const journalSection = defineType({
  name: 'journalSection',
  title: 'Journal Section Styling',
  type: 'document',
  description: 'Simple styling controls for the Journal section - upload background image, choose overlay color, and adjust opacity',
  fields: [
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      description: 'Internal title for this configuration (not displayed on frontend)',
      initialValue: 'Journal Section Styling',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'matterDescription',
      title: 'Matter Description',
      type: 'text',
      description: 'Enter the description for the Journal section.',
    }),
    // Background Image Upload
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      description: 'Upload a background image for the Journal section. If no image is provided, the default gradient background will be used.',
      options: {
        hotspot: true,
        accept: '.png,.jpg,.jpeg,.webp',
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
          description: 'Describe the background image for accessibility',
          validation: (Rule) => Rule.max(100),
        }
      ],
    }),

    // Color Picker for Overlay
    defineField({
      name: 'overlayColor',
      title: 'Overlay Color',
      type: 'color',
      description: 'Choose a color to overlay on top of the background image. This helps ensure text readability and creates visual consistency.',
      options: {
        disableAlpha: false, // Allow transparency control in color picker
      },
      initialValue: {
        hex: '#1e293b', // Default slate-800 color
        alpha: 0.8
      }
    }),

    // Opacity Slider
    defineField({
      name: 'overlayOpacity',
      title: 'Overlay Opacity',
      type: 'number',
      description: 'Control the opacity of the color overlay (0-100%). Higher values make the overlay more opaque, lower values make it more transparent.',
      validation: (Rule) => Rule.required().min(0).max(100),
      initialValue: 80,
      // options: {
      //   range: {
      //     min: 0,
      //     max: 100,
      //     step: 5
      //   }
      // }
    }),

    // Enable/Disable Toggle
    defineField({
      name: 'isActive',
      title: 'Enable Custom Styling',
      type: 'boolean',
      description: 'Toggle this ON to apply your custom background image and overlay styling to the Journal section. Toggle OFF to use the default gradient background.',
      initialValue: true,
    }),
  ],

  preview: {
    select: {
      title: 'title',
      backgroundImage: 'backgroundImage',
      isActive: 'isActive',
      overlayColor: 'overlayColor.hex',
      overlayOpacity: 'overlayOpacity',
    },
    prepare({ title, backgroundImage, isActive, overlayColor, overlayOpacity }) {
      const status = isActive ? '✅ Active' : '⏸️ Inactive';
      const hasImage = backgroundImage ? '🖼️ Custom Image' : '🎨 Default Background';
      const opacity = overlayOpacity ? `${overlayOpacity}%` : '80%';

      return {
        title: title || 'Journal Section Styling',
        subtitle: `${status} • ${hasImage} • Color: ${overlayColor || '#1e293b'} • Opacity: ${opacity}`,
        media: backgroundImage,
      };
    },
  },
  
  // Singleton - only one document of this type should exist
  // __experimental_singleton: true,
});

export default journalSection;
