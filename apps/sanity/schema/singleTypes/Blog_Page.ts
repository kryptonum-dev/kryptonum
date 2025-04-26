import { defineField, defineType } from "sanity"
import { defineSlugForDocument } from "../../utils/define-slug-for-document";
import { languageLabel } from "../../utils/language-label";

const name = 'Blog_Page';
const title = 'Blog';
const icon = () => '📰'

export default defineType({
  name: name,
  type: 'document',
  title: title,
  icon: icon,
  options: { documentPreview: true },
  fields: [
    defineField({
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
    ...defineSlugForDocument({
      predefinedSlugs: {
        pl: '/pl/blog',
        en: '/en/blog'
      }
    }),
    defineField({
      name: 'heading',
      type: 'Heading',
      title: 'Heading',
      description: 'In that page the H1 tag will not be visible, so you can use this field to define the main heading of the page.',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'listing',
      type: 'object',
      title: 'Listing',
      fields: [
        defineField({
          name: 'heading',
          type: 'Heading',
          title: 'Heading',
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
    select: {
      language: 'language',
    },
    prepare: ({ language }) => ({
      title: title,
      subtitle: languageLabel(language),
    })
  }
});
