import { defineField, defineType } from "sanity"
import { defineSlugForDocument } from "../../utils/define-slug-for-document";

const name = 'Shop_Page';
const title = 'Shop';
const slug = '/pl/produkty-cyfrowe';
const icon = () => '🛒'

export default defineType({
  name: name,
  type: 'document',
  title: title,
  icon: icon,
  options: { documentPreview: true },
  fields: [
    ...defineSlugForDocument({ slug: slug }),
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
    prepare: () => ({
      title: title,
      subtitle: slug
    })
  }
});
