export const prerender = false

import type { APIRoute } from "astro";
import { DOMAIN, REGEX } from "@repo/shared/constants";
import { htmlToString } from "@repo/utils/html-to-string";

type RequestBody = {
  email: string
  message: string
  legal: boolean
  turnstileToken?: string
}

const RESEND_API_KEY = process.env.RESEND_API_KEY || import.meta.env.RESEND_API_KEY;
// TODO: revert after testing - use test secret key to match test sitekey
const TURNSTILE_SECRET_KEY = '1x0000000000000000000000000000000AA';
// const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY || import.meta.env.TURNSTILE_SECRET_KEY;

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

const template = ({ email, message }: { email: string; message: string }) => `
  <p>Adres email: <b>${email}</b></p>
  <br />
  <p>${message.trim().replace(/\n/g, '<br />')}</p>
`;

export const POST: APIRoute = async ({ request }) => {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  let email: string, message: string, legal: boolean, turnstileToken: string | undefined;
  
  try {
    const data = await request.json() as RequestBody;
    email = data.email;
    message = data.message;
    legal = data.legal;
    turnstileToken = data.turnstileToken;
  } catch {
    return new Response(JSON.stringify({
      message: "Invalid request body",
      success: false
    }), {
      status: 400,
      headers: corsHeaders
    });
  }

  // Verify Turnstile token (if provided)
  if (turnstileToken) {
    try {
      const turnstileResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: TURNSTILE_SECRET_KEY,
          response: turnstileToken,
        }),
      });
      const turnstileResult = await turnstileResponse.json() as { success: boolean };

      if (!turnstileResult.success) {
        return new Response(JSON.stringify({
          message: "Verification failed",
          success: false
        }), {
          status: 403,
          headers: corsHeaders
        });
      }
    } catch {
      console.error('[Contact] Turnstile verification error');
    }
  }

  if (!REGEX.email.test(email) || !message || !legal) {
    return new Response(JSON.stringify({
      message: "Missing required fields",
      success: false
    }), {
      status: 400,
      headers: corsHeaders
    });
  }

  const htmlTemplate = template({ email, message });
  const textTemplate = htmlToString(htmlTemplate);

  try {
    const res = await fetch(`https://api.resend.com/emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Formularz kontaktowy | Kryptonum <formularz@send.kryptonum.eu>',
        to: 'michal@kryptonum.eu',
        bcc: ['ola@kryptonum.eu', 'kuba@kryptonum.eu', 'bogumil@kryptonum.eu'],
        reply_to: email,
        subject: `Wiadomość z formularza kontaktowego | Kryptonum`,
        html: htmlTemplate,
        text: textTemplate,
        headers: {
          'X-Entity-Ref-ID': crypto.randomUUID(),
        },
      }),
    });

    if (!res.ok) {
      return new Response(JSON.stringify({
        message: "Something went wrong",
        success: false
      }), {
        status: 400,
        headers: corsHeaders
      });
    }

    return new Response(JSON.stringify({
      message: "Successfully sent message",
      success: true
    }), {
      status: 200,
      headers: corsHeaders
    });
  } catch {
    return new Response(JSON.stringify({
      message: "An error occurred while sending message",
      success: false
    }), {
      status: 400,
      headers: corsHeaders
    });
  }
};
