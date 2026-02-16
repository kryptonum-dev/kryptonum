export const prerender = false

import type { APIRoute } from "astro";
import type { Props } from "./subscribeToNewsletter";
import { DOMAIN, REGEX } from "@repo/shared/constants";

const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY;

const isAllowedOrigin = (origin: string | null): boolean => {
  if (!origin) return false;
  const domainPart = DOMAIN.replace('https://', '');
  return origin === DOMAIN || new RegExp(`^https://.+\\.${domainPart.replace('.', '\\.')}$`).test(origin);
};

const getCorsHeaders = (origin: string | null) => {
  const allowedOrigin = isAllowedOrigin(origin) ? origin : null;

  return {
    'Access-Control-Allow-Origin': allowedOrigin || 'null',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
};

export const OPTIONS: APIRoute = async ({ request }) => {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  return new Response(null, {
    status: 200,
    headers: corsHeaders
  });
};

export const POST: APIRoute = async ({ request }) => {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  let email: string, name: string, groupId: string, legal: boolean;
  
  try {
    const data = await request.json() as Props;
    email = data.email;
    name = data.name;
    groupId = data.groupId;
    legal = data.legal;
  } catch (error) {
    return new Response(JSON.stringify({
      message: "Invalid request body",
      success: false
    }), {
      status: 400,
      headers: corsHeaders
    });
  }

  if (!REGEX.email.test(email) || !name || !groupId || !legal)
    return new Response(JSON.stringify({ message: "Missing required fields", success: false }), {
      status: 400,
      headers: corsHeaders
    });

  try {
    const subscriber = {
      email,
      fields: {
        name: name
      },
      groups: groupId ? [groupId] : []
    };
    const res = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MAILERLITE_API_KEY}`,
      },
      body: JSON.stringify(subscriber),
    });
    const data = await res.json();
    if (!res.ok) {
      return new Response(JSON.stringify({
        message: data.message || "Failed to subscribe",
        success: false
      }), {
        status: res.status,
        headers: corsHeaders
      });
    }
    return new Response(JSON.stringify({
      message: "Successfully subscribed to newsletter",
      success: true
    }), {
      status: 200,
      headers: corsHeaders
    });
  } catch (error) {
    return new Response(JSON.stringify({
      message: "An error occurred while subscribing",
      success: false
    }), {
      status: 400,
      headers: corsHeaders
    });
  }
};
