import { defineField, defineType } from "sanity";
import { toPlainText } from "../../utils/to-plain-text";

const name = 'Faq_Collection';
const title = 'FAQ items Collection';
const icon = () => '❓';

export default defineType({
  name: name,
  type: 'document',
  title,
  icon,
  fields: [
    defineField({
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
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
      title: 'question',
      subtitle: 'answer',
    },
    prepare: ({ title, subtitle }) => ({
      title: toPlainText(title),
      subtitle: toPlainText(subtitle),
      icon,
    }),
  },
});
