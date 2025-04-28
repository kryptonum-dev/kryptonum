import { defineField } from 'sanity';
import sectionId from '../ui/sectionId';
import { sectionPreview } from '../../utils/section-preview';

const name = 'FullWidthImage';
const title = 'Full Width Image';
const icon = () => '🖼️';

export default defineField({
  name,
  type: 'object',
  title,
  icon,
  fields: [
    defineField({
      name: 'img',
      type: 'image',
      title: 'Image',
      validation: Rule => Rule.required(),
    }),
    ...sectionId,
  ],
  preview: {
    prepare: () => ({
      title: title,
      ...sectionPreview({ imgUrl: `/static/components/${name}.webp`, icon: icon() }),
    }),
  },
});
