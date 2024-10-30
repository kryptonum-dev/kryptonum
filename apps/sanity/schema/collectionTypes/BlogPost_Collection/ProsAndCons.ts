import { defineField } from "sanity";
import { sectionPreview } from "../../../utils/section-preview";

const name = 'ProsAndCons';
const title = 'Pros and Cons';
const icon = () => '⚖️';

export default defineField({
  name: name,
  type: 'object',
  title: title,
  ...sectionPreview({ imgUrl: `/static/BlogPost_Collection/${name}.webp`, icon: icon() }),
  fields: [
    defineField({
      name: 'pros',
      type: 'object',
      title: 'Pros',
      fields: [
        defineField({
          name: 'heading',
          type: 'Heading',
          title: 'Heading',
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: 'items',
          type: 'array',
          title: 'Items',
          of: [
            defineField({
              name: 'item',
              type: 'text',
              rows: 2,
              validation: Rule => Rule.required(),
            }),
          ],
          validation: Rule => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'cons',
      type: 'object',
      title: 'Cons',
      fields: [
        defineField({
          name: 'heading',
          type: 'Heading',
          title: 'Heading',
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: 'items',
          type: 'array',
          title: 'Items',
          of: [
            defineField({
              name: 'item',
              type: 'text',
              rows: 2,
              validation: Rule => Rule.required(),
            }),
          ],
          validation: Rule => Rule.required(),
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
