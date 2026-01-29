import { defineField } from 'sanity';
import sectionId from '../ui/sectionId';
import { toPlainText } from '../../utils/to-plain-text';
import { sectionPreview } from '../../utils/section-preview';

const name = 'TwoColumnImageList';
const title = 'Two Column Image List';
const icon = () => '🖼️';

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
      title: 'Paragraph (optional)',
    }),
    defineField({
      name: 'columns',
      type: 'array',
      title: 'Columns',
      description: 'Exactly 2 columns required',
      of: [
        defineField({
          name: 'column',
          type: 'object',
          title: 'Column',
          fields: [
            defineField({
              name: 'image',
              type: 'image',
              title: 'Image',
              description: 'Large illustration for this column',
              options: {
                hotspot: true,
              },
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'heading',
              type: 'Heading',
              title: 'Heading',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'description',
              type: 'PortableText',
              title: 'Description',
              description: 'Use bullet list for items (supports bold, italic, and links)',
              validation: Rule => Rule.required(),
            }),
          ],
          preview: {
            select: {
              image: 'image',
              heading: 'heading',
              description: 'description',
            },
            prepare: ({ image, heading, description }) => ({
              media: image,
              title: toPlainText(heading),
              subtitle: toPlainText(description),
            }),
          },
        }),
      ],
      validation: Rule => Rule.required().min(2).max(2).error('Exactly 2 columns are required'),
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
