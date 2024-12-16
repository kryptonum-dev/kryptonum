/// <reference path="../.astro/types.d.ts" />

declare const fathom: {
  trackEvent: (name: string, data?: {
    _site_id?: string;
    _value?: number;
  }) => void;
}
