import { defineField } from 'sanity';
import sectionId from '../ui/sectionId';
import { toPlainText } from '../../utils/to-plain-text';
import { sectionPreview } from '../ui/section-preview';
import { countItems } from '../../utils/count-items';

const name = 'GroupedElements';
const title = 'Grouped Elements';
const icon = () => '🗄️';

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
      name: 'groups',
      type: 'array',
      title: 'Groups',
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
              name: 'heading',
              type: 'string',
              title: 'Heading',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'list',
              type: 'array',
              title: 'List',
              of: [{ type: 'string' }],
              validation: Rule => Rule.required(),
            }),
          ],
          preview: {
            select: {
              icon: 'icon',
              heading: 'heading',
              list: 'list',
            },
            prepare: ({ icon, heading, list }) => ({
              media: icon,
              title: toPlainText(heading),
              subtitle: countItems(list.length)
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
      ...sectionPreview({ name, icon: icon() }),
    }),
  },
});
