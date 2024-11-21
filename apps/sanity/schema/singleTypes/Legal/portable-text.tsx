import { defineField } from "sanity";
import { InternalLinkableTypes } from "../../../structure/internal-linkable-types";
import { isValidUrl } from "../../../utils/is-valid-url";
import { toPlainText } from "../../../utils/to-plain-text";

export default defineField({
  name: 'content',
  type: 'array',
  title: 'Content',
  of: [
    defineField({
      type: 'block',
      name: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        {
          title: 'Heading 2',
          value: 'h2',
          component: ({ children }) => <h2 style={{ fontSize: '1.875rem', fontWeight: 400, margin: 0 }}>{children}</h2>
        },
        {
          title: 'Heading 3',
          value: 'h3',
          component: ({ children }) => <h3 style={{ fontSize: '1.5rem', fontWeight: 400, margin: 0 }}>{children}</h3>
        },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' }
      ],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong', component: ({ children }) => <strong style={{ fontWeight: 700 }}>{children}</strong> },
          { title: 'Emphasis', value: 'em' }
        ],
        annotations: [
          defineField({
            name: 'link',
            type: 'object',
            title: 'Link',
            icon: () => '🔗',
            fields: [
              defineField({
                name: 'linkType',
                type: 'string',
                title: 'Type',
                description: 'Choose "External" for links to websites outside your domain, or "Internal" for links to pages within your site.',
                options: {
                  list: ['external', 'internal'],
                  layout: 'radio',
                  direction: 'horizontal',
                },
                initialValue: 'external',
              }),
              defineField({
                name: 'external',
                type: 'string',
                title: 'URL',
                description: 'Specify the full URL. Ensure it starts with "https://", "mailto:" or "tel:" protocol.',
                hidden: ({ parent }) => parent?.linkType !== 'external',
                validation: (Rule) => [
                  Rule.custom((value, { parent }) => {
                    const linkType = (parent as { linkType?: string })?.linkType;
                    if (linkType === 'external') {
                      if (!value) return "URL is required";
                      if (!value.startsWith('https://') && !value.startsWith('mailto:') && !value.startsWith('tel:')) {
                        return 'External link must start with the "https://", "mailto:" or "tel:" protocol';
                      }
                      if (!isValidUrl(value)) return 'Invalid URL';
                    }
                    return true;
                  }),
                ],
              }),
              defineField({
                name: 'internal',
                type: 'reference',
                title: 'Internal reference to page',
                description: 'Select an internal page to link to.',
                to: InternalLinkableTypes,
                options: {
                  disableNew: true,
                  filter: 'defined(slug.current)',
                },
                hidden: ({ parent }) => parent?.linkType !== 'internal',
                validation: (rule) => [
                  rule.custom((value, { parent }) => {
                    const linkType = (parent as { linkType?: string })?.linkType;
                    if (linkType === 'internal' && !value?._ref) return "You have to choose internal page to link to.";
                    return true;
                  }),
                ],
              }),
            ]
          }),
        ]
      }
    }),
    defineField({
      name: 'Image',
      type: 'image',
      title: 'Image',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'ContactInfo',
      type: 'object',
      title: 'Contact Info',
      icon: () => '📧',
      fields: [
        defineField({
          name: 'email',
          type: 'string',
          title: 'Email (optional)',
        }),
        defineField({
          name: 'tel',
          type: 'string',
          title: 'Phone number (optional)',
        }),
      ],
      preview: {
        select: {
          email: 'email',
          tel: 'tel',
        },
        prepare: ({ email, tel }) => ({
          title: 'Contact Info',
          subtitle: [email ? `Email: ${email}` : '', tel ? `Tel: ${tel}` : ''].filter(Boolean).join('; '),
        }),
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'Logos',
      type: 'object',
      title: 'Logos',
      icon: () => '🏢',
      fields: [
        defineField({
          name: 'icons',
          type: 'array',
          of: [
            defineField({
              name: 'icon',
              type: 'image',
              title: 'Icon',
              validation: Rule => Rule.required(),
            }),
          ],
          title: 'Icons',
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: 'paragraph',
          type: 'PortableText',
          title: 'Paragraph',
          validation: Rule => Rule.required(),
        }),
      ],
      preview: {
        select: {
          paragraph: 'paragraph',
        },
        prepare: ({ paragraph }) => ({
          title: 'Logos',
          subtitle: toPlainText(paragraph),
        }),
      },
      validation: Rule => Rule.required(),
    }),
  ],
  validation: Rule => Rule.required(),
});
