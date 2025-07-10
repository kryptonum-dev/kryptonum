import { defineField, defineType } from "sanity";
import { defineSlugForDocument } from "../../utils/define-slug-for-document";

const name = 'ShopProduct_Collection';
const title = 'Shop Product Collection';
const icon = () => '📖'

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
    ...defineSlugForDocument({ prefixes: { en: '/en/', pl: '/pl/' } }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 5,
      title: 'Description',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'thumbnail',
      type: 'image',
      title: 'Thumbnail',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'analytics',
      type: 'object',
      title: 'Analytics',
      fields: [
        defineField({
          name: 'product_id',
          type: 'string',
          title: 'Product ID',
          description: 'The Stripe product ID. You can find that in Product catalog -> Choose product -> Product details -> Product ID on the right side „Details”',
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: 'price',
          type: 'number',
          title: 'Price',
          description: 'Price should be a full number, without currency symbol or decimal points.',
          validation: Rule => Rule.required(),
          fieldset: 'price',
        }),
        defineField({
          name: 'currency',
          type: 'string',
          title: 'Currency',
          description: 'Currency should be a 3-letter code, like: "USD", "EUR", "PLN"',
          validation: Rule => Rule.required(),
          fieldset: 'price',
        }),
      ],
      fieldsets: [
        {
          name: 'price',
          title: 'Price',
          options: {
            columns: 2,
          },
        },
      ],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'purchase_url',
      type: 'url',
      title: 'Purchase URL',
      validation: Rule => Rule.required().uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'rating',
      type: 'object',
      title: 'Rating',
      fields: [
        defineField({
          name: 'rating',
          type: 'number',
          title: 'Rating (1.0 - 5.0)',
          validation: Rule => Rule.required().max(5).min(1),
        }),
        defineField({
          name: 'text',
          type: 'string',
          title: 'Rating text',
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: 'avatars',
          type: 'array',
          title: 'Avatars',
          options: {
            layout: 'grid',
          },
          of: [
            defineField({
              name: 'avatar',
              type: 'image',
              title: 'Avatar',
            }),
          ],
          validation: Rule => Rule.required().max(3),
        }),
        defineField({
          name: 'download_count',
          type: 'string',
          title: 'Download count',
          description: 'Just a number, no unit. It will be displayed as "X downloads", where X is the value that you will provide. Recommended to use number with + sign, like: „500+"',
          validation: Rule => Rule.required(),
        }),
      ],
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
      img: 'img',
    },
    prepare: ({ name, img, }) => ({
      title: name,
      media: img,
      icon,
    }),
  },
});
