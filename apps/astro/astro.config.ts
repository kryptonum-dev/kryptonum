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
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern",
        }
      }
    }
  },
  redirects: redirects,
  output: isPreviewDeployment ? "server" : "static",
  adapter: vercel({
    isr: {
      bypassToken: "00568f45-96ad-490a-8f92-493a7318d477",
    }
  }),
});
