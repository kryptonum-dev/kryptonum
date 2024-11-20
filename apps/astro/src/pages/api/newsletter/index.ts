export const prerender = false

import type { APIRoute } from "astro";
import type { Props } from "./subscribeToNewsletter";
import { REGEX } from "@/src/global/constants";

const MAILERLITE_API_KEY = import.meta.env.MAILERLITE_API_KEY || process.env.MAILERLITE_API_KEY;

export const POST: APIRoute = async ({ request }) => {
  const { email, name, groupId, legal } = await request.json() as Props;

  if (!REGEX.email.test(email) || !name || !groupId || !legal)
    return new Response(JSON.stringify({ message: "Missing required fields", success: false }), { status: 400 });

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
      }), { status: res.status });
    }
    return new Response(JSON.stringify({
      message: "Successfully subscribed to newsletter",
      success: true
    }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({
      message: "An error occurred while subscribing",
      success: false
    }), { status: 400 });
  }
};
