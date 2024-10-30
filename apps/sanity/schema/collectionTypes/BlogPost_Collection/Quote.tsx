import { defineField } from "sanity";
import { sectionPreview } from "../../../utils/section-preview";
import { toPlainText } from "../../../utils/to-plain-text";

const name = 'Quote';
const title = 'Quote';
const icon = () => '💬';

export default defineField({
  name: name,
  type: 'object',
  title: title,
  ...sectionPreview({ imgUrl: `/static/BlogPost_Collection/${name}.webp`, icon: icon() }),
  fields: [
    defineField({
      name: 'text',
      type: 'PortableText',
      title: 'Text',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'person',
      type: 'object',
      title: 'Person',
      fields: [
        defineField({
          name: 'img',
          type: 'image',
          title: 'Image (optional)',
        }),
        defineField({
          name: 'name',
          type: 'string',
          title: 'Name',
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: 'headline',
          type: 'string',
          title: 'Headline (optional)',
        }),
      ],
      preview: {
        select: {
          name: 'name',
          headline: 'headline',
          media: 'img',
        },
        prepare({ name, headline, media }) {
          return {
            title: name,
            subtitle: headline,
            media: media,
          };
        },
      },
    }),
  ],
  preview: {
    select: {
      text: 'text',
    },
    prepare({ text }) {
      return {
        title: title,
        subtitle: toPlainText(text),
      };
    },
  },
});
