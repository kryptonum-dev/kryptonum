import { defineField } from "sanity";
import { sectionPreview } from "../../../utils/section-preview";
import { toPlainText } from "../../../utils/to-plain-text";

const name = 'SimpleCenteredCtaSection';
const title = 'Simple Centered CTA Section';
const icon = () => '💬';

export default defineField({
  name: name,
  type: 'object',
  title: title,
  ...sectionPreview({ imgUrl: `/static/BlogPost_Collection/${name}.webp`, icon: icon() }),
  fields: [
    defineField({
      name: 'heading',
      type: 'Heading',
      title: 'Heading',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'ctas',
      type: 'array',
      title: 'CTAs',
      of: [
        defineField({
          name: 'cta',
          type: 'cta',
          title: 'CTA',
          validation: Rule => Rule.required(),
        })
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
