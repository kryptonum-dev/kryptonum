export const prerender = false

import type { APIRoute } from 'astro'
import sanityFetch from '@repo/utils/sanity.fetch'
import { getCookie } from '@repo/utils/get-cookie'
import { hash } from '@repo/utils/hash'

type MetaRequestBody = {
  event_name: string
  event_id?: string
  url?: string
  event_time?: number
  content_name?: string
  user?: {
    email?: string
    phone?: string
    first_name?: string
    last_name?: string
    external_id?: string
    postal_code?: string
    city?: string
    country_code?: string
  }
  custom_event_params?: Record<string, unknown>
  log_only?: boolean
}

type MetaAnalyticsConfig = {
  metaPixelId: string | null
  metaConversionToken: string | null
}

type MetaUserData = Record<string, string | string[] | undefined>

type MetaEventPayload = {
  event_name: string
  event_time: number
  event_id: string
  action_source: 'website'
  user_data: MetaUserData
  event_source_url?: string
  content_name?: string
  custom_data?: Record<string, unknown>
}

const META_ANALYTICS_QUERY = `
  {
    "metaPixelId": *[_type == "analytics"][0].meta_pixel_id,
    "metaConversionToken": *[_type == "analytics"][0].meta_conversion_token
  }
`

async function getMetaAnalyticsConfig(): Promise<MetaAnalyticsConfig> {
  const data = await sanityFetch<MetaAnalyticsConfig>({
    query: META_ANALYTICS_QUERY,
  })

  return {
    metaPixelId: data?.metaPixelId ?? null,
    metaConversionToken: data?.metaConversionToken ?? null,
  }
}

function phoneToE164(raw?: string, defaultCountry = '+48'): string | undefined {
  if (!raw) return undefined
  let v = raw.replace(/\s+/g, '').trim()
  if (!v) return undefined
  if (!v.startsWith('+')) {
    if (v.startsWith('0')) v = v.replace(/^0+/, '')
    v = `${defaultCountry}${v}`
  }
  return v
}

