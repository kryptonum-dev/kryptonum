import { defineField, defineType } from "sanity";
import { defineSlugForDocument } from "../../utils/define-slug-for-document";

const name = 'CaseStudy_Collection';
const title = 'Case Study Collection';
const icon = () => '📂';

export default defineType({
  name: name,
  type: 'document',
  title,
  icon,
  options: { documentPreview: true },
  fields: [
    defineField({
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'name',
      type: 'string',
      title: 'Name',
      validation: Rule => Rule.required(),
    }),
    ...defineSlugForDocument({
      source: 'name',
      prefixes: {
        "pl": "/pl/portfolio/",
        "en": "/en/portfolio/"
      }
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Description',
      rows: 3,
      validation: Rule => [
        Rule.required(),
        Rule.max(150).warning('Please keep the description short, with max 150 characters.')
      ],
    }),
    defineField({
      name: 'img',
      type: 'image',
      title: 'Image',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'sector',
      type: 'string',
      title: 'Sector (optional)',
    }),
    defineField({
      name: 'client',
      type: 'string',
      title: 'Client (optional)',
    }),
    defineField({
      name: 'categories',
      type: 'array',
      title: 'Categories',
      of: [
        defineField({
          name: 'category',
          type: 'reference',
          to: [{ type: 'CaseStudyCategory_Collection' }],
          options: {
            filter: ({ parent, document }) => {
              const language = (document as { language?: string })?.language;
              const selectedIds = (parent as { _ref?: string }[])?.filter(item => item._ref).map(item => item._ref) || [];
              return {
                filter: '!(_id in $selectedIds) && !(_id in path("drafts.**")) && language == $lang',
                params: { selectedIds, lang: language }
              }
            }
          }
        }),
      ],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'date',
      type: 'date',
      title: 'Date',
      description: 'Only year will be shown',
      options: {
        dateFormat: "YYYY",
      },
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
