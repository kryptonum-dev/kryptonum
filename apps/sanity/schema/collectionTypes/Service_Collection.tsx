import { defineField, defineType } from "sanity";
import { isUniqueSlug } from "../../utils/is-unique-slug";
import { slugify } from "../../utils/slugify";

const name = 'Service_Collection';
const title = 'Service Collection';
const icon = () => '💼';

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
          const hasMainPage = (context.parent as { hasMainPage: boolean })?.hasMainPage;
          const mainPageRef = (context.parent as { mainPage: { _ref: string } })?.mainPage?._ref;
          if (hasMainPage && mainPageRef) {
            const client = context.getClient({ apiVersion: '2024-11-12' })
            const mainPageSlug = await client.fetch(`*[_id == $ref][0].slug.current`, { ref: mainPageRef })
            return `${mainPageSlug}/${slugify(slug)}`
          }
          return `/pl/${slugify(slug)}`
        },
        isUnique: isUniqueSlug,
      },
      validation: Rule => [
        Rule.custom(async (value, context) => {
          const hasMainPage = (context.parent as { hasMainPage: boolean })?.hasMainPage;
          const mainPageRef = (context.parent as { mainPage: { _ref: string } })?.mainPage?._ref;
          if (hasMainPage && mainPageRef) {
            const client = context.getClient({ apiVersion: '2024-11-12' })
            const mainPageSlug = await client.fetch(`*[_id == $ref][0].slug.current`, { ref: mainPageRef })
            if (!value?.current?.startsWith(mainPageSlug)) return 'Slug should start with the slug of the main page.';
            return true;
          }
          if (!value?.current?.startsWith('/pl/')) return 'The slug should start with /pl/';
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
      name: 'hasMainPage',
      type: 'boolean',
      title: 'Has main page?',
      description: 'Tick that if this page has a main page.',
      validation: Rule => Rule.required(),
      initialValue: false,
    }),
    defineField({
      name: 'mainPage',
      type: 'reference',
      title: 'Main page',
      description: 'Add main page for that service page. If selected, then it will be automatically structured as subpage.',
      to: [{ type: 'Service_Collection' }],
      options: {
        disableNew: true,
      },
      hidden: ({ parent }) => !parent?.hasMainPage,
      validation: Rule => Rule.custom((value, context) => {
        const hasMainPage = (context.parent as { hasMainPage: boolean })?.hasMainPage;
        if (hasMainPage && !value) return 'Main page is required.';
        return true;
      }),
    }),
    defineField({
      name: 'icon',
      type: 'image',
      title: 'Icon',
      description: 'Icon is used to identify the service. It will be used in Footer. It have to be an SVG.',
      hidden: ({ parent }) => parent?.hasMainPage,
      validation: Rule => Rule.custom((value, context) => {
        const hasMainPage = (context.parent as { hasMainPage: boolean })?.hasMainPage;
        if (!hasMainPage && !value) return 'Icon is required.';
        return true;
      }),
    }),
    defineField({
      name: 'img',
      type: 'image',
      title: 'Featured Image',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'components',
      type: 'components',
      title: 'Page Components',
    }),
    defineField({
      name: 'servicesNav',
      type: 'object',
      title: 'Services Navigation',
      fields: [
        defineField({
          name: 'heading',
          type: 'Heading',
          title: 'Heading',
          validation: Rule => Rule.required(),
        }),
      ],
      initialValue: {
        "heading": [
          {
            "_key": "8a96c5a61792",
            "children": [
              {
                "_key": "72e2454f7822",
                "_type": "span",
                "marks": [],
                "text": "❧ Inni ludzie sprawdzali też "
              },
              {
                "_type": "span",
                "marks": [
                  "strong"
                ],
                "_key": "ddd311511421",
                "text": "te usługi"
              }
            ],
            "markDefs": [],
            "_type": "block",
            "style": "normal"
          }
        ]
      },
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
