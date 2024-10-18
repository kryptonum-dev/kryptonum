import { defineField } from 'sanity';
import sectionId from '../ui/sectionId';
import { toPlainText } from '../../utils/to-plain-text';
import { sectionPreview } from '../ui/section-preview';

const name = 'OverlappingCircles';
const title = 'Overlapping Circles';
const icon = () => '🫧';

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
      name: 'textFirst',
      type: 'string',
      title: 'First Text',
      validation: Rule => [
        Rule.required(),
        Rule.max(30).warning('We recommend to not use that long text in that section'),
      ]
    }),
    defineField({
      name: 'textSecond',
      type: 'string',
      title: 'Second Text',
      validation: Rule => [
        Rule.required(),
        Rule.max(30).warning('We recommend to not use that long text in that section'),
      ]
    }),
    defineField({
      name: 'icon',
      type: 'image',
      title: 'Icon',
      validation: Rule => Rule.required(),
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
      ...sectionPreview({ name, icon: icon() }),
    }),
  },
});
