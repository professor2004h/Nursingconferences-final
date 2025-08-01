import { defineField, defineType } from 'sanity';

const heroSection = defineType({
  name: 'heroSection',
  title: 'Hero Section',
  type: 'document',
  fields: [
    defineField({
      name: 'images',
      title: 'Background Images',
      description: 'Upload multiple images for the background slideshow. Images will cycle automatically.',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
        },
      ],
      validation: (Rule) => Rule.required().min(1).max(10).warning('Consider using 3-5 images for optimal performance'),
    }),
    defineField({
      name: 'slideshowSettings',
      title: 'Slideshow Settings',
      type: 'object',
      fields: [
        defineField({
          name: 'enableSlideshow',
          title: 'Enable Slideshow',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'overlayColor',
          title: 'Overlay Color',
          type: 'color',
          initialValue: { hex: '#000000' },
        }),
        defineField({
          name: 'overlayOpacity',
          title: 'Overlay Opacity (%)',
          type: 'number',
          validation: (Rule) => Rule.min(0).max(100),
          initialValue: 50,
        }),
        defineField({
          name: 'transitionDuration',
          title: 'Transition Duration (seconds)',
          type: 'number',
          validation: (Rule) => Rule.min(1).max(10),
          initialValue: 5,
        }),
        defineField({
          name: 'enableZoomEffect',
          title: 'Enable Zoom Effect',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'enableFadeTransition',
          title: 'Enable Fade Transition',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'showNavigationDots',
          title: 'Show Navigation Dots',
          type: 'boolean',
          initialValue: true,
        }),
      ],
    }),
    defineField({
      name: 'conferenceTitle',
      title: 'Conference Title',
      description: 'Main conference title (e.g., "INTERNATIONAL CONFERENCE ON")',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'conferenceSubject',
      title: 'Conference Subject',
      description: 'Main subject/topic of the conference (e.g., "MATERIAL CHEMISTRY & NANO MATERIALS")',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'conferenceTheme',
      title: 'Conference Theme',
      description: 'Detailed theme description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'conferenceDate',
      title: 'Conference Date',
      description: 'Conference dates (e.g., "June 23-24, 2025")',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'conferenceVenue',
      title: 'Conference Venue',
      description: 'Venue name and location',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'eventType',
      title: 'Event Type',
      description: 'Type of event (e.g., Hybrid event (Online and Offline), Online Only, In-Person Only)',
      type: 'string',
      initialValue: 'Hybrid event (Online and Offline)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'abstractSubmissionInfo',
      title: 'Abstract Submission Information',
      description: 'Information about abstract submission deadlines',
      type: 'string',
    }),
    defineField({
      name: 'registrationInfo',
      title: 'Registration Information',
      description: 'Information about registration deadlines and early bird offers',
      type: 'string',
    }),
    defineField({
      name: 'showRegisterButton',
      title: 'Show Register Button',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'registerButtonText',
      title: 'Register Button Text',
      type: 'string',
      initialValue: 'Register Now',
      hidden: ({ parent }) => !parent?.showRegisterButton,
    }),
    defineField({
      name: 'registerButtonUrl',
      title: 'Register Button URL',
      type: 'url',
      initialValue: '/registration',
      hidden: ({ parent }) => !parent?.showRegisterButton,
    }),
    defineField({
      name: 'textColor',
      title: 'Text Color',
      type: 'color',
      options: {
        disableAlpha: false,
      },
      initialValue: { hex: '#ffffff', alpha: 1 },
    }),
  ],
  preview: {
    select: {
      title: 'conferenceSubject',
      subtitle: 'conferenceDate',
      media: 'images.0',
    },
    prepare(selection) {
      const { title, subtitle, media } = selection;
      return {
        title: title || 'Hero Section',
        subtitle: subtitle || 'No date set',
        media,
      };
    },
  },
});

export default heroSection;
