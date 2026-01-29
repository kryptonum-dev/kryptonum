import { defineField } from 'sanity';
import sectionId from '../ui/sectionId';
import { toPlainText } from '../../utils/to-plain-text';
import { sectionPreview } from '../../utils/section-preview';

const name = 'SimpleGridLayout';
const title = 'Simple Grid Layout';
const icon = () => '🔳';

export default defineField({
  name,
  type: 'object',
  title,
  icon,
  fields: [
    defineField({
      name: 'eyebrow',
      type: 'string',
      title: 'Eyebrow (optional)',
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
    defineField({
      name: 'items',
      type: 'array',
      title: 'Grid Items',
      description: 'Cards displayed in a 3-column grid (minimum 3, maximum 9)',
      of: [
        defineField({
          name: 'item',
          type: 'object',
          title: 'Grid Item',
          fields: [
            defineField({
              name: 'icon',
              type: 'image',
              title: 'Icon',
              description: 'Small icon (SVG recommended)',
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
              title: 'Paragraph',
              validation: Rule => Rule.required(),
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
      validation: Rule => Rule.min(3).max(9).required(),
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
