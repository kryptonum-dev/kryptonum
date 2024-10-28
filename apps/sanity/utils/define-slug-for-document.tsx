import { defineField } from "sanity";
import { slugify } from "./slugify";

export const defineSlugForDocument = ({ source, slugPrefix = '', slug }: { source?: string, slugPrefix?: string, slug?: string }) => [
  ...(source ? [] : [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      description: 'The title of the document, used for display in the Breadcrumbs.',
      validation: Rule => Rule.required(),
    }),
  ]),
  defineField({
    name: 'slug',
    type: 'slug',
    title: 'Slug',
    description: (
      <>
        Slug is a unique identifier for the document, used for SEO and links.
        {slug && <> <strong><em>That slug can&apos;t be changed.</em></strong></>}
        {slugPrefix && <> The slug will be prefixed with: <strong>{slugPrefix}</strong></>}
      </>
    ),
    ...!!slug && {
      initialValue: { current: slug },
      readOnly: true,
    },
    options: {
      source: source || 'title',
      slugify: (slug: string) => slugify(slug),
    },
    validation: Rule => Rule.custom(value => {
      if (value?.current && value.current !== slugify(value.current)) {
        return 'There is a typo in the slug. Remember that slug can contain only lowercase letters, numbers and dashes.';
      }
      return true;
    }).required(),
  }),
]
