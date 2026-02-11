export const prerender = true;

import type { APIRoute } from "astro";
import sanityFetch from "@repo/utils/sanity.fetch";
import { DOMAIN } from "@repo/shared/constants";

const slugs = await sanityFetch<string[]>({
  query: `
    *[defined(slug.current) && string::startsWith(slug.current, "/pl") && _type != "NotFound_Page" && _type != "Shop_Page" && _type != "ShopProduct_Collection" && _type != "ShopThankYou_Page" && _type != "LandingPage_Collection"].slug.current
  `,
})

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
