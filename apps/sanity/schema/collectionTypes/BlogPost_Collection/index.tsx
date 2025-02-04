import { defineField, defineType } from "sanity";
import { defineSlugForDocument } from "../../../utils/define-slug-for-document";
import PortableText from "./portable-text";
import { Stack, Card, Text } from "@sanity/ui";

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
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'name',
      type: 'string',
      title: 'Name',
      description: 'Name will be displayed in breadcrumb and in schemas for Google',
      validation: Rule => Rule.required(),
    }),
    ...defineSlugForDocument({
      source: 'name',
      prefixes: {
        pl: '/pl/blog/',
        en: '/en/blog/'
      }
    }),
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
      options: {
        filter: ({ document }) => {
          const language = (document as { language?: string })?.language;
          return {
            filter: 'language == $language',
            params: { language: language }
          }
        }
      },
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
    defineField({
      name: 'publishedDate',
      type: 'datetime',
      title: 'Publication Date (optional)',
      description: (
        <Stack space={3}>
          <Card tone="caution" padding={4} border radius={2}>
            <Stack space={3}>
              <Text weight="semibold">ℹ️ Publication Date Override</Text>
              <Text size={1}>
                This field allows you to override the default publication date (_createdAt). Only use this for migrated or historical content where you need to preserve the original publication date.
              </Text>
            </Stack>
          </Card>
        </Stack>
      ),
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
