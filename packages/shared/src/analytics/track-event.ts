import type {
  AnalyticsUser,
  MetaEventName,
  Ga4EventName,
  TrackEventParams,
  TrackEventMeta,
} from './types'
import { loadAnalyticsUser, saveAnalyticsUser, normalizeAnalyticsUser } from './analytics-user-storage'

type PendingEvent<
  TMeta extends MetaEventName = MetaEventName,
  TGa4 extends Ga4EventName = Ga4EventName
> = Required<Pick<TrackEventParams<TMeta, TGa4>, 'eventId'>> & {
  url: string
  eventTime: number
  user?: AnalyticsUser
  meta?: TrackEventMeta<TMeta>
  ga4?: TrackEventParams<TMeta, TGa4>['ga4']
  attempt?: number
  awaitingReady?: boolean
  gaDispatched?: boolean
  capiDispatched?: boolean
}

const COOKIE_NAME = 'cookie-consent'
const pendingEvents: PendingEvent[] = []
let waitingForConsent = false
let waitingForReadiness = false
const MAX_META_RETRIES = 3
const MAX_GA4_RETRIES = 3

const META_STANDARD_EVENTS = new Set<MetaEventName>([
  'PageView',
  'ViewContent',
  'Search',
  'AddToCart',
  'InitiateCheckout',
  'AddPaymentInfo',
  'Purchase',
  'Lead',
  'Contact',
  'CompleteRegistration',
  'ViewCart',
])

function generateEventId(): string {
  if (typeof globalThis !== 'undefined' && globalThis.crypto && 'randomUUID' in globalThis.crypto) {
    return globalThis.crypto.randomUUID()
  }
  return Math.random().toString(36).slice(2)
}

function normalizeUser(user?: AnalyticsUser | null): AnalyticsUser | undefined {
  return normalizeAnalyticsUser(user)
}

function hasUserDifference(previous: AnalyticsUser | undefined, next: AnalyticsUser | undefined): boolean {
  if (!previous && next) return true
  if (previous && !next) return true
  if (!previous || !next) return false

  const previousEntries = Object.entries(previous)
  const nextEntries = Object.entries(next)
  if (previousEntries.length !== nextEntries.length) return true

  const nextMap = new Map(nextEntries)
  for (const [key, value] of previousEntries) {
    if (!Object.is(nextMap.get(key), value)) {
      return true
    }
  }
  return false
}

function mergeUserData(user?: AnalyticsUser, options: { persist?: boolean } = {}): AnalyticsUser | undefined {
  const stored = normalizeUser(loadAnalyticsUser())
  const provided = normalizeUser(user)

  if (!stored && !provided) return undefined

  const merged: AnalyticsUser = {
    ...(stored ?? {}),
    ...(provided ?? {}),
  }

  if (options.persist && provided) {
    if (!stored || hasUserDifference(stored, merged)) {
      saveAnalyticsUser(merged)
    }
  }

  return merged
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const parts = `; ${document.cookie}`.split(`; ${name}=`)
  if (parts.length === 2) return decodeURIComponent(parts.pop()!.split(';').shift()!)
  return null
}

