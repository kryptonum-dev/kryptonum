import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'analytics',
  type: 'document',
  title: 'Analytics',
  icon: () => '📊',
  fields: [
    defineField({
      name: 'gtm_id',
      type: 'string',
      title: 'Google Tag Manager ID',
      description: 'Format: GTM-XXXXXX. Container ID for managing analytics tools (GA4, Facebook Pixel, etc.).',
    }),
    defineField({
      name: 'ga4_id',
      type: 'string',
      title: 'Google Analytics 4 ID',
      description: 'Format: G-XXXXXXXXXX. Used for GA4 tracking.',
    }),
    defineField({
      name: 'meta_pixel_id',
      type: 'string',
      title: 'Meta (Facebook) Pixel ID',
      description: 'Format: XXXXXXXXXX. Used for Meta Pixel and Conversion API tracking.',
    }),
    defineField({
      name: 'meta_conversion_token',
      type: 'string',
      title: 'Meta Conversion API Token',
      description: 'Secret token for server-side Meta Conversion API tracking.',
    }),
  ],
  preview: {
    prepare: () => ({
      title: 'Analytics Settings',
    })
  }
})
