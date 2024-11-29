import { useCallback, useState } from 'react';
import { useClient, defineField, defineType, type SlugRule } from 'sanity';
import { Box, Text, Tooltip, Button, Stack, useToast, Card } from '@sanity/ui';

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

const ProcessJsonButton = (props: { value: any; renderDefault: any; }) => {
  const { value, renderDefault } = props;
  const client = useClient({ apiVersion: '2024-11-29' });
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const processJson = useCallback(async () => {
    if (!value) return;
    setIsLoading(true);
    try {
      const parsed = JSON.parse(value) as RedirectTypes[];
      const processedRedirects = parsed.map(redirect => ({
        _key: crypto.randomUUID(),
        source: { current: redirect.source },
        destination: { current: redirect.destination },
        isPermanent: redirect.isPermanent ?? true
      }));
      await client.patch("drafts.redirects").set({ redirects: processedRedirects }).commit();
      toast.push({
        status: 'success',
        title: 'Success',
        description: `${processedRedirects.length} redirects have been successfully processed and updated`
      });
    } catch {
      toast.push({
        status: 'error',
        title: 'Error',
        description: 'Failed to process and update redirects'
      });
    } finally {
      setIsLoading(false);
    }
  }, [value, client, toast]);

  return (
    <Stack space={3}>
      {renderDefault(props)}
      <Button
        tone="primary"
        onClick={processJson}
        disabled={!value || isLoading}
        loading={isLoading}
        style={{ textAlign: 'center' }}
      >
        Process JSON and Update Redirects
      </Button>
    </Stack>
  );
};

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
    }),
    defineField({
      name: 'jsonEditor',
      type: 'text',
      title: 'JSON Editor',
      description: 'Paste JSON array of redirects. Format: [{"source": "/old-path", "destination": "/new-path", "isPermanent": true}]',
      components: {
        input: (props) => (
          <Stack space={3}>
            <Card tone="caution" padding={4} border radius={2}>
              <Stack space={3}>
                <Text weight="semibold">⚠️ Warning: Use with caution!</Text>
                <Text size={1}>
                  This editor will override all existing redirects. Technical knowledge of JSON format is required.
                  Incorrect usage may result in broken redirects.
                </Text>
              </Stack>
            </Card>
            <ProcessJsonButton {...props} />
          </Stack>
        )
      },
      validation: Rule => Rule.custom((value) => {
        if (!value) return true;
        const allowedKeys = ['source', 'destination', 'isPermanent'];
        try {
          const parsed = JSON.parse(value);
          if (!Array.isArray(parsed)) return 'The JSON must be an array of redirect objects';
          for (const redirect of parsed) {
            const objectKeys = Object.keys(redirect);
            const hasInvalidKeys = objectKeys.some(key => !allowedKeys.includes(key));
            if (hasInvalidKeys) {
              const invalidKeys = objectKeys.filter(key => !allowedKeys.includes(key));
              return `Invalid properties found: ${invalidKeys.join(', ')}. Only "source", "destination", and "isPermanent" are allowed.`;
            }
            if (!redirect.source || typeof redirect.source !== 'string')
              return 'Each redirect must have a "source" property with a string value';
            if (!redirect.source.startsWith('/'))
              return 'Source paths must start with a forward slash (/)';
            if (!redirect.destination || typeof redirect.destination !== 'string')
              return 'Each redirect must have a "destination" property with a string value';
            if (!redirect.destination.startsWith('/'))
              return 'Destination paths must start with a forward slash (/)';
            if (redirect.isPermanent !== undefined && typeof redirect.isPermanent !== 'boolean')
              return 'The "isPermanent" property must be a boolean (true/false) when provided';
          }
          const sources = parsed.map(r => r.source);
          const duplicates = sources.filter((item, index) => sources.indexOf(item) !== index);
          if (duplicates.length > 0) {
            return `Duplicate source paths found: ${duplicates.join(', ')}. Each source path must be unique.`;
          }
          return true;
        } catch {
          return 'Invalid JSON format. Please check your syntax.';
        }
      })
    })
  ],
  preview: {
    prepare: () => ({
      title: 'Redirects',
    })
  },
})
