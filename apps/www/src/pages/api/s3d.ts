export const prerender = false

import { appendLeadToNotion, type ContactLeadData } from '@repo/utils/notion'
import type { APIRoute } from 'astro'
import { DOMAIN } from '@repo/shared/constants'

const isAllowedOrigin = (origin: string | null): boolean => {
  if (!origin) return false
  const domainPart = DOMAIN.replace('https://', '')
  return origin === DOMAIN || new RegExp(`^https://.+\\.${domainPart.replace('.', '\\.')}$`).test(origin)
}

const getCorsHeaders = (origin: string | null) => {
  const allowedOrigin = isAllowedOrigin(origin) ? origin : null
  return {
    'Access-Control-Allow-Origin': allowedOrigin || 'null',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

export const OPTIONS: APIRoute = async ({ request }) => {
  const origin = request.headers.get('origin')
  const corsHeaders = getCorsHeaders(origin)
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  })
}

/** Cal.com webhook payload (BOOKING_CREATED) – minimal shape we use */
type CalWebhookPayload = {
  triggerEvent?: string
  payload?: {
    title?: string
    startTime?: string
    type?: string
    organizer?: { name?: string; email?: string }
    attendees?: Array<{ email?: string; name?: string }>
    responses?: Record<string, { value?: string }>
  }
}

function isCalWebhook(body: unknown): body is CalWebhookPayload {
  const b = body as CalWebhookPayload
  // Any Cal.com webhook has triggerEvent + payload wrapper
  return Boolean(b && 'triggerEvent' in b && 'payload' in b)
}

function calPayloadToLead(payload: CalWebhookPayload['payload']): ContactLeadData | null {
  if (!payload?.attendees?.length) return null
  const attendee = payload.attendees[0]
  const email = attendee?.email ?? payload.responses?.email?.value
  if (!email) return null
  const phone = payload.responses?.attendeePhoneNumber?.value
  const title = payload.title || payload.type || 'Spotkanie'
  const startTime = payload.startTime ? new Date(payload.startTime).toLocaleString('pl-PL') : ''
  const message = `Cal.com: ${title}${startTime ? ` – ${startTime}` : ''}`
  return {
    email,
    message,
    source: 'Cal.com',
    ...(phone && { phone }),
  }
}

export const POST: APIRoute = async ({ request }) => {
  const origin = request.headers.get('origin')
  const corsHeaders = getCorsHeaders(origin)

  try {
    const text = await request.text()
    const parsed = JSON.parse(text) as unknown

    // Cal.com webhook (server-to-server, no Origin) → add lead to Notion
    if (isCalWebhook(parsed)) {
      const lead = calPayloadToLead(parsed.payload)
      // If we can't build a proper lead (e.g. ping test or other event),
      // just acknowledge the webhook so Cal.com doesn't retry.
      if (lead) {
        await appendLeadToNotion(lead)
      }
      return new Response(null, { status: 200, headers: corsHeaders })
    }

    // Contact form submission → require same-origin
    if (!isAllowedOrigin(origin)) {
      return new Response(null, { status: 403, headers: corsHeaders })
    }

    const data = parsed as ContactLeadData
    if (!data.email) {
      return new Response(null, { status: 400, headers: corsHeaders })
    }

    await appendLeadToNotion(data)
    return new Response(null, { status: 204, headers: corsHeaders })
  } catch (error) {
    console.error('[S3D] Error:', error)
    return new Response(null, { status: 500, headers: corsHeaders })
  }
}
