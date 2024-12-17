export const prerender = true;

import type { APIRoute } from "astro";
import { DOMAIN } from "@repo/shared/constants";

const content = [
  "User-Agent: *",
  "Allow: /",
  "",
  `Sitemap: ${DOMAIN}/sitemap-index.xml`
].join("\n");

export const GET: APIRoute = () => {
  return new Response(content, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
};
