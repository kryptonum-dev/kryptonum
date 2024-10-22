import { Box, Text, Tooltip } from '@sanity/ui';

export const sectionPreview = ({ name, icon, label }: { name: string; icon: string; label?: string }) => ({
  media: () => (
    <Tooltip
      animate
      placement="top"
      portal
      content={
        <Box padding={2}>
          <img src={`/static/${name}.webp`} width={344} alt="" />
          {label && (
            <Text
              style={{
                fontSize: '0.875rem',
                padding: '1rem',
                display: 'block',
                textAlign: 'center',
                borderTop: '1px solid rgba(255,255,255,0.13)',
                textTransform: 'uppercase',
                fontWeight: '600',
              }}
            >
              {label}
            </Text>
          )}
        </Box>
      }
    >
      <span>{icon}</span>
    </Tooltip>
  ),
});
