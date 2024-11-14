import { defineField, defineType } from "sanity"
import { defineSlugForDocument } from "../../utils/define-slug-for-document";

const name = 'Portfolio_Page';
const title = 'Portfolio';
const slug = '/pl/portfolio';
const icon = () => '🏆'

export default defineType({
  name: name,
  type: 'document',
  title: title,
  icon: icon,
  options: { documentPreview: true },
  fields: [
    ...defineSlugForDocument({ slug: slug }),
    defineField({
      name: 'hero',
      type: 'object',
      title: 'Hero',
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
          title: 'Paragraph',
          validation: Rule => Rule.required(),
        }),
      ],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'components',
      type: 'components',
      title: 'Page Components',
    }),
    defineField({
      name: 'seo',
      type: 'seo',
      title: 'SEO',
      group: 'seo',
    }),
  ],
  groups: [
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
  preview: {
    prepare: () => ({
      title: title,
      subtitle: slug
    })
  }
});
