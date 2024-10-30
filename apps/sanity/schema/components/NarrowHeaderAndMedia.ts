import { defineField } from 'sanity';
import sectionId from '../ui/sectionId';
import { toPlainText } from '../../utils/to-plain-text';
import { sectionPreview } from '../../utils/section-preview';

const name = 'NarrowHeaderAndMedia';
const title = 'Narrow Header and Media | with variants';
const icon = () => '📰';

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
      name: 'ctas',
      type: 'array',
      title: 'CTAs',
      description: 'Up to 2 CTAs',
      of: [{ type: 'cta' }],
      validation: Rule => Rule.required().max(2),
    }),
    defineField({
      name: 'media',
      type: 'array',
      title: 'Media',
      description: 'Only 1 or 3 media items are allowed',
      of: [
        defineField({
          name: 'image',
          type: 'image',
          title: 'Image',
          validation: Rule => Rule.required()
        }),
        defineField({
          name: 'video',
          type: 'object',
          fields: [
            defineField({
              name: 'hasUi',
              type: 'boolean',
              title: 'Has UI?',
              initialValue: true,
              description: 'If true, the video will be displayed with a UI overlay. If not, then the video will be autoplayed in a loop',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'asset',
              type: 'mux.video',
              title: 'Asset',
              validation: Rule => Rule.required(),
            }),
          ],
          preview: {
            select: {
              hasUi: 'hasUi',
            },
            prepare: ({ hasUi }) => ({
              title: '🎥 Video',
              subtitle: hasUi ? 'Video will be played with UI' : 'Video will be autoplayed and looped',
              icon: () => '🎥',
            }),
          },
        }),
      ],
      validation: Rule => Rule.custom((value, context) => {
        const media = (context.parent as { media?: any[] }).media;
        if (!media) return true
        if (media.length === 1 || media.length === 3) return true
        return 'Only 1 or 3 media items are allowed'
      })
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
