import { defineField } from 'sanity';
import sectionId from '../ui/sectionId';
import { toPlainText } from '../../utils/to-plain-text';
import { sectionPreview } from '../../utils/section-preview';

const name = 'LatestBlogPosts';
const title = 'Latest Blog Posts';
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
      name: 'cta',
      type: 'cta',
      title: 'Call To Action (optional)',
    }),
    defineField({
      name: 'posts',
      type: 'array',
      title: 'Posts (optional)',
      description: 'If not set, the latest 2 blog posts will be shown',
      of: [
        defineField({
          name: 'post',
          type: 'reference',
          to: [{ type: 'BlogPost_Collection' }],
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
      validation: Rule => Rule.min(2).unique(),
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
