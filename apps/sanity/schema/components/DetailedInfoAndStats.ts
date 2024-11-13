import { defineField } from 'sanity';
import sectionId from '../ui/sectionId';
import { toPlainText } from '../../utils/to-plain-text';
import { sectionPreview } from '../../utils/section-preview';

const name = 'DetailedInfoAndStats';
const title = 'Detailed Info and Stats';
const icon = () => '📊';

export default defineField({
  name,
  type: 'object',
  title,
  icon,
  fields: [
    defineField({
      name: 'img',
      type: 'image',
      title: 'Image (optional)',
    }),
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
      name: 'list',
      type: 'array',
      title: 'List (optional)',
      description: 'List will be showed under a button „Show more”',
      of: [
        defineField({
          name: 'item',
          type: 'object',
          title: 'Item',
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
          ],
          preview: {
            select: {
              heading: 'heading',
              paragraph: 'paragraph',
            },
            prepare: ({ heading, paragraph }) => ({
              title: toPlainText(heading),
              subtitle: toPlainText(paragraph),
            }),
          },
        }),
      ],
    }),
    defineField({
      name: 'stats',
      type: 'array',
      title: 'Stats (optional)',
      of: [
        defineField({
          name: 'item',
          type: 'object',
          title: 'Item',
          fields: [
            defineField({
              name: 'value',
              type: 'string',
              title: 'Value',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'label',
              type: 'text',
              rows: 2,
              title: 'Label',
              validation: Rule => Rule.required(),
            }),
          ],
          preview: {
            select: {
              value: 'value',
              label: 'label',
            },
            prepare: ({ value, label }) => ({
              title: value,
              subtitle: label,
            }),
          },
          validation: Rule => Rule.required(),
        }),
      ],
    }),
    ...sectionId,
  ],
  preview: {
    select: {
      heading: 'heading',
    },
    prepare: ({ heading }) => ({
      title: title,
      subtitle: toPlainText(heading),
      ...sectionPreview({ imgUrl: `/static/components/${name}.webp`, icon: icon() }),
    }),
  },
});
