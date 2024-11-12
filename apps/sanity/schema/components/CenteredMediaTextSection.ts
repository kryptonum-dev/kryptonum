import { defineField } from 'sanity';
import sectionId from '../ui/sectionId';
import { toPlainText } from '../../utils/to-plain-text';
import { sectionPreview } from '../../utils/section-preview';

const name = 'CenteredMediaTextSection';
const title = 'Centered Media Text Section';
const icon = () => '📄';

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
      name: 'media',
      title: 'Media',
      type: 'object',
      fields: [
        defineField({
          name: 'type',
          type: 'string',
          initialValue: 'image',
          options: {
            list: [
              { title: 'Image', value: 'image' },
              { title: 'Video', value: 'video' }
            ],
            layout: 'radio',
            direction: 'horizontal'
          }
        }),
        defineField({
          name: 'image',
          type: 'image',
          hidden: ({ parent }) => parent?.type !== 'image',
          validation: Rule => Rule.custom((value, context) => {
            const type = (context.parent as { type: 'image' | 'video' })?.type;
            if (type !== 'image') return true;
            if (!value) return 'Image is required';
            return true;
          })
        }),
        defineField({
          name: 'video',
          type: 'mux.video',
          options: {
            collapsible: false,
          },
          hidden: ({ parent }) => parent?.type !== 'video',
          validation: Rule => Rule.custom((value, context) => {
            const type = (context.parent as { type: 'image' | 'video' })?.type;
            if (type !== 'video') return true;
            if (!value) return 'Video is required';
            return true;
          })
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
      name: 'ctaText',
      type: 'PortableText',
      title: 'CTA Text',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'ctas',
      type: 'array',
      title: 'CTAs',
      of: [{ type: 'cta' }],
      validation: Rule => Rule.required().max(2),
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
