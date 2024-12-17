export const prerender = true;

import type { APIRoute } from "astro";
import sharp from "sharp";
import ico from "sharp-ico";
import favicon from "@repo/shared/assets/favicon.svg?raw";

export const GET: APIRoute = async () => {
  const processedFavicon = await sharp(Buffer.from(favicon))
    .resize(32, 32)
    .toBuffer();
  const icoBuffer = ico.encode([processedFavicon]);

  return new Response(icoBuffer, {
    headers: { "Content-Type": "image/x-icon" },
  });
};
