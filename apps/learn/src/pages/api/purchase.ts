export const prerender = false;

import type { APIRoute } from 'astro';
import Stripe from 'stripe';
import { sendPurchaseAccessEmail } from '@repo/emails/templates/PurchaseAccess';

const endpointSecret = process.env.STRIPE_CHECKOUT_SESSION_COMPLETED_SECRET!;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const POST: APIRoute = async ({ request }) => {
  const sig = request.headers.get('stripe-signature');

  if (!sig) return new Response(JSON.stringify({ success: false, message: 'Missing Stripe signature' }), { status: 400 });

  try {
    const body = await request.text();
    const event = stripe.webhooks.constructEvent(body, sig, endpointSecret);

    if (event.type !== 'checkout.session.completed') {
      return new Response(JSON.stringify({ success: false, message: 'Invalid event type' }), { status: 400 });
    }

    const session = event.data.object;
    const customer_email = session.customer_details?.email;

    if (!customer_email) {
      return new Response(JSON.stringify({ success: false, message: 'Customer email is missing' }), { status: 400 });
    }

    const expandedSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ['line_items.data.price.product'],
    });

    const lineItems = expandedSession.line_items?.data || [];
    const products = lineItems
      .filter((item) => item.price?.product)
      .map((item) => ({ product: item.price?.product }))
      .filter((item) => item.product && (item.product as Stripe.Product).metadata?.download_url)
      .map((item, index) => ({
        name: (item.product as Stripe.Product).name,
        link: `https://learn.kryptonum.eu/thank-you?session_id=${session.id}&product_id=${index}`,
      }));

    if (!products || products.length === 0) {
      return new Response(JSON.stringify({ success: false, message: 'No products with download URLs found' }), {
        status: 400
      });
    }

    const countryCode = session.customer_details?.address?.country?.toLowerCase() || 'pl';
    const lang = countryCode === 'pl' ? 'pl' : 'en';

    const emailResult = await sendPurchaseAccessEmail({ to: customer_email, lang, products });

    if (!emailResult.success) {
      console.error('Failed to send email:', emailResult.error);
      return new Response(JSON.stringify({ success: false, message: 'Failed to send email' }), {
        status: 500
      });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({ success: false, message: 'Webhook processing failed' }), {
      status: 400
    });
  }
};
