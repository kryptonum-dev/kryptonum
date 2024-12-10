import { defineField } from 'sanity';
import sectionId from '../ui/sectionId';
import { toPlainText } from '../../utils/to-plain-text';
import { sectionPreview } from '../../utils/section-preview';

const name = 'PricingRange';
const title = 'Pricing Range';
const icon = () => '💰';

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
      name: 'range',
      type: 'object',
      title: 'Range',
      fields: [
        defineField({
          name: 'from',
          type: 'string',
          title: 'From',
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: 'to',
          type: 'string',
          title: 'To',
          validation: Rule => Rule.required(),
        }),
      ],
      options: {
        columns: 2,
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'factorsParagraph',
      type: 'PortableText',
      title: 'Factors Paragraph (optional)',
    }),
    defineField({
      name: 'factors',
      type: 'array',
      of: [
        defineField({
          name: 'factor',
          type: 'text',
          rows: 3,
          validation: Rule => Rule.required(),
        }),
      ],
      title: 'Factors',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'cta',
      type: 'cta',
      title: 'Call to Action (optional)',
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
