import { defineField } from "sanity";
import { slugify } from "./slugify";
import { isUniqueSlug } from "./is-unique-slug";

export const defineSlugForDocument = ({ prefix = '', slug }: { prefix?: string, slug?: string }) => [
  defineField({
    name: 'title',
    type: 'string',
    title: 'Title',
    description: 'The title of the document, used for display in the Breadcrumbs.',
    validation: Rule => Rule.required(),
  }),
  defineField({
    name: 'slug',
    type: 'slug',
    title: `Slug`,
    description: (
      <>
        Slug is a unique identifier for the document, used for SEO and links.
        {slug && <> <strong><em>That slug can&apos;t be changed.</em></strong></>}
        {prefix && <> The slug should start with a prefix: <strong>{prefix}</strong></>}
      </>
    ),
    ...!!slug && {
      initialValue: { current: slug },
      readOnly: true,
    },
    options: {
      source: 'title',
      slugify: (slug: string) => `${prefix || '/'}${slugify(slug)}`,
      isUnique: isUniqueSlug,
    },
    validation: (Rule) =>
      Rule.required().custom((value) => {
        if (prefix && value?.current && !value.current.startsWith(prefix)) {
          return `Slug should start with ${prefix}`;
        }
        return true;
      })
  }),
]
