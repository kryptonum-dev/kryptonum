import { defineField, defineType } from "sanity";
import { defineSlugForDocument } from "../../utils/define-slug-for-document";
import { InternalLinkableTypes } from "../../structure/internal-linkable-types";
import { isValidUrl } from "../../utils/is-valid-url";

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
    defineField({
      name: 'content',
      type: 'array',
      title: 'Content',
      of: [
        defineField({
          type: 'block',
          name: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            {
              title: 'Heading 2',
              value: 'h2',
              component: ({ children }) => <h3 style={{ fontSize: '1.75rem', fontWeight: 400, margin: 0 }}>{children}</h3>
            },
            {
              title: 'Heading 3',
              value: 'h3',
              component: ({ children }) => <h3 style={{ fontSize: '1.375rem', fontWeight: 400, margin: 0 }}>{children}</h3>
            }
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' }
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong', component: ({ children }) => <strong style={{ fontWeight: 700 }}>{children}</strong> },
              { title: 'Emphasis', value: 'em' }
            ],
            annotations: [
              defineField({
                name: 'link',
                type: 'object',
                title: 'Link',
                icon: () => '🔗',
                fields: [
                  defineField({
                    name: 'linkType',
                    type: 'string',
                    title: 'Type',
                    description: 'Choose "External" for links to websites outside your domain, or "Internal" for links to pages within your site.',
                    options: {
                      list: ['external', 'internal'],
                      layout: 'radio',
                      direction: 'horizontal',
                    },
                    initialValue: 'external',
                  }),
                  defineField({
                    name: 'external',
                    type: 'string',
                    title: 'URL',
                    description: 'Specify the full URL. Ensure it starts with "https://", "mailto:" or "tel:" protocol.',
                    hidden: ({ parent }) => parent?.linkType !== 'external',
                    validation: (Rule) => [
                      Rule.custom((value, { parent }) => {
                        const linkType = (parent as { linkType?: string })?.linkType;
                        if (linkType === 'external') {
                          if (!value) return "URL is required";
                          if (!value.startsWith('https://') && !value.startsWith('mailto:') && !value.startsWith('tel:')) {
                            return 'External link must start with the "https://", "mailto:" or "tel:" protocol';
                          }
                          if (!isValidUrl(value)) return 'Invalid URL';
                        }
                        return true;
                      }),
                    ],
                  }),
                  defineField({
                    name: 'internal',
                    type: 'reference',
                    title: 'Internal reference to page',
                    description: 'Select an internal page to link to.',
                    to: InternalLinkableTypes,
                    options: {
                      disableNew: true,
                      filter: 'defined(slug.current)',
                    },
                    hidden: ({ parent }) => parent?.linkType !== 'internal',
                    validation: (rule) => [
                      rule.custom((value, { parent }) => {
                        const linkType = (parent as { linkType?: string })?.linkType;
                        if (linkType === 'internal' && !value?._ref) return "You have to choose internal page to link to.";
                        return true;
                      }),
                    ],
                  }),
                ]
              }),
            ]
          }
        }),
        defineField({
          name: 'image',
          type: 'image',
          title: 'Image',
          icon: () => '🖼️',
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: 'video',
          type: 'mux.video',
          title: 'Video',
          icon: () => '🎥',
          validation: Rule => Rule.required(),
        }),
      ],
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
      subtitle: `${slugPrefix}${slug}`,
      icon,
      media: media,
    }),
  },
});
