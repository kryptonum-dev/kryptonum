import { defineField, defineType } from "sanity";

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
      name: 'name',
      type: 'string',
      title: 'Name',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 5,
      title: 'Description',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'img',
      type: 'image',
      title: 'Image',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'url',
      type: 'url',
      title: 'URL',
      validation: Rule => Rule.required().uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'badge',
      type: 'string',
      title: 'Badge (optional)',
    }),
    defineField({
      name: 'rating',
      type: 'number',
      title: 'Rating (optional)',
      validation: Rule => Rule.min(1).max(5),
    }),
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
