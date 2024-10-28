import { Iframe, type IframeProps } from "sanity-plugin-iframe-pane";
import { PREVIEW_DEPLOYMENT_DOMAIN } from "../constants";

export const Preview = ({ document, schemaType }: { document: IframeProps['document'], schemaType: { options: { slugPrefix?: string } } }) => {
  const slug = (document.displayed.slug as { current?: string })?.current;
  const slugPrefix = schemaType?.options?.slugPrefix || '/';
  if (!slug) return <div style={{ padding: '1rem' }}>🛑 Preview not available: The slug is missing</div>;
  return <Iframe
    document={document}
    options={{
      url: `${PREVIEW_DEPLOYMENT_DOMAIN}${slugPrefix}${slug}`,
      reload: { button: true }
    }} />
}
