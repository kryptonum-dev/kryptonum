import { defineField } from 'sanity';
import sectionId from '../ui/sectionId';
import { toPlainText } from '../../utils/to-plain-text';
import { sectionPreview } from '../../utils/section-preview';

const name = 'StagesAccordion';
const title = 'Stages Accordion';
const icon = () => '🪗';

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
      name: 'img',
      type: 'image',
      title: 'Image',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'items',
      type: 'array',
      title: 'Items',
      of: [
        defineField({
          name: 'item',
          type: 'object',
          title: 'Item',
          fields: [
            defineField({
              name: 'title',
              type: 'text',
              rows: 2,
              title: 'Title',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'content',
              type: 'PortableText',
              title: 'Content',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'cta',
              type: 'cta',
              title: 'Call to Action (optional)',
            })
          ],
          preview: {
            select: {
              title: 'title',
              content: 'content',
            },
            prepare: ({ title, content }) => ({
              title: title,
              subtitle: toPlainText(content),
            }),
          },
        })
      ],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'annotation',
      type: 'object',
      title: 'Annotation (optional)',
      fields: [
        defineField({
          name: 'icon',
          type: 'image',
          title: 'Icon',
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: 'text',
          type: 'PortableText',
          title: 'Text',
          validation: Rule => Rule.required(),
        })
      ]
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
