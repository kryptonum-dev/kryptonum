import { defineField, defineType } from "sanity"
import { defineSlugForDocument } from "../../utils/define-slug-for-document";
import { languageLabel } from "../../utils/language-label";

const name = 'NotFound_Page';
const title = 'Not Found Page (404)';

export default defineType({
  name: name,
  type: 'document',
  title: title,
  icon: () => '🔍',
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
        pl: '/pl/404',
        en: '/en/404'
      }
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
