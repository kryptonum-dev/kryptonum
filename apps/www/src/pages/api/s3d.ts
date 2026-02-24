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

export const POST: APIRoute = async ({ request }) => {
  const origin = request.headers.get('origin')
  const corsHeaders = getCorsHeaders(origin)

  // Reject requests from non-allowed origins
  if (!isAllowedOrigin(origin)) {
    return new Response(null, { status: 403, headers: corsHeaders })
  }

  try {
    const text = await request.text()
    const data = JSON.parse(text) as ContactLeadData

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
