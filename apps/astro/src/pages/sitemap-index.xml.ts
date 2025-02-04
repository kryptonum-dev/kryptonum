export const prerender = true;

import type { APIRoute } from "astro";
import sanityFetch from "@repo/utils/sanity.fetch";
import { DOMAIN } from "@repo/shared/constants";

const slugs = [
  ...await sanityFetch<string[]>({
    query: `
      *[defined(slug.current) && _type != "NotFound_Page" && language == $language].slug.current
    `,
    params: { language: 'pl' },
  }),
  ...await Promise.all([
    import("./pl/blog/strona/[page].astro")
      .then(res => res.getStaticPaths())
      .then(paths => paths.map(path => `/pl/blog/strona/${path.params.page}`)),
    import("./pl/blog/kategoria/[category]/strona/[page].astro")
      .then(res => res.getStaticPaths())
      .then(paths => paths.map(path => `/pl/blog/kategoria/${path.params.category}/strona/${path.params.page}`)),
    import("./pl/portfolio/strona/[page].astro")
      .then(res => res.getStaticPaths())
      .then(paths => paths.map(path => `/pl/portfolio/strona/${path.params.page}`)),
    import("./pl/portfolio/kategoria/[category]/strona/[page].astro")
      .then(res => res.getStaticPaths())
      .then(paths => paths.map(path => `/pl/portfolio/kategoria/${path.params.category}/strona/${path.params.page}`)),
  ]).then(paths => paths.flat())
]

const response = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  ${slugs.map(slug => `<url><loc>${DOMAIN}${slug}</loc></url>`).join('\n  ')}
</urlset>`;

export const GET: APIRoute = () => {
  return new Response(response, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
};
