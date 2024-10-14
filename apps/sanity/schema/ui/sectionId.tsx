import { defineField } from "sanity";

type Props = {
  _key: string;
  sectionId?: string
}

export default [
  defineField({
    name: 'sectionId',
    type: 'string',
    title: 'Section ID (optional)',
    description: 'The Section ID is a unique identifier used to link to specific sections of the page.',
    validation: Rule => [
      Rule.custom((value, context) => {
        if (!value) return true;
        if (value?.startsWith('#')) return 'Section ID cannot start with a "#" symbol. It has to be just a string.';
        const components = (context.document?.components || []) as Props[];
        const currentComponent = context.parent as Props
        const isDuplicate = components.some(component =>
          component._key !== currentComponent._key && component.sectionId === value
        );
        if (isDuplicate) return "This section ID is already used in another component. Section IDs must be unique.";
        return true;
      })
    ]
  }),
]
