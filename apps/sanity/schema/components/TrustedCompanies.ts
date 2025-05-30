import { defineField } from 'sanity';
import sectionId from '../ui/sectionId';
import { toPlainText } from '../../utils/to-plain-text';
import { sectionPreview } from '../../utils/section-preview';

const name = 'TrustedCompanies';
const title = 'Trusted Companies';
const icon = () => '💼';

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
              name: 'img',
              type: 'image',
              title: 'Image',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'link',
              type: 'url',
              title: 'Link (optional)',
              validation: Rule => Rule.uri({ scheme: ['https'] }),
            }),
            defineField({
              name: 'name',
              type: 'string',
              title: 'Name',
              validation: Rule => Rule.required(),
            }),
          ],
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
