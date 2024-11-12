import { defineField } from 'sanity';
import sectionId from '../ui/sectionId';
import { toPlainText } from '../../utils/to-plain-text';
import { sectionPreview } from '../../utils/section-preview';

const name = 'TeamIntroduction';
const title = 'Team Introduction';
const icon = () => '👥';

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
      name: 'cta',
      type: 'cta',
      title: 'Call to Action (optional)',
    }),
    defineField({
      name: 'withTabs',
      type: 'boolean',
      title: 'With Tabs?',
      description: 'With that variant you will get an ability to add tabs for section',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'tabs',
      type: 'object',
      title: 'Tabs',
      fields: [
        defineField({
          name: 'tab1',
          type: 'object',
          title: 'First Tab',
          fields: [
            defineField({
              name: 'tab',
              type: 'string',
              title: 'Tab name',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'paragraph',
              type: 'PortableText',
              title: 'Paragraph',
              validation: Rule => Rule.required(),
            }),
          ],
          options: {
            collapsible: false,
          },
        }),
        defineField({
          name: 'tab2',
          type: 'object',
          title: 'Second Tab',
          fields: [
            defineField({
              name: 'tab',
              type: 'string',
              title: 'Tab name',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'paragraph',
              type: 'PortableText',
              title: 'Paragraph',
              validation: Rule => Rule.required(),
            }),
          ],
          options: {
            collapsible: false,
          },
        }),
      ],
      hidden: ({ parent }) => !parent?.withTabs,
      validation: Rule => Rule.custom((value, context) => {
        const isWithTabs = (context.parent as { withTabs: boolean })?.withTabs;
        if (!isWithTabs) return true;
        if (!value) return 'Tabs are required';
        return true;
      })
    }),
    ...sectionId,
  ],
  preview: {
    select: {
      heading: 'heading',
      withTabs: 'withTabs',
    },
    prepare: ({ heading, withTabs }) => ({
      title: title + (withTabs ? ' (with tabs)' : ''),
      subtitle: toPlainText(heading),
      ...sectionPreview({ imgUrl: `/static/components/${name}.webp`, icon: icon() }),
    }),
  },
});
