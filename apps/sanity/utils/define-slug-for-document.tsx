import { defineField } from "sanity";
import { slugify } from "@repo/utils/slugify";
import { isUniqueSlug } from "./is-unique-slug";

const isProduction = process.env.NODE_ENV === 'production' ?? true;

export const defineSlugForDocument = ({ source, prefix = '' }: { source?: string, prefix?: string }) => [
  ...(source ? [] : [
    defineField({
      name: 'name',
      type: 'string',
      title: 'Name',
      description: 'The name of the document, used for display in the Breadcrumbs.',
      validation: Rule => Rule.required(),
    }),
  ]),
  defineField({
    name: 'slug',
    type: 'slug',
    title: `Slug`,
    description: (
      <>
        Slug is a unique identifier for the document, used for SEO and links.
        {isProduction && <> <strong><em>That slug can&apos;t be changed.</em></strong></>}
        {prefix && <> The slug should start with a prefix: <strong>{prefix}</strong></>}
      </>
    ),
    readOnly: isProduction,
    options: {
      source: source || 'title',
      slugify: (slug: string) => `${prefix || '/'}${slugify(slug)}`,
      isUnique: isUniqueSlug,
    },
    validation: Rule => Rule.custom((value) => {
      if (prefix && value?.current && !value.current.startsWith(prefix)) {
        return `Slug should start with ${prefix}`;
      }
      const currentPrefix = prefix || (value?.current?.startsWith('/pl/') ? '/pl/' : '/en/');
      if (value?.current && value.current.replace(currentPrefix, '') !== slugify(value.current.replace(currentPrefix, ''))) {
        return 'There is a typo in the slug. Remember that slug can contain only lowercase letters, numbers and dashes.';
      }
      return true;
    }).required()
  }),
]
