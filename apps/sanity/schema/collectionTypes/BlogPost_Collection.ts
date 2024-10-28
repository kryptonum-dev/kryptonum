import { defineField, defineType } from "sanity";
import { defineSlugForDocument } from "../../utils/define-slug-for-document";

const slugPrefix = '/pl/blog/';
const name = 'BlogPost_Collection';
const title = 'Blog Post Collection';
const icon = () => '📰';

export default defineType({
  name: name,
  type: 'document',
  title,
  icon,
  options: { documentPreview: true, slugPrefix: slugPrefix },
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      title: 'Name',
      description: 'Name will be displayed in breadcrumb and in schemas for Google',
      validation: Rule => Rule.required(),
    }),
    ...defineSlugForDocument({ source: 'name', slugPrefix: slugPrefix }),
    defineField({
      name: 'heading',
      type: 'Heading',
      title: 'Heading',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'category',
      type: 'reference',
      to: [{ type: 'BlogCategory_Collection' }],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'img',
      type: 'image',
      title: 'Image',
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
      subtitle: `${slugPrefix}${slug}`,
      icon,
    }),
  },
});
