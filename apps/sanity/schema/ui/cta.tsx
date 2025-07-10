import { defineField, defineType } from "sanity"
import { Tooltip, Box, Text, } from '@sanity/ui';
import { isValidUrl } from "../../utils/is-valid-url";
import { InternalLinkableTypes } from "../../structure/internal-linkable-types";

const name = 'cta';
const title = 'Call To Action (CTA)';
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
      description: (
        <>
          <em>Primary</em> (main button) or <em>Secondary</em> (less important)
        </>
      ),
      options: {
        list: ['primary', 'secondary'],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'primary',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'linkType',
      type: 'string',
      title: 'Type',
      description: (
        <>
          <em>External</em> (other websites), <em>Internal</em> (within your site), or <em>Anchor</em> (section on same page)
        </>
      ),
      options: {
        list: ['external', 'internal', 'anchor'],
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
      hidden: ({ parent }) => parent?.linkType !== 'external',
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
      hidden: ({ parent }) => parent?.linkType !== 'internal',
      validation: (rule) => [
        rule.custom((value, { parent }) => {
          const type = (parent as { type?: string })?.type;
          if (type === 'internal' && !value?._ref) return "You have to choose internal page to link to.";
          return true;
        }),
      ],
    }),
    defineField({
      name: 'anchor',
      type: 'string',
      title: 'Anchor ID',
      description: 'Enter the ID of the section to scroll to (with the # symbol)',
      hidden: ({ parent }) => parent?.linkType !== 'anchor',
      validation: (Rule) => [
        Rule.custom((value, { parent }) => {
          if ((parent as { linkType?: string })?.linkType === 'anchor') {
            if (!value) return "Anchor ID is required";
            if (!value.startsWith('#')) return "Include the # symbol";
            if (!/^#[a-zA-Z0-9_-]+$/.test(value)) return "Anchor ID should only contain letters, numbers, hyphens or underscores";
          }
          return true;
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'text',
      theme: 'theme',
      linkType: 'linkType',
      external: 'external',
      internal: 'internal.slug.current',
      anchor: 'anchor',
    },
    prepare({ title, theme, linkType, external, internal, anchor }) {
      let subtitle = '';
      if (linkType === 'external') subtitle = external;
      else if (linkType === 'internal') subtitle = internal;
      else if (linkType === 'anchor') subtitle = `#${anchor}`;

      return {
        title: `${title}`,
        subtitle,
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
