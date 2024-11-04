import { defineField, defineType } from "sanity";
import { defineSlugForDocument } from "../../../utils/define-slug-for-document";
import PortableText from "./portable-text";

const name = 'BlogPost_Collection';
const title = 'Blog Post Collection';
const icon = () => '📰';

export default defineType({
  name: name,
  type: 'document',
  title,
  icon,
  options: { documentPreview: true },
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      title: 'Name',
      description: 'Name will be displayed in breadcrumb and in schemas for Google',
      validation: Rule => Rule.required(),
    }),
    ...defineSlugForDocument({ source: 'name', prefix: '/pl/blog/' }),
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
      name: 'author',
      type: 'array',
      title: 'Author',
      description: 'Blog post needs to have at least one author. The first author will be displayed in the blog post. Rest of authors will be referenced in other places like in the individual team member page.',
      of: [
        defineField({
          name: 'author',
          type: 'reference',
          to: [{ type: 'TeamMember_Collection' }],
          options: {
            disableNew: true,
            filter: ({ parent }) => {
              const selectedIds = (parent as { _ref?: string }[])?.filter(item => item._ref).map(item => item._ref) || [];
              if (selectedIds.length > 0) {
                return {
                  filter: '!(_id in $selectedIds) && !(_id in path("drafts.**"))',
                  params: { selectedIds }
                }
              }
              return {}
            }
          }
        }),
      ],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'img',
      type: 'image',
      title: 'Image',
      validation: Rule => Rule.required(),
    }),
    PortableText,
    defineField({
      name: 'components',
      type: 'components',
      title: 'Page Components (optional)',
      description: 'Those components will be displayed after the content of the blog post.',
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
      media: 'img',
    },
    prepare: ({ name, slug, media }) => ({
      title: name,
      subtitle: slug,
      icon,
      media: media,
    }),
  },
});
