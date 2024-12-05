import { defineConfig } from "astro/config";
import preact from '@astrojs/preact';
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import { DOMAIN } from "./src/global/constants";
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
  build: {
    inlineStylesheets: 'never',
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
  output: "server",
  adapter: vercel({
    isr: {
      bypassToken: process.env.VERCEL_DEPLOYMENT_ID,
    }
  }),
});
