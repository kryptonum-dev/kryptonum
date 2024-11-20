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
      validation: Rule => Rule.required(),
      fieldset: 'email',
    }),
    defineField({
      name: 'email',
      type: 'string',
      title: 'Email Adress',
      hidden: ({ parent }) => parent?.isReference,
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
      validation: Rule => Rule.required(),
      fieldset: 'tel',
    }),
    defineField({
      name: 'tel',
      type: 'string',
      title: 'Phone number',
      hidden: ({ parent }) => parent?.isReference,
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
