import { defineField } from 'sanity';
import sectionId from '../ui/sectionId';
import { toPlainText } from '../../utils/to-plain-text';
import { sectionPreview } from '../../utils/section-preview';

const name = 'SingleReview';
const title = 'Single Review';
const icon = () => '💬';

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
      name: 'review',
      type: 'reference',
      to: [{ type: 'Review_Collection' }],
      options: {
        disableNew: true,
        filter: ({ document }) => {
          const language = (document as { language?: string })?.language;
          return {
            filter: 'language == $lang',
            params: { lang: language }
          }
        }
      },
      validation: Rule => Rule.custom((value, context) => {
        const customReview = (context.parent as { customReview?: unknown })?.customReview;
        if (value || customReview) {
          return true;
        }

        return 'Select a review from the collection or provide custom review details.';
      }),
    }),
    defineField({
      name: 'customReview',
      type: 'object',
      title: 'Custom Review (optional)',
      description: 'Fill in to provide review content without using the collection reference.',
      fields: [
        defineField({
          name: 'name',
          type: 'string',
          title: 'Name',
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: 'img',
          type: 'image',
          title: 'Image',
          validation: Rule => Rule.custom((value, context) => {
            const { video } = context.parent as { video?: unknown };

            if (video || value) {
              return true;
            }

            return 'Provide an image when no video is set.';
          }),
        }),
        defineField({
          name: 'video',
          type: 'mux.video',
          title: 'Video (optional)',
        }),
        defineField({
          name: 'review',
          type: 'PortableText',
          title: 'Review',
          validation: Rule => Rule.required(),
        }),
      ],
      validation: Rule => Rule.custom((value, context) => {
        const { review } = context.parent as { review?: unknown };

        if (value || review) {
          return true;
        }

        return 'Select a review from the collection or provide custom review details.';
      }),
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
