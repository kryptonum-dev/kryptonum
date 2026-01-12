export const prerender = false

import type { APIRoute } from "astro";

const BOTID_API = "https://api.vercel.com/bot-protection/v1/challenge";

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const targetUrl = `${BOTID_API}${url.search}`;
  
  const response = await fetch(targetUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/javascript",
    },
  });

  const body = await response.text();
  
  return new Response(body, {
    status: response.status,
    headers: {
      "Content-Type": "application/javascript",
      "Cache-Control": "no-store",
    },
  });
};

export const POST: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const targetUrl = `${BOTID_API}${url.search}`;
  const body = await request.text();
  
  const response = await fetch(targetUrl, {
    method: "POST",
    headers: {
      "Content-Type": request.headers.get("Content-Type") || "application/x-www-form-urlencoded",
    },
    body,
  });

  const responseBody = await response.text();
  
  return new Response(responseBody, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("Content-Type") || "application/json",
      "Cache-Control": "no-store",
    },
  });
};

