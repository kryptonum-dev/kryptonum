import { defineField, defineType } from "sanity"
import { defineSlugForDocument } from "../../utils/define-slug-for-document";
import { languageLabel } from "../../utils/language-label";

const name = 'Shop_Page';
const title = 'Shop';
const icon = () => '🛒'

export default defineType({
  name: name,
  type: 'document',
  title: title,
  icon: icon,
  options: { documentPreview: true },
  fields: [
    defineField({
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
    ...defineSlugForDocument({
      predefinedSlugs: {
        pl: '/pl/produkty-cyfrowe',
        en: '/en/digital-products'
      }
    }),
    defineField({
      name: 'heading',
      type: 'Heading',
      title: 'Heading',
      validation: Rule => Rule.required(),
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
      language: 'language',
    },
    prepare: ({ language }) => ({
      title: title,
      subtitle: languageLabel(language),
    })
  }
});
