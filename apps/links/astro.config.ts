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
        exclude: [/^\/api\/.+/]
      }
    })
  }),
});
