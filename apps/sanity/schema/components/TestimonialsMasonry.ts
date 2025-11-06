import { defineField } from 'sanity';
import sectionId from '../ui/sectionId';
import { toPlainText } from '../../utils/to-plain-text';
import { sectionPreview } from '../../utils/section-preview';

const name = 'TestimonialsMasonry';
const title = 'Testimonials Masonry';
const icon = () => '🧱';

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
      name: 'badge',
      type: 'string',
      title: 'Badge Text (optional)',
    }),
    defineField({
      name: 'testimonials',
      type: 'array',
      title: 'Testimonials',
      validation: Rule => Rule.required(),
      of: [
        defineField({
          name: 'item',
          type: 'object',
          title: 'Testimonial',
          fields: [
            defineField({
              name: 'type',
              type: 'string',
              title: 'Testimonial Type',
              options: {
                list: [
                  { title: 'Text', value: 'text' },
                  { title: 'Video', value: 'video' }
                ],
                layout: 'radio',
                direction: 'horizontal'
              },
              initialValue: 'text',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'video',
              type: 'mux.video',
              title: 'Video Testimonial',
              hidden: ({ parent }) => parent?.type !== 'video',
              validation: Rule => Rule.custom((value, context) => {
                const type = (context.parent as { type?: string })?.type;
                if (type !== 'video') return true;
                if (!value) return 'Video is required for video testimonials';
                return true;
              })
            }),
            defineField({
              name: 'name',
              type: 'string',
              title: 'Name',
              hidden: ({ parent }) => parent?.type !== 'text',
              validation: Rule => Rule.custom((value, context) => {
                const type = (context.parent as { type?: string })?.type;
                if (type !== 'text') return true;
                if (!value) return 'Name is required for text testimonials';
                return true;
              })
            }),
            defineField({
              name: 'position',
              type: 'string',
              title: 'Position',
              hidden: ({ parent }) => parent?.type !== 'text',
              validation: Rule => Rule.custom((value, context) => {
                const type = (context.parent as { type?: string })?.type;
                if (type !== 'text') return true;
                if (!value) return 'Position is required for text testimonials';
                return true;
              })
            }),
            defineField({
              name: 'img',
              type: 'image',
              title: 'Image',
              hidden: ({ parent }) => parent?.type !== 'text',
            }),
            defineField({
              name: 'review',
              type: 'PortableText',
              title: 'Review Text',
              hidden: ({ parent }) => parent?.type !== 'text',
              validation: Rule => Rule.custom((value, context) => {
                const type = (context.parent as { type?: string })?.type;
                if (type !== 'text') return true;
                if (!value) return 'Review text is required for text testimonials';
                return true;
              })
            }),
            defineField({
              name: 'date',
              type: 'date',
              title: 'Date',
              hidden: ({ parent }) => parent?.type !== 'text',
              initialValue: new Date().toISOString().split('T')[0],
              validation: Rule => Rule.custom((value, context) => {
                const type = (context.parent as { type?: string })?.type;
                if (type !== 'text') return true;
                if (!value) return 'Date is required for text testimonials';
                return true;
              })
            }),
            defineField({
              name: 'cta',
              type: 'cta',
              title: 'CTA (optional)',
              hidden: ({ parent }) => parent?.type !== 'text',
            }),
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'position',
              image: 'img',
              type: 'type',
            },
            prepare: ({ title, subtitle, image, type }) => ({
              title: type === 'video' ? '🎥 Video Testimonial' : title,
              subtitle: type === 'text' && subtitle,
              media: image || (type === 'video' && (() => '🎥')),
            }),
          },
        }),
      ],
    }),
    defineField({
      name: 'rating',
      type: 'object',
      title: 'Rating (optional)',
      description: 'Override the default rating shown next to the section. Leave empty to reuse the global rating.',
      fields: [
        defineField({
          name: 'rating',
          type: 'number',
          title: 'Rating (1.0 - 5.0)',
          validation: Rule => Rule.required().max(5).min(1),
        }),
        defineField({
          name: 'text',
          type: 'string',
          title: 'Rating text',
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: 'avatars',
          type: 'array',
          title: 'Avatars',
          options: {
            layout: 'grid',
          },
          of: [
            defineField({
              name: 'avatar',
              type: 'image',
              title: 'Avatar',
            }),
          ],
          validation: Rule => Rule.required().max(3),
        }),
      ],
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
