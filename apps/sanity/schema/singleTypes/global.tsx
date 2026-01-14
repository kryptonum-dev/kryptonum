import { defineField, defineType } from 'sanity';
import { languageLabel } from '../../utils/language-label';

export default defineType({
  name: 'global',
  type: 'document',
  title: 'Global',
  icon: () => '🌍',
  fields: [
    defineField({
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'email',
      type: 'string',
      title: 'Email',
      validation: Rule => Rule.required().email(),
    }),
    defineField({
      name: 'tel',
      type: 'string',
      title: 'Phone number (optional)',
    }),
    defineField({
      name: 'socials',
      type: 'object',
      title: 'Social media',
      options: { collapsible: true },
      fields: [
        defineField({
          name: 'instagram',
          type: 'url',
          title: 'Instagram',
          validation: Rule => Rule.uri({ scheme: ['https'] }).error('Provide a valid URL (starting with https://)'),
        }),
        defineField({
          name: 'facebook',
          type: 'url',
          title: 'Facebook',
          validation: Rule => Rule.uri({ scheme: ['https'] }).error('Provide a valid URL (starting with https://)'),
        }),
        defineField({
          name: 'tiktok',
          type: 'url',
          title: 'TikTok',
          validation: Rule => Rule.uri({ scheme: ['https'] }).error('Provide a valid URL (starting with https://)'),
        }),
        defineField({
          name: 'linkedin',
          type: 'url',
          title: 'LinkedIn',
          validation: Rule => Rule.uri({ scheme: ['https'] }).error('Provide a valid URL (starting with https://)'),
        }),
      ],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'address',
      type: 'object',
      title: 'Address',
      options: { collapsible: true },
      fields: [
        defineField({
          name: 'addressText',
          type: 'string',
          title: 'Display Address',
          description: 'Human-readable address for display on the website (e.g., "Żwirki i Wigury 15/9, 02-143 Warszawa").',
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: 'mapLink',
          type: 'url',
          title: 'Map link',
          description: 'Google Maps link for the address.',
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: 'streetAddress',
          type: 'string',
          title: 'Street Address',
          description: 'Street name and number for structured data (e.g., "Żwirki i Wigury 15/9").',
          validation: Rule => Rule.required(),
          fieldset: 'structuredAddress',
        }),
        defineField({
          name: 'addressLocality',
          type: 'string',
          title: 'City',
          description: 'City name (e.g., "Warszawa").',
          validation: Rule => Rule.required(),
          fieldset: 'structuredAddress',
        }),
        defineField({
          name: 'postalCode',
          type: 'string',
          title: 'Postal Code',
          description: 'Postal/ZIP code (e.g., "02-143").',
          validation: Rule => Rule.required(),
          fieldset: 'structuredAddress',
        }),
        defineField({
          name: 'addressCountry',
          type: 'string',
          title: 'Country Code',
          description: 'ISO 3166-1 alpha-2 country code.',
          initialValue: 'PL',
          validation: Rule => Rule.required().length(2),
          fieldset: 'structuredAddress',
        }),
        defineField({
          name: 'geo',
          type: 'object',
          title: 'Geo Coordinates',
          description: 'GPS coordinates for local SEO. You can find these on Google Maps.',
          fieldset: 'structuredAddress',
          fields: [
            defineField({
              name: 'latitude',
              type: 'number',
              title: 'Latitude',
              description: 'e.g., 52.2023',
              validation: Rule => Rule.required().min(-90).max(90),
            }),
            defineField({
              name: 'longitude',
              type: 'number',
              title: 'Longitude',
              description: 'e.g., 20.9585',
              validation: Rule => Rule.required().min(-180).max(180),
            }),
          ],
        }),
      ],
      fieldsets: [
        {
          name: 'structuredAddress',
          title: 'Structured Address (for SEO)',
          description: 'These fields are used for structured data and local SEO.',
          options: { collapsible: true, collapsed: false },
        },
      ],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'googleData',
      type: 'object',
      title: 'Google Data',
      fields: [
        defineField({
          name: 'rating',
          type: 'number',
          title: 'Rating (1.0 - 5.0)',
          validation: Rule => Rule.required().max(5).min(1),
          fieldset: 'rating',
        }),
        defineField({
          name: 'user_ratings_total',
          type: 'number',
          title: 'Number of reviews',
          validation: Rule => Rule.required(),
          fieldset: 'rating',
        }),
        defineField({
          name: 'url',
          type: 'url',
          title: 'Google Business URL',
          validation: Rule => Rule.required().uri({ scheme: ['https'] }),
        }),
      ],
      fieldsets: [
        {
          name: 'rating',
          title: 'Rating',
          options: { columns: 2 },
        },
      ],
    }),
    defineField({
      name: 'nav',
      type: 'object',
      title: 'Navigation',
      fields: [
        defineField({
          name: 'annotation',
          type: 'object',
          title: 'Annotation',
          fields: [
            defineField({
              name: 'icon',
              type: 'image',
              title: 'Icon (optional)',
              description: 'Only SVG files are supported.',
              options: {
                accept: '.svg',
              },
            }),
            defineField({
              name: 'text',
              type: 'string',
              title: 'Text',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'link',
              type: 'object',
              title: 'Link (optional)',
              fields: [
                defineField({
                  name: 'text',
                  type: 'string',
                  title: 'Text',
                  validation: Rule => Rule.required(),
                }),
                defineField({
                  name: 'url',
                  type: 'url',
                  title: 'URL',
                  validation: Rule => Rule.required().uri({ scheme: ['https'] }),
                })
              ]
            })
          ]
        }),
        defineField({
          name: 'cta',
          type: 'cta',
          title: 'Call to Action',
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: 'caseStudies',
          type: 'array',
          title: 'Case Studies',
          description: 'If you will leave this empty, we will display 8 last case studies from portfolio.',
          of: [{
            type: 'reference',
            to: [{ type: 'CaseStudy_Collection' }],
            options: {
              disableNew: true,
              filter: ({ parent }) => {
                const selectedIds = (parent as { _ref?: string }[])?.filter(item => item._ref).map(item => item._ref) || [];
                if (selectedIds.length > 0) {
                  return {
                    filter: '!(_id in $selectedIds) && !(_id in path("drafts.**"))',
                    params: { selectedIds }
                  }
                }
                return {}
              }
            }
          }],
          validation: Rule => [
            Rule.max(8).warning('We recommend to have max 8 case studies in navigation.'),
            Rule.unique(),
          ]
        }),
      ]
    }),
    defineField({
      name: 'footer',
      type: 'object',
      title: 'Footer',
      fields: [
        defineField({
          name: 'caseStudies',
          type: 'array',
          title: 'Case Studies',
          description: 'If you will leave this empty, we will display 4 last case studies from portfolio.',
          of: [{
            type: 'reference',
            to: [{ type: 'CaseStudy_Collection' }],
            options: {
              disableNew: true,
              filter: ({ parent }) => {
                const selectedIds = (parent as { _ref?: string }[])?.filter(item => item._ref).map(item => item._ref) || [];
                if (selectedIds.length > 0) {
                  return {
                    filter: '!(_id in $selectedIds) && !(_id in path("drafts.**"))',
                    params: { selectedIds }
                  }
                }
                return {}
              }
            }
          }],
          validation: Rule => [
            Rule.max(4).warning('We recommend to have max 4 case studies in footer.'),
            Rule.unique(),
          ]
        }),
      ],
    }),
    defineField({
      name: 'seo',
      type: 'object',
      title: 'Global SEO',
      fields: [
        defineField({
          name: 'img',
          type: 'image',
          title: 'Social Share Image',
          description: 'Social Share Image is visible when sharing website on social media. The dimensions of the image should be 1200x630px. For maximum compatibility, use JPG or PNG formats, as WebP may not be supported everywhere.',
          validation: Rule => Rule.required()
        }),
      ],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'OrganizationSchema',
      type: 'object',
      title: 'Organization structured data',
      description: (
        <>
          Learn more about{' '}
          <a
            href="https://developers.google.com/search/docs/appearance/structured-data/organization?hl=en"
            target="_blank"
            rel="noreferrer"
          >
            Organization structured data
          </a>
        </>
      ),
      options: { collapsible: true },
      fields: [
        defineField({
          name: 'name',
          type: 'string',
          title: 'Name',
          description: 'Enter the name of your organization as you want it to appear in search results.',
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: 'description',
          type: 'text',
          rows: 3,
          title: 'Description',
          description: 'A brief description of your organization that will appear in search results.',
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: 'logo',
          type: 'image',
          title: 'Logo',
          description: 'Organization logo for structured data. Use a square or landscape image, minimum 112x112px. PNG or SVG recommended.',
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: 'foundingDate',
          type: 'date',
          title: 'Founding Date',
          description: 'The date the organization was founded.',
          options: {
            dateFormat: 'YYYY-MM-DD',
          },
        }),
        defineField({
          name: 'priceRange',
          type: 'string',
          title: 'Price Range',
          description: 'Indicates the relative price range of services. Used by Google for local business results.',
          options: {
            list: [
              { title: '$ (Budget)', value: '$' },
              { title: '$$ (Moderate)', value: '$$' },
              { title: '$$$ (Premium)', value: '$$$' },
              { title: '$$$$ (Luxury)', value: '$$$$' },
            ],
            layout: 'radio',
          },
          initialValue: '$$',
        }),
        defineField({
          name: 'areaServed',
          type: 'array',
          title: 'Areas Served',
          description: 'Cities/regions where you provide services. Supports local SEO for your service pages.',
          of: [
            {
              type: 'object',
              title: 'Location',
              fields: [
                defineField({
                  name: 'name',
                  type: 'string',
                  title: 'City/Region Name',
                  description: 'e.g., "Warszawa", "Kraków"',
                  validation: Rule => Rule.required(),
                }),
              ],
              preview: {
                select: { title: 'name' },
              },
            },
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      language: 'language',
    },
    prepare: ({ language }) => ({
      title: 'Global settings',
      subtitle: languageLabel(language),
    })
  }
})

