import { defineField } from 'sanity';
import sectionId from '../ui/sectionId';
import { toPlainText } from '../../utils/to-plain-text';
import { sectionPreview } from '../../utils/section-preview';

const name = 'GridIconsList';
const title = 'Grid Icons List';
const icon = () => '🔲';

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
    }),
    defineField({
      name: 'img',
      type: 'image',
      title: 'Image (optional)',
    }),
    defineField({
      name: 'list',
      type: 'array',
      title: 'List',
      of: [
        defineField({
          name: 'item',
          type: 'object',
          title: 'Item',
          fields: [
            defineField({
              name: 'icon',
              type: 'image',
              title: 'Icon',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'title',
              type: 'Heading',
              title: 'Title',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'paragraph',
              type: 'PortableText',
              title: 'Paragraph',
            }),
          ],
          preview: {
            select: {
              icon: 'icon',
              title: 'title',
              paragraph: 'paragraph',
            },
            prepare: ({ icon, title, paragraph }) => ({
              media: icon,
              title: toPlainText(title),
              subtitle: toPlainText(paragraph),
            }),
          },
        }),
      ],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'ctas',
      type: 'array',
      of: [{ type: 'cta' }],
      title: 'CTAs',
      validation: Rule => Rule.min(1).max(2),
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
