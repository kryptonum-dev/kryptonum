import { defineField } from 'sanity';
import sectionId from '../ui/sectionId';
import { toPlainText } from '../../utils/to-plain-text';
import { sectionPreview } from '../../utils/section-preview'

const name = 'Faq';
const title = 'FAQ Section';
const icon = () => '❓';

export default defineField({
  name,
  type: 'object',
  title,
  fields: [
    defineField({
      name: 'heading',
      type: 'Heading',
      title: 'Heading',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'list',
      type: 'array',
      of: [
        defineField({
          name: 'item',
          type: 'reference',
          weak: true,
          to: [{ type: 'Faq_Collection' }],
          options: {
            filter: ({ parent }) => {
              const selectedIds = (parent as { _ref?: string }[])?.filter(item => item._ref).map(item => item._ref) || [];
              if (selectedIds.length > 0) {
                return {
                  filter: '!(_id in $selectedIds) && !(_id in path("drafts.**"))',
                  params: { selectedIds }
                }
              }
              return {}
            }
          }
        }),
      ],
      title: 'List',
      validation: Rule => Rule.required().unique(),
    }),
    ...sectionId,
  ],
  preview: {
    select: {
      heading: 'heading',
      list: 'list',
    },
    prepare: ({ heading, list }) => ({
      title: `${title} (${list.length} references)`,
      subtitle: toPlainText(heading),
      ...sectionPreview({ imgUrl: `/static/components/${name}.webp`, icon: icon() }),
    }),
  },
  ...sectionPreview({ imgUrl: `/static/components/${name}.webp`, icon: icon() }),
});
