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
          title: 'FAQ Reference',
          to: [{ type: 'Faq_Collection' }],
          options: {
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
        defineField({
          name: 'inline_item',
          type: 'object',
          title: 'Inline FAQ',
          fields: [
            defineField({
              name: 'question',
              type: 'text',
              rows: 2,
              title: 'Question',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'answer',
              type: 'PortableText',
              title: 'Answer',
              validation: Rule => Rule.required(),
            }),
          ],
          preview: {
            select: {
              question: 'question',
              answer: 'answer',
            },
            prepare: ({ question, answer }) => ({
              title: toPlainText(question),
              subtitle: toPlainText(answer),
            }),
          },
        }),
      ],
      title: 'FAQ Items',
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
      title: `${title} (${list.length} items)`,
      subtitle: toPlainText(heading),
      ...sectionPreview({ imgUrl: `/static/components/${name}.webp`, icon: icon() }),
    }),
  },
  ...sectionPreview({ imgUrl: `/static/components/${name}.webp`, icon: icon() }),
});
