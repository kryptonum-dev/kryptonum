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
      name: 'question',
      type: 'text',
      rows: 2,
      title: 'Pytanie',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'answer',
      type: 'PortableText',
      title: 'Odpowiedź',
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
