import { defineField } from 'sanity';
import sectionId from '../ui/sectionId';
import { sectionPreview } from '../../utils/section-preview';

const name = 'ImageListAndMarquee';
const title = 'Image List And Marquee';
const icon = () => '📱';

export default defineField({
  name,
  type: 'object',
  title,
  icon,
  fields: [
    defineField({
      name: 'theme',
      type: 'string',
      title: 'Theme',
      options: {
        list: [
          { title: 'Problems', value: 'problems' },
          { title: 'Solutions', value: 'solutions' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'problems',
      validation: Rule => Rule.required(),
      description:
        'The initial value is set to "problems" by default. The „Problems” theme will display red theme, while the „Solutions” theme will display green theme.',
    }),
    defineField({
      name: 'marqueeString',
      type: 'string',
      title: 'Marquee Text',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'img',
      type: 'image',
      title: 'Image',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'list',
      type: 'array',
      title: 'List',
      of: [
        { type: 'text', rows: 2 }
      ],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'paragraph',
      type: 'PortableText',
      title: 'Paragraph (optional)',
    }),
    ...sectionId,
  ],
  preview: {
    select: {
      theme: 'theme',
      list: 'list',
    },
    prepare: ({ theme, list = [] }) => ({
      title: `${title} (theme: ${theme === 'problems' ? 'Problems' : 'Solutions'})`,
      subtitle: `${list.length} items`,
      ...sectionPreview({ imgUrl: `/static/components/${name}.webp`, icon: icon() }),
    }),
  },
});
