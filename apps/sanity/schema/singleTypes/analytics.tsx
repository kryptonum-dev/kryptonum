import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'analytics',
  type: 'document',
  title: 'Analytics',
  icon: () => '📊',
  fields: [
    defineField({
      name: 'ga4_id',
      type: 'string',
      title: 'Google Analytics 4 ID',
      description: 'Format: G-XXXXXXXXXX. Used for GA4 tracking with Consent Mode v2 (supports cookieless tracking when consent denied).',
      validation: Rule => Rule.regex(/^G-[A-Z0-9]+$/, {
        name: 'GA4 ID format',
        invert: false,
      }).error('Must be in format G-XXXXXXXXXX (e.g., G-ML3RK14DJM)'),
    }),
    defineField({
      name: 'meta_pixel_id',
      type: 'string',
      title: 'Meta (Facebook) Pixel ID',
      description: 'Numeric ID from Meta Events Manager. Used for client-side Meta Pixel tracking.',
      validation: Rule => Rule.regex(/^\d+$/, {
        name: 'Meta Pixel ID format',
        invert: false,
      }).error('Must be a numeric ID (e.g., 359506342387829)'),
    }),
    defineField({
      name: 'meta_conversion_token',
      type: 'string',
      title: 'Meta Conversion API Token',
      description: 'Access token from Meta Events Manager for server-side Conversion API (CAPI) tracking. Keep this secret!',
      validation: Rule => Rule.min(50).error('Token seems too short. Get the full token from Meta Events Manager.'),
    }),
  ],
  preview: {
    prepare: () => ({
      title: 'Analytics Settings',
    })
  }
})
