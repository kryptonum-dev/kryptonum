import { defineField, defineType } from "sanity"
import { defineSlugForDocument } from "../../utils/define-slug-for-document";
import { languageLabel } from "../../utils/language-label";

const name = 'ShopThankYou_Page';
const title = 'Shop Thank You Page';
const icon = () => '✅'

export default defineType({
  name: name,
  type: 'document',
  title: title,
  icon: icon,
  fields: [
    defineField({
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
    ...defineSlugForDocument({
      predefinedSlugs: {
        pl: '/pl/dziekujemy',
        en: '/en/thank-you'
      }
    }),
    defineField({
      name: 'header',
      type: 'object',
      title: 'Header',
      validation: Rule => Rule.required(),
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
      ]
    }),
    defineField({
      name: 'components',
      type: 'components',
      title: 'Additional Components',
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
      language: 'language',
    },
    prepare: ({ language }) => ({
      title: title,
      subtitle: languageLabel(language),
    })
  }
});
