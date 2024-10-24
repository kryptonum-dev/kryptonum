import { defineField } from 'sanity';
import sectionId from '../ui/sectionId';
import { toPlainText } from '../../utils/to-plain-text';
import { sectionPreview } from '../ui/section-preview';

const name = 'ProcessItemsGraph';
const title = 'Process Items Graph';
const icon = () => '🔢';

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
      title: 'Items',
      of: [
        defineField({
          name: 'metric',
          type: 'object',
          title: 'Metric',
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
            }),
            defineField({
              name: 'label',
              type: 'string',
              title: 'Label (optional)',
            })
          ],
          preview: {
            select: {
              icon: 'icon',
              text: 'text',
              label: 'label',
            },
            prepare: ({ icon, text, label }) => ({
              title: toPlainText(text),
              subtitle: label,
              media: icon,
            }),
          },
        })
      ],
      validation: Rule => [
        Rule.required(),
        Rule.max(4).warning('Consider using up to 4 items to best display the process'),
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
      ...sectionPreview({ name, icon: icon() }),
    }),
  },
});
