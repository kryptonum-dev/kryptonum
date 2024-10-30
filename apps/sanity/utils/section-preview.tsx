import { Tooltip, Box } from '@sanity/ui';

// Enhanced the preview to include both media and icon for compatibility.
// This ensures that the preview works seamlessly with both the main components
// for page builder and components embedded within the portable-text custom section.
export const sectionPreview = ({ imgUrl, icon }: { imgUrl: string; icon: string }) => {
  const Preview = () => <Tooltip
    animate
    placement="top"
    portal
    content={
      <Box padding={2}>
        <img src={imgUrl} width={610} alt="" style={{ maxWidth: '100%' }} />
      </Box>
    }
  >
    <span style={{
      width: '2rem',
      height: '2rem',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'zoom-in',
      margin: '-0.75rem',
    }}>{icon}</span>
  </Tooltip>

  return {
    media: Preview,
    icon: Preview,
  }
};
