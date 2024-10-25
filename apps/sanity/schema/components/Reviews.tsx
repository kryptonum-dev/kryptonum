import { defineField } from 'sanity';
import sectionId from '../ui/sectionId';
import { toPlainText } from '../../utils/to-plain-text';
import { sectionPreview } from '../ui/section-preview';

const name = 'Reviews';
const title = 'Reviews';
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
      name: 'reviews',
      type: 'array',
      title: 'Reviews (optional)',
      description: (
        <>
          If you will not add any reviews there, then all reviews from the <a href="/structure/Review_Collection" target='_blank' rel='noopener'>Review Collection</a> will be displayed.
        </>
      ),
      of: [
        defineField({
          name: 'item',
          type: 'reference',
          to: [{ type: 'Review_Collection' }],
          options: {
            filter: ({ parent }) => {
              const selectedIds = (parent as { _ref?: string }[])?.filter(item => item._ref).map(item => item._ref) || [];
              if (selectedIds.length > 0) {
                return {
                  filter: '!(_id in $selectedIds)',
                  params: { selectedIds }
                }
              }
              return {}
            }
          }
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
      ...sectionPreview({ name, icon: icon() }),
    }),
  },
});
