import { defineField } from 'sanity';
import sectionId from '../ui/sectionId';
import { toPlainText } from '../../utils/to-plain-text';
import { sectionPreview } from '../../utils/section-preview';

const name = 'SimpleTextSection';
const title = 'Simple Text Section (with variants)';
const icon = () => '📝';

export default defineField({
  name,
  type: 'object',
  title,
  icon,
  fields: [
    defineField({
      name: 'icon',
      type: 'image',
      title: 'Icon (optional)',
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
    ...sectionId,
  ],
  preview: {
    select: {
      _icon: 'icon',
      heading: 'heading',
    },
    prepare: ({ _icon, heading }) => ({
      title: `${title}${_icon ? ' | variant with icon' : ''}`,
      subtitle: toPlainText(heading),
      ...sectionPreview({ imgUrl: `/static/components/${name}.webp`, icon: icon() }),
    }),
  },
});
