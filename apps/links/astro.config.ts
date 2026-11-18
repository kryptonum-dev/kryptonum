import { defineConfig } from "astro/config";
import react from '@astrojs/react';
import vercel from "@astrojs/vercel";
import { isProductionDeployment } from "@repo/utils/is-production-deployment";

export default defineConfig({
  site: 'https://l.kryptonum.eu',
  integrations: [
    react(),
  ],
  image: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io"
      }
    ],
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
  output: "server",
  adapter: vercel({
    ...(isProductionDeployment && {
      isr: {
        bypassToken: process.env.VERCEL_DEPLOYMENT_ID,
        // Moved landings redirect with the visitor's own query string, so they must not be cached.
        // A regex here is matched against route patterns, only a string excludes one exact path.
        exclude: [/^\/api\/.+/, '/pl/wspolnik-na-zapleczu', '/pl/wspolnik-za-granica']
      }
    })
  }),
});
