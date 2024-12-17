export const prerender = false

import type { APIRoute } from "astro";
import { REGEX } from "@repo/shared/constants";
import { type Props } from "./sendContactEmail";
import { htmlToString } from "@repo/utils/html-to-string";

const RESEND_API_KEY = process.env.RESEND_API_KEY;

const template = ({ email, phone, message }: Omit<Props, 'legal'>) => `
  <p>Adres email: <b>${email}</b></p>
  <p>Telefon: <b>${phone || 'Nie podano'}</b></p>
  <br />
  <p>${message.trim().replace(/\n/g, '<br />')}</p>
`;

export const POST: APIRoute = async ({ request }) => {
  const { email, phone, message, legal } = await request.json() as Props;

  if (!REGEX.email.test(email) || (phone && !REGEX.phone.test(phone)) || !message || !legal) {
    return new Response(JSON.stringify({
      message: "Missing required fields",
      success: false
    }), { status: 400 });
  }

  const htmlTemplate = template({ email, phone, message });
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
        reply_to: email,
        subject: `Wiadomość z formularza kontaktowego | Kryptonum`,
        html: htmlTemplate,
        text: textTemplate,
      }),
    });

    if (res.status !== 200) {
      return new Response(JSON.stringify({
        message: "Something went wrong",
        success: false
      }), { status: 400 });
    }

    return new Response(JSON.stringify({
      message: "Successfully sent message",
      success: true
    }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({
      message: "An error occurred while sending message",
      success: false
    }), { status: 400 });
  }
};
