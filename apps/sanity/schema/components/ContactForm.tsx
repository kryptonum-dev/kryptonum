import { defineField } from 'sanity';
import sectionId from '../ui/sectionId';
import { toPlainText } from '../../utils/to-plain-text';
import { sectionPreview } from '../../utils/section-preview';

const name = 'ContactForm';
const title = 'Contact Form';
const icon = () => '📩';

export default defineField({
  name,
  type: 'object',
  title,
  icon,
  fields: [
    defineField({
      name: 'variant',
      type: 'string',
      title: 'Variant',
      options: {
        direction: 'horizontal',
        layout: 'radio',
        list: [
          {
            value: 'form-with-list',
            title: 'Form with list',
          },
          {
            value: 'form-with-person',
            title: 'Form with person',
          },
        ],
      },
      initialValue: 'form-with-list',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'isReference',
      type: 'boolean',
      title: 'Is reference?',
      description: (
        <>
          If you check this option, you will have the ability to reference data from <a href="/structure/TeamMember_Collection" target="_blank" rel="noopener">Team Member Collection</a>
        </>
      ),
      initialValue: true,
      hidden: ({ parent }) => parent?.variant === 'form-with-list',
      validation: Rule => Rule.custom((value, context) => {
        const variant = (context.parent as { variant: 'form-with-list' | 'form-with-person' })?.variant;
        if (variant === 'form-with-person' && value === undefined) return 'That field is required';
        return true;
      }),
    }),
    defineField({
      name: 'personReference',
      type: 'reference',
      title: 'Person reference',
      to: [{ type: 'TeamMember_Collection' }],
      options: {
        disableNew: true,
      },
      hidden: ({ parent }) => parent?.variant === 'form-with-list' || !parent?.isReference,
      validation: Rule => Rule.custom((value, context) => {
        const variant = (context.parent as { variant: 'form-with-list' | 'form-with-person' })?.variant;
        const isReference = (context.parent as { isReference: boolean })?.isReference;
        if (variant === 'form-with-person' && isReference && !value) return 'Person reference is required';
        return true;
      }),
    }),
    defineField({
      name: 'img',
      type: 'image',
      title: 'Image',
      hidden: ({ parent }) => parent?.variant === 'form-with-list' || parent?.isReference,
      validation: Rule => Rule.custom((value, context) => {
        const variant = (context.parent as { variant: 'form-with-list' | 'form-with-person' })?.variant;
        const isReference = (context.parent as { isReference: boolean })?.isReference;
        if (variant === 'form-with-person' && !isReference && !value) return 'Image is required';
        return true;
      }),
    }),
    defineField({
      name: 'emailText',
      type: 'string',
      title: 'Text',
      hidden: ({ parent }) => parent?.variant === 'form-with-list',
      validation: Rule => Rule.custom((value, context) => {
        const variant = (context.parent as { variant: 'form-with-list' | 'form-with-person' })?.variant;
        if (variant === 'form-with-person' && !value) return 'Email text is required';
        return true;
      }),
      fieldset: 'email',
    }),
    defineField({
      name: 'email',
      type: 'string',
      title: 'Email Adress',
      hidden: ({ parent }) => parent?.variant === 'form-with-list' || parent?.isReference,
      validation: Rule => Rule.custom((value, context) => {
        const isReference = (context.parent as { isReference: boolean })?.isReference;
        if (isReference) return true;
        if (!value) return 'Email address is required';
        return true;
      }).email(),
      fieldset: 'email',
    }),
    defineField({
      name: 'telText',
      type: 'string',
      title: 'Text',
      hidden: ({ parent }) => parent?.variant === 'form-with-list',
      validation: Rule => Rule.custom((value, context) => {
        const variant = (context.parent as { variant: 'form-with-list' | 'form-with-person' })?.variant;
        if (variant === 'form-with-person' && !value) return 'Tel text is required';
        return true;
      }),
      fieldset: 'tel',
    }),
    defineField({
      name: 'tel',
      type: 'string',
      title: 'Phone number',
      hidden: ({ parent }) => parent?.variant === 'form-with-list' || parent?.isReference,
      fieldset: 'tel',
    }),
    defineField({
      name: 'heading',
      type: 'Heading',
      title: 'Heading',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'paragraph',
      type: 'PortableText',
      title: 'Paragraph',
      hidden: ({ parent }) => parent?.variant === 'form-with-person',
      validation: Rule => Rule.custom((value, context) => {
        const variant = (context.parent as { variant: 'form-with-list' | 'form-with-person' })?.variant;
        if (variant === 'form-with-list' && !value) return 'Paragraph is required';
        return true;
      }),
    }),
    defineField({
      name: 'list',
      type: 'array',
      title: 'List',
      of: [
        defineField({
          name: 'item',
          type: 'object',
          title: 'Item',
          fields: [
            defineField({
              name: 'icon',
              type: 'image',
              title: 'Icon',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'label',
              type: 'PortableText',
              title: 'Label',
              validation: Rule => Rule.required(),
            }),
          ],
          validation: Rule => Rule.required(),
          preview: {
            select: {
              icon: 'icon',
              label: 'label',
            },
            prepare: ({ icon, label }) => ({
              title: toPlainText(label),
              media: icon,
            }),
          },
        })
      ],
      hidden: ({ parent }) => parent?.variant === 'form-with-person',
      validation: Rule => Rule.custom((value, context) => {
        const variant = (context.parent as { variant: 'form-with-list' | 'form-with-person' })?.variant;
        if (variant === 'form-with-list' && !value) return 'Paragraph is required';
        return true;
      }),
    }),
    defineField({
      name: 'state',
      type: 'object',
      title: 'Form States',
      fields: [
        defineField({
          name: 'success',
          type: 'object',
          title: 'Success',
          fields: [
            defineField({
              name: 'heading',
              type: 'Heading',
              title: 'Heading',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'paragraph',
              type: 'PortableText',
              title: 'Paragraph',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'link',
              type: 'object',
              title: 'Link',
              fields: [
                defineField({
                  name: 'url',
                  type: 'url',
                  title: 'URL',
                  validation: Rule => Rule.required().uri({ scheme: ['https'] }),
                }),
                defineField({
                  name: 'icon',
                  type: 'image',
                  title: 'Icon',
                  validation: Rule => Rule.required(),
                }),
                defineField({
                  name: 'heading',
                  type: 'string',
                  title: 'Heading',
                  validation: Rule => Rule.required(),
                }),
                defineField({
                  name: 'paragraph',
                  type: 'text',
                  rows: 2,
                  title: 'Paragraph',
                  validation: Rule => Rule.required(),
                }),
                defineField({
                  name: 'img',
                  type: 'image',
                  title: 'Image',
                  validation: Rule => Rule.required(),
                }),
              ],
              validation: Rule => Rule.required(),
              options: {
                collapsible: true,
                collapsed: false,
              },
            }),
          ],
          validation: Rule => Rule.required(),
          options: {
            collapsible: true,
            collapsed: false,
          },
        }),
        defineField({
          name: 'error',
          type: 'object',
          title: 'Error',
          fields: [
            defineField({
              name: 'heading',
              type: 'Heading',
              title: 'Heading',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'paragraph',
              type: 'PortableText',
              title: 'Paragraph',
              validation: Rule => Rule.required(),
            }),
          ],
          validation: Rule => Rule.required(),
          options: {
            collapsible: true,
            collapsed: false,
          },
        }),
      ],
      initialValue: {
        "error": {
          "heading": [
            {
              "_key": "8a0d68722eaf",
              "_type": "block",
              "children": [
                {
                  "_key": "b0c030ee3f460",
                  "_type": "span",
                  "marks": [],
                  "text": "Jeden z serwerów ma czkawkę"
                }
              ],
              "markDefs": [],
              "style": "normal"
            }
          ],
          "paragraph": [
            {
              "_key": "ebb0292e568a",
              "_type": "block",
              "children": [
                {
                  "_key": "640c8ab70cba0",
                  "_type": "span",
                  "marks": [],
                  "text": "Przed nami "
                },
                {
                  "_key": "4ca42746bcfd",
                  "_type": "span",
                  "marks": [
                    "strong"
                  ],
                  "text": "akcja ratunkowa"
                },
                {
                  "_key": "92907358ee5d",
                  "_type": "span",
                  "marks": [],
                  "text": ", a przed Tobą 2 opcje: spróbuj wysłać formularz ponownie lub napisz bezpośrednio na adres e-mail."
                }
              ],
              "markDefs": [],
              "style": "normal"
            }
          ]
        },
        "success": {
          "heading": [
            {
              "_key": "4b59f811d0a8",
              "_type": "block",
              "children": [
                {
                  "_key": "539e16d1343b0",
                  "_type": "span",
                  "marks": [],
                  "text": "Mamy to! Twój formularz właśnie do nas "
                },
                {
                  "_key": "6521ab7a4b15",
                  "_type": "span",
                  "marks": [
                    "strong"
                  ],
                  "text": "trafił"
                },
                {
                  "_key": "67a84f3d88ed",
                  "_type": "span",
                  "marks": [],
                  "text": "!"
                }
              ],
              "markDefs": [],
              "style": "normal"
            }
          ],
          "link": {
            "heading": "A w międzyczasie…",
            "icon": {
              "_type": "image",
              "asset": {
                "_ref": "image-bd39fb7c435c3124f2f31c7abe7a4c0ae1b38fda-17x16-svg",
                "_type": "reference"
              }
            },
            "img": {
              "_type": "image",
              "asset": {
                "_ref": "image-7368db51b5b1ab9b9b9cc5c11b660ca4927bbf92-161x202-webp",
                "_type": "reference"
              }
            },
            "paragraph": "Sprawdź co się dzieje na naszych socialach",
            "url": "https://www.linkedin.com/company/kryptonum"
          },
          "paragraph": [
            {
              "_key": "ab95362f4845",
              "_type": "block",
              "children": [
                {
                  "_key": "b1c1d6105cb50",
                  "_type": "span",
                  "marks": [],
                  "text": "Daj nam "
                },
                {
                  "_key": "259738a349a5",
                  "_type": "span",
                  "marks": [
                    "strong"
                  ],
                  "text": "max 24 h"
                },
                {
                  "_key": "8f80001bbf8f",
                  "_type": "span",
                  "marks": [],
                  "text": " – odpowiemy na Twojego maila."
                }
              ],
              "markDefs": [],
              "style": "normal"
            }
          ]
        }
      },
      validation: Rule => Rule.required(),
    }),
    ...sectionId,
  ],
  fieldsets: [
    {
      name: 'email',
      title: 'Email',
    },
    {
      name: 'tel',
      title: 'Telephone',
    },
  ],
  preview: {
    select: {
      heading: 'heading',
      variant: 'variant',
    },
    prepare: ({ heading, variant }) => ({
      title: `${title} (${variant})`,
      subtitle: toPlainText(heading),
      ...sectionPreview({ imgUrl: `/static/components/${name}.webp`, icon: icon() }),
    }),
  },
});
