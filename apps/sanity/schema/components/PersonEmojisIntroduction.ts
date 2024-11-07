import { defineField } from 'sanity';
import sectionId from '../ui/sectionId';
import { toPlainText } from '../../utils/to-plain-text';
import { sectionPreview } from '../../utils/section-preview';

const name = 'PersonEmojisIntroduction';
const title = 'Person Emojis Introduction';
const icon = () => '🙋🏻‍♂️';

export default defineField({
  name,
  type: 'object',
  title,
  icon,
  fields: [
    defineField({
      name: 'img',
      type: 'image',
      title: 'Image',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'emojis',
      type: 'array',
      of: [{ type: 'image' }],
      title: 'Emojis',
      validation: Rule => Rule.required().max(4),
    }),
    defineField({
      name: 'paragraph',
      type: 'PortableText',
      title: 'Paragraph',
      validation: Rule => Rule.required(),
    }),
    ...sectionId,
  ],
  preview: {
    select: {
      paragraph: 'paragraph',
    },
    prepare: ({ paragraph }) => ({
      title: title,
      subtitle: toPlainText(paragraph),
      ...sectionPreview({ imgUrl: `/static/components/${name}.webp`, icon: icon() }),
    }),
  },
});
