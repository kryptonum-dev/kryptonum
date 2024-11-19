import { defineConfig } from "astro/config";
import preact from '@astrojs/preact';
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel/serverless";
import { DOMAIN } from "./src/global/constants";
import { isPreviewDeployment } from "./src/utils/is-preview-deployment";
import redirects from "./redirects";

export default defineConfig({
  site: DOMAIN,
  integrations: [
    preact({ compat: true }),
    sitemap(),
  ],
  image: {
    remotePatterns: [{
      protocol: "https",
      hostname: "cdn.sanity.io"
    }],
  },
  prefetch: {
    prefetchAll: true
  },
  vite: {
    ssr: {
      noExternal: ['react-hook-form']
    },
  },
  redirects: redirects,
  output: isPreviewDeployment ? "server" : 'hybrid',
  adapter: vercel(),
});
