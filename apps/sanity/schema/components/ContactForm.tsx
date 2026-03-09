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
          {
            value: 'form-lead',
            title: 'Form lead (phone + dropdown)',
          },
          {
            value: 'form-influencer',
            title: 'Form influencer',
          },
        ],
      },
      initialValue: 'form-with-list',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'dropdownLabel',
      type: 'string',
      title: 'Dropdown label',
      description: 'Label displayed above the dropdown (e.g. "Industry", "Budget")',
      hidden: ({ parent }) => parent?.variant !== 'form-lead',
      validation: Rule => Rule.custom((value, context) => {
        const variant = (context.parent as { variant: string })?.variant;
        if (variant === 'form-lead' && !value) return 'Dropdown label is required';
        return true;
      }),
    }),
    defineField({
      name: 'dropdownPlaceholder',
      type: 'string',
      title: 'Dropdown placeholder',
      description: 'Placeholder text for the dropdown (e.g. "Select industry")',
      hidden: ({ parent }) => parent?.variant !== 'form-lead',
      validation: Rule => Rule.custom((value, context) => {
        const variant = (context.parent as { variant: string })?.variant;
        if (variant === 'form-lead' && !value) return 'Dropdown placeholder is required';
        return true;
      }),
    }),
    defineField({
      name: 'dropdownOptions',
      type: 'array',
      title: 'Dropdown options',
      of: [{ type: 'string' }],
      hidden: ({ parent }) => parent?.variant !== 'form-lead',
      validation: Rule => Rule.custom((value, context) => {
        const variant = (context.parent as { variant: string })?.variant;
        if (variant === 'form-lead' && (!value || value.length < 2)) return 'At least 2 options are required';
        return true;
      }),
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
      hidden: ({ parent }) => parent?.variant === 'form-with-list' || parent?.variant === 'form-influencer',
      validation: Rule => Rule.custom((value, context) => {
        const variant = (context.parent as { variant: string })?.variant;
        if ((variant === 'form-with-person' || variant === 'form-lead') && value === undefined) return 'That field is required';
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
        filter: ({ document }) => {
          const language = (document as { language?: string })?.language;
          return {
            filter: 'language == $lang',
            params: { lang: language }
          }
        }
      },
      hidden: ({ parent }) => parent?.variant === 'form-with-list' || parent?.variant === 'form-influencer' || !parent?.isReference,
      validation: Rule => Rule.custom((value, context) => {
        const variant = (context.parent as { variant: string })?.variant;
        const isReference = (context.parent as { isReference: boolean })?.isReference;
        if ((variant === 'form-with-person' || variant === 'form-lead') && isReference && !value) return 'Person reference is required';
        return true;
      }),
    }),
    defineField({
      name: 'img',
      type: 'image',
      title: 'Image',
      hidden: ({ parent }) => parent?.variant === 'form-with-list' || parent?.variant === 'form-influencer' || parent?.isReference,
      validation: Rule => Rule.custom((value, context) => {
        const variant = (context.parent as { variant: string })?.variant;
        const isReference = (context.parent as { isReference: boolean })?.isReference;
        if ((variant === 'form-with-person' || variant === 'form-lead') && !isReference && !value) return 'Image is required';
        return true;
      }),
    }),
    defineField({
      name: 'emailText',
      type: 'string',
      title: 'Text',
      hidden: ({ parent }) => parent?.variant === 'form-with-list' || parent?.variant === 'form-influencer',
      validation: Rule => Rule.custom((value, context) => {
        const variant = (context.parent as { variant: string })?.variant;
        if ((variant === 'form-with-person' || variant === 'form-lead') && !value) return 'Email text is required';
        return true;
      }),
      fieldset: 'email',
    }),
    defineField({
      name: 'email',
      type: 'string',
      title: 'Email Adress',
      hidden: ({ parent }) => parent?.variant === 'form-with-list' || parent?.variant === 'form-influencer' || parent?.isReference,
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
      hidden: ({ parent }) => parent?.variant === 'form-with-list' || parent?.variant === 'form-influencer',
      validation: Rule => Rule.custom((value, context) => {
        const variant = (context.parent as { variant: string })?.variant;
        if ((variant === 'form-with-person' || variant === 'form-lead') && !value) return 'Tel text is required';
        return true;
      }),
      fieldset: 'tel',
    }),
    defineField({
      name: 'tel',
      type: 'string',
      title: 'Phone number',
      hidden: ({ parent }) => parent?.variant === 'form-with-list' || parent?.variant === 'form-influencer' || parent?.isReference,
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
      title: 'Paragraph (optional)',
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
      hidden: ({ parent }) => parent?.variant !== 'form-with-list',
      validation: Rule => Rule.custom((value, context) => {
        const variant = (context.parent as { variant: string })?.variant;
        if (variant === 'form-with-list' && !value) return 'List is required';
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
    defineField({
      name: 'recipientEmail',
      type: 'string',
      title: 'Recipient Email',
      description: 'Override the default email recipient for this form. Leave empty to use the default (michal@kryptonum.eu).',
      validation: Rule => Rule.custom((value) => {
        if (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) return 'Invalid email address';
        return true;
      }),
      fieldset: 'integrations',
    }),
    defineField({
      name: 'recipientBcc',
      type: 'array',
      title: 'Recipient BCC',
      description: 'Override the default BCC recipients. Leave empty to use defaults.',
      of: [{ type: 'string' }],
      fieldset: 'integrations',
    }),
    defineField({
      name: 'notionDatabaseId',
      type: 'string',
      title: 'Notion Database ID',
      description: 'Override the default Notion leads database. Paste the ID of the target Notion database.',
      fieldset: 'integrations',
    }),
    defineField({
      name: 'slackWebhookUrl',
      type: 'url',
      title: 'Slack Webhook URL',
      description: 'If set, a Slack notification will be sent to this webhook on form submission.',
      validation: Rule => Rule.uri({ scheme: ['https'] }),
      fieldset: 'integrations',
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
    {
      name: 'integrations',
      title: 'Integration Settings',
      options: {
        collapsible: true,
        collapsed: true,
      },
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
