import { defineField, defineType } from "sanity";
import { defineSlugForDocument } from "../../utils/define-slug-for-document";

const slugPrefix = '/pl/blog/kategoria/';
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
      name: 'name',
      type: 'string',
      title: 'Name',
      validation: Rule => Rule.required(),
    }),
    ...defineSlugForDocument({ source: 'name', slugPrefix: slugPrefix }),
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
      subtitle: `${slugPrefix}${slug}`,
      icon,
    }),
  },
});
