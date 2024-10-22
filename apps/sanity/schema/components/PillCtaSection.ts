import { defineField } from 'sanity';
import sectionId from '../ui/sectionId';
import { toPlainText } from '../../utils/to-plain-text';
import { sectionPreview } from '../ui/section-preview';

const name = 'PillCtaSection';
const title = 'Pill CTA Section | with variants';
const icon = () => '💊';

export default defineField({
  name,
  type: 'object',
  title,
  icon,
  fields: [
    defineField({
      name: 'image',
      type: 'image',
      title: 'Image (optional)',
    }),
    defineField({
      name: 'heading',
      type: 'Heading',
      title: 'Heading',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'isEmail',
      type: 'boolean',
      title: 'Is Email?',
      description: 'If set, then instead of a CTA button, an email link will be shown',
      validation: Rule => Rule.required(),
      initialValue: false,
    }),
    defineField({
      name: 'email',
      type: 'string',
      title: 'Email',
      hidden: ({ parent }) => !parent?.isEmail,
      validation: (Rule) => Rule.custom((value, context) => {
        const isEmail = (context.parent as { isEmail?: boolean }).isEmail;
        if (!isEmail) return true
        if (!value) return 'Email is required'
        return true
      }).email(),
    }),
    defineField({
      name: 'cta',
      type: 'cta',
      title: 'Call To Action',
      hidden: ({ parent }) => parent?.isEmail,
      validation: (Rule) => Rule.custom((value, context) => {
        const isEmail = (context.parent as { isEmail?: boolean }).isEmail;
        if (isEmail) return true
        if (!value) return 'Call To Action is required'
        return true
      })
    }),
    defineField({
      name: 'icon',
      type: 'image',
      title: 'Icon',
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
      ...sectionPreview({ name, icon: icon(), label: 'With variants' }),
    }),
  },
});
