/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly SANITY_API_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