function parseConsent(): Partial<Record<string, 'granted' | 'denied'>> {
  const raw = getCookie(COOKIE_NAME)
  if (!raw) return {}
  try {
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

function isAnalyticsReady(): boolean {
  if (typeof window === 'undefined') return false
  return window.__analyticsReady === true
}

function hasConsentDecision(): boolean {
  return Boolean(getCookie(COOKIE_NAME))
}

function enqueue(
  event: PendingEvent,
  options: { waitForConsent?: boolean; waitForReadiness?: boolean } = {}
): void {
  pendingEvents.push(event)

  if (options.waitForConsent && !waitingForConsent) {
    waitingForConsent = true
    document.addEventListener(
      'cookie_consent_updated',
      () => {
        waitingForConsent = false
        flushQueue()
      },
      { once: true }
    )
  }

  if (options.waitForReadiness && !waitingForReadiness) {
    waitingForReadiness = true
    document.addEventListener(
      'analytics_ready',
      () => {
        waitingForReadiness = false
        flushQueue()
      },
      { once: true }
    )
  }
}

function flushQueue(): void {
  while (pendingEvents.length) {
    const event = pendingEvents.shift()!
    sendEvent(event)
  }
}

function flushFbqQueue(fbqFn: Window['fbq']): void {
  if (typeof window === 'undefined') return
  const queue = window._fbq?.queue
  if (!Array.isArray(queue) || typeof fbqFn.callMethod !== 'function') {
    return
  }

  while (queue.length) {
    const args = queue.shift()
    if (!Array.isArray(args)) continue
    try {
      fbqFn.callMethod.apply(fbqFn, args as [])
    } catch (err) {
      console.error('[Meta] fbq manual flush failed', err)
    }
  }
}

function phoneToE164(raw: string | number | undefined, defaultCountry = '+48'): string | undefined {
  if (raw === undefined || raw === null) return undefined
  const stringified = typeof raw === 'number' ? String(raw) : raw
  const normalized = stringified.replace(/[^ 0-9+]/g, '')
  if (!normalized) return undefined
  if (normalized.startsWith('+')) return normalized
  if (normalized.startsWith('00')) return `+${normalized.slice(2)}`
  return `${defaultCountry}${normalized}`
}

function buildAdvancedMatchingPayload(user?: AnalyticsUser | null): Record<string, string> | null {
  const normalized = normalizeUser(user)
  if (!normalized) return null

  const payload: Record<string, string> = {}

  if (normalized.email) payload.em = normalized.email.trim().toLowerCase()
  if (normalized.phone) {
    const phone = phoneToE164(normalized.phone)
    if (phone) payload.ph = phone
  }
  if (normalized.first_name) payload.fn = normalized.first_name.trim().toLowerCase()
  if (normalized.last_name) payload.ln = normalized.last_name.trim().toLowerCase()
  if (normalized.city) payload.ct = normalized.city.trim().toLowerCase()
  if (normalized.postal_code) payload.zp = normalized.postal_code.trim().toLowerCase()
  if (normalized.country_code) payload.country = normalized.country_code.trim().toLowerCase()
  if (normalized.external_id) payload.external_id = normalized.external_id.toString().trim()

  return Object.keys(payload).length ? payload : null
}

function applyMetaPixelUserData(pixelId: string | undefined | null, payload: Record<string, string>): void {
  if (!pixelId || typeof window === 'undefined') {
    return
  }
  const pixelInstance = window.fbq?.instance?.pixelsByID?.[pixelId]
  if (!pixelInstance) {
    return
  }
  pixelInstance.userData = {
    ...(pixelInstance.userData ?? {}),
    ...payload,
  }
  pixelInstance.userDataFormFields = {
    ...(pixelInstance.userDataFormFields ?? {}),
    ...payload,
  }
}

/**
 * Send Meta event for logging purposes only (when consent is denied).
 * The route will log the event but NOT send it to Meta's API.
 */
function sendMetaLogOnly(event: PendingEvent & { meta: TrackEventMeta }): void {
  const { meta } = event
  const metaBody = {
    event_name: meta.eventName,
    content_name: meta.contentName,
    url: event.url,
    event_id: event.eventId,
    event_time: Math.floor(event.eventTime / 1000),
    user: undefined,
    custom_event_params: meta.params,
    log_only: true,
  }

  if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
    try {
      navigator.sendBeacon(
        '/api/analytics/meta',
        new Blob([JSON.stringify(metaBody)], { type: 'application/json' })
      )
    } catch {
      // Silently fail
    }
  }
}

/**
 * Send GA4 event in cookieless mode (Consent Mode v2)
 * When user denies consent, we can still send anonymized data to GA4.
 */
function sendCookielessGa4Event(event: PendingEvent): void {
  const { ga4 } = event
  if (!ga4 || typeof window.gtag !== 'function') return

  try {
    const safeParams: Record<string, unknown> = {
      event_id: event.eventId,
    }

    if (ga4.params) {
      const allowedKeys = [
        'page_location', 'page_title', 'page_path',
        'search_term',
        'currency', 'value',
        'item_list_id', 'item_list_name',
        'payment_type',
        'transaction_id',
      ]
      for (const key of allowedKeys) {
        if (key in ga4.params) {
          safeParams[key] = (ga4.params as Record<string, unknown>)[key]
        }
      }
      if ('items' in ga4.params && Array.isArray((ga4.params as Record<string, unknown>).items)) {
        const items = (ga4.params as Record<string, unknown>).items as Array<Record<string, unknown>>
        safeParams.items = items.map(item => ({
          item_id: item.item_id,
          item_name: item.item_name,
          quantity: item.quantity,
          price: item.price,
          item_category: item.item_category,
        }))
      }
    }

    window.gtag('event', ga4.eventName, safeParams)
  } catch (error) {
    console.error(`[GA4 Cookieless] trackEvent error for ${ga4.eventName}`, error)
  }
}

function sendEvent(event: PendingEvent): void {
  const { meta, ga4 } = event
  const attempt = event.attempt ?? 0

  const consent = parseConsent()
  const hasConsentCookie = hasConsentDecision()
  const marketingGranted = consent.ad_storage === 'granted' || consent.ad_user_data === 'granted'
  const conversionApiGranted = consent.conversion_api === 'granted'
  const analyticsGranted = consent.analytics_storage === 'granted'

  // If user explicitly denied consent, send cookieless GA4 ping
  const consentDenied = hasConsentCookie && !analyticsGranted && !marketingGranted
  if (consentDenied) {
    if (ga4 && typeof window.gtag === 'function') {
      sendCookielessGa4Event(event)
    }
    if (meta) {
      sendMetaLogOnly(event as PendingEvent & { meta: TrackEventMeta })
    }
    return
  }

  // For full analytics, wait for ready state
  if (!isAnalyticsReady()) {
    if (event.awaitingReady) {
      return
    }
    enqueue({ ...event, awaitingReady: true }, { waitForReadiness: true })
    return
  }

  const processedEvent = event.awaitingReady ? { ...event, awaitingReady: false } : event
  const resolvedUser = mergeUserData(processedEvent.user, { persist: true })
  processedEvent.user = resolvedUser

  const canSendMetaPixel = Boolean(meta && marketingGranted)
  const canSendMetaCapi = Boolean(meta && conversionApiGranted)

  if (meta && (canSendMetaPixel || canSendMetaCapi)) {
    const metaParams = { ...(meta.params ?? {}) } as Record<string, unknown>
    if (meta.contentName) {
      metaParams.content_name = meta.contentName
    }
    const metaPayload = Object.keys(metaParams).length > 0 ? metaParams : {}

    if (canSendMetaCapi && !processedEvent.capiDispatched) {
      const metaBody = {
        event_name: meta.eventName,
        content_name: meta.contentName,
        url: processedEvent.url,
        event_id: processedEvent.eventId,
        event_time: Math.floor(processedEvent.eventTime / 1000),
        user: resolvedUser,
        custom_event_params: meta.params,
      }

      let dispatchedViaBeacon = false
      if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
        try {
          const beaconPayload = JSON.stringify(metaBody)
          const beaconResult = navigator.sendBeacon(
            '/api/analytics/meta',
            new Blob([beaconPayload], { type: 'application/json' })
          )
          if (beaconResult) {
            processedEvent.capiDispatched = true
            dispatchedViaBeacon = true
          }
        } catch (error) {
          console.error('[Meta] sendBeacon failed', error)
        }
      }

      if (!dispatchedViaBeacon) {
        try {
          void fetch('/api/analytics/meta', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            keepalive: true,
            body: JSON.stringify(metaBody),
          }).then(async (res) => {
            if (!res.ok) {
              console.error('[Meta] trackEvent failed', await res.text())
            }
          })
          processedEvent.capiDispatched = true
        } catch (error) {
          console.error('[Meta] trackEvent fetch error', error)
        }
      }
    }

    if (canSendMetaPixel) {
      if (window.__metaPixelAdvancedMatching) {
        const payload = buildAdvancedMatchingPayload(processedEvent.user)
        if (payload) {
          applyMetaPixelUserData(window.__metaPixelId ?? undefined, payload)
        }
      }

      if (typeof window.fbq === 'function') {
        try {
          const method = META_STANDARD_EVENTS.has(meta.eventName) ? 'track' : 'trackCustom'
          const fbqFn = window.fbq
          const args: Parameters<Window['fbq']> = [
            method,
            meta.eventName,
            metaPayload,
            {
              eventID: processedEvent.eventId,
            },
          ]
          if (typeof fbqFn.callMethod === 'function') {
            flushFbqQueue(fbqFn)
            fbqFn.callMethod.apply(fbqFn, args)
            flushFbqQueue(fbqFn)
          } else {
            fbqFn(...args)
            setTimeout(() => {
              flushFbqQueue(fbqFn)
            }, 250)
          }
        } catch (error) {
          console.error('[Meta] fbq tracking failed', error)
        }
      } else if (attempt < MAX_META_RETRIES) {
        setTimeout(() => {
          sendEvent({
            ...processedEvent,
            attempt: attempt + 1,
            gaDispatched: processedEvent.gaDispatched,
            capiDispatched: processedEvent.capiDispatched,
          })
        }, 200)
      }
    }
  }

  const canSendGa4 = Boolean(ga4 && analyticsGranted)

  if (canSendGa4 && ga4) {
    if (typeof window.gtag === 'function') {
      if (!processedEvent.gaDispatched) {
        try {
          const params = { ...(ga4.params ?? {}), event_id: processedEvent.eventId }
          window.gtag('event', ga4.eventName, params)
          processedEvent.gaDispatched = true
        } catch (error) {
          console.error(`[GA4] trackEvent error for ${ga4.eventName}`, error)
        }
      }
    } else if (attempt < MAX_GA4_RETRIES) {
      setTimeout(() => {
        sendEvent({
          ...processedEvent,
          attempt: attempt + 1,
          awaitingReady: false,
          gaDispatched: processedEvent.gaDispatched,
        })
      }, 200)
    }
  }
}

export function trackEvent<
  TMeta extends MetaEventName = MetaEventName,
  TGa4 extends Ga4EventName = Ga4EventName
>(params: TrackEventParams<TMeta, TGa4>): string {
  const eventId = params.eventId ?? generateEventId()

  if (typeof window === 'undefined') {
    return eventId
  }

  const now = Date.now()
  const providedUser = normalizeUser(params.user)
  const event: PendingEvent<TMeta, TGa4> = {
    eventId,
    url: params.url || window.location.href,
    eventTime: now,
    user: providedUser,
    meta: params.meta,
    ga4: params.ga4,
  }

  if (!params.meta && !params.ga4) {
    return eventId
  }

  const needsConsent = !hasConsentDecision()
  const needsReadiness = !isAnalyticsReady()

  if (needsConsent || needsReadiness) {
    enqueue(event, { waitForConsent: needsConsent, waitForReadiness: needsReadiness })
    return eventId
  }

  sendEvent(event)
  return eventId
}

// Expose globally
if (typeof window !== 'undefined') {
  window.trackEvent = trackEvent
}
