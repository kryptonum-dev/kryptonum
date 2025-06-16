import { defineField } from 'sanity';
import sectionId from '../ui/sectionId';
import { toPlainText } from '../../utils/to-plain-text';
import { sectionPreview } from '../../utils/section-preview';

const name = 'UpsellPathway';
const title = 'Upsell Pathway';
const icon = () => '🛤️';

export default defineField({
  name,
  type: 'object',
  title,
  icon,
  fields: [
    defineField({
      name: 'heading',
      type: 'Heading',
      title: 'Heading',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'groupsHeading',
      type: 'Heading',
      title: 'Groups Heading',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'groups',
      type: 'array',
      title: 'Groups',
      of: [
        defineField({
          name: 'group',
          type: 'object',
          title: 'Group',
          fields: [
            defineField({
              name: 'groupName',
              type: 'string',
              title: 'Group Name',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'advantages',
              type: 'object',
              title: 'Advantages',
              fields: [
                defineField({
                  name: 'text',
                  type: 'PortableText',
                  title: 'Text',
                  validation: Rule => Rule.required(),
                }),
                defineField({
                  name: 'items',
                  type: 'array',
                  title: 'Items',
                  of: [
                    defineField({
                      name: 'item',
                      type: 'text',
                      title: 'Item',
                      rows: 2,
                      validation: Rule => Rule.required(),
                    }),
                  ],
                  validation: Rule => Rule.required(),
                }),
              ],
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'disadvantages',
              type: 'object',
              title: 'Disadvantages',
              fields: [
                defineField({
                  name: 'text',
                  type: 'PortableText',
                  title: 'Text',
                  validation: Rule => Rule.required(),
                }),
                defineField({
                  name: 'items',
                  type: 'array',
                  title: 'Items',
                  of: [
                    defineField({
                      name: 'item',
                      type: 'text',
                      title: 'Item',
                      rows: 2,
                      validation: Rule => Rule.required(),
                    }),
                  ],
                  validation: Rule => Rule.required(),
                }),
              ],
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'pathway',
              type: 'object',
              title: 'Pathway',
              fields: [
                defineField({
                  name: 'heading',
                  type: 'string',
                  title: 'Heading',
                  validation: Rule => Rule.required(),
                }),
                defineField({
                  name: 'items',
                  type: 'array',
                  title: 'Items',
                  of: [
                    defineField({
                      name: 'item',
                      type: 'object',
                      title: 'Item',
                      fields: [
                        defineField({
                          name: 'reference',
                          type: 'reference',
                          title: 'Reference',
                          to: [
                            {
                              type: 'ShopProduct_Collection',
                            },
                          ],
                          options: {
                            disableNew: true,
                            filter: ({ document }) => {
                              const language = (document as { language?: 'pl' | 'en' })?.language;
                              return {
                                filter: 'language == $lang',
                                params: { lang: language }
                              }
                            }
                          },
                          validation: Rule => Rule.required(),
                        }),
                        defineField({
                          name: 'heading',
                          type: 'Heading',
                          title: 'Heading',
                          validation: Rule => Rule.required(),
                        }),
                        defineField({
                          name: 'text',
                          type: 'PortableText',
                          title: 'Text',
                          validation: Rule => Rule.required(),
                        }),
                      ],
                      preview: {
                        select: {
                          heading: 'heading',
                          text: 'text',
                        },
                        prepare: ({ heading, text }) => ({
                          title: toPlainText(heading),
                          subtitle: toPlainText(text),
                        }),
                      },
                    }),
                  ],
                  validation: Rule => Rule.required().min(1),
                }),
                defineField({
                  name: 'ctaHeading',
                  type: 'string',
                  title: 'CTA Heading',
                  validation: Rule => Rule.required(),
                }),
                defineField({
                  name: 'price',
                  type: 'string',
                  title: 'Price',
                  validation: Rule => Rule.required(),
                  fieldset: 'price',
                }),
                defineField({
                  name: 'oldPrice',
                  type: 'string',
                  title: 'Old Price (optional)',
                  fieldset: 'price',
                }),
                defineField({
                  name: 'saleTag',
                  type: 'string',
                  title: 'Sale Tag',
                  validation: Rule => Rule.required(),
                }),
                defineField({
                  name: 'cta',
                  type: 'cta',
                  title: 'Call to Action',
                  validation: Rule => Rule.required(),
                  options: {
                    collapsible: false,
                  },
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
          ],
          preview: {
            select: {
              groupName: 'groupName',
              advantagesText: 'advantages.text',
              pathwayHeading: 'pathway.heading',
            },
            prepare: ({ groupName, advantagesText, pathwayHeading }) => ({
              title: groupName,
              subtitle: `${toPlainText(advantagesText)} | ${toPlainText(pathwayHeading)}`,
            }),
          },
        }),
      ],
      validation: Rule => Rule.required().min(1),
    }),
    ...sectionId,
  ],
  preview: {
    select: {
      heading: 'heading',
      groups: 'groups',
    },
    prepare: ({ heading, groups = [] }) => ({
      title: `${title} (${groups.length} groups)`,
      subtitle: toPlainText(heading),
      ...sectionPreview({ imgUrl: `/static/components/${name}.webp`, icon: icon() }),
    }),
  },
});
