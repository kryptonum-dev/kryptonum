import { defineField } from 'sanity';
import sectionId from '../ui/sectionId';
import { toPlainText } from '../../utils/to-plain-text';
import { sectionPreview } from '../../utils/section-preview';

const name = 'IrregularBlocksWithStats';
const title = 'Irregular Blocks With Stats';
const icon = () => '📊';

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
      name: 'list',
      type: 'array',
      title: 'Feature Blocks',
      of: [
        defineField({
          name: 'item',
          type: 'object',
          title: 'Feature Item',
          fields: [
            defineField({
              name: 'icon',
              type: 'image',
              title: 'Icon',
              validation: Rule => Rule.required(),
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
              title: 'Paragraph (optional)',
            }),
          ],
          preview: {
            select: {
              icon: 'icon',
              heading: 'heading',
              paragraph: 'paragraph',
            },
            prepare: ({ icon, heading, paragraph }) => ({
              media: icon,
              title: toPlainText(heading),
              subtitle: toPlainText(paragraph),
            }),
          },
        }),
      ],
      validation: Rule => Rule.required().min(2),
    }),
    defineField({
      name: 'img',
      type: 'image',
      title: 'Image',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'stats',
      type: 'array',
      title: 'Statistics',
      of: [
        defineField({
          name: 'stat',
          type: 'object',
          title: 'Statistic',
          fields: [
            defineField({
              name: 'value',
              type: 'string',
              title: 'Value',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'description',
              type: 'text',
              title: 'Description',
              rows: 2,
              validation: Rule => Rule.required(),
            }),
          ],
          preview: {
            select: {
              value: 'value',
              description: 'description',
            },
            prepare: ({ value, description }) => ({
              title: value,
              subtitle: description,
            }),
          },
        }),
      ],
      validation: Rule => Rule.required(),
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
