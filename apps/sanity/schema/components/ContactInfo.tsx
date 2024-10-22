import { defineField } from 'sanity';
import sectionId from '../ui/sectionId';
import { toPlainText } from '../../utils/to-plain-text';
import { sectionPreview } from '../ui/section-preview';

const name = 'ContactInfo';
const title = 'Contact Info';
const icon = () => '💬';

export default defineField({
  name,
  type: 'object',
  title,
  icon,
  fields: [
    defineField({
      name: 'isReference',
      type: 'boolean',
      title: 'Is reference?',
      description: (
        <>
          If you check this option, you will have the ability to reference data from <a href="/structure/TeamMember_Collection" target="_blank" rel="noopener">Team Member Collection</a>
        </>
      ),
      initialValue: false,
    }),
    defineField({
      name: 'personReference',
      type: 'reference',
      title: 'Person reference',
      to: [{ type: 'TeamMember_Collection' }],
      options: {
        disableNew: true,
      },
      hidden: ({ parent }) => !parent?.isReference,
      validation: Rule => Rule.custom((value, context) => {
        const isReference = (context.parent as { isReference: boolean })?.isReference;
        if (!isReference) return true;
        if (!value) return 'Person reference is required';
        return true;
      }),
    }),
    defineField({
      name: 'img',
      type: 'image',
      title: 'Image',
      hidden: ({ parent }) => parent?.isReference,
      validation: Rule => Rule.custom((value, context) => {
        const isReference = (context.parent as { isReference: boolean })?.isReference;
        if (isReference) return true;
        if (!value) return 'Image is required';
        return true;
      }),
    }),
    defineField({
      name: 'emailText',
      type: 'string',
      title: 'Text',
      validation: Rule => Rule.required(),
      fieldset: 'email',
    }),
    defineField({
      name: 'email',
      type: 'string',
      title: 'Email Adress',
      hidden: ({ parent }) => parent?.isReference,
      validation: Rule => Rule.custom((value, context) => {
        const isReference = (context.parent as { isReference: boolean })?.isReference;
        if (isReference) return true;
        if (!value) return 'Email address is required';
        return true;
      }).email(),
      fieldset: 'email',
    }),
    defineField({
      name: 'telText',
      type: 'string',
      title: 'Text',
      validation: Rule => Rule.required(),
      fieldset: 'tel',
    }),
    defineField({
      name: 'tel',
      type: 'string',
      title: 'Phone number',
      hidden: ({ parent }) => parent?.isReference,
      fieldset: 'tel',
    }),
    defineField({
      name: 'address',
      type: 'object',
      title: 'Address',
      description: (
        <>
          The <em>Address Text</em> and <em>Map Link</em> are optional. If you left them blank, then we will use data from <a href='/structure/global' target='_blank' rel='noopener'>global settings</a>.
        </>
      ),
      fields: [
        defineField({
          name: 'img',
          type: 'image',
          title: 'Image',
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: 'text',
          type: 'string',
          title: 'Text',
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: 'addressText',
          type: 'string',
          title: 'Address Text (optional)',
        }),
        defineField({
          name: 'mapLink',
          type: 'url',
          title: 'Map Link (optional)',
        }),
      ],
      validation: Rule => Rule.required(),
    }),
    ...sectionId,
  ],
  fieldsets: [
    {
      name: 'email',
      title: 'Email',
    },
    {
      name: 'tel',
      title: 'Telephone',
    },
  ],
  preview: {
    select: {
      heading: 'heading',
    },
    prepare: ({ heading }) => ({
      title: title,
      subtitle: toPlainText(heading),
      ...sectionPreview({ name, icon: icon() }),
    }),
  },
});
