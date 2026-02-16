/**
 * UTM Storage Utility
 *
 * Stores UTM parameters and referrer data in a cookie that is shared
 * across all subdomains (*.kryptonum.eu).
 *
 * Features:
 * - Captures UTM params from URL on page load
 * - Falls back to document.referrer when no UTM present
 * - Overwrites existing data when new UTM params are detected
 * - Formats data for Google Sheets integration
 */

const UTM_COOKIE_NAME = 'kryptonum_utm'
const UTM_COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days in seconds
const COOKIE_DOMAIN = '.kryptonum.eu'

// Standard UTM parameters
const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const

export type UtmData = {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  referrer?: string
  captured_at: number
}

// --- Cookie Helpers ---

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

/**
 * Get the cookie domain based on the current hostname.
 * Uses .kryptonum.eu for production, but allows localhost for development.
 */
function getCookieDomain(): string {
  if (!isBrowser()) return COOKIE_DOMAIN

  const hostname = window.location.hostname

  // Development: don't set domain for localhost
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return ''
  }

  // Production: use shared domain for all subdomains
  return COOKIE_DOMAIN
}

/**
 * Parse a cookie string to extract a specific cookie value.
 */
function getCookie(name: string): string | null {
  if (!isBrowser()) return null

  const cookies = document.cookie.split(';')
  for (const cookie of cookies) {
    const [cookieName, ...cookieValueParts] = cookie.trim().split('=')
    if (cookieName === name) {
      const cookieValue = cookieValueParts.join('=')
      try {
        return decodeURIComponent(cookieValue)
      } catch {
        return cookieValue
      }
    }
  }
  return null
}

/**
 * Set a cookie with proper security attributes.
 */
function setCookie(name: string, value: string, maxAge: number): void {
  if (!isBrowser()) return

  const domain = getCookieDomain()
  const isSecure = window.location.protocol === 'https:'

  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    `path=/`,
    `max-age=${maxAge}`,
    `SameSite=Lax`, // Allows cookie to be sent on top-level navigations
  ]

  // Only set domain for production (not localhost)
  if (domain) {
    parts.push(`Domain=${domain}`)
  }

  // Only set Secure flag on HTTPS
  if (isSecure) {
    parts.push('Secure')
  }

  document.cookie = parts.join('; ')
}

/**
 * Delete a cookie by setting its expiration to the past.
 */
function deleteCookie(name: string): void {
  if (!isBrowser()) return

  const domain = getCookieDomain()
  const parts = [`${name}=`, `path=/`, `max-age=0`]

  if (domain) {
    parts.push(`Domain=${domain}`)
  }

  document.cookie = parts.join('; ')
}

// --- UTM Data Helpers ---

/**
 * Extract UTM parameters from the current URL.
 * Returns null if no UTM params are present.
 */
function extractUtmFromUrl(): Partial<UtmData> | null {
  if (!isBrowser()) return null

  const params = new URLSearchParams(window.location.search)
  const utmData: Partial<UtmData> = {}
  let hasUtm = false

  for (const param of UTM_PARAMS) {
    const value = params.get(param)
    if (value) {
      utmData[param] = value.trim()
      hasUtm = true
    }
  }

  return hasUtm ? utmData : null
}

/**
 * Extract and parse the referrer domain.
 * Returns null if referrer is empty or same domain.
 */
function extractReferrer(): string | null {
  if (!isBrowser()) return null

  const referrer = document.referrer
  if (!referrer) return null

  try {
    const referrerUrl = new URL(referrer)
    const currentHost = window.location.hostname

    // Ignore self-referrals (same domain or subdomains)
    if (
      referrerUrl.hostname === currentHost ||
      referrerUrl.hostname.endsWith('.kryptonum.eu') ||
      currentHost.endsWith(referrerUrl.hostname)
    ) {
      return null
    }

    // Return just the hostname (e.g., "google.com", "facebook.com")
    return referrerUrl.hostname.replace(/^www\./, '')
  } catch {
    return null
  }
}

// --- Public API ---

/**
 * Load UTM data from cookie.
 */
export function loadUtmData(): UtmData | null {
  const raw = getCookie(UTM_COOKIE_NAME)
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as UtmData
    // Validate structure
    if (typeof parsed.captured_at !== 'number') {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

/**
 * Save UTM data to cookie.
 */
export function saveUtmData(data: UtmData): void {
  try {
    const json = JSON.stringify(data)
    setCookie(UTM_COOKIE_NAME, json, UTM_COOKIE_MAX_AGE)

    // Dispatch event for any listeners
    document.dispatchEvent(
      new CustomEvent('utm_data_updated', { detail: data })
    )
  } catch (error) {
    console.error('[UTM Storage] Failed to save UTM data:', error)
  }
}

/**
 * Clear UTM data from cookie.
 */
export function clearUtmData(): void {
  deleteCookie(UTM_COOKIE_NAME)
  document.dispatchEvent(
    new CustomEvent('utm_data_updated', { detail: null })
  )
}

/**
 * Capture UTM data from the current page.
 * Should be called on every page load.
 *
 * Logic:
 * 1. If URL has UTM params → save them (overwriting any existing data)
 * 2. If no UTM params and no existing data → try to capture referrer
 * 3. If no UTM params but has existing data → keep existing data
 */
export function captureUtmData(): UtmData | null {
  if (!isBrowser()) return null

  const urlUtm = extractUtmFromUrl()

  // If URL has UTM params, always save (overwrite existing)
  if (urlUtm) {
    const data: UtmData = {
      ...urlUtm,
      captured_at: Date.now(),
    }
    saveUtmData(data)
    return data
  }

  // Check for existing data
  const existing = loadUtmData()
  if (existing) {
    // Keep existing UTM data
    return existing
  }

  // No UTM in URL and no existing data → try referrer as fallback
  const referrer = extractReferrer()
  if (referrer) {
    const data: UtmData = {
      referrer,
      captured_at: Date.now(),
    }
    saveUtmData(data)
    return data
  }

  return null
}

/**
 * Format UTM data as multiline string for Google Sheets.
 *
 * Example output:
 * utm_source=google
 * utm_medium=cpc
 * utm_campaign=summer_sale
 *
 * Or for referrer fallback:
 * referrer=facebook.com
 */
export function formatUtmForSheet(data: UtmData | null): string {
  if (!data) return ''

  const lines: string[] = []

  // Add UTM params in preferred order
  for (const param of UTM_PARAMS) {
    const value = data[param]
    if (value) {
      lines.push(`${param}=${value}`)
    }
  }

  // Add referrer if present (and no UTM params)
  if (data.referrer && lines.length === 0) {
    lines.push(`referrer=${data.referrer}`)
  }

  return lines.join('\n')
}

/**
 * Convenience function: load UTM from storage and format for Google Sheets.
 */
export function getUtmForSheet(): string {
  return formatUtmForSheet(loadUtmData())
}
