import { defineField, defineType } from 'sanity';

const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    {
      name: 'branding',
      title: 'Branding & Logo',
    },
    {
      name: 'header',
      title: 'Header Settings',
    },
    {
      name: 'contact',
      title: 'Contact Information',
    },
    {
      name: 'social',
      title: 'Social Media',
    },
    {
      name: 'seo',
      title: 'SEO Settings',
    },
    {
      name: 'journal',
      title: 'Journal Settings',
    },
    {
      name: 'admin',
      title: 'Admin Settings',
    },
    {
      name: 'footer',
      title: 'Footer Content',
    },
  ],
  fields: [
    // Branding & Logo
    defineField({
      name: 'logo',
      title: 'Website Logo',
      type: 'image',
      description: 'Upload your website logo. This will be displayed in the header. Recommended size: 300x80px or higher for best quality. Supports PNG, JPG, SVG formats.',
      validation: (Rule) => Rule.required().error('Logo is required'),
      options: {
        hotspot: true,
        accept: '.png,.jpg,.jpeg,.svg,.webp',
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Logo Alt Text',
          description: 'Describe your logo for screen readers and SEO (e.g., "Company Logo")',
          placeholder: 'Describe your logo',
          validation: (Rule: any) => Rule.max(100).error('Alt text should be under 100 characters')
        }
      ],
      group: 'branding',
    }),
    defineField({
      name: 'brandName',
      title: 'Primary Brand Name',
      type: 'string',
      description: 'The main brand name that appears throughout the website (e.g., "Intelli Global")',
      placeholder: 'Intelli Global',
      initialValue: 'Intelli Global',
      validation: (Rule) => Rule.required().min(2).max(50).error('Brand name is required and should be 2-50 characters'),
      group: 'branding',
    }),
    defineField({
      name: 'brandSecondary',
      title: 'Secondary Brand Text',
      type: 'string',
      description: 'The secondary part of your brand name (e.g., "Conferences")',
      placeholder: 'Conferences',
      initialValue: 'Conferences',
      validation: (Rule) => Rule.required().min(2).max(50).error('Secondary brand text is required and should be 2-50 characters'),
      group: 'branding',
    }),
    defineField({
      name: 'brandTagline',
      title: 'Brand Tagline (Optional)',
      type: 'string',
      description: 'Optional tagline or subtitle for your brand',
      placeholder: 'Leading Academic & Medical Conferences',
      validation: (Rule: any) => Rule.max(100).error('Tagline should be under 100 characters'),
      group: 'branding',
    }),
    defineField({
      name: 'favicon',
      title: 'Website Favicon',
      type: 'image',
      description: 'Small icon that appears in browser tabs. Recommended size: 32x32px or 16x16px.',
      options: {
        accept: '.ico,.png,.jpg,.jpeg,.gif,.svg',
      },
      group: 'branding',
    }),
    defineField({
      name: 'websiteUrl',
      title: 'Website URL',
      type: 'url',
      description: 'Your website\'s main URL (e.g., https://yourwebsite.com)',
      placeholder: 'https://intelliglobalconferences.com',
      initialValue: 'https://intelliglobalconferences.com',
      validation: (Rule: any) => Rule.uri({
        scheme: ['http', 'https']
      }).required().error('A valid website URL is required'),
      group: 'seo',
    }),
    defineField({
      name: 'siteDescription',
      title: 'Website Description',
      type: 'text',
      description: 'Brief description of your website for search engines and social media',
      placeholder: 'Describe what your website is about...',
      rows: 3,
      validation: (Rule: any) => Rule.max(300).error('Description should be under 300 characters'),
      group: 'seo',
    }),
    defineField({
      name: 'headerVisibility',
      title: 'Header Display Settings',
      type: 'object',
      description: 'Control what appears in your website header',
      group: 'header',
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        defineField({
          name: 'showHeaderSection',
          title: 'Show Contact & Social Media Bar',
          type: 'boolean',
          description: 'Toggle ON to display the contact information and social media icons in the header. Toggle OFF to hide the entire section.',
          initialValue: true,
        }),
      ],
    }),
    defineField({
      name: 'contactInfo',
      title: 'Contact Information',
      type: 'object',
      description: 'Your business contact details that will appear in the header',
      group: 'contact',
      fields: [
        {
          name: 'email',
          title: 'Primary Email Address',
          type: 'string',
          description: 'Your main business email address (e.g., info@yourcompany.com)',
          placeholder: 'info@yourcompany.com',
          validation: (Rule: any) => Rule.email().required().error('A valid email address is required'),
        },
        {
          name: 'phone',
          title: 'Phone Number',
          type: 'string',
          description: 'General contact phone number (optional)',
          placeholder: '+1 234 567 8900',
          validation: (Rule: any) => Rule.regex(/^[\+]?[0-9\s\-\(\)]{7,20}$/).error('Please enter a valid phone number'),
        },
        {
          name: 'whatsapp',
          title: 'WhatsApp Number',
          type: 'string',
          description: 'WhatsApp number with country code for direct messaging',
          placeholder: '+44 20 4571 8752',
          validation: (Rule: any) => Rule.regex(/^[\+]?[0-9\s\-\(\)]{7,20}$/).required().error('WhatsApp number is required with country code'),
        },
        {
          name: 'address',
          title: 'Business Address',
          type: 'text',
          rows: 3,
          description: 'Your business address (optional - not displayed in header but useful for contact pages)',
          placeholder: 'Enter your business address...',
        },
      ],
    }),
    // Journal Settings
    defineField({
      name: 'journal',
      title: 'Journal Settings',
      type: 'object',
      description: 'Configure the Journal page',
      group: 'journal',
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        defineField({
          name: 'showJournal',
          title: 'Show Journal Button',
          type: 'boolean',
          description: 'Toggle ON to display the Journal button in both the header navigation and homepage. Toggle OFF to hide it completely.',
          initialValue: false,
        }),
        // Kept for future expansion, optional text blob
        defineField({
          name: 'matterDescription',
          title: 'Journal Matter Description',
          type: 'text',
          rows: 5,
        }),
      ],
    }),
    
    defineField({
      name: 'socialMedia',
      title: 'Social Media Links',
      type: 'object',
      description: 'Add your social media profile URLs. Only filled fields will show icons in the header.',
      group: 'social',
      fields: [
        {
          name: 'linkedin',
          title: 'LinkedIn Profile/Company Page',
          type: 'url',
          description: 'Your LinkedIn profile or company page URL',
          placeholder: 'https://linkedin.com/company/yourcompany',
          validation: (Rule: any) => Rule.uri({
            scheme: ['http', 'https']
          }).error('Please enter a valid LinkedIn URL starting with http:// or https://'),
        },
        {
          name: 'facebook',
          title: 'Facebook Page',
          type: 'url',
          description: 'Your Facebook business page URL',
          placeholder: 'https://facebook.com/yourpage',
          validation: (Rule: any) => Rule.uri({
            scheme: ['http', 'https']
          }).error('Please enter a valid Facebook URL starting with http:// or https://'),
        },
        {
          name: 'twitter',
          title: 'X (Twitter) Profile',
          type: 'url',
          description: 'Your X (formerly Twitter) profile URL',
          placeholder: 'https://x.com/yourusername',
          validation: (Rule: any) => Rule.uri({
            scheme: ['http', 'https']
          }).error('Please enter a valid X/Twitter URL starting with http:// or https://'),
        },
        {
          name: 'instagram',
          title: 'Instagram Profile',
          type: 'url',
          description: 'Your Instagram business profile URL',
          placeholder: 'https://instagram.com/yourusername',
          validation: (Rule: any) => Rule.uri({
            scheme: ['http', 'https']
          }).error('Please enter a valid Instagram URL starting with http:// or https://'),
        },
      ],
    }),
    defineField({
      name: 'seo',
      title: 'Search Engine Optimization',
      type: 'object',
      description: 'Settings to help your website appear better in search results',
      group: 'seo',
      fields: [
        {
          name: 'metaTitle',
          title: 'SEO Title',
          type: 'string',
          description: 'Title that appears in Google search results and browser tabs (50-60 characters recommended)',
          placeholder: 'Your Website Title - Key Benefits',
          validation: (Rule: any) => Rule.max(60).warning('Titles over 60 characters may be cut off in search results'),
        },
        {
          name: 'metaDescription',
          title: 'SEO Description',
          type: 'text',
          description: 'Description that appears under your title in Google search results (150-160 characters recommended)',
          placeholder: 'Describe your website and what visitors can expect...',
          rows: 3,
          validation: (Rule: any) => Rule.max(160).warning('Descriptions over 160 characters may be cut off in search results'),
        },
        {
          name: 'keywords',
          title: 'SEO Keywords',
          type: 'array',
          of: [{ type: 'string' }],
          description: 'Important keywords related to your business (add one keyword per entry)',
          options: {
            layout: 'tags'
          }
        },
      ],
    }),
    // Duplicate journal block removed to avoid schema duplication
    defineField({
      name: 'adminSettings',
      title: 'Admin Settings',
      type: 'object',
      description: 'Administrative settings for system operations',
      group: 'admin',
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        defineField({
          name: 'adminEmail',
          title: 'Admin Email Address',
          type: 'string',
          description: 'Email address used for sending invoices and administrative communications',
          placeholder: 'admin@yourcompany.com',
          validation: (Rule: any) => Rule.email().required().error('A valid admin email address is required'),
        }),
        defineField({
          name: 'invoiceEmailSubject',
          title: 'Invoice Email Subject',
          type: 'string',
          description: 'Subject line for invoice emails',
          placeholder: 'Your Sponsorship Invoice - Conference Name',
          initialValue: 'Your Sponsorship Invoice',
        }),
        defineField({
          name: 'invoiceEmailTemplate',
          title: 'Invoice Email Template',
          type: 'text',
          rows: 6,
          description: 'Email template for invoice delivery. Use {{companyName}}, {{contactName}}, {{conferenceName}}, {{amount}} as placeholders',
          placeholder: `Dear {{contactName}},

Thank you for your sponsorship of {{conferenceName}}...`,
          initialValue: `Dear {{contactName}},

Thank you for your sponsorship of {{conferenceName}}. Please find your invoice attached.

Best regards,
The Conference Team`,
        }),
        defineField({
          name: 'paymentConfirmationTemplate',
          title: 'Payment Confirmation Template',
          type: 'text',
          rows: 4,
          description: 'Email template for payment confirmation',
          initialValue: `Dear {{contactName}},

Your payment of \${{amount}} for {{conferenceName}} sponsorship has been confirmed.

Thank you for your support!`,
        }),
      ],
    }),
    defineField({
      name: 'footerContent',
      title: 'Footer Content Management',
      type: 'object',
      description: 'Manage footer pages content and social media links',
      group: 'footer',
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        defineField({
          name: 'footerText',
          title: 'Footer Description Text',
          type: 'text',
          rows: 4,
          description: 'Main descriptive text that appears in the footer section about your organization',
          placeholder: 'We at Nursing Conference 2026 built an ecosystem that brings the Scholars, people in the Scientific Study & Research...',
          initialValue: 'We at Nursing Conference 2026 built an ecosystem that brings the Scholars, people in the Scientific Study & Research, knowledge group of the society, the students, learners and more on a common ground – to share their knowledge, on the scientific progress that brings along the benefits to humanity and to our existence itself.',
          validation: (Rule: any) => Rule.max(1000).error('Footer text should be under 1000 characters'),
        }),
        defineField({
          name: 'termsAndConditions',
          title: 'Terms & Conditions',
          type: 'array',
          of: [{ type: 'block' }],
          description: 'Content for the Terms & Conditions page',
        }),
        defineField({
          name: 'privacyPolicy',
          title: 'Privacy Policy',
          type: 'array',
          of: [{ type: 'block' }],
          description: 'Content for the Privacy Policy page',
        }),
        defineField({
          name: 'faqs',
          title: 'Frequently Asked Questions',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'faq',
              title: 'FAQ Item',
              fields: [
                {
                  name: 'question',
                  title: 'Question',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'answer',
                  title: 'Answer',
                  type: 'array',
                  of: [{ type: 'block' }],
                  validation: (Rule) => Rule.required(),
                },
              ],
              preview: {
                select: {
                  title: 'question',
                },
              },
            },
          ],
          description: 'Add frequently asked questions and their answers',
        }),
        defineField({
          name: 'footerSocialMedia',
          title: 'Footer Social Media Links',
          type: 'object',
          description: 'Social media links specifically for the footer (can be different from header)',
          fields: [
            {
              name: 'twitter',
              title: 'X (Twitter) URL',
              type: 'url',
              description: 'Your X (formerly Twitter) profile URL',
              placeholder: 'https://x.com/yourusername',
              validation: (Rule) => Rule.uri({
                scheme: ['http', 'https']
              }),
            },
            {
              name: 'instagram',
              title: 'Instagram URL',
              type: 'url',
              description: 'Your Instagram profile URL',
              placeholder: 'https://instagram.com/yourusername',
              validation: (Rule) => Rule.uri({
                scheme: ['http', 'https']
              }),
            },
            {
              name: 'linkedin',
              title: 'LinkedIn URL',
              type: 'url',
              description: 'Your LinkedIn profile or company page URL',
              placeholder: 'https://linkedin.com/company/yourcompany',
              validation: (Rule) => Rule.uri({
                scheme: ['http', 'https']
              }),
            },
            {
              name: 'facebook',
              title: 'Facebook URL',
              type: 'url',
              description: 'Your Facebook page URL',
              placeholder: 'https://facebook.com/yourpage',
              validation: (Rule) => Rule.uri({
                scheme: ['http', 'https']
              }),
            },
          ],
        }),
        defineField({
          name: 'footerBackgroundImage',
          title: 'Footer Background Image',
          type: 'image',
          description: 'Optional background image for the footer section. If not provided, a default gradient will be used.',
          options: {
            hotspot: true,
            accept: '.png,.jpg,.jpeg,.webp',
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Background Image Alt Text',
              description: 'Describe the background image for accessibility',
              placeholder: 'Footer background image',
              validation: (Rule: any) => Rule.max(100).error('Alt text should be under 100 characters'),
            }
          ],
        }),
        defineField({
          name: 'footerLogo',
          title: 'Footer Logo',
          type: 'image',
          description: 'Specific logo for the footer section (can be different from main site logo)',
          options: {
            hotspot: true,
            accept: '.png,.jpg,.jpeg,.webp,.svg',
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Footer Logo Alt Text',
              description: 'Describe the footer logo for accessibility',
              placeholder: 'Footer logo',
              validation: (Rule: any) => Rule.max(100).error('Alt text should be under 100 characters'),
            }
          ],
        }),
        defineField({
          name: 'registerButton',
          title: 'Register Now Button',
          type: 'object',
          description: 'Configuration for the Register Now button in the footer',
          fields: [
            {
              name: 'text',
              title: 'Button Text',
              type: 'string',
              description: 'Text displayed on the register button',
              placeholder: 'Register Now',
              validation: (Rule: any) => Rule.max(50).error('Button text should be under 50 characters'),
            },
            {
              name: 'url',
              title: 'Registration URL',
              type: 'url',
              description: 'URL where the register button should navigate',
              placeholder: 'https://example.com/register',
              validation: (Rule: any) => Rule.uri({
                scheme: ['http', 'https']
              }),
            },
            {
              name: 'openInNewTab',
              title: 'Open in New Tab',
              type: 'boolean',
              description: 'Should the registration link open in a new tab?',
              initialValue: true,
            }
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      media: 'logo',
    },
    prepare(selection) {
      const { media } = selection;
      return {
        title: 'Site Settings',
        media,
      };
    },
  },
});

export default siteSettings;
