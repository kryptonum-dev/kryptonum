export const prerender = false

import { appendLeadToSheet, type ContactLeadData } from '@repo/utils/google-sheets'
import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request }) => {
  try {
    // sendBeacon sends as text/plain, so parse manually
    const text = await request.text()
    const data = JSON.parse(text) as ContactLeadData

    // Basic validation
    if (!data.email) {
      return new Response(null, { status: 400 })
    }

    await appendLeadToSheet(data)
    return new Response(null, { status: 204 })
  } catch (error) {
    console.error('[S3D] Error:', error)
    return new Response(null, { status: 500 })
  }
}
