import { Box, Tooltip } from '@sanity/ui';

export const sectionPreview = ({ name, icon }: { name: string; icon: string }) => ({
  media: () => (
    <Tooltip
      animate
      placement="top"
      portal
      content={
        <Box padding={2}>
          <img src={`/static/${name}.webp`} width={233} height={155} alt="" />
        </Box>
      }
    >
      <span>{icon}</span>
    </Tooltip>
  ),
});
