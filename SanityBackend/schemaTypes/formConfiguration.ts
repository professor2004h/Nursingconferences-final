import { defineType, defineField } from 'sanity'

export const formConfiguration = defineType({
  name: 'formConfiguration',
  title: 'Form Configuration',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Configuration Title',
      type: 'string',
      validation: Rule => Rule.required(),
      initialValue: 'Registration Form Configuration',
      readOnly: true,
    }),

    defineField({
      name: 'countries',
      title: 'Countries List',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'code',
              title: 'Country Code',
              type: 'string',
              validation: Rule => Rule.required().length(2),
              description: 'ISO 2-letter country code (e.g., US, IN, GB)',
            },
            {
              name: 'name',
              title: 'Country Name',
              type: 'string',
              validation: Rule => Rule.required(),
            },
            {
              name: 'isActive',
              title: 'Active',
              type: 'boolean',
              initialValue: true,
            },
          ],
          preview: {
            select: {
              name: 'name',
              code: 'code',
              isActive: 'isActive',
            },
            prepare({ name, code, isActive }) {
              return {
                title: name,
                subtitle: `${code} ${!isActive ? '(Inactive)' : ''}`,
              }
            },
          },
        },
      ],
      description: 'List of countries available in the registration form',
    }),

    defineField({
      name: 'abstractCategories',
      title: 'Abstract Categories',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'value',
              title: 'Value',
              type: 'string',
              validation: Rule => Rule.required(),
            },
            {
              name: 'label',
              title: 'Display Label',
              type: 'string',
              validation: Rule => Rule.required(),
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              description: 'Optional description for this category',
            },
            {
              name: 'isActive',
              title: 'Active',
              type: 'boolean',
              initialValue: true,
            },
            {
              name: 'displayOrder',
              title: 'Display Order',
              type: 'number',
              validation: Rule => Rule.min(0),
            },
          ],
          preview: {
            select: {
              label: 'label',
              value: 'value',
              isActive: 'isActive',
            },
            prepare({ label, value, isActive }) {
              return {
                title: label,
                subtitle: `${value} ${!isActive ? '(Inactive)' : ''}`,
              }
            },
          },
        },
      ],
      initialValue: [
        { value: 'poster', label: 'Poster', isActive: true, displayOrder: 1 },
        { value: 'oral', label: 'Oral', isActive: true, displayOrder: 2 },
        { value: 'delegate', label: 'Delegate', isActive: true, displayOrder: 3 },
        { value: 'other', label: 'Other', isActive: true, displayOrder: 4 },
      ],
    }),

    defineField({
      name: 'titleOptions',
      title: 'Title Options',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'value',
              title: 'Value',
              type: 'string',
              validation: Rule => Rule.required(),
            },
            {
              name: 'label',
              title: 'Display Label',
              type: 'string',
              validation: Rule => Rule.required(),
            },
            {
              name: 'isActive',
              title: 'Active',
              type: 'boolean',
              initialValue: true,
            },
          ],
        },
      ],
      initialValue: [
        { value: 'mr', label: 'Mr.', isActive: true },
        { value: 'mrs', label: 'Mrs.', isActive: true },
        { value: 'ms', label: 'Ms.', isActive: true },
        { value: 'dr', label: 'Dr.', isActive: true },
        { value: 'prof', label: 'Prof.', isActive: true },
        { value: 'assoc_prof', label: 'Assoc Prof', isActive: true },
        { value: 'assist_prof', label: 'Assist Prof', isActive: true },
      ],
    }),

    defineField({
      name: 'accommodationNightOptions',
      title: 'Accommodation Night Options',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'nights',
              title: 'Number of Nights',
              type: 'number',
              validation: Rule => Rule.required().min(1),
            },
            {
              name: 'label',
              title: 'Display Label',
              type: 'string',
              validation: Rule => Rule.required(),
            },
            {
              name: 'isActive',
              title: 'Active',
              type: 'boolean',
              initialValue: true,
            },
          ],
        },
      ],
      initialValue: [
        { nights: 1, label: '1 Night', isActive: true },
        { nights: 2, label: '2 Nights', isActive: true },
        { nights: 3, label: '3 Nights', isActive: true },
        { nights: 4, label: '4 Nights', isActive: true },
        { nights: 5, label: '5 Nights', isActive: true },
      ],
    }),

    defineField({
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'datetime',
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),
  ],

  preview: {
    select: {
      title: 'title',
      countriesCount: 'countries',
      categoriesCount: 'abstractCategories',
    },
    prepare({ title, countriesCount, categoriesCount }) {
      const countries = Array.isArray(countriesCount) ? countriesCount.length : 0;
      const categories = Array.isArray(categoriesCount) ? categoriesCount.length : 0;
      
      return {
        title: title || 'Form Configuration',
        subtitle: `${countries} countries, ${categories} categories`,
      }
    },
  },
})
