import { defineField, defineType } from "sanity";
import { defineSlugForDocument } from "../../utils/define-slug-for-document";

const name = 'ShopProduct_Collection';
const title = 'Shop Product Collection';
const icon = () => '📖'

export default defineType({
  name: name,
  type: 'document',
  title,
  icon,
  fields: [
    defineField({
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
    ...defineSlugForDocument({ prefixes: { en: '/en/', pl: '/pl/' } }),
    defineField({
      name: 'purchase_url',
      type: 'url',
      title: 'Purchase URL',
      validation: Rule => Rule.required().uri({ scheme: ['https'] }),
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
      name: 'name',
      img: 'img',
    },
    prepare: ({ name, img, }) => ({
      title: name,
      media: img,
      icon,
    }),
  },
});
