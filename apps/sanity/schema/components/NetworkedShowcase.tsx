import { defineField } from 'sanity';
import sectionId from '../ui/sectionId';
import { toPlainText } from '../../utils/to-plain-text';
import { sectionPreview } from '../../utils/section-preview';

const name = 'NetworkedShowcase';
const title = 'Networked Showcase';
const icon = () => '🌐';

export default defineField({
  name,
  type: 'object',
  title,
  icon,
  fields: [
    defineField({
      name: 'tags',
      type: 'array',
      of: [{ type: 'string' }],
      title: 'Tags (optional)',
      description: 'If that field will be blank, nothing will be displayed.',
      validation: Rule => Rule.min(3),
    }),
    defineField({
      name: 'status',
      type: 'string',
      title: 'Status (optional)',
    }),
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
      name: 'showRating',
      type: 'boolean',
      title: 'Show rating?',
      description: <>
        If you will set that to true, the data will be fetched from <a href='/structure/global#googleData.rating' target='_blank' rel='noopener'>global settings</a>.
      </>,
      initialValue: true,
    }),
    defineField({
      name: 'scrollToSectionId',
      type: 'string',
      title: 'Scroll to section ID (optional)',
      description: 'If you will do not set that, the link will be to the Google rating page. If you will set that, the link will scroll to the section with that ID.',
      hidden: ({ parent }) => !parent?.showRating,
      validation: Rule => Rule.custom((value, context) => {
        const showRating = (context.parent as { showRating?: boolean })?.showRating;
        if (showRating && value && !value?.startsWith('#')) {
          return 'Scroll to section ID must start with "#" symbol';
        }
        return true;
      }),
    }),
    defineField({
      name: 'pages',
      type: 'array',
      title: '4 linked services pages',
      of: [
        defineField({
          name: 'page',
          type: 'reference',
          to: [{ type: 'Service_Collection' }],
          options: {
            disableNew: true,
            filter: ({ parent, document }) => {
              const language = (document as { language?: string })?.language;
              const selectedIds = (parent as { _ref?: string }[])?.filter(item => item._ref).map(item => item._ref) || [];
              return {
                filter: '!(_id in $selectedIds) && !(_id in path("drafts.**")) && language == $lang',
                params: { selectedIds, lang: language }
              }
            }
          }
        }),
      ],
      validation: Rule => Rule.required().min(4).max(4),
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
