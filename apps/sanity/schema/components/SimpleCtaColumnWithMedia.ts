import { defineField } from 'sanity';
import sectionId from '../ui/sectionId';
import { toPlainText } from '../../utils/to-plain-text';
import { sectionPreview } from '../ui/section-preview';

const name = 'SimpleCtaColumnWithMedia';
const title = 'Simple CTA Column with Media';
const icon = () => '🎥';

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
      name: 'cta',
      type: 'cta',
      title: 'Call To Action',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'isVideo',
      type: 'boolean',
      title: 'Is Video?',
      description: 'If set, then a video field will be shown, instead of an image field',
      initialValue: false,
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'image',
      type: 'image',
      title: 'Image',
      hidden: ({ parent }) => parent?.isVideo,
      validation: Rule => Rule.custom((value, context) => {
        const isVideo = (context.parent as { isVideo?: boolean }).isVideo;
        if (isVideo) return true
        if (!value) return 'Image is required'
        return true
      })
    }),
    defineField({
      name: 'video',
      type: 'mux.video',
      title: 'Video',
      hidden: ({ parent }) => !parent?.isVideo,
      validation: Rule => Rule.custom((value, context) => {
        const isVideo = (context.parent as { isVideo?: boolean }).isVideo;
        if (!isVideo) return true
        if (!value) return 'Video is required'
        return true
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
      ...sectionPreview({ name, icon: icon() }),
    }),
  },
});
