import { defineField } from 'sanity';
import sectionId from '../ui/sectionId';
import { toPlainText } from '../../utils/to-plain-text';
import { sectionPreview } from '../../utils/section-preview';

const name = 'ExpertProfiles';
const title = 'Expert Profiles';
const icon = () => '👨‍💻';

export default defineField({
  name,
  type: 'object',
  title,
  icon,
  fields: [
    defineField({
      name: 'icon',
      type: 'image',
      title: 'Icon (SVG)',
      description: 'Optional icon to display above the heading',
      options: {
        accept: 'image/svg+xml',
      },
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
      title: 'Paragraph',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'list',
      type: 'array',
      title: 'Expert Profiles',
      of: [
        defineField({
          name: 'expert',
          type: 'object',
          title: 'Expert',
          fields: [
            defineField({
              name: 'img',
              type: 'image',
              title: 'Profile Image',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'name',
              type: 'string',
              title: 'Name',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'position',
              type: 'string',
              title: 'Position',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'description',
              type: 'PortableText',
              title: 'Description',
              validation: Rule => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'position',
              media: 'img',
            },
          },
        }),
      ],
      validation: Rule => Rule.required().min(1),
    }),
    ...sectionId,
  ],
  preview: {
    select: {
      heading: 'heading',
    },
    prepare: ({ heading }) => ({
      title,
      subtitle: toPlainText(heading),
      ...sectionPreview({ imgUrl: `/static/components/${name}.webp`, icon: icon() }),
    }),
  },
});
