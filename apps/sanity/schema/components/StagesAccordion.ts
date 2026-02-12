import { defineField } from 'sanity';
import sectionId from '../ui/sectionId';
import { toPlainText } from '../../utils/to-plain-text';
import { sectionPreview } from '../../utils/section-preview';

const name = 'StagesAccordion';
const title = 'Stages Accordion';
const icon = () => '🪗';

const findObjectByKey = (value: unknown, key: string): Record<string, unknown> | null => {
  if (!value) return null;
  if (Array.isArray(value)) {
    for (const entry of value) {
      const found = findObjectByKey(entry, key);
      if (found) return found;
    }
    return null;
  }
  if (typeof value !== 'object') return null;
  const typedValue = value as Record<string, unknown>;
  if (typedValue._key === key) return typedValue;
  for (const child of Object.values(typedValue)) {
    const found = findObjectByKey(child, key);
    if (found) return found;
  }
  return null;
};

const getSectionImageModeFromContext = (context: { document?: unknown; path?: unknown[] }): 'single' | 'multiple' | undefined => {
  const sectionKey = (context.path?.[1] as { _key?: string } | undefined)?._key;
  if (!sectionKey) return undefined;
  const section = findObjectByKey(context.document, sectionKey);
  const imageMode = section?.imageMode;
  return imageMode === 'multiple' ? 'multiple' : imageMode === 'single' ? 'single' : undefined;
};

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
      name: 'imageMode',
      type: 'string',
      title: 'Image Mode',
      initialValue: 'single',
      options: {
        list: [
          { title: 'One image', value: 'single' },
          { title: 'Multiple images for each accordion', value: 'multiple' },
        ],
        layout: 'radio',
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'img',
      type: 'image',
      title: 'Image',
      description: 'Default image. In multiple mode this is shown when all accordion items are closed.',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'items',
      type: 'array',
      title: 'Items',
      of: [
        defineField({
          name: 'item',
          type: 'object',
          title: 'Item',
          fields: [
            defineField({
              name: 'title',
              type: 'text',
              rows: 2,
              title: 'Title',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'content',
              type: 'PortableText',
              title: 'Content',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'cta',
              type: 'cta',
              title: 'Call to Action (optional)',
            }),
            defineField({
              name: 'openImg',
              type: 'image',
              title: 'Open State Image',
              description: 'Required in multiple image mode',
              hidden: (context) => getSectionImageModeFromContext(context) !== 'multiple',
            }),
          ],
          preview: {
            select: {
              media: 'openImg',
              title: 'title',
              content: 'content',
            },
            prepare: ({ media, title, content }) => ({
              media,
              title: title,
              subtitle: toPlainText(content),
            }),
          },
        })
      ],
      validation: Rule =>
        Rule.required().custom((value, context) => {
          const parent = context.parent as { imageMode?: 'single' | 'multiple' } | undefined;
          if (parent?.imageMode !== 'multiple') return true;
          const items = (value || []) as Array<{ openImg?: unknown }>;
          const missingImages = items.some(item => !item?.openImg);
          return missingImages ? 'Each accordion item must have an Open State Image in multiple image mode' : true;
        }),
    }),
    defineField({
      name: 'annotation',
      type: 'object',
      title: 'Annotation (optional)',
      fields: [
        defineField({
          name: 'icon',
          type: 'image',
          title: 'Icon',
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: 'text',
          type: 'PortableText',
          title: 'Text',
          validation: Rule => Rule.required(),
        })
      ]
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
