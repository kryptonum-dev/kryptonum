import { defineField, defineType } from "sanity";
import { toPlainText } from "../../utils/to-plain-text";

const title = 'Zbiór elementów FAQ';
const icon = () => '❓';

export default defineType({
  name: 'Faq_Collection',
  type: 'document',
  title,
  icon,
  fields: [
    defineField({
      name: 'question',
      type: 'Heading',
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
