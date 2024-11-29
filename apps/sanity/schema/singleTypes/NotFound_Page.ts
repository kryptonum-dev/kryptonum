import { defineField, defineType } from "sanity"
import { defineSlugForDocument } from "../../utils/define-slug-for-document";

const name = 'NotFound_Page';
const title = 'Not Found Page (404)';
const slug = '/404';

export default defineType({
  name: name,
  type: 'document',
  title: title,
  icon: () => '🔍',
  options: { documentPreview: true },
  fields: [
    ...defineSlugForDocument({ slug: slug }),
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
    prepare: () => ({
      title: title,
      subtitle: slug
    })
  }
});
