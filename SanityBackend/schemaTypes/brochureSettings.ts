import { defineField, defineType } from 'sanity';
import { DocumentIcon } from '@sanity/icons';
import { PDFFileInput } from '../components/CustomFileInput.jsx';

export const brochureSettings = defineType({
  name: 'brochureSettings',
  title: 'Brochure Settings',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Brochure Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(100),
      description: 'The title displayed on the brochure download page',
      initialValue: 'Conference Brochure',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(500),
      description: 'Brief description about the brochure content',
      initialValue: 'Download our comprehensive conference brochure to learn more about the event, speakers, and opportunities.',
    }),
    // New hero background image to be used on /brochure header
    defineField({
      name: 'heroBackgroundImage',
      title: 'Hero Background Image',
      type: 'image',
      options: {
        hotspot: true
      },
      description: 'Background image for the Brochure page hero header',
    }),
    // Optional: black overlay opacity (0-100). Default 40 to match About page
    defineField({
      name: 'heroOverlayOpacity',
      title: 'Hero Overlay Opacity (%)',
      type: 'number',
      description: 'Black overlay opacity for hero background (0-100). Default 40.',
      initialValue: 40,
      validation: (Rule) => Rule.min(0).max(100),
    }),
    defineField({
      name: 'pdfFile',
      title: 'PDF Brochure File',
      type: 'file',
      options: {
        accept: '.pdf',
      },
      components: {
        input: PDFFileInput,
      },
      validation: (Rule) => Rule.required(),
      description: 'Upload the PDF brochure file that users will download - opens in new tab',
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      description: 'Toggle to enable/disable brochure downloads',
      initialValue: true,
    }),
    defineField({
      name: 'downloadCount',
      title: 'Total Downloads',
      type: 'number',
      readOnly: true,
      initialValue: 0,
      description: 'Total number of brochure downloads (automatically updated)',
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'datetime',
      readOnly: true,
      initialValue: () => new Date().toISOString(),
      description: 'When the brochure settings were last modified',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      active: 'active',
      downloadCount: 'downloadCount',
    },
    prepare({ title, active, downloadCount }) {
      return {
        title: title || 'Brochure Settings',
        subtitle: `${active ? 'Active' : 'Inactive'} • ${downloadCount || 0} downloads`,
        media: DocumentIcon,
      };
    },
  },
});

export default brochureSettings;
