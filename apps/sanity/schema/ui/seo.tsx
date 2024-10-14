import { defineField, defineType } from "sanity"

export default defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  validation: Rule => Rule.required(),
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      description: 'Title is visible in the browser tab and in search engines.',
      validation: Rule => [
        Rule.max(70).warning('The field should not be longer than 70 characters.'),
        Rule.required()
      ],
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Description',
      rows: 4,
      description: 'Description is visible in search engines and when sharing the page on social media.',
      validation: Rule => [
        Rule.max(165).warning('The field should not be longer than 165 characters.'),
        Rule.required()
      ],
    }),
    defineField({
      name: 'img',
      type: 'image',
      title: 'Social Share Image (optional)',
      description: (
        <>
          Social Share Image is visible when sharing website on social media. The dimensions of the image should be 1200x630px. For maximum compatibility, use JPG or PNG formats, as WebP may not be supported everywhere. If this field is left empty, the image defined in <a href='/structure/global'>global settings</a> will be used.
        </>
      ),
    }),
  ],
});
