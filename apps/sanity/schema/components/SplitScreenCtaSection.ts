import { defineField } from 'sanity';
import sectionId from '../ui/sectionId';
import { toPlainText } from '../../utils/to-plain-text';

const name = 'SplitScreenCtaSection';
const title = 'Split Screen CTA Section';
const icon = () => '📢';

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
      name: 'cta',
      type: 'cta',
      title: 'Call To Action (CTA)',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'headingSecondary',
      type: 'Heading',
      title: 'Secondary Heading',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'ctaSecondary',
      type: 'cta',
      title: 'Secondary Call To Action (CTA)',
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
    }),
  },
});
