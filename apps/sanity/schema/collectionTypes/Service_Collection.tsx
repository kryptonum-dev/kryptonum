import { defineField, defineType } from "sanity";
import { slugify } from "@repo/utils/slugify";
import { defineSlugForDocument } from "../../utils/define-slug-for-document";
import { BriefcaseBusiness } from "lucide-react";

const name = 'Service_Collection';
const title = 'Service Collection';
const icon = BriefcaseBusiness;

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
        return `/${language}/uslugi/${slugify(slug)}`
      },
      validate: Rule => [
        Rule.custom(async (value, context) => {
          const language = (context.parent as { language: string })?.language ?? 'pl';
          const requiredPrefix = `/${language}/uslugi/`;
          if (!value?.current?.startsWith(requiredPrefix)) {
            return `The slug should start with ${requiredPrefix}`;
          }
          return true;
        }).required(),
        Rule.custom((value, context) => {
          const name = (context.parent as { name: string })?.name;
          if (!value?.current?.includes(slugify(name))) {
            return 'That slug doesn\'t match the name. Verify if it\'s correct.';
          }
          return true;
        }).warning(),
      ]
    }),
    defineField({
      name: 'icon',
      type: 'image',
      title: 'Icon',
      description: 'Icon is used to identify the service. It will be used in Footer. It have to be an SVG.',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'img',
      type: 'image',
      title: 'Featured Image',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Short Description',
      description: 'Short description shown in header dropdown (e.g., "Strony, które prowadzą do decyzji i generują leady.")',
      rows: 2,
      validation: Rule => Rule.max(120).warning('Keep it under 120 characters for best display'),
    }),
    defineField({
      name: 'isArchived',
      type: 'boolean',
      title: 'Archived',
      description: 'Archive this service to hide it from active Studio lists.',
      initialValue: false,
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
