import { defineField, defineType } from "sanity";
import { isUniqueSlug } from "../../utils/is-unique-slug";
import { slugify } from "@repo/utils/slugify";

const name = 'Location_Collection';
const title = 'Location Collection';
const icon = () => '📌';

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
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: `Slug`,
      description: 'Slug is a unique identifier for the document, used for SEO and links.',
      options: {
        source: 'name',
        slugify: async (slug: string, _, context) => {
          const servicePageRef = (context.parent as { servicePage: { _ref: string } })?.servicePage?._ref;
          if (servicePageRef) {
            const client = context.getClient({ apiVersion: '2024-11-12' })
            const servicePageSlug = await client.fetch(`*[_id == $ref][0].slug.current`, { ref: servicePageRef })
            return `${servicePageSlug}/${slugify(slug)}`
          }
          return `/pl/${slugify(slug)}`
        },
        isUnique: isUniqueSlug,
      },
      validation: Rule => [
        Rule.custom(async (value, context) => {
          const servicePageRef = (context.parent as { servicePage: { _ref: string } })?.servicePage?._ref;
          if (!servicePageRef) return 'The service page is required for Location Page.';
          const client = context.getClient({ apiVersion: '2024-11-12' })
          const servicePageSlug = await client.fetch(`*[_id == $ref][0].slug.current`, { ref: servicePageRef })
          if (!value?.current?.startsWith(servicePageSlug)) return 'Slug should start with the slug of the service page.';
          return true;
        }).required(),
        Rule.custom((value, context) => {
          const name = (context.parent as { name: string })?.name;
          if (!value?.current?.includes(slugify(name))) return 'That slug doesn\'t match the name. Verify if it\'s correct.';
          return true;
        }).warning(),
      ]
    }),
    defineField({
      name: 'servicePage',
      type: 'reference',
      title: 'Reference to a Service Page',
      description: 'A location page always have to be a direct subpage of a service page.',
      to: [{ type: 'Service_Collection' }],
      options: {
        disableNew: true,
      },
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
    prepare: ({ name, slug, img, }) => ({
      title: name,
      subtitle: slug,
      media: img,
      icon,
    }),
  },
});
