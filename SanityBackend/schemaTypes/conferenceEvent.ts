import { defineField, defineType } from 'sanity'

export const conferenceEvent = defineType({
  name: 'conferenceEvent',
  title: 'Conference Event',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Event Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Event Poster',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Event Date',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email (Optional)',
      type: 'string',
      validation: (Rule) =>
        Rule.email().error('Must be a valid email address'),
    }),
    defineField({
      name: 'mainConferenceUrl',
      title: 'Main Conference Website URL',
      type: 'url',
      description: 'Main conference website URL - used when clicking on the conference image',
      validation: (Rule) => Rule.uri({
        scheme: ['http', 'https']
      }).error('Must be a valid URL (http:// or https://)'),
    }),
    defineField({
      name: 'registerNowUrl',
      title: 'Register Now Button URL',
      type: 'url',
      description: 'URL for the "Register Now" button - accepts any valid URL format',
      validation: (Rule) => Rule.uri({
        scheme: ['http', 'https']
      }).error('Must be a valid URL (http:// or https://)'),
    }),
    defineField({
      name: 'submitAbstractUrl',
      title: 'Submit Abstract Button URL',
      type: 'url',
      description: 'URL for the "Submit Abstract" button - accepts any valid URL format',
      validation: (Rule) => Rule.uri({
        scheme: ['http', 'https']
      }).error('Must be a valid URL (http:// or https://)'),
    }),
    defineField({
      name: 'isActive',
      title: 'Show on Website',
      type: 'boolean',
      description: 'Toggle this ON to display this conference event on the website. Toggle OFF to hide it from all public pages.',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
      location: 'location',
      isActive: 'isActive',
      media: 'image',
    },
    prepare({ title, date, location, isActive, media }: any) {
      const formattedDate = date ? new Date(date).toLocaleDateString() : 'No date';
      const status = isActive ? '✅' : '❌';

      return {
        title: `${status} ${title}`,
        subtitle: `${formattedDate} • ${location}`,
        media,
      };
    },
  },
})

export default conferenceEvent;
