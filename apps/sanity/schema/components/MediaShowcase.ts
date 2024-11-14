import { defineField } from 'sanity';
import sectionId from '../ui/sectionId';
import { toPlainText } from '../../utils/to-plain-text';
import { sectionPreview } from '../../utils/section-preview';

const name = 'MediaShowcase';
const title = 'Media Showcase';
const icon = () => '📺';

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
      name: 'layout',
      type: 'string',
      title: 'Layout',
      options: {
        list: ['50/50', '30/70', '70/30'],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: '50/50',
      hidden: ({ parent }) => parent?.media?.length !== 2,
      validation: Rule => Rule.required(),
      fieldset: 'media',
    }),
    defineField({
      name: 'media',
      type: 'array',
      title: 'Media (optional)',
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
      fieldset: 'media',
      validation: Rule => Rule.max(3),
    }),
    ...sectionId,
  ],
  fieldsets: [
    {
      name: 'media',
      title: 'Media',
      options: {
        collapsible: false,
      }
    }
  ],
  preview: {
    select: {
      heading: 'heading',
      media: 'media',
    },
    prepare: ({ heading, media }) => ({
      title: `${title} (${media?.length ?? 'without'} media elements)`,
      subtitle: toPlainText(heading),
      ...sectionPreview({ imgUrl: `/static/components/${name}.webp`, icon: icon() }),
    }),
  },
});
