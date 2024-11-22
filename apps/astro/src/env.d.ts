/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly SANITY_API_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare const fathom: {
  trackEvent: (name: string, data?: {
    _site_id?: string;
    _value?: number;
  }) => void;
}
