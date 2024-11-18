import { defineField } from 'sanity';
import sectionId from '../ui/sectionId';
import { toPlainText } from '../../utils/to-plain-text';
import { sectionPreview } from '../../utils/section-preview';

const name = 'Timeline';
const title = 'Timeline';
const icon = () => '🕒';

export default defineField({
  name,
  type: 'object',
  title,
  icon,
  fields: [
    defineField({
      name: 'headingIcon',
      type: 'image',
      title: 'Heading Icon (optional)',
      fieldset: 'heading',
    }),
    defineField({
      name: 'heading',
      type: 'Heading',
      title: 'Heading',
      validation: Rule => Rule.required(),
      fieldset: 'heading',
    }),
    defineField({
      name: 'paragraph',
      type: 'PortableText',
      title: 'Paragraph (optional)',
    }),
    defineField({
      name: 'items',
      type: 'array',
      title: 'Items',
      of: [
        defineField({
          name: 'item',
          type: 'object',
          fields: [
            defineField({
              name: 'deadline',
              type: 'number',
              title: 'Deadline (business days)',
              description: 'It should be a number of business days for deadline. If the value will be 0, then it will be shown as „Today”. The value from 1 to 5 will be shown as „in X days”. And any other value will be shown as absolute date.',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'icon',
              type: 'image',
              title: 'Icon',
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
              title: 'Paragraph (optional)',
            }),
          ],
          preview: {
            select: {
              heading: 'heading',
              deadline: 'deadline',
              icon: 'icon',
            },
            prepare: ({ heading, deadline, icon }) => ({
              title: toPlainText(heading),
              subtitle: `Deadline: ${deadline} business days`,
              media: icon,
            }),
          },
        }),
      ],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'ctaText',
      type: 'PortableText',
      title: 'CTA Text',
      validation: Rule => Rule.required(),
      fieldset: 'cta',
    }),
    defineField({
      name: 'cta',
      type: 'cta',
      title: 'Call to Action',
      validation: Rule => Rule.required(),
      fieldset: 'cta',
    }),
    ...sectionId,
  ],
  fieldsets: [
    {
      name: 'heading',
      title: 'Heading',
    },
    {
      name: 'cta',
      title: 'Call to Action',
    },
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
