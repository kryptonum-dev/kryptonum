export const prerender = false

import type { APIRoute } from "astro";
import { DOMAIN, REGEX } from "@repo/shared/constants";
import { htmlToString } from "@repo/utils/html-to-string";

type RequestBody = {
  email: string
  message?: string
  legal: boolean
  phone?: string
  dropdown?: string
}

const RESEND_API_KEY = process.env.RESEND_API_KEY || import.meta.env.RESEND_API_KEY;

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

const template = ({ email, message, phone, dropdown }: { email: string; message?: string; phone?: string; dropdown?: string }) => {
  const parts: string[] = [];
  parts.push(`<p>Adres email: <b>${email}</b></p>`);
  if (phone) parts.push(`<p>Telefon: <b>${phone}</b></p>`);
  if (dropdown) parts.push(`<p>Branża: <b>${dropdown}</b></p>`);
  if (message) {
    parts.push('<br />');
    parts.push(`<p>${message.trim().replace(/\n/g, '<br />')}</p>`);
  }
  return parts.join('\n');
};

export const POST: APIRoute = async ({ request }) => {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  let email: string, message: string | undefined, legal: boolean, phone: string | undefined, dropdown: string | undefined;
  
  try {
    const data = await request.json() as RequestBody;
    email = data.email;
    message = data.message;
    legal = data.legal;
    phone = data.phone;
    dropdown = data.dropdown;
  } catch {
    return new Response(JSON.stringify({
      message: "Invalid request body",
      success: false
    }), {
      status: 400,
      headers: corsHeaders
    });
  }

  const hasMessageOrPhone = !!message || !!phone;
  if (!REGEX.email.test(email) || !hasMessageOrPhone || !legal) {
    return new Response(JSON.stringify({
      message: "Missing required fields",
      success: false
    }), {
      status: 400,
      headers: corsHeaders
    });
  }

  if (phone && !REGEX.phone.test(phone)) {
    return new Response(JSON.stringify({
      message: "Invalid phone number",
      success: false
    }), {
      status: 400,
      headers: corsHeaders
    });
  }

  const isLeadForm = !!phone;
  const subject = isLeadForm
    ? `Lead z formularza kontaktowego | Kryptonum`
    : `Wiadomość z formularza kontaktowego | Kryptonum`;

  const htmlTemplate = template({ email, message, phone, dropdown });
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
        subject,
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
