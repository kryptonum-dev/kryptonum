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
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
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
      title: 'Headline (optional)',
    }),
    defineField({
      name: 'scope',
      type: 'array',
      title: 'Scope (optional)',
      of: [
        defineField({
          name: 'item',
          type: 'reference',
          to: [{ type: 'CaseStudyCategory_Collection' }],
          options: {
            disableNew: true,
            filter: ({ parent }) => {
              const selectedIds = (parent as { _ref?: string }[])?.filter(item => item._ref).map(item => item._ref) || [];
              if (selectedIds.length > 0) {
                return {
                  filter: '!(_id in $selectedIds) && !(_id in path("drafts.**"))',
                  params: { selectedIds }
                }
              }
              return {}
            }
          },
          validation: Rule => Rule.required(),
        })
      ],
      validation: Rule => Rule.unique(),
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
