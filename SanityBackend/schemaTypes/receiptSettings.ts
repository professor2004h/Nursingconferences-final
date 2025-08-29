import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'receiptSettings',
  title: 'Receipt & Email Settings',
  type: 'document',
  icon: () => '🧾',
  fields: [
    defineField({
      name: 'title',
      title: 'Settings Title',
      type: 'string',
      initialValue: 'Payment Receipt Configuration',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'conferenceTitle',
      title: 'Conference Title',
      type: 'string',
      description: 'Title displayed on receipts and emails',
      initialValue: 'International Nursing Conference 2025',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'companyName',
      title: 'Company Name',
      type: 'string',
      description: 'Company name displayed in header',
      initialValue: 'Intelli Global Conferences',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'receiptTemplate',
      title: 'Receipt Template Settings',
      type: 'object',
      fields: [
        defineField({
          name: 'useBlueHeader',
          title: 'Use Blue Header Template',
          type: 'boolean',
          description: 'Enable the blue header PDF template (recommended)',
          initialValue: true
        }),
        defineField({
          name: 'headerColor',
          title: 'Header Background Color',
          type: 'color',
          description: 'Header background color for PDF receipts',
          options: {
            disableAlpha: true
          },
          initialValue: {
            hex: '#4267B2'
          }
        }),
        defineField({
          name: 'logoSize',
          title: 'Logo Size Settings',
          type: 'object',
          fields: [
            defineField({
              name: 'width',
              title: 'Logo Width (px)',
              type: 'number',
              initialValue: 72,
              validation: Rule => Rule.min(50).max(200)
            }),
            defineField({
              name: 'height',
              title: 'Logo Height (px)',
              type: 'number',
              initialValue: 24,
              validation: Rule => Rule.min(20).max(100)
            })
          ]
        })
      ]
    }),
    defineField({
      name: 'emailSettings',
      title: 'Email Configuration',
      type: 'object',
      fields: [
        defineField({
          name: 'senderName',
          title: 'Sender Name',
          type: 'string',
          description: 'Name displayed as email sender',
          initialValue: 'Intelli Global Conferences',
          validation: Rule => Rule.required()
        }),
        defineField({
          name: 'senderEmail',
          title: 'Sender Email',
          type: 'string',
          description: 'Email address used for sending receipts',
          initialValue: 'contactus@intelliglobalconferences.com',
          validation: Rule => Rule.required().email()
        }),
        defineField({
          name: 'subjectLine',
          title: 'Email Subject Line',
          type: 'string',
          description: 'Subject line for receipt emails',
          initialValue: 'Payment Receipt - International Nursing Conference 2025',
          validation: Rule => Rule.required()
        }),
        defineField({
          name: 'emailTemplate',
          title: 'Email Template',
          type: 'text',
          description: 'HTML email template (use {{variables}} for dynamic content)',
          rows: 10,
          initialValue: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #4267B2 0%, #5a7bc8 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px;">
    <h1 style="margin: 0; font-size: 24px;">Payment Receipt</h1>
    <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">{{conferenceTitle}}</p>
  </div>
  
  <div style="padding: 30px 20px; background: #f8f9fa; border-radius: 8px; margin: 20px 0;">
    <h2 style="color: #4267B2; margin: 0 0 15px 0;">Dear {{customerName}},</h2>
    <p style="color: #333; line-height: 1.6; margin: 0 0 15px 0;">
      Thank you for your registration! Your payment has been successfully processed.
    </p>
    <p style="color: #333; line-height: 1.6; margin: 0;">
      Transaction ID: <strong>{{transactionId}}</strong>
    </p>
  </div>
</div>`
        })
      ]
    }),
    defineField({
      name: 'contactInformation',
      title: 'Contact Information',
      type: 'object',
      fields: [
        defineField({
          name: 'supportEmail',
          title: 'Support Email',
          type: 'string',
          description: 'Email for customer support inquiries',
          initialValue: 'contactus@intelliglobalconferences.com',
          validation: Rule => Rule.required().email()
        }),
        defineField({
          name: 'phone',
          title: 'Support Phone',
          type: 'string',
          description: 'Phone number for customer support',
          initialValue: '+1-555-0123'
        }),
        defineField({
          name: 'website',
          title: 'Website URL',
          type: 'url',
          description: 'Company website URL',
          initialValue: 'https://intelliglobalconferences.com'
        })
      ]
    }),
    defineField({
      name: 'pdfSettings',
      title: 'PDF Generation Settings',
      type: 'object',
      fields: [
        defineField({
          name: 'enablePdfAttachment',
          title: 'Attach PDF to Email',
          type: 'boolean',
          description: 'Include PDF receipt as email attachment',
          initialValue: true
        }),
        defineField({
          name: 'storePdfInSanity',
          title: 'Store PDF in Sanity',
          type: 'boolean',
          description: 'Save PDF receipts to Sanity CMS',
          initialValue: true
        }),
        defineField({
          name: 'pdfFilenameFormat',
          title: 'PDF Filename Format',
          type: 'string',
          description: 'Format for PDF filenames (use {{variables}})',
          initialValue: 'Payment_Receipt_{{transactionId}}.pdf'
        })
      ]
    }),
    defineField({
      name: 'isActive',
      title: 'Active Configuration',
      type: 'boolean',
      description: 'Mark this as the active receipt configuration',
      initialValue: true
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      readOnly: true
    })
  ],
  preview: {
    select: {
      title: 'title',
      conferenceTitle: 'conferenceTitle',
      isActive: 'isActive'
    },
    prepare(selection) {
      const { title, conferenceTitle, isActive } = selection
      return {
        title: title || 'Receipt Settings',
        subtitle: `${conferenceTitle} ${isActive ? '(Active)' : '(Inactive)'}`
      }
    }
  }
})
