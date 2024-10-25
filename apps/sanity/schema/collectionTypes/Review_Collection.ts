import { defineField, defineType } from "sanity";

const name = 'Review_Collection';
const title = 'Review items Collection';
const icon = () => '💬';

export default defineType({
  name: name,
  type: 'document',
  title,
  icon,
  fields: [
    defineField({
      name: 'img',
      type: 'image',
      title: 'Image',
      validation: Rule => Rule.required(),
      fieldset: 'media',
    }),
    defineField({
      name: 'video',
      type: 'mux.video',
      title: 'Video (optional)',
      fieldset: 'media',
    }),
    defineField({
      name: 'name',
      type: 'string',
      title: 'Name',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'headline',
      type: 'string',
      title: 'Headline',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'scope',
      type: 'array',
      title: 'Scope',
      of: [{ type: 'string' }],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'review',
      type: 'PortableText',
      title: 'Review',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'caseStudy',
      type: 'reference',
      title: 'Case Study (optional)',
      to: [{ type: 'CaseStudy_Collection' }],
    }),
  ],
  fieldsets: [
    {
      name: 'media',
      title: 'Media',
      options: { collapsible: true }
    },
  ],
  preview: {
    select: {
      name: 'name',
      headline: 'headline',
      img: 'img',
    },
    prepare: ({ name, headline, img }) => ({
      title: name,
      subtitle: headline,
      media: img,
    }),
  },
});
