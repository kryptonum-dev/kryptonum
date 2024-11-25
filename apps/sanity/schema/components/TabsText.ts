import { defineField } from 'sanity';
import sectionId from '../ui/sectionId';
import { toPlainText } from '../../utils/to-plain-text';
import { sectionPreview } from '../../utils/section-preview';

const name = 'TabsText';
const title = 'Tabs Text';
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
      name: 'paragraph',
      type: 'PortableText',
      title: 'Paragraph',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'tabsHeading',
      type: 'Heading',
      title: 'Tabs Heading',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'tabs',
      type: 'array',
      title: 'Tabs',
      of: [
        defineField({
          name: 'tab',
          type: 'object',
          title: 'Tab',
          fields: [
            defineField({
              name: 'name',
              type: 'string',
              title: 'Name',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'paragraph',
              type: 'PortableText',
              title: 'Paragraph',
              validation: Rule => Rule.required(),
            }),
          ],
          preview: {
            select: {
              name: 'name',
              paragraph: 'paragraph',
            },
            prepare: ({ name, paragraph }) => ({
              title: name,
              subtitle: toPlainText(paragraph),
            }),
          },
          validation: Rule => Rule.required(),
        }),
      ],
      validation: Rule => Rule.required().min(2),
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
