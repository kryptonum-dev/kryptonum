import { defineField, defineType } from "sanity";
import { defineSlugForDocument } from "../../utils/define-slug-for-document";

const name = 'CaseStudyCategory_Collection';
const title = 'Case Study Category Collection';
const icon = () => '📂';

export default defineType({
  name: name,
  type: 'document',
  title,
  icon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      title: 'Name',
      validation: Rule => Rule.required(),
    }),
    ...defineSlugForDocument({ source: 'name', prefix: '/pl/portfolio/kategoria/' }),
    defineField({
      name: 'hero',
      type: 'object',
      title: 'Hero',
      description: 'That will be displayed on the top of the page of each case study category',
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
    select: {
      name: 'name',
      slug: 'slug.current',
    },
    prepare: ({ name, slug }) => ({
      title: name,
      subtitle: slug,
      icon,
    }),
  },
});
