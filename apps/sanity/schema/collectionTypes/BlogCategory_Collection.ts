import { defineField, defineType } from "sanity";
import { defineSlugForDocument } from "../../utils/define-slug-for-document";

const name = 'BlogCategory_Collection';
const title = 'Blog Category Collection';
const icon = () => '🔖';

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
      name: 'name',
      type: 'string',
      title: 'Name',
      validation: Rule => Rule.required(),
    }),
    ...defineSlugForDocument({
      source: 'name',
      prefixes: {
        "pl": "/pl/blog/kategoria/",
        "en": "/en/blog/category/"
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
