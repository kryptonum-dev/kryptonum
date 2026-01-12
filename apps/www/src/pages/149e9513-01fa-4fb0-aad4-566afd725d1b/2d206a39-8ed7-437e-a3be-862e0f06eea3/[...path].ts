export const prerender = false

import type { APIRoute } from "astro";

const BOTID_PROXY = "https://api.vercel.com/bot-protection/v1/proxy";

export const ALL: APIRoute = async ({ params, request }) => {
  const path = params.path || "";
  const url = new URL(request.url);
  const targetUrl = `${BOTID_PROXY}/${path}${url.search}`;
  
  const headers = new Headers();
  for (const [key, value] of request.headers.entries()) {
    if (!["host", "connection"].includes(key.toLowerCase())) {
      headers.set(key, value);
    }
  }

  const response = await fetch(targetUrl, {
    method: request.method,
    headers,
    body: request.method !== "GET" && request.method !== "HEAD" ? await request.text() : undefined,
  });

  const responseHeaders = new Headers();
  for (const [key, value] of response.headers.entries()) {
    if (!["content-encoding", "transfer-encoding"].includes(key.toLowerCase())) {
      responseHeaders.set(key, value);
    }
  }
  responseHeaders.set("X-Frame-Options", "SAMEORIGIN");
  responseHeaders.set("Content-Security-Policy", "frame-ancestors 'self'");

  return new Response(await response.text(), {
    status: response.status,
    headers: responseHeaders,
  });
};

