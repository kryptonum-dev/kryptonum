import { Iframe, type IframeProps } from "sanity-plugin-iframe-pane";
import { PREVIEW_DOMAINS } from "../constants";
import { schemaTypes } from "../structure/schema-types";

/**
 * Mapping of document types to their corresponding preview domains.
 * Add new document types here to route them to specific subdomains.
 */
const DOCUMENT_TYPE_TO_DOMAIN = {
  Links_Page: 'links',
  LandingPage_Collection: 'links',
  ShopProduct_Collection: 'learn'
} as const;

export const Preview = ({ document }: { document: IframeProps['document'] }) => {
  const documentType = document.displayed._type;

  // Get schema options for this document type
  const schemaType = schemaTypes.find(item => item.name === documentType);
  const options = schemaType?.options as { documentPreview?: boolean; previewSlug?: string } | undefined;

  // Use previewSlug from document options if defined, otherwise use document slug
  const documentSlug = (document.displayed.slug as { current?: string })?.current;
  const optionsSlug = options?.previewSlug;
  const slug = optionsSlug || documentSlug;

  if (!slug) {
    return <div style={{ padding: '1rem' }}>🛑 Preview not available: The slug is missing</div>;
  }

  // Get the appropriate preview domain for this document type
  const domainKey = DOCUMENT_TYPE_TO_DOMAIN[documentType as keyof typeof DOCUMENT_TYPE_TO_DOMAIN];
  const previewDomain = domainKey ? PREVIEW_DOMAINS[domainKey] : PREVIEW_DOMAINS.main;

  if (!previewDomain) {
    return (
      <div style={{ padding: '1rem' }}>
        🛑 Preview not available: No preview domain configured for document type "{documentType}"
      </div>
    );
  }

  const previewUrl = `${previewDomain}${slug}`;

  return (
    <Iframe
      document={document}
      options={{
        url: previewUrl,
        reload: { button: true }
      }}
    />
  );
};
