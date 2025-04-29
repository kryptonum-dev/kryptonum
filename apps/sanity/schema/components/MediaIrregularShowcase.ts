import { defineField } from 'sanity';
import sectionId from '../ui/sectionId';
import { toPlainText } from '../../utils/to-plain-text';
import { sectionPreview } from '../../utils/section-preview';

const name = 'MediaIrregularShowcase';
const title = 'Media Irregular Showcase';
const icon = () => '📱';

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
      name: 'medias',
      type: 'array',
      title: 'Media Items',
      of: [
        defineField({
          name: 'image',
          type: 'image',
          title: 'Image',
          validation: Rule => Rule.required()
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
      validation: Rule => Rule.max(3).required(),
    }),
    ...sectionId,
  ],
  preview: {
    select: {
      heading: 'heading',
      medias: 'medias',
    },
    prepare: ({ heading, medias }) => ({
      title: `${title} (${medias?.length ?? 0} media elements)`,
      subtitle: toPlainText(heading),
      ...sectionPreview({ imgUrl: `/static/components/${name}.webp`, icon: icon() }),
    }),
  },
});
