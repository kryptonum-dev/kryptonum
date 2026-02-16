export const prerender = false

import { appendLeadToSheet, type ContactLeadData } from '@repo/utils/google-sheets'
import type { APIRoute } from 'astro'
import { DOMAIN } from '@repo/shared/constants'

const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY || import.meta.env.TURNSTILE_SECRET_KEY

type RequestData = ContactLeadData & {
  turnstileToken?: string
}

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

export const POST: APIRoute = async ({ request }) => {
  const origin = request.headers.get('origin')
  const corsHeaders = getCorsHeaders(origin)

  try {
    const text = await request.text()
    const data = JSON.parse(text) as RequestData

    // Basic validation
    if (!data.email) {
      return new Response(null, { status: 400, headers: corsHeaders })
    }

    // Verify Turnstile token
    if (!data.turnstileToken) {
      console.log('[S3D] Missing Turnstile token')
      return new Response(null, { status: 400, headers: corsHeaders })
    }

    const turnstileResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: TURNSTILE_SECRET_KEY,
        response: data.turnstileToken,
      }),
    })
    const turnstileResult = await turnstileResponse.json() as { success: boolean }

    if (!turnstileResult.success) {
      console.log('[S3D] Turnstile verification failed')
      return new Response(null, { status: 403, headers: corsHeaders })
    }

    // Remove turnstileToken before passing to sheet
    const { turnstileToken: _, ...leadData } = data
    await appendLeadToSheet(leadData)
    return new Response(null, { status: 204, headers: corsHeaders })
  } catch (error) {
    console.error('[S3D] Error:', error)
    return new Response(null, { status: 500, headers: corsHeaders })
  }
}
