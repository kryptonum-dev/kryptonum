export const prerender = true;

import type { APIRoute } from "astro";
import sharp from "sharp";
import ico from "sharp-ico";


export const GET: APIRoute = async () => {
  return new Response('test', {
    headers: { "Content-Type": "image/x-icon" },
  });
};
