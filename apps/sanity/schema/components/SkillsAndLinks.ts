import { defineField } from 'sanity';
import sectionId from '../ui/sectionId';
import { toPlainText } from '../../utils/to-plain-text';
import { sectionPreview } from '../ui/section-preview';

const name = 'SkillsAndLinks';
const title = 'Skills And Links';
const icon = () => '💪🔗';

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
              title: 'Icon (optional)',
            }),
            defineField({
              name: 'label',
              type: 'string',
              title: 'Label',
              validation: Rule => Rule.required(),
            })
          ],
          preview: {
            select: {
              icon: 'icon',
              label: 'label',
            },
            prepare: ({ icon, label }) => ({
              title: label,
              media: icon
            }),
          },
        })
      ],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'paragraph',
      type: 'PortableText',
      title: 'Paragraph',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'linksText',
      type: 'string',
      title: 'Links Text',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'links',
      type: 'array',
      title: 'Links',
      of: [
        defineField({
          name: 'link',
          type: 'object',
          title: 'Link',
          fields: [
            defineField({
              name: 'icon',
              type: 'image',
              title: 'Icon',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'link',
              type: 'url',
              title: 'Link',
              validation: Rule => Rule.required().uri({ scheme: ['https'] }),
            }),
            defineField({
              name: 'name',
              type: 'string',
              title: 'Name',
              validation: Rule => Rule.required(),
            })
          ],
          preview: {
            select: {
              icon: 'icon',
              link: 'link',
              name: 'name',
            },
            prepare: ({ icon, link, name }) => ({
              title: name,
              subtitle: link,
              media: icon
            }),
          }
        })
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
