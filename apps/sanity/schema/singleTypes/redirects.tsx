import { defineField, defineType, type SlugRule } from 'sanity';
import { Box, Text, Tooltip } from '@sanity/ui';

type RedirectTypes = {
  _key: string;
  source: { current: string };
  destination: { current: string };
  isPermanent: boolean;
}

const SlugValidation = (Rule: SlugRule) => Rule.custom((value) => {
  if (!value || !value.current) return "The value can't be blank";
  if (!value.current.startsWith("/")) return "The path must be a relative path (starts with /)";
  return true;
});

export default defineType({
  name: 'redirects',
  type: 'document',
  title: 'Redirects',
  description: 'Redirects are used to redirect users to a different page. This is useful for SEO purposes.',
  icon: () => '🔀',
  fields: [
    defineField({
      name: 'redirects',
      type: 'array',
      description: 'Redirects are used to redirect users to a different page. This is useful for SEO purposes. Remember about good practices for redirects as they can affect SEO.',
      of: [
        defineField({
          name: 'redirect',
          type: 'object',
          fields: [
            defineField({
              name: 'source',
              type: 'slug',
              validation: Rule => [
                SlugValidation(Rule),
                Rule.custom((value, context) => {
                  const redirects = (context.document?.redirects || []) as RedirectTypes[];
                  const currentRedirect = context.parent as RedirectTypes
                  const isDuplicate = redirects.some(redirect =>
                    redirect._key !== currentRedirect._key && redirect.source?.current === value?.current
                  );
                  if (isDuplicate) return "This source path is already used in another redirect. Source paths must be unique.";
                  return true;
                })
              ]
            }),
            defineField({
              name: 'destination',
              type: 'slug',
              validation: SlugValidation,
            }),
            defineField({
              name: 'isPermanent',
              type: 'boolean',
              initialValue: true,
            }),
          ],
          preview: {
            select: {
              source: 'source.current',
              destination: 'destination.current',
              isPermanent: 'isPermanent',
            },
            prepare({ source, destination, isPermanent }) {
              return {
                title: `Source: ${source}`,
                subtitle: `Destination: ${destination}`,
                media: () => <Tooltip
                  content={
                    <Box padding={1}>
                      <Text size={1}>
                        {isPermanent ? '🔒 Permanent' : '🔄 Temporary'}
                      </Text>
                    </Box>
                  }
                  placement="top"
                  portal
                >
                  <span>
                    {isPermanent ? '🔒' : '🔄'}
                  </span>
                </Tooltip>
              }
            }
          },
        })
      ],
    })
  ],
  preview: {
    prepare: () => ({
      title: 'Redirects',
    })
  }
})

