import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel/serverless";
import sitemap from "@astrojs/sitemap";
import { DOMAIN } from "./src/global/constants";
import { isPreviewDeployment } from "./src/utils/is-preview-deployment";
import redirects from "./redirects";

export default defineConfig({
  site: DOMAIN,
  integrations: [
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
  redirects: redirects,
  output: isPreviewDeployment ? "server" : 'hybrid',
  adapter: vercel(),
});
