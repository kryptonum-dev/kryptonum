import { defineField } from "sanity";
import { sectionPreview } from "../../../utils/section-preview";
import { toPlainText } from "../../../utils/to-plain-text";

const name = 'ListWithIcon';
const title = 'List with Icon';
const icon = () => '📄';

export default defineField({
  name: name,
  type: 'object',
  title: title,
  ...sectionPreview({ imgUrl: `/static/BlogPost_Collection/${name}.webp`, icon: icon() }),
  fields: [
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
              name: 'icon',
              type: 'image',
              title: 'Icon',
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
              title: 'Paragraph (optional)',
            }),
            defineField({
              name: 'sublist',
              type: 'array',
              title: 'Nested Items (optional)',
              of: [
                defineField({
                  name: 'item',
                  type: 'object',
                  title: 'Item',
                  fields: [
                    defineField({
                      name: 'icon',
                      type: 'image',
                      title: 'Icon',
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
                      title: 'Paragraph (optional)',
                    }),
                  ],
                  preview: {
                    select: {
                      icon: 'icon',
                      heading: 'heading',
                      paragraph: 'paragraph',
                    },
                    prepare({ icon, heading, paragraph }) {
                      return {
                        title: toPlainText(heading),
                        subtitle: toPlainText(paragraph),
                        media: icon,
                      };
                    },
                  },
                  validation: Rule => Rule.required(),
                }),
              ],
            }),
          ],
          preview: {
            select: {
              icon: 'icon',
              heading: 'heading',
              paragraph: 'paragraph',
            },
            prepare({ icon, heading, paragraph }) {
              return {
                title: toPlainText(heading),
                subtitle: toPlainText(paragraph),
                media: icon,
              };
            },
          },
          validation: Rule => Rule.required(),
        }),
      ],
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
