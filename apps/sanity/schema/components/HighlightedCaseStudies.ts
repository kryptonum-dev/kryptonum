import { defineField } from 'sanity';
import sectionId from '../ui/sectionId';
import { toPlainText } from '../../utils/to-plain-text';
import { sectionPreview } from '../../utils/section-preview';

const name = 'HighlightedCaseStudies';
const title = 'Highlighted Case Studies';
const icon = () => '🏆';

export default defineField({
  name,
  type: 'object',
  title,
  icon,
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
      title: 'Paragraph (optional)',
    }),
    defineField({
      name: 'layout',
      type: 'string',
      title: 'Layout',
      description: 'Choose how case study images are positioned',
      options: {
        list: [
          { title: 'All images on the right', value: 'consistent' },
          { title: 'Alternating (right-left-right)', value: 'alternating' },
        ],
        layout: 'radio',
      },
      initialValue: 'consistent',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'caseStudies',
      type: 'array',
      title: 'Highlighted Case Studies',
      description: 'Featured case studies with embedded reviews (2-4 items)',
      of: [
        defineField({
          name: 'caseStudyItem',
          type: 'object',
          title: 'Case Study Item',
          fields: [
            defineField({
              name: 'heading',
              type: 'Heading',
              title: 'Heading',
              description: 'Result-focused headline (e.g. "+38% leadów w 60 dni")',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'description',
              type: 'PortableText',
              title: 'Description',
              description: 'Problem → Solution → Outcome (2-3 sentences)',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'metrics',
              type: 'array',
              title: 'Metrics (optional)',
              description: 'Key achievements/metrics (e.g. "< 2s loading", "500+ pages") - max 3',
              of: [
                defineField({
                  name: 'metric',
                  type: 'object',
                  title: 'Metric',
                  fields: [
                    defineField({
                      name: 'icon',
                      type: 'image',
                      title: 'Icon',
                      description: 'Small icon for the metric',
                      validation: Rule => Rule.required(),
                    }),
                    defineField({
                      name: 'text',
                      type: 'string',
                      title: 'Text',
                      description: 'Metric text (e.g. "< 2s wczytywania")',
                      validation: Rule => Rule.required(),
                    }),
                  ],
                  preview: {
                    select: {
                      icon: 'icon',
                      text: 'text',
                    },
                    prepare: ({ icon, text }) => ({
                      media: icon,
                      title: text,
                    }),
                  },
                }),
              ],
              validation: Rule => Rule.max(3),
            }),
            defineField({
              name: 'image',
              type: 'image',
              title: 'Preview Image',
              description: 'Large image displayed on the right side',
              options: {
                hotspot: true,
              },
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'caseStudy',
              type: 'reference',
              title: 'Case Study',
              description: 'Link to the full case study page',
              to: [{ type: 'CaseStudy_Collection' }],
              options: {
                disableNew: true,
                filter: ({ parent, document }) => {
                  const language = (document as { language?: string })?.language;
                  return {
                    filter: '!(_id in path("drafts.**")) && language == $lang',
                    params: { lang: language }
                  }
                }
              },
              validation: Rule => Rule.required(),
            }),
          ],
          preview: {
            select: {
              image: 'image',
              heading: 'heading',
              description: 'description',
            },
            prepare: ({ image, heading, description }) => ({
              media: image,
              title: toPlainText(heading),
              subtitle: toPlainText(description),
            }),
          },
        }),
      ],
      validation: Rule => Rule.required().min(2).max(4).error('Between 2 and 4 case studies are required'),
    }),
    defineField({
      name: 'bottomParagraph',
      type: 'PortableText',
      title: 'Bottom Paragraph (optional)',
      description: 'Optional text displayed below the case studies list',
    }),
    defineField({
      name: 'cta',
      type: 'cta',
      title: 'Call to Action (optional)',
      description: 'Optional CTA button (e.g. "Zobacz wszystkie realizacje")',
    }),
    ...sectionId,
  ],
  preview: {
    select: {
      heading: 'heading',
    },
    prepare: ({ heading }) => ({
      title: title,
      subtitle: toPlainText(heading),
      ...sectionPreview({ imgUrl: `/static/components/${name}.webp`, icon: icon() }),
    }),
  },
});
