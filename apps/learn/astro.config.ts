import { defineConfig } from "astro/config";
import preact from '@astrojs/preact';
import vercel from "@astrojs/vercel";
import { isProductionDeployment } from "@repo/utils/is-production-deployment";

export default defineConfig({
  site: 'https://learn.kryptonum.eu',
  integrations: [
    preact({ compat: true }),
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
