import { defineConfig } from "astro/config";
import preact from '@astrojs/preact';
import vercel from "@astrojs/vercel";
import { DOMAIN } from "@repo/shared/constants";
import redirects from "./redirects";

export default defineConfig({
  site: DOMAIN,
  integrations: [
    preact({ compat: true }),
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
  output: "server",
  adapter: vercel({
    isr: {
      bypassToken: process.env.VERCEL_DEPLOYMENT_ID,
      exclude: ['/api/*']
    }
  }),
});
