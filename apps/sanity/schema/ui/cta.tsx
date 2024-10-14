import { defineField, defineType } from "sanity"
import { Tooltip, Box, Text, } from '@sanity/ui';
import { isValidUrl } from "../../utils/is-valid-url";
import { InternalLinkableTypes } from "../../structure/internal-linkable-types";

const name = 'cta';
const title = 'Call to action';
const icon = () => '🗣️';

export default defineType({
  name,
  type: 'object',
  title,
  icon,
  fields: [
    defineField({
      name: 'text',
      type: 'string',
      title: 'Text',
      description: 'The text that will be displayed on the button.',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'theme',
      type: 'string',
      title: 'Theme',
      description: 'Theme is used to style the button. Choose "Primary" for the main call to action, or "Secondary" for less important actions.',
      options: {
        list: ['primary', 'secondary'],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'primary',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'type',
      type: 'string',
      title: 'Type',
      description: 'Choose "External" for links to websites outside your domain, or "Internal" for links to pages within your site.',
      options: {
        list: ['external', 'internal'],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'external',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'external',
      type: 'string',
      title: 'URL',
      description: 'Specify the full URL. Ensure it starts with "https://" and is a valid URL.',
      hidden: ({ parent }) => parent?.type !== 'external',
      validation: (Rule) => [
        Rule.custom((value, { parent }) => {
          const type = (parent as { type?: string })?.type;
          if (type === 'external') {
            if (!value) return "URL is required";
            if (!value.startsWith('https://')) {
              return 'External link must start with the "https://" protocol';
            }
            if (!isValidUrl(value)) return 'Invalid URL';
          }
          return true;
        }),
      ],
    }),
    defineField({
      name: 'internal',
      type: 'reference',
      title: 'Internal reference to page',
      description: 'Select an internal page to link to.',
      to: InternalLinkableTypes,
      options: {
        disableNew: true,
        filter: 'defined(slug.current)',
      },
      hidden: ({ parent }) => parent?.type !== 'internal',
      validation: (rule) => [
        rule.custom((value, { parent }) => {
          const type = (parent as { type?: string })?.type;
          if (type === 'internal' && !value?._ref) return "You have to choose internal page to link to.";
          return true;
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'text',
      theme: 'theme',
      type: 'type',
      external: 'external',
      internal: 'internal.slug.current',
    },
    prepare({ title, theme, type, external, internal }) {
      return {
        title: `${title}`,
        subtitle: type === 'external' ? external : internal,
        media: () => <Tooltip
          content={
            <Box padding={1}>
              <Text size={1}>
                {theme === 'primary' ? 'Primary button' : 'Secondary button'}
              </Text>
            </Box>
          }
          placement="top"
          portal
        >
          <span>{icon()}</span>
        </Tooltip>
      };
    },
  },
});
