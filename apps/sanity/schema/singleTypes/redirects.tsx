import { useCallback, useState } from 'react';
import { useClient, defineField, defineType, type SlugRule } from 'sanity';
import { Box, Text, Tooltip, Button, Stack, useToast, Card, Dialog } from '@sanity/ui';

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

const createRedirectField = ({ name, title }: { name: string; title: string }) =>
  defineField({
    name,
    type: 'array',
    title,
    description: `Redirects for ${title.toLowerCase()}. Used to redirect users to a different page for SEO purposes.`,
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
                const redirects = (context.document?.[name] || []) as RedirectTypes[];
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
              title: `${source}`,
              subtitle: `→ ${destination}`,
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
  });

const ProcessJsonButton = (props: { value: any; renderDefault: any; }) => {
  const { value, renderDefault } = props;
  const client = useClient({ apiVersion: '2024-11-29' });
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const processJson = useCallback(async () => {
    if (!value) return;
    setIsLoading(true);
    try {
      const parsed = JSON.parse(value);
      const processedData: any = {};

      // Process each domain group
      for (const [domain, redirects] of Object.entries(parsed)) {
        if (Array.isArray(redirects)) {
          processedData[domain] = (redirects as any[]).map(redirect => ({
            _key: crypto.randomUUID(),
            source: { current: redirect.source },
            destination: { current: redirect.destination },
            isPermanent: redirect.isPermanent ?? true
          }));
        }
      }

      await client.patch("drafts.redirects").set(processedData).commit();

      const totalRedirects = Object.values(processedData).reduce((sum: number, redirects: any) => sum + redirects.length, 0);
      toast.push({
        status: 'success',
        title: 'Success',
        description: `${totalRedirects} redirects have been successfully processed and updated across all domains`
      });
    } catch {
      toast.push({
        status: 'error',
        title: 'Error',
        description: 'Failed to process and update redirects. Check if there are any changes in the JSON.'
      });
    } finally {
      setIsLoading(false);
      setShowConfirmDialog(false);
    }
  }, [value, client, toast]);

  return (
    <Stack space={3}>
      {renderDefault(props)}
      <Button
        tone="caution"
        onClick={() => setShowConfirmDialog(true)}
        disabled={!value || isLoading}
        loading={isLoading}
        style={{ textAlign: 'center' }}
      >
        Process JSON and Update Redirects
      </Button>
      {showConfirmDialog && (
        <Dialog
          header="Confirm Update"
          id="confirm-dialog"
          onClose={() => setShowConfirmDialog(false)}
          zOffset={1000}
        >
          <Box padding={4}>
            <Stack space={5}>
              <Text>Are you sure you want to process this JSON? This will override all existing redirects.</Text>
              <Stack space={3}>
                <Button
                  tone="caution"
                  onClick={processJson}
                  loading={isLoading}
                  style={{ textAlign: 'center' }}
                >
                  Yes, process and update
                </Button>
                <Button
                  mode="ghost"
                  onClick={() => setShowConfirmDialog(false)}
                  disabled={isLoading}
                  style={{ textAlign: 'center' }}
                >
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Dialog>
      )}
    </Stack>
  );
};

export default defineType({
  name: 'redirects',
  type: 'document',
  title: 'Redirects',
  icon: () => '🔀',
  groups: [
    {
      name: 'main',
      title: 'Main Site (kryptonum.eu)',
    },
    {
      name: 'learn',
      title: 'Learn Platform (learn.kryptonum.eu)',
    },
    {
      name: 'bulk',
      title: 'Bulk Import',
    },
  ],
  fields: [
    {
      ...createRedirectField({
        name: 'mainRedirects',
        title: 'Main Site Redirects'
      }),
      group: 'main'
    },

    {
      ...createRedirectField({
        name: 'learnRedirects',
        title: 'Learn Platform Redirects'
      }),
      group: 'learn'
    },

    defineField({
      name: 'jsonEditor',
      type: 'text',
      title: 'JSON Editor',
      group: 'bulk',
      description: (
        <>
          Paste a JSON object with domain groups. Example structure:
          <pre style={{ fontSize: '12px', background: '#f5f5f5', padding: '8px', borderRadius: '4px', whiteSpace: 'pre-wrap' }}>
            {`{
  "mainRedirects": [
    { "source": "/old-path", "destination": "/new-path", "isPermanent": true }
  ],
  "learnRedirects": [
    { "source": "/old-course", "destination": "/new-course", "isPermanent": false }
  ]
}`}
          </pre>
        </>
      ),
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
        const allowedGroups = ['mainRedirects', 'learnRedirects'];
        try {
          const parsed = JSON.parse(value);
          if (typeof parsed !== 'object' || Array.isArray(parsed)) {
            return 'The JSON must be an object with domain groups (mainRedirects, learnRedirects)';
          }

          for (const [groupName, redirects] of Object.entries(parsed)) {
            if (!allowedGroups.includes(groupName)) {
              return `Invalid group "${groupName}". Allowed groups: ${allowedGroups.join(', ')}`;
            }

            if (!Array.isArray(redirects)) {
              return `Group "${groupName}" must contain an array of redirect objects`;
            }

            for (const redirect of redirects as any[]) {
              const objectKeys = Object.keys(redirect);
              const hasInvalidKeys = objectKeys.some(key => !allowedKeys.includes(key));
              if (hasInvalidKeys) {
                const invalidKeys = objectKeys.filter(key => !allowedKeys.includes(key));
                return `Invalid properties in ${groupName}: ${invalidKeys.join(', ')}. Only "source", "destination", and "isPermanent" are allowed.`;
              }
              if (!redirect.source || typeof redirect.source !== 'string')
                return `Each redirect in ${groupName} must have a "source" property with a string value`;
              if (!redirect.source.startsWith('/'))
                return `Source paths in ${groupName} must start with a forward slash (/)`;
              if (!redirect.destination || typeof redirect.destination !== 'string')
                return `Each redirect in ${groupName} must have a "destination" property with a string value`;
              if (!redirect.destination.startsWith('/'))
                return `Destination paths in ${groupName} must start with a forward slash (/)`;
              if (redirect.isPermanent !== undefined && typeof redirect.isPermanent !== 'boolean')
                return `The "isPermanent" property in ${groupName} must be a boolean (true/false) when provided`;
            }

            // Check for duplicates within the group
            const sources = (redirects as any[]).map(r => r.source);
            const duplicates = sources.filter((item, index) => sources.indexOf(item) !== index);
            if (duplicates.length > 0) {
              return `Duplicate source paths found in ${groupName}: ${duplicates.join(', ')}. Each source path must be unique per group.`;
            }
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