function computeFbc(fbcCookie?: string | null, urlOrRef?: string): string | undefined {
  if (fbcCookie) return fbcCookie || undefined
  const src = urlOrRef || ''
  const m = src.match(/[?&]fbclid=([^&#]+)/)
  if (!m?.[1]) return undefined
  const ts = Math.floor(Date.now() / 1000)
  return `fb.1.${ts}.${m[1]}`
}

async function postWithRetry(url: string, body: unknown, maxRetries = 2): Promise<Response> {
  let attempt = 0
  let lastErr: unknown

  while (attempt <= maxRetries) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.status >= 500 || res.status === 429) {
        attempt++
        if (attempt > maxRetries) return res
        const wait = attempt === 1 ? 1000 : 3000
        await new Promise((r) => setTimeout(r, wait))
        continue
      }
      return res
    } catch (err) {
      lastErr = err
      attempt++
      if (attempt > maxRetries) throw lastErr
      const wait = attempt === 1 ? 1000 : 3000
      await new Promise((r) => setTimeout(r, wait))
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error('request failed')
}

export const POST: APIRoute = async ({ request }) => {
  let config: MetaAnalyticsConfig
  try {
    config = await getMetaAnalyticsConfig()
  } catch (error) {
    console.error('[CAPI] Config error:', error)
    return new Response(JSON.stringify({ success: false, message: 'Meta not configured' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    })
  }

  const pixelId = config.metaPixelId
  const accessToken = config.metaConversionToken

  if (!pixelId || !accessToken) {
    console.error('[CAPI] Missing Pixel ID or Token')
    return new Response(JSON.stringify({ success: false, message: 'Meta not configured' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    })
  }

  let body: MetaRequestBody
  try {
    body = (await request.json()) as MetaRequestBody
  } catch {
    return new Response(JSON.stringify({ success: false, message: 'Invalid JSON' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    })
  }

  if (!body?.event_name) {
    return new Response(JSON.stringify({ success: false, message: 'event_name is required' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    })
  }

  const event_id = body.event_id || crypto.randomUUID()

  // Log-only mode (consent denied)
  if (body.log_only) {
    console.log(`[CAPI] LOG_ONLY: ${body.event_name} (${event_id})`)
    return new Response(JSON.stringify({ success: true, logged_only: true }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
  }

  // Check consent
  const consentRaw = getCookie('cookie-consent', request.headers)
  let conversion_api = 'denied'
  let advanced_matching = 'denied'

  if (consentRaw) {
    try {
      const parsed = JSON.parse(consentRaw) as {
        conversion_api?: string
        advanced_matching?: string
      }
      conversion_api = parsed.conversion_api ?? 'denied'
      advanced_matching = parsed.advanced_matching ?? 'denied'
    } catch {
      // Invalid consent cookie
    }
  }

  if (conversion_api !== 'granted') {
    return new Response(JSON.stringify({ success: false, message: 'Conversion API not permitted' }), {
      status: 403,
      headers: { 'content-type': 'application/json' },
    })
  }

  // Extract request metadata
  const forwardedIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  const realIp = request.headers.get('x-real-ip') || undefined
  const ip = forwardedIp || realIp
  const ua = request.headers.get('user-agent') || undefined
  const referer = request.headers.get('referer') || undefined
  const fbp = getCookie('_fbp', request.headers) || undefined
  const fbc = computeFbc(getCookie('_fbc', request.headers), body.url || referer)

  const event_time = typeof body.event_time === 'number' ? body.event_time : Math.floor(Date.now() / 1000)
  const event_source_url = body.url || referer

  // Build user data
  const user_data: MetaUserData = {}
  if (ip) user_data.client_ip_address = ip
  if (ua) user_data.client_user_agent = ua
  if (fbp) user_data.fbp = fbp
  if (fbc) user_data.fbc = fbc

  // Add advanced matching data if consented
  if (advanced_matching === 'granted' && body.user) {
    const em = body.user.email?.trim().toLowerCase()
    const ph = phoneToE164(body.user.phone)
    const fn = body.user.first_name?.trim().toLowerCase()
    const ln = body.user.last_name?.trim().toLowerCase()
    const xid = body.user.external_id?.toString().trim().toLowerCase()
    const zip = body.user.postal_code?.trim().toLowerCase()
    const ct = body.user.city?.trim().toLowerCase()
    const country = body.user.country_code?.trim().toLowerCase()

    if (em) user_data.em = [await hash(em)]
    if (ph) user_data.ph = [await hash(ph)]
    if (fn) user_data.fn = [await hash(fn)]
    if (ln) user_data.ln = [await hash(ln)]
    if (xid) user_data.external_id = [await hash(xid)]
    if (zip) user_data.zp = [await hash(zip)]
    if (ct) user_data.ct = [await hash(ct)]
    if (country) user_data.country = [await hash(country)]
  }

  // Build event payload
  const data: MetaEventPayload = {
    event_name: body.event_name,
    event_time,
    event_id,
    action_source: 'website',
    user_data,
  }
  if (event_source_url) data.event_source_url = event_source_url
  if (body.content_name) data.content_name = body.content_name
  if (body.custom_event_params) data.custom_data = body.custom_event_params

  const url = `https://graph.facebook.com/v23.0/${encodeURIComponent(pixelId)}/events?access_token=${encodeURIComponent(accessToken)}`

  try {
    const res = await postWithRetry(url, { data: [data] })
    const json = (await res.json().catch(() => ({}))) as Record<string, unknown>

    if (!res.ok) {
      console.error(`[CAPI] ❌ ${body.event_name} (${event_id}):`, json)
      return new Response(JSON.stringify({ success: false, message: 'Meta API error' }), {
        status: res.status,
        headers: { 'content-type': 'application/json' },
      })
    }

    console.log(`[CAPI] ✓ ${body.event_name} (${event_id})`)
    return new Response(JSON.stringify({ success: true, event_id }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
  } catch (err) {
    console.error(`[CAPI] ❌ ${body.event_name} failed:`, err instanceof Error ? err.message : err)
    return new Response(JSON.stringify({ success: false, message: 'Request failed' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    })
  }
}
