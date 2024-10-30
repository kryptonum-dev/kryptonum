import { defineField } from "sanity";
import { sectionPreview } from "../../../utils/section-preview";
import { toPlainText } from "../../../utils/to-plain-text";

const name = 'DoAndDonts';
const title = "Do's and Don'ts";
const icon = () => '💡';

export default defineField({
  name: name,
  type: 'object',
  title: title,
  ...sectionPreview({ imgUrl: `/static/BlogPost_Collection/${name}.webp`, icon: icon() }),
  fields: [
    defineField({
      name: 'elements',
      type: 'array',
      title: 'Elements',
      of: [
        defineField({
          name: 'item',
          type: 'object',
          title: 'Item',
          fields: [
            defineField({
              name: 'isDo',
              type: 'boolean',
              title: 'Is Do?',
              initialValue: true,
              description: 'If that is true, the item will be displayed as a "Do" element (green tick), otherwise as a "Don\'t" element (red cross).',
              validation: Rule => Rule.required(),
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
          ],
          validation: Rule => Rule.required(),
          preview: {
            select: {
              isDo: 'isDo',
              heading: 'heading',
              paragraph: 'paragraph',
            },
            prepare({ isDo, heading, paragraph }) {
              return {
                title: toPlainText(heading),
                subtitle: toPlainText(paragraph),
                icon: () => isDo ? '🟢' : '🔴',
              };
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: title,
      };
    },
  },
});
