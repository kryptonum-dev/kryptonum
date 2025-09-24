import { defineField } from 'sanity';
import sectionId from '../ui/sectionId';
import { toPlainText } from '../../utils/to-plain-text';
import { sectionPreview } from '../../utils/section-preview';

const name = 'Newsletter';
const title = 'Newsletter';
const icon = () => '📰';

export default defineField({
  name,
  type: 'object',
  title,
  icon,
  fields: [
    defineField({
      name: 'groupId',
      type: 'string',
      title: 'Group ID',
      description: <>
        Group ID from MailerLite – subscribers will be added to this group. It can be found in the <a href="https://www.mailerlite.com/help/where-to-find-the-mailerlite-api-key-groupid-and-documentation#new/group-id" target="_blank" rel="noopener">Integrations tab</a>
      </>,
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'img',
      type: 'image',
      title: 'Image',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'heading',
      type: 'Heading',
      title: 'Heading',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'paragraph',
      type: 'PortableText',
      title: 'Paragraph',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'ctaButtons',
      type: 'object',
      title: 'CTA Buttons (Optional)',
      description: 'Override default button text for each step',
      fields: [
        defineField({
          name: 'step1',
          type: 'string',
          title: 'Step 1 Button Text',
          description: 'Custom text for the first step button (default: "Subscribe" / "Zapisuję się")',
          validation: Rule => Rule.max(20).warning('Keep button text short for better UX'),
        }),
        defineField({
          name: 'step2',
          type: 'string',
          title: 'Step 2 Button Text',
          description: 'Custom text for the second step button (default: "Subscribe" / "Zapisuję się")',
          validation: Rule => Rule.max(20).warning('Keep button text short for better UX'),
        }),
      ],
    }),
    defineField({
      name: 'state',
      type: 'object',
      title: 'Form States',
      fields: [
        defineField({
          name: 'success',
          type: 'object',
          title: 'Success',
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
              title: 'Paragraph',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'img',
              type: 'image',
              title: 'Image',
              validation: Rule => Rule.required(),
            }),
          ],
          validation: Rule => Rule.required(),
          options: {
            collapsible: true,
            collapsed: false,
          },
        }),
        defineField({
          name: 'error',
          type: 'object',
          title: 'Error',
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
              title: 'Paragraph',
              validation: Rule => Rule.required(),
            }),
          ],
          validation: Rule => Rule.required(),
          options: {
            collapsible: true,
            collapsed: false,
          },
        }),
      ],
      validation: Rule => Rule.required(),
    }),
    ...sectionId,
  ],
  preview: {
    select: {
      heading: 'heading',
      groupId: 'groupId',
    },
    prepare: ({ heading, groupId }) => ({
      title: `${title} | Group ID: ${groupId}`,
      subtitle: toPlainText(heading),
      ...sectionPreview({ imgUrl: `/static/components/${name}.webp`, icon: icon() }),
    }),
  },
});
