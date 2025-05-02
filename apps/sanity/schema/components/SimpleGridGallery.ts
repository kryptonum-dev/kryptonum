import { defineField } from 'sanity';
import sectionId from '../ui/sectionId';
import { toPlainText } from '../../utils/to-plain-text';
import { sectionPreview } from '../../utils/section-preview';

const name = 'SimpleGridGallery';
const title = 'Simple Grid Gallery';
const icon = () => '🖼️';

export default defineField({
  name,
  type: 'object',
  title,
  icon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'heading',
      type: 'Heading',
      title: 'Heading',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'list',
      type: 'array',
      title: 'Gallery Items',
      of: [
        defineField({
          name: 'item',
          type: 'object',
          title: 'Gallery Item',
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
              name: 'media',
              type: 'array',
              title: 'Media Items',
              of: [
                defineField({
                  name: 'image',
                  type: 'image',
                  title: 'Image',
                  validation: Rule => Rule.required(),
                }),
                defineField({
                  name: 'video',
                  type: 'mux.video',
                  title: 'Video',
                  validation: Rule => Rule.required(),
                  preview: {
                    select: {
                      title: '🎥 Video',
                    },
                  },
                }),
              ],
              description: 'The media (image or video) should have 3:2 aspect ratio',
              validation: Rule => Rule.required(),
            }),
          ],
          preview: {
            select: {
              heading: 'heading',
              media: 'media',
            },
            prepare: ({ heading, media }) => ({
              title: toPlainText(heading),
              subtitle: `${media?.length ?? 0} media elements`,
            }),
          },
        }),
      ],
      validation: Rule => Rule.min(1).required(),
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
      heading: 'heading',
    },
    prepare: ({ heading }) => ({
      title: title,
      subtitle: toPlainText(heading),
      ...sectionPreview({ imgUrl: `/static/components/${name}.webp`, icon: icon() }),
    }),
  },
});
