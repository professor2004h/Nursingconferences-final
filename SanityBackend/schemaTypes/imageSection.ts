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
      name: 'carouselSlides',
      title: 'University/Organization Carousel Slides',
      type: 'array',
      description: 'Add multiple university or organization logos with names and links. Each slide will be displayed in 16:9 ratio.',
      validation: (Rule: any) => Rule.min(1).max(10),
      of: [
        {
          type: 'object',
          title: 'Carousel Slide',
          fields: [
            {
              name: 'logo',
              title: 'Logo/Image',
              type: 'image',
              description: 'University or organization logo (will be displayed in 16:9 container)',
              validation: (Rule: any) => Rule.required(),
              options: {
                hotspot: true,
              },
            },
            {
              name: 'name',
              title: 'Organization Name',
              type: 'string',
              description: 'Name of the university or organization',
              validation: (Rule: any) => Rule.required().min(2).max(200),
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              description: 'Short description about the organization (optional)',
              rows: 3,
            },
            {
              name: 'link',
              title: 'Website Link',
              type: 'url',
              description: 'Link to the organization website (optional)',
              validation: (Rule: any) =>
                Rule.uri({
                  scheme: ['http', 'https'],
                }),
            },
            {
              name: 'layout',
              title: 'Slide Layout',
              type: 'string',
              description: 'Choose how to display the logo and text',
              options: {
                list: [
                  { title: 'Logo Top - Text Bottom (Centered)', value: 'top-center' },
                  { title: 'Logo Left - Text Right', value: 'left-right' },
                ],
              },
              initialValue: 'top-center',
            },
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'description',
              media: 'logo',
            },
          },
        },
      ],
    },
    {
      name: 'carouselSettings',
      title: 'Carousel Settings',
      type: 'object',
      description: 'Configure carousel behavior',
      fields: [
        {
          name: 'autoplay',
          title: 'Auto-play Carousel',
          type: 'boolean',
          description: 'Automatically cycle through slides',
          initialValue: true,
        },
        {
          name: 'autoplaySpeed',
          title: 'Auto-play Speed (seconds)',
          type: 'number',
          description: 'Time to display each slide before moving to next',
          validation: (Rule: any) => Rule.min(2).max(30),
          initialValue: 5,
          hidden: ({ parent }: any) => !parent?.autoplay,
        },
        {
          name: 'showDots',
          title: 'Show Navigation Dots',
          type: 'boolean',
          description: 'Display dots for slide navigation',
          initialValue: true,
        },
        {
          name: 'showArrows',
          title: 'Show Navigation Arrows',
          type: 'boolean',
          description: 'Display left/right arrows for manual navigation',
          initialValue: true,
        },
      ],
      initialValue: {
        autoplay: true,
        autoplaySpeed: 5,
        showDots: true,
        showArrows: true,
      },
    },
    {
      name: 'cpdImage',
      title: 'CPD Credit Image (Bottom)',
      type: 'image',
      description: 'Upload the CPD credit points image. This will be shown below the carousel. Recommended size: 1552x531 (approx 2.92:1 ratio).',
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
          return true;
        }).warning('Recommended dimensions are 1552x531 (approx 2.92:1).'),
    },
    {
      name: 'layout',
      title: 'Layout Settings',
      type: 'object',
      fields: [
        {
          name: 'borderRadius',
          title: 'Border Radius',
          type: 'string',
          description: 'Rounded corners for carousel slides',
          options: {
            list: [
              { title: 'None', value: 'none' },
              { title: 'Small', value: 'sm' },
              { title: 'Medium', value: 'md' },
              { title: 'Large', value: 'lg' },
              { title: 'Extra Large', value: 'xl' },
            ],
          },
          initialValue: 'lg',
        },
      ],
      initialValue: {
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
      slides: 'carouselSlides',
    },
    prepare({ title, slides }: any) {
      const slideCount = slides?.length || 0;
      return {
        title: title || 'Image Section',
        subtitle: `${slideCount} carousel slide${slideCount !== 1 ? 's' : ''}`,
        media: slides?.[0]?.logo,
      };
    },
  },
  initialValue: {
    title: 'Our Impact',
    carouselSettings: {
      autoplay: true,
      autoplaySpeed: 5,
      showDots: true,
      showArrows: true,
    },
    layout: {
      borderRadius: 'lg',
    },
    visibility: {
      showOnHomepage: true,
      showOnAboutPage: false,
    },
  },
};
