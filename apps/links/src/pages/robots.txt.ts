export const prerender = true;

import type { APIRoute } from "astro";

export const GET: APIRoute = ({ url }) => {
  const DOMAIN = url.origin
  const content = [
    "User-Agent: *",
    "Allow: /",
    "",
    `Sitemap: ${DOMAIN}/sitemap-index.xml`
  ].join("\n");

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
};
