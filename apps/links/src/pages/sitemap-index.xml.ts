export const prerender = true;

import type { APIRoute } from "astro";

export const GET: APIRoute = ({ url }) => {
  const DOMAIN = url.origin
  const slugs = ['/']
  const response = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
    ${slugs.map(slug => `<url><loc>${DOMAIN}${slug}</loc></url>`).join('\n  ')}
  </urlset>`;

  return new Response(response, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
};
