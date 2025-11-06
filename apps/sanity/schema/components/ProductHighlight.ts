import { defineField } from 'sanity';
import sectionId from '../ui/sectionId';
import { toPlainText } from '../../utils/to-plain-text';
import { sectionPreview } from '../../utils/section-preview';

const name = 'ProductHighlight';
const title = 'Product Highlight';
const icon = () => '📦';

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
      name: 'cta',
      type: 'cta',
      title: 'Call To Action',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'hint',
      type: 'string',
      title: 'Hint Text (optional)',
      description: 'A small hint or additional information text displayed under the CTA button',
    }),
    defineField({
      name: 'img',
      type: 'image',
      title: 'Image',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'rating',
      type: 'object',
      title: 'Rating (optional)',
      description: 'Override the product collection rating for this section. Leave empty to reuse the default rating.',
      fields: [
        defineField({
          name: 'rating',
          type: 'number',
          title: 'Rating (1.0 - 5.0)',
          validation: Rule => Rule.required().max(5).min(1),
        }),
        defineField({
          name: 'text',
          type: 'string',
          title: 'Rating text',
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: 'avatars',
          type: 'array',
          title: 'Avatars',
          options: {
            layout: 'grid',
          },
          of: [
            defineField({
              name: 'avatar',
              type: 'image',
              title: 'Avatar',
            }),
          ],
          validation: Rule => Rule.required().max(3),
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
