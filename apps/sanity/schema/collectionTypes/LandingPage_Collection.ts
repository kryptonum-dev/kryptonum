import { defineField, defineType } from "sanity";
import { defineSlugForDocument } from "../../utils/define-slug-for-document";
import { slugify } from "@repo/utils/slugify";

const name = 'LandingPage_Collection';
const title = 'Landing Page Collection';
const icon = () => '📄'

export default defineType({
  name: name,
  type: 'document',
  title,
  icon,
  fields: [
    defineField({
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
    ...defineSlugForDocument({
      slugify: (slug, _, context) => {
        const language = (context.parent as { language: string })?.language ?? 'pl';
        const currentPrefix = language === 'pl' ? '/pl/' : '/en/';
        return `${currentPrefix}${slugify(slug)}`;
      },
      validate: Rule => [
        Rule.custom(async (value, context) => {
          if (!value?.current) return true;

          // Prevent index paths
          if (value.current === '/pl' || value.current === '/en') {
            return 'Landing page slug cannot be the same as language index pages (/pl or /en)';
          }

          // Standard prefix validation
          const language = (context.parent as { language: string })?.language ?? 'pl';
          const currentPrefix = language === 'pl' ? '/pl/' : '/en/';
          if (!value.current.startsWith(currentPrefix)) {
            return `Slug should start with ${currentPrefix}`;
          }

          return true;
        }).required()
      ]
    }),
    defineField({
      name: 'nav',
      type: 'object',
      fields: [
        defineField({
          name: 'links',
          type: 'array',
          title: 'Navigation Links',
          description: 'Add section IDs for the navigation menu (max 5). Do not include the # symbol.',
          of: [
            defineField({
              type: 'object',
              name: 'link',
              fields: [
                defineField({
                  name: 'text',
                  type: 'string',
                  title: 'Display Text',
                  validation: Rule => Rule.required()
                }),
                defineField({
                  name: 'href',
                  type: 'string',
                  title: 'Section ID',
                  description: 'The ID of the section to link to (without the # symbol)',
                  validation: Rule => Rule.required().custom((href, context) => {
                    if (!href) return true;

                    const components = context.document?.components;
                    if (!components) return true;

                    const sectionIds = new Set();
                    const findSectionIds = (comp: any) => {
                      if (!comp) return;
                      if (comp.sectionId) {
                        sectionIds.add(comp.sectionId);
                      }
                      if (Array.isArray(comp)) {
                        comp.forEach(item => findSectionIds(item));
                        return;
                      }
                      Object.keys(comp).forEach(key => {
                        const value = comp[key];
                        if (typeof value === 'object' && value !== null) {
                          findSectionIds(value);
                        }
                      });
                    };
                    findSectionIds(components);

                    if (!sectionIds.has(href)) {
                      return `Section ID "${href}" doesn't exist on the page. Please add this section ID to your page components or use a valid existing section ID.`;
                    }

                    return true;
                  })
                })
              ]
            })
          ],
          validation: Rule => Rule.max(5)
        }),
        defineField({
          name: 'cta',
          type: 'cta',
          title: 'Call To Action Button',
          validation: Rule => Rule.required(),
        }),
      ],
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
    },
    prepare: ({ name }) => ({
      title: name,
      icon,
    }),
  },
});
