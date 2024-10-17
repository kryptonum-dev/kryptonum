import { defineField } from 'sanity';
import sectionId from '../ui/sectionId';
import { toPlainText } from '../../utils/to-plain-text';

const name = 'MarqueePillSection';
const title = 'Marquee Pill Section';
const icon = () => '💊';

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
              name: 'label',
              type: 'string',
              title: 'Label',
              validation: Rule => Rule.required(),
            }),
          ],
          preview: {
            select: {
              icon: 'icon',
              label: 'label',
            },
            prepare: ({ icon, label }) => ({
              media: icon,
              title: label,
            }),
          },
        }),
      ],
      validation: Rule => Rule.required().min(6),
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
    }),
  },
});
