import { defineField } from 'sanity';
import sectionId from '../ui/sectionId';
import { toPlainText } from '../../utils/to-plain-text';
import { sectionPreview } from '../../utils/section-preview';

const name = 'HighlightsGrid';
const title = 'Highlights Grid';
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
      name: 'paragraph',
      type: 'PortableText',
      title: 'Paragraph',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'items',
      type: 'array',
      title: 'Grid Items',
      of: [
        defineField({
          name: 'item',
          type: 'object',
          title: 'Grid Item',
          fields: [
            defineField({
              name: 'title',
              type: 'Heading',
              title: 'Title',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'img',
              type: 'image',
              title: 'Image',
              validation: Rule => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'title',
              img: 'img',
            },
            prepare: ({ title, img }) => ({
              title: toPlainText(title),
              media: img,
            }),
          },
        }),
      ],
      validation: Rule => Rule.min(2).required(),
    }),
    defineField({
      name: 'additionalInfo',
      type: 'PortableText',
      title: 'Additional Information (optional)',
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
