import { defineField, defineType } from "sanity"
import { languageLabel } from "../../utils/language-label";

const name = 'Links_Page';
const title = 'Links Page';

export default defineType({
  name: name,
  type: 'document',
  title: title,
  icon: () => '🔗',
  fields: [
    defineField({
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'heading',
      type: 'Heading',
      title: 'Heading',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'homepageTitle',
      type: 'string',
      title: 'Homepage title',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'services',
      type: 'object',
      title: 'Services',
      fields: [
        defineField({
          name: 'title',
          type: 'string',
          title: 'Title',
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: 'items',
          type: 'array',
          title: 'Items',
          of: [{
            type: 'reference',
            to: [{ type: 'Service_Collection' }],
            options: {
              disableNew: true,
              filter: ({ parent, document }) => {
                const language = (document as { language?: string })?.language;
                const selectedIds = (parent as { _ref?: string }[])?.filter(item => item._ref).map(item => item._ref) || [];
                if (selectedIds.length > 0) {
                  return {
                    filter: '!(_id in $selectedIds) && !(_id in path("drafts.**")) && language == $lang',
                    params: { selectedIds, lang: language }
                  }
                }
                return {}
              }
            }
          }],
          validation: Rule => Rule.required(),
        }),
      ],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'pages',
      type: 'object',
      title: 'Pages',
      fields: [
        defineField({
          name: 'title',
          type: 'string',
          title: 'Title',
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: 'portfolioTitle',
          type: 'string',
          title: 'Portfolio Title',
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: 'teamTitle',
          type: 'string',
          title: 'Team Title',
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: 'blogTitle',
          type: 'string',
          title: 'Blog Title',
          validation: Rule => Rule.required(),
        })
      ],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'contact',
      type: 'object',
      title: 'Contact',
      fields: [
        defineField({
          name: 'title',
          type: 'string',
          title: 'Title',
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
          initialValue: false,
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
          hidden: ({ parent }) => !parent?.isReference,
          validation: Rule => Rule.custom((value, context) => {
            const isReference = (context.parent as { isReference: boolean })?.isReference;
            if (!isReference) return true;
            if (!value) return 'Person reference is required';
            return true;
          }),
        }),
        defineField({
          name: 'img',
          type: 'image',
          title: 'Image',
          hidden: ({ parent }) => parent?.isReference,
          validation: Rule => Rule.custom((value, context) => {
            const isReference = (context.parent as { isReference: boolean })?.isReference;
            if (isReference) return true;
            if (!value) return 'Image is required';
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
          name: 'address',
          type: 'object',
          title: 'Address',
          description: (
            <>
              The <em>Address Text</em> and <em>Map Link</em> are optional. If you left them blank, then we will use data from <a href='/structure/global' target='_blank' rel='noopener'>global settings</a>.
            </>
          ),
          fields: [
            defineField({
              name: 'img',
              type: 'image',
              title: 'Image',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'text',
              type: 'string',
              title: 'Text',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'addressText',
              type: 'string',
              title: 'Address Text (optional)',
            }),
            defineField({
              name: 'mapLink',
              type: 'url',
              title: 'Map Link (optional)',
            }),
          ],
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: 'socialTitle',
          type: 'string',
          title: 'Social Title',
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: 'socialText',
          type: 'string',
          title: 'Social Text',
          validation: Rule => Rule.required(),
        })
      ],
      validation: Rule => Rule.required(),
      fieldsets: [
        {
          name: 'email',
          title: 'Email',
        },
        {
          name: 'tel',
          title: 'Telephone',
        }
      ]
    }),
    defineField({
      name: 'seo',
      type: 'seo',
      title: 'SEO',
      group: 'seo',
      validation: Rule => Rule.required(),
    })
  ],
  groups: [
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
  preview: {
    select: {
      language: 'language',
    },
    prepare: ({ language }) => ({
      title: title,
      subtitle: languageLabel(language),
    })
  }
});
