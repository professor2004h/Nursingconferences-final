// /schemas/imageSection.ts

export default {
  name: 'imageSection',
  title: 'Image Section',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Section Title',
      type: 'string',
      description: 'Optional title for the image section',
      initialValue: 'Our Impact',
    },
    {
      name: 'image',
      title: 'Main Section Image (16:9)',
      type: 'image',
      description: 'Main image to display in this section (16:9 photo). Recommended size ~1552x874 for exact 16:9.',
      validation: (Rule: any) => Rule.required(),
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
          description: 'Important for accessibility and SEO',
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'caption',
          title: 'Caption',
          type: 'string',
          description: 'Optional caption to display below the image',
        },
      ],
    },
    {
      name: 'cpdImage',
      title: 'CPD Credit Image (1552x531)',
      type: 'image',
      description: 'Upload the CPD credit points image (target 1552x531). This will be shown alongside the main image in a gallery layout.',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
          description: 'Describe the CPD credit image for accessibility/SEO',
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'caption',
          title: 'Caption',
          type: 'string',
          description: 'Optional caption for the CPD image',
        },
      ],
      validation: (Rule: any) =>
        Rule.custom((value: any) => {
          if (!value) return true; // optional field
          // We cannot reliably access image metadata here; provide a friendly pass-through
          return true;
        }).warning('Recommended dimensions are 1552x531 (approx 2.92:1).'),
    },
    {
      name: 'layout',
      title: 'Layout Settings',
      type: 'object',
      fields: [
        {
          name: 'aspectRatio',
          title: 'Main Image Aspect Ratio',
          type: 'string',
          description: 'Choose the aspect ratio for the MAIN image display',
          options: {
            list: [
              { title: '16:9 (Widescreen)', value: '16/9' },
              { title: '4:3 (Standard)', value: '4/3' },
              { title: '3:2 (Photo)', value: '3/2' },
              { title: '1:1 (Square)', value: '1/1' },
              { title: 'Auto (Original)', value: 'auto' },
            ],
          },
          initialValue: '16/9',
        },
        {
          name: 'objectFit',
          title: 'Main Image Fit',
          type: 'string',
          description: 'How the MAIN image should fit within its container',
          options: {
            list: [
              { title: 'Cover (Fill container)', value: 'cover' },
              { title: 'Contain (Fit within)', value: 'contain' },
              { title: 'Fill (Stretch)', value: 'fill' },
            ],
          },
          initialValue: 'cover',
        },
        {
          name: 'borderRadius',
          title: 'Border Radius',
          type: 'string',
          description: 'Rounded corners for images in this section',
          options: {
            list: [
              { title: 'None', value: 'none' },
              { title: 'Small', value: 'sm' },
              { title: 'Medium', value: 'md' },
              { title: 'Large', value: 'lg' },
              { title: 'Extra Large', value: 'xl' },
              { title: 'Full (Circle/Pill)', value: 'full' },
            ],
          },
          initialValue: 'lg',
        },
        {
          name: 'cpdAspectRatio',
          title: 'CPD Image Aspect Ratio',
          type: 'string',
          description: 'Display ratio hint for the CPD image (content is 1552x531 ~ 2.92:1)',
          options: {
            list: [
              { title: 'Auto (Original)', value: 'auto' },
              { title: '3:1 (Wide banner approx)', value: '3/1' },
            ],
          },
          initialValue: 'auto',
        },
        {
          name: 'galleryStyle',
          title: 'Gallery Layout',
          type: 'string',
          description: 'How the two images should be arranged',
          options: {
            list: [
              { title: 'Side-by-side (2 columns)', value: 'cols' },
              { title: 'Stacked (Main above CPD)', value: 'stack' },
            ],
          },
          initialValue: 'cols',
        },
      ],
      initialValue: {
        aspectRatio: '16/9',
        objectFit: 'cover',
        borderRadius: 'lg',
      },
    },
    {
      name: 'visibility',
      title: 'Visibility Settings',
      type: 'object',
      fields: [
        {
          name: 'showOnHomepage',
          title: 'Show on Homepage',
          type: 'boolean',
          description: 'Display this image section on the homepage',
          initialValue: true,
        },
        {
          name: 'showOnAboutPage',
          title: 'Show on About Page',
          type: 'boolean',
          description: 'Display this image section on the about page',
          initialValue: false,
        },
      ],
      initialValue: {
        showOnHomepage: true,
        showOnAboutPage: false,
      },
    },
  ],
  preview: {
    select: {
      title: 'title',
      image: 'image',
      alt: 'image.alt',
    },
    prepare({ title, image, alt }: any) {
      return {
        title: title || 'Image Section',
        subtitle: alt || 'No alt text provided',
        media: image,
      };
    },
  },
  initialValue: {
    title: 'Our Impact',
    layout: {
      aspectRatio: '16/9',
      objectFit: 'cover',
      borderRadius: 'lg',
    },
    visibility: {
      showOnHomepage: true,
      showOnAboutPage: false,
    },
  },
};
