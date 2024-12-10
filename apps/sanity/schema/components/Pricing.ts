import { defineField } from 'sanity';
import sectionId from '../ui/sectionId';
import { toPlainText } from '../../utils/to-plain-text';
import { sectionPreview } from '../../utils/section-preview';

const name = 'Pricing';
const title = 'Pricing';
const icon = () => '💰';

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
      name: 'features',
      type: 'array',
      title: 'Features',
      of: [
        defineField({
          type: 'string',
          name: 'feature',
          title: 'Feature',
          validation: Rule => Rule.required(),
        }),
      ],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'plans',
      type: 'array',
      title: 'Pricing Plans',
      of: [
        defineField({
          name: 'plan',
          type: 'object',
          title: 'Plan',
          fields: [
            defineField({
              name: 'name',
              type: 'string',
              title: 'Plan Name',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'description',
              type: 'string',
              title: 'Plan Description',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'isHighlighted',
              type: 'boolean',
              title: 'Highlight this plan?',
              initialValue: false,
            }),
            defineField({
              name: 'featureValues',
              type: 'array',
              title: 'Feature Values',
              of: [
                defineField({
                  name: 'value',
                  type: 'object',
                  title: 'Value',
                  fields: [
                    defineField({
                      name: 'type',
                      type: 'string',
                      title: 'Type',
                      options: {
                        list: [
                          { title: 'Yes', value: 'yes' },
                          { title: 'No', value: 'no' },
                          { title: 'Text', value: 'text' },
                        ],
                        layout: 'radio',
                        direction: 'horizontal',
                      },
                      validation: Rule => Rule.required(),
                    }),
                    defineField({
                      name: 'text',
                      type: 'string',
                      title: 'Text Value',
                      hidden: ({ parent }) => parent?.type !== 'text',
                      validation: Rule => Rule.custom((value, context) => {
                        const isText = (context.parent as { type: "text" | "yes" | "no" })?.type === 'text';
                        if (isText && !value) return 'Text is required for text type features';
                        return true;
                      }),
                    }),
                  ],
                  preview: {
                    select: {
                      type: 'type',
                      text: 'text',
                    },
                    prepare: ({ type, text }) => ({
                      title: type === 'text' ? text : type,
                      media: () => type === 'yes' ? '✅' : type === 'no' ? '❌' : '📝',
                    }),
                  },
                }),
              ],
              validation: Rule => Rule.custom((value, context) => {
                const _key = (context.path?.[1] as { _key: string })?._key;
                const section = (context.document as unknown as { components: { _key: string }[] })?.components.find((component) => component._key === _key);
                const featureCount = (section as unknown as { features: string[] })?.features?.length;
                if (featureCount !== value?.length) return 'Feature Values count must match the number of features from root level of that section';
                return true;
              }),
            }),
          ],
          preview: {
            select: {
              name: 'name',
              description: 'description',
              isHighlighted: 'isHighlighted',
            },
            prepare: ({ name, description, isHighlighted }) => ({
              title: `${name} | ${description}`,
              subtitle: isHighlighted ? '✨ Highlighted' : undefined,
            }),
          },
        }),
      ],
      validation: Rule => Rule.required().min(1).max(4),
    }),
    defineField({
      name: 'cta',
      type: 'cta',
      title: 'Call to Action',
      validation: Rule => Rule.required(),
    }),
    ...sectionId,
  ],
  preview: {
    select: {
      heading: 'heading',
      plans: 'plans',
    },
    prepare: ({ heading, plans = [] }) => ({
      title: `${title} (${plans.length} plans)`,
      subtitle: toPlainText(heading),
      ...sectionPreview({ imgUrl: `/static/components/${name}.webp`, icon: icon() }),
    }),
  },
});
