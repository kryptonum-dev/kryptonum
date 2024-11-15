import { defineField } from 'sanity';
import sectionId from '../ui/sectionId';
import { toPlainText } from '../../utils/to-plain-text';
import { sectionPreview } from '../../utils/section-preview';

const name = 'CompareTable';
const title = 'Compare Table';
const icon = () => '🔍';

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
      name: 'compare',
      type: 'array',
      title: 'Compare',
      of: [
        defineField({
          name: 'item',
          type: 'object',
          title: 'Item',
          fields: [
            defineField({
              name: 'kryptonum',
              type: 'boolean',
              title: 'Kryptonum',
              initialValue: true,
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'others',
              type: 'boolean',
              title: 'Others',
              initialValue: false,
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'label',
              type: 'string',
              title: 'Label',
              validation: Rule => Rule.required(),
            }),
          ],
          preview: {
            select: {
              kryptonum: 'kryptonum',
              others: 'others',
              label: 'label',
            },
            prepare: ({ kryptonum, others, label }) => ({
              title: label,
              subtitle: `${kryptonum ? '✅' : '❌'} Kryptonum | ${others ? '✅' : '❌'} Others`,
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
