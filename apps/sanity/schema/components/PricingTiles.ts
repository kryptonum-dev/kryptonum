import { defineField } from 'sanity';
import sectionId from '../ui/sectionId';
import { toPlainText } from '../../utils/to-plain-text';
import { sectionPreview } from '../../utils/section-preview';

const name = 'PricingTiles';
const title = 'Pricing Tiles';
const icon = () => '💰';

export default defineField({
  name,
  type: 'object',
  title,
  icon,
  fields: [
    defineField({
      name: 'heading',
      type: 'Heading',
      title: 'Heading',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'paragraph',
      type: 'PortableText',
      title: 'Paragraph',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'items',
      type: 'array',
      title: 'Pricing Items',
      of: [
        defineField({
          name: 'item',
          type: 'object',
          title: 'Pricing Item',
          fields: [
            defineField({
              name: 'name',
              type: 'string',
              title: 'Name',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'price',
              type: 'string',
              title: 'Price',
              validation: Rule => Rule.required(),
              fieldset: 'pricing',
            }),
            defineField({
              name: 'oldPrice',
              type: 'string',
              title: 'Old Price (optional for promotional pricing)',
              fieldset: 'pricing',
            }),
            defineField({
              name: 'cta',
              type: 'cta',
              title: 'Call to Action',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'featuresTitle',
              type: 'string',
              title: 'Features Title',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'features',
              type: 'array',
              title: 'Features',
              of: [
                defineField({
                  name: 'feature',
                  type: 'text',
                  title: 'Feature',
                  rows: 2,
                  validation: Rule => Rule.required(),
                }),
              ],
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'thumbnails',
              type: 'array',
              title: 'Thumbnails',
              of: [
                defineField({
                  name: 'thumbnail',
                  type: 'image',
                  title: 'Thumbnail',
                }),
              ],
              validation: Rule => Rule.max(3),
            }),
            defineField({
              name: 'isHighlighted',
              type: 'boolean',
              title: 'Highlight this tile?',
              initialValue: false,
            }),
            defineField({
              name: 'highlight',
              type: 'object',
              title: 'Highlight',
              fields: [
                defineField({
                  name: 'icon',
                  type: 'image',
                  title: 'Icon',
                  validation: Rule => Rule.required(),
                }),
                defineField({
                  name: 'title',
                  type: 'string',
                  title: 'Title',
                  validation: Rule => Rule.required(),
                }),
                defineField({
                  name: 'avatars',
                  type: 'array',
                  title: 'Avatars',
                  of: [
                    defineField({
                      name: 'avatar',
                      type: 'image',
                      title: 'Avatar',
                    }),
                  ],
                  validation: Rule => Rule.max(2),
                }),
                defineField({
                  name: 'avatarsTruncation',
                  type: 'string',
                  title: 'Avatars Truncation Text (e.g. "+99")',
                  description: 'Text to indicate additional users when more than displayed avatars',
                }),
              ],
              hidden: ({ parent }) => !parent?.isHighlighted,
            }),
          ],
          fieldsets: [
            {
              name: 'pricing',
              title: 'Pricing',
              options: {
                columns: 2,
              },
            },
          ],
          preview: {
            select: {
              name: 'name',
              price: 'price',
              oldPrice: 'oldPrice',
              media: 'thumbnails.0',
            },
            prepare: ({ name, price, oldPrice, media }) => ({
              title: `${name} - ${price}${oldPrice ? ` (was ${oldPrice})` : ''}`,
              media,
            }),
          },
        }),
      ],
      validation: Rule => Rule.required().min(1),
    }),
    defineField({
      name: 'additionalInfo',
      type: 'text',
      title: 'Additional Info (optional)',
      description: 'A small decorative text at the bottom of section.',
      rows: 2,
    }),
    ...sectionId,
  ],
  preview: {
    select: {
      heading: 'heading',
      items: 'items',
    },
    prepare: ({ heading, items = [] }) => ({
      title: `${title} (${items.length} items)`,
      subtitle: toPlainText(heading),
      ...sectionPreview({ imgUrl: `/static/components/${name}.webp`, icon: icon() }),
    }),
  },
});
