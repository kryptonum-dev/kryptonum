export const prerender = false

import { appendLeadToNotion, findLeadByEmail, isRtLeadsDatabase, updateLeadStatus, type ContactLeadData } from '@repo/utils/notion'
import { evaluateRtGate } from '@repo/utils/rt-gate'
import { sendRtAutomationMail } from '@repo/utils/rt-automation'
import { sendSlackNotification } from '@repo/utils/slack'
import { getFormIntegrationConfig } from '@repo/utils/form-config'
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
    metadata?: Record<string, string>
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
  const metadata = payload.metadata ?? {}
  const notionDatabaseId = metadata.notionDatabaseId
  // CalEmbed passes the visitor's captured UTM cookie and the landing path as
  // booking metadata, so bookings attribute to the ad the same way form leads do.
  const utm = (['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const)
    .filter((key) => metadata[key])
    .map((key) => `${key}=${metadata[key]}`)
    .join('\n')
  return {
    email,
    message,
    source: metadata.sourcePath || 'Cal.com',
    status: 'Rozmowa umówiona',
    ...(utm && { utm }),
    ...(phone && { phone }),
    ...(notionDatabaseId && { notionDatabaseId }),
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
        // A booking usually follows a form submission from the same person:
        // update that record instead of creating a duplicate.
        const databaseId = lead.notionDatabaseId
          || process.env.NOTION_LEADS_DATABASE_ID
          || import.meta.env.NOTION_LEADS_DATABASE_ID
        const existingLeadId = databaseId ? await findLeadByEmail(databaseId, lead.email) : null
        if (existingLeadId) {
          await updateLeadStatus(existingLeadId, 'Rozmowa umówiona')
        } else {
          await appendLeadToNotion(lead)
        }
      }
      return new Response(null, { status: 200, headers: corsHeaders })
    }

    // Contact form submission → require same-origin
    if (!isAllowedOrigin(origin)) {
      return new Response(null, { status: 403, headers: corsHeaders })
    }

    const { formId, ...leadData } = parsed as ContactLeadData & { formId?: string }
    if (!leadData.email) {
      return new Response(null, { status: 400, headers: corsHeaders })
    }

    const config = formId ? await getFormIntegrationConfig(formId) : {}
    if (config.notionDatabaseId) {
      leadData.notionDatabaseId = config.notionDatabaseId
    }

    // RT automation: instant reply matching the qualification gate. Statuses
    // are only advanced when a mail was actually accepted for delivery, and
    // submissions without a usable profile link (only possible by bypassing
    // the form) are archived without any mail.
    const targetDatabaseId = leadData.notionDatabaseId
      || process.env.NOTION_LEADS_DATABASE_ID
      || import.meta.env.NOTION_LEADS_DATABASE_ID
    if (isRtLeadsDatabase(targetDatabaseId)) {
      const gate = evaluateRtGate(leadData)
      if (gate === 'junk') {
        leadData.status = 'Archiwum'
      } else {
        const mailKind = gate === 'qualified' ? 'mail1' : 'mail2'
        const sent = await sendRtAutomationMail(mailKind, leadData.email, leadData.socialMediaLinks)
        if (sent) {
          leadData.status = mailKind === 'mail1' ? 'W trakcie' : 'Do weryfikacji'
          leadData.automatMail = mailKind
          leadData.automatDate = new Date().toISOString()
        }
      }
    }

    await appendLeadToNotion(leadData)

    if (config.slackWebhookUrl) {
      sendSlackNotification(config.slackWebhookUrl, leadData).catch((err) =>
        console.error('[S3D] Slack notification failed:', err)
      )
    }

    return new Response(null, { status: 204, headers: corsHeaders })
  } catch (error) {
    console.error('[S3D] Error:', error)
    return new Response(null, { status: 500, headers: corsHeaders })
  }
}
