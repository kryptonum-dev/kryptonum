import { defineField } from "sanity";
import { sectionPreview } from "../../../utils/section-preview";
import { toPlainText } from "../../../utils/to-plain-text";

const name = 'Author';
const title = 'Author';
const icon = () => '👤';

export default defineField({
  name: name,
  type: 'object',
  title: title,
  ...sectionPreview({ imgUrl: `/static/BlogPost_Collection/${name}.webp`, icon: icon() }),
  fields: [
    defineField({
      name: 'person',
      type: 'reference',
      to: [{ type: 'TeamMember_Collection' }],
      options: {
        disableNew: true,
      },
      title: 'Person',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'text',
      type: 'PortableText',
      title: 'Text',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'cta',
      type: 'cta',
      title: 'Call To Action (optional)',
    }),
  ],
  preview: {
    select: {
      media: 'person.img',
      person: 'person.name',
      text: 'text',
    },
    prepare({ person, text, media }) {
      return {
        title: person,
        subtitle: toPlainText(text),
        media: media,
      };
    },
  },
});
