import { defineField, defineType } from "sanity";
import { defineSlugForDocument } from "../../utils/define-slug-for-document";
import { slugify } from "@repo/utils/slugify";

const name = 'Location_Collection';
const title = 'Location Collection';
const icon = () => '📌';
const RESERVED_LOCATION_SLUGS: Record<string, string[]> = {
  pl: [
    'uslugi',
    'blog',
    'portfolio',
    'kontakt',
    'zespol',
    'regulamin',
    'polityka-prywatnosci',
    'produkty-cyfrowe',
  ],
  en: [
    'services',
    'blog',
    'portfolio',
    'contact',
    'team',
    'terms',
    'privacy-policy',
    'digital-products',
  ],
};

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
    ...defineSlugForDocument({
      slugify: async (slug, _, context) => {
        const language = (context.parent as { language: string })?.language ?? 'pl';
        return `/${language}/${slugify(slug)}`
      },
      validate: Rule => [
        Rule.custom((value, context) => {
          const language = (context.parent as { language: string })?.language ?? 'pl';
          const requiredPrefix = `/${language}/`;
          if (!value?.current?.startsWith(requiredPrefix)) {
            return `The slug should start with ${requiredPrefix}`;
          }
          if (!new RegExp(`^/${language}/[^/]+$`).test(value.current)) {
            return `The location URL must use a single top-level segment, e.g. ${requiredPrefix}warszawa`;
          }
          const rawSlug = value.current.replace(requiredPrefix, '');
          if ((RESERVED_LOCATION_SLUGS[language] || []).includes(rawSlug)) {
            return `Slug "${rawSlug}" is reserved. Pick a different location slug.`;
          }
          return true;
        }).required(),
        Rule.custom((value, context) => {
          const name = (context.parent as { name: string })?.name;
          if (!value?.current?.endsWith(slugify(name))) {
            return 'That slug doesn\'t match the name. Verify if it\'s correct.';
          }
          return true;
        }).warning()
      ],
    }),
    defineField({
      name: 'servicePage',
      type: 'reference',
      title: 'Related Service (Optional)',
      description: 'Optional relation for navigation context. URL is always top-level: /{language}/{location}.',
      to: [{ type: 'Service_Collection' }],
      options: {
        disableNew: true,
        filter: ({ document }) => {
          const language = (document as { language?: string })?.language;
          return {
            filter: 'language == $lang && coalesce(isArchived, false) != true',
            params: { lang: language }
          }
        }
      },
    }),
    defineField({
      name: 'isArchived',
      type: 'boolean',
      title: 'Archived',
      description: 'Archive this location page to hide it from active Studio lists.',
      initialValue: false,
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
      img: 'img',
    },
    prepare: ({ name, slug, img }) => ({
      title: name,
      subtitle: slug,
      media: img,
      icon,
    }),
  },
});
