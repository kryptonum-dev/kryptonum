import { defineField } from "sanity";
import { sectionPreview } from "../../../utils/section-preview";
import { toPlainText } from "../../../utils/to-plain-text";

const name = 'NumberedStepsList';
const title = 'Numbered Steps List';
const icon = () => '🔢';

export default defineField({
  name: name,
  type: 'object',
  title: title,
  ...sectionPreview({ imgUrl: `/static/BlogPost_Collection/${name}.webp`, icon: icon() }),
  fields: [
    defineField({
      name: 'paragraph',
      type: 'PortableText',
      title: 'Paragraph',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'list',
      type: 'array',
      title: 'List',
      of: [
        defineField({
          name: 'item',
          type: 'object',
          title: 'Item',
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
              title: 'Paragraph (optional)',
            }),
          ],
          validation: Rule => Rule.required(),
          preview: {
            select: {
              heading: 'heading',
              paragraph: 'paragraph',
            },
            prepare({ heading, paragraph }) {
              return {
                title: toPlainText(heading),
                subtitle: toPlainText(paragraph),
              };
            },
          },
        }),
      ],
      validation: Rule => Rule.required().min(2)
    }),
  ],
  preview: {
    select: {
      heading: 'heading',
    },
    prepare({ heading }) {
      return {
        title: title,
        subtitle: toPlainText(heading),
      };
    },
  },
});
