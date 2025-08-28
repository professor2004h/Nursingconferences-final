import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'abstractSettings',
  title: 'Abstract Settings',
  type: 'document',
  icon: () => '⚙️',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Abstract Submission'
    }),
    defineField({
      name: 'subtitle',
      title: 'Page Subtitle',
      type: 'string',
      initialValue: 'Submit Your Abstract'
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: {
        hotspot: true
      },
      description: 'Background image for the abstract submission page'
    }),
    defineField({
      name: 'abstractTemplate',
      title: 'Abstract Template File',
      type: 'file',
      options: {
        accept: '.pdf,.doc,.docx'
      },
      components: {
        input: (props) => {
          const { CustomFileInput } = require('../components/CustomFileInput.jsx')
          return CustomFileInput(props)
        },
      },
      description: 'Template file for abstract submission that users can download - PDFs open in new tab'
    }),
    defineField({
      name: 'templateDownloadText',
      title: 'Template Download Button Text',
      type: 'string',
      initialValue: 'Download Abstract Template Here'
    }),
    defineField({
      name: 'submissionEnabled',
      title: 'Enable Abstract Submission',
      type: 'boolean',
      initialValue: true
    }),
    defineField({
      name: 'submissionDeadline',
      title: 'Submission Deadline',
      type: 'datetime',
      description: 'Last date for abstract submission'
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      validation: Rule => Rule.email()
    }),
    defineField({
      name: 'interestedInOptions',
      title: 'Interested In Options',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'value',
              title: 'Value',
              type: 'string'
            },
            {
              name: 'label',
              title: 'Display Label',
              type: 'string'
            }
          ]
        }
      ],
      initialValue: [
        { value: 'oral-presentation-in-person', label: 'Oral Presentation (In-Person)' },
        { value: 'poster-presentation-in-person', label: 'Poster Presentation (In-Person)' },
        { value: 'oral-presentation-virtual', label: 'Oral Presentation (Virtual)' },
        { value: 'poster-presentation-virtual', label: 'Poster Presentation (Virtual)' }
      ]
    }),
    defineField({
      name: 'trackNames',
      title: 'Track Names',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'value',
              title: 'Value',
              type: 'string'
            },
            {
              name: 'label',
              title: 'Display Label',
              type: 'string'
            }
          ]
        }
      ],
      initialValue: [
        { value: 'nursing-education', label: 'Nursing Education' },
        { value: 'nursing-informatics', label: 'Nursing Informatics' },
        { value: 'psychiatric-mental-health', label: 'Psychiatric and Mental Health Nursing' },
        { value: 'nursing-research', label: 'Nursing Research' },
        { value: 'public-health-nursing', label: 'Public Health Nursing' },
        { value: 'rehabilitation-nursing', label: 'Rehabilitation Nursing' },
        { value: 'clinical-nursing', label: 'Clinical Nursing' },
        { value: 'cardiac-nursing', label: 'Cardiac Nursing' },
        { value: 'geriatric-nursing', label: 'Geriatric Nursing' },
        { value: 'occupational-health-nursing', label: 'Occupational Health Nursing' },
        { value: 'men-in-nursing', label: 'Men in Nursing' },
        { value: 'mental-nursing', label: 'Mental Nursing' },
        { value: 'nursing-management', label: 'Nursing Management' },
        { value: 'psychological-nursing', label: 'Psychological Nursing' },
        { value: 'medical-surgical-nursing', label: 'Medical Surgical Nursing' },
        { value: 'emergency-nursing', label: 'Emergency Nursing and Ambulatory Care Nursing' },
        { value: 'advances-in-nursing', label: 'Nursing Advances In Nursing' },
        { value: 'transcultural-nursing', label: 'Transcultural Nursing' },
        { value: 'national-health-system', label: 'National Health System' },
        { value: 'family-participatory-care', label: 'Family Participatory Care Nursing' },
        { value: 'nursing-leadership', label: 'Leadership' },
        { value: 'midwifery-womens-health', label: 'Midwifery and Womens Health' },
        { value: 'dental-nursing', label: 'Dental Nursing' },
        { value: 'international-nursing-education', label: 'International nursing Education' },
        { value: 'nurse-practitioner', label: 'Nurse Practitioner' },
        { value: 'veterinary-nursing', label: 'Veterinary Nursing' },
        { value: 'travel-nursing', label: 'Travel Nursing' },
        { value: 'gynecology-nursing', label: 'Gynecology Nursing' },
        { value: 'traditional-medicine-nursing', label: 'Traditional Medicine Nursing' },
        { value: 'diabetic-nursing', label: 'Diabetic Nursing' },
        { value: 'cancer-nursing', label: 'Cancer Nursing' },
        { value: 'orthopeadic-nursing', label: 'Orthopeadic Nursing' },
        { value: 'nephrology-nursing', label: 'Nephrology Nursing' },
        { value: 'patient-care', label: 'Patient care' },
        { value: 'healthcare-global-nursing', label: 'Healthcare Global Nursing' },
        { value: 'adult-health-nursing', label: 'Adult Health nursing' },
        { value: 'risk-factors-nursing', label: 'Risk Factors in Nursing and Healthcare' },
        { value: 'workforce-development', label: 'Professionals Workforce Development and Retention in Nursing' },
        { value: 'obstetrics-gynecology', label: 'Obstetrics and Gynecology Nursing' },
        { value: 'pain-management', label: 'Pain Management & Preventive Medicine' },
        { value: 'nursing-specialties', label: 'Nursing in Different Fields and Specialties' },
        { value: 'nursing-ethics', label: 'Nursing Ethics, Legal Aspects, and Patient Advocacy' },
        { value: 'leadership-development', label: 'Leadership and Professional Development' },
        { value: 'geriatric-pediatric', label: 'Geriatric & Pediatric Nursing' },
        { value: 'environmental-health', label: 'Environmental Health Nursing' },
        { value: 'epidemiology-community', label: 'Epidemiology and Community Health' },
        { value: 'community-home-health', label: 'Community and Home Health Nursing' },
        { value: 'ai-emerging-technologies', label: 'AI and Emerging Technologies in Nursing' },
        { value: 'anesthesia-perianesthesia', label: 'Anesthesia and PeriAnesthesia Nursing' },
        { value: 'burnout-wellbeing', label: 'Burnout, Well-Being, and Resilience in Nursing' },
        { value: 'cancer-therapy', label: 'cancer therapy' },
        { value: 'pediatric-nursing', label: 'pediatric nursing' },
        { value: 'obesity-nursing', label: 'obesity nursing' },
        { value: 'cardiology-nursing', label: 'cardiology nursing' },
        { value: 'others', label: 'Others' }
      ]
    })
  ],
  preview: {
    select: {
      title: 'title'
    },
    prepare(selection) {
      return {
        title: selection.title || 'Abstract Settings'
      }
    }
  }
})
