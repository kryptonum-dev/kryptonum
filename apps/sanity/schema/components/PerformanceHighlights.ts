import { defineField } from 'sanity';
import sectionId from '../ui/sectionId';
import { toPlainText } from '../../utils/to-plain-text';
import { sectionPreview } from '../../utils/section-preview';

const name = 'PerformanceHighlights';
const title = 'Performance Highlights';
const icon = () => '📈';

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
      name: 'metrics',
      type: 'array',
      title: 'Metrics',
      of: [
        defineField({
          name: 'metric',
          type: 'object',
          title: 'Metric',
          fields: [
            defineField({
              name: 'value',
              type: 'string',
            }),
            defineField({
              name: 'label',
              type: 'text',
              rows: 3,
            })
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
        })
      ],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'cta',
      type: 'cta',
      title: 'Call To Action',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'img',
      type: 'image',
      title: 'Image',
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
