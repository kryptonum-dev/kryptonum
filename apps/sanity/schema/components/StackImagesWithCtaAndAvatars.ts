import { defineField } from 'sanity';
import sectionId from '../ui/sectionId';
import { toPlainText } from '../../utils/to-plain-text';
import { sectionPreview } from '../ui/section-preview';

const name = 'StackImagesWithCtaAndAvatars';
const title = 'Stack Images With CTA And Avatars';
const icon = () => '👥';

export default defineField({
  name,
  type: 'object',
  title,
  icon,
  fields: [
    defineField({
      name: 'images',
      type: 'array',
      of: [
        { type: 'image' },
      ],
      title: '4 Images',
      validation: Rule => Rule.required().min(4).max(4),
    }),
    defineField({
      name: 'heading',
      type: 'Heading',
      title: 'Heading',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'cta',
      type: 'cta',
      title: 'Call To Action (CTA)',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'avatars',
      type: 'array',
      of: [
        { type: 'image' },
      ],
      title: 'Avatars (optional)',
      validation: Rule => Rule.max(11),
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
