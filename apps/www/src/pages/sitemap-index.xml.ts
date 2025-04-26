export const prerender = true;

import type { APIRoute } from "astro";
import sanityFetch from "@repo/utils/sanity.fetch";
import { DOMAIN } from "@repo/shared/constants";

const slugs = [
  ...await sanityFetch<string[]>({
    query: `
      *[defined(slug.current) && _type != "NotFound_Page"].slug.current
    `,
  }),
  ...await Promise.all([
    import("./[lang]/blog/strona/[page].astro")
      .then(res => res.getStaticPaths())
      .then(paths => paths.map(({ params: { lang, page } }) => `/${lang}/blog/strona/${page}`)),
    import("./[lang]/blog/page/[page].astro")
      .then(res => res.getStaticPaths())
      .then(paths => paths.map(({ params: { lang, page } }) => `/${lang}/blog/page/${page}`)),
    import("./[lang]/blog/kategoria/[category]/strona/[page].astro")
      .then(res => res.getStaticPaths())
      .then(paths => paths.map(({ params: { lang, category, page } }) => `/${lang}/blog/kategoria/${category}/strona/${page}`)),
    import("./[lang]/blog/category/[category]/page/[page].astro")
      .then(res => res.getStaticPaths())
      .then(paths => paths.map(({ params: { lang, category, page } }) => `/${lang}/blog/category/${category}/page/${page}`)),
    import("./[lang]/portfolio/strona/[page].astro")
      .then(res => res.getStaticPaths())
      .then(paths => paths.map(({ params: { lang, page } }) => `/${lang}/portfolio/strona/${page}`)),
    import("./[lang]/portfolio/page/[page].astro")
      .then(res => res.getStaticPaths())
      .then(paths => paths.map(({ params: { lang, page } }) => `/${lang}/portfolio/page/${page}`)),
    import("./[lang]/portfolio/kategoria/[category]/strona/[page].astro")
      .then(res => res.getStaticPaths())
      .then(paths => paths.map(({ params: { lang, category, page } }) => `/${lang}/portfolio/kategoria/${category}/strona/${page}`)),
    import("./[lang]/portfolio/category/[category]/page/[page].astro")
      .then(res => res.getStaticPaths())
      .then(paths => paths.map(({ params: { lang, category, page } }) => `/${lang}/portfolio/category/${category}/page/${page}`)),
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
