import { defineConfig } from "astro/config";
import react from '@astrojs/react';
import vercel from "@astrojs/vercel";
import { isProductionDeployment } from "@repo/utils/is-production-deployment";
import redirects from "../../packages/shared/src/redirects";

export default defineConfig({
  site: 'https://learn.kryptonum.eu',
  integrations: [
    react(),
  ],
  image: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io"
      },
      {
        protocol: "https",
        hostname: 'files.stripe.com'
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
  redirects: await redirects('learnRedirects'),
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
