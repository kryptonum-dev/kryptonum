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
  fullName?: string
  totalFollowers?: string
  socialMediaLinks?: string
  publishedVideos?: string
  exampleVideo?: string
  recipientEmail?: string
  recipientBcc?: string[]
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

type TemplateData = {
  email: string
  message?: string
  phone?: string
  dropdown?: string
  fullName?: string
  totalFollowers?: string
  socialMediaLinks?: string
  publishedVideos?: string
  exampleVideo?: string
}

const template = (data: TemplateData) => {
  const parts: string[] = [];
  if (data.fullName) parts.push(`<p>Imię i nazwisko: <b>${data.fullName}</b></p>`);
  parts.push(`<p>Adres email: <b>${data.email}</b></p>`);
  if (data.phone) parts.push(`<p>Telefon: <b>${data.phone}</b></p>`);
  if (data.dropdown) parts.push(`<p>Branża: <b>${data.dropdown}</b></p>`);
  if (data.totalFollowers) parts.push(`<p>Łączna liczba obserwujących: <b>${data.totalFollowers}</b></p>`);
  if (data.socialMediaLinks) parts.push(`<p>Social media:<br/>${data.socialMediaLinks.trim().replace(/\n/g, '<br />')}</p>`);
  if (data.publishedVideos) parts.push(`<p>Opublikowane wideo: <b>${data.publishedVideos}</b></p>`);
  if (data.exampleVideo) parts.push(`<p>Przykładowy film: <a href="${data.exampleVideo}">${data.exampleVideo}</a></p>`);
  if (data.message) {
    parts.push('<br />');
    parts.push(`<p>${data.message.trim().replace(/\n/g, '<br />')}</p>`);
  }
  return parts.join('\n');
};

export const POST: APIRoute = async ({ request }) => {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  let body: RequestBody;

  try {
    body = await request.json() as RequestBody;
  } catch {
    return new Response(JSON.stringify({
      message: "Invalid request body",
      success: false
    }), {
      status: 400,
      headers: corsHeaders
    });
  }

  const { email, message, legal, phone, dropdown, fullName, totalFollowers, socialMediaLinks, publishedVideos, exampleVideo, recipientEmail, recipientBcc } = body;

  const isInfluencerForm = !!fullName;
  const hasRequiredContent = !!message || !!phone || isInfluencerForm;
  if (!REGEX.email.test(email) || !hasRequiredContent || !legal) {
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

  const subject = isInfluencerForm
    ? `Nowe zgłoszenie influencera | Kryptonum`
    : phone
      ? `Lead z formularza kontaktowego | Kryptonum`
      : `Wiadomość z formularza kontaktowego | Kryptonum`;

  const htmlTemplate = template({ email, message, phone, dropdown, fullName, totalFollowers, socialMediaLinks, publishedVideos, exampleVideo });
  const textTemplate = htmlToString(htmlTemplate);

  const defaultTo = 'michal@kryptonum.eu';
  const defaultBcc = ['ola@kryptonum.eu', 'kuba@kryptonum.eu', 'bogumil@kryptonum.eu'];

  try {
    const res = await fetch(`https://api.resend.com/emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Formularz kontaktowy | Kryptonum <formularz@send.kryptonum.eu>',
        to: recipientEmail || defaultTo,
        ...(recipientBcc?.length ? { bcc: recipientBcc } : { bcc: defaultBcc }),
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
