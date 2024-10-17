import { defineField } from 'sanity';
import sectionId from '../ui/sectionId';
import { toPlainText } from '../../utils/to-plain-text';

const name = 'HeaderGridIcons';
const title = 'Header Grid Icons';
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
              name: 'text',
              type: 'PortableText',
              title: 'Text',
              validation: Rule => Rule.required(),
            }),
          ],
          preview: {
            select: {
              icon: 'icon',
              text: 'text',
            },
            prepare: ({ icon, text }) => ({
              media: icon,
              title: toPlainText(text),
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
    }),
  },
});
