/**
 * Normalizes personal data for Meta (Pixel + Conversions API).
 *
 * These rules mirror what `fbevents.js` does to a value in the browser before it
 * computes SHA-256 (SignalsFBEventsPixelPIISchema + SignalsFBEventsNormalizers).
 * That is the whole point of this file: if the server normalizes differently than
 * the pixel, it sends a hash of a different string for the same person. Meta does
 * not report an error, it simply fails to match.
 *
 * Use this module on both sides (client and /api/analytics/meta).
 */

type MetaField = 'em' | 'ph' | 'fn' | 'ln' | 'ct' | 'zp' | 'country' | 'external_id'

const HASHED = /^[a-f0-9]{64}$/i
const EMAIL =
  /^[\w!#$%&'*+/=?^`{|}~-]+(?:\.[\w!#$%&'*+/=?^`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i
/** strip: 'whitespace_and_punctuation' - keeps diacritics */
const PUNCTUATION = /[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~\s]+/g
/** strip: 'all_non_latin_alpha_numeric' - drops diacritics too */
const NON_ALPHANUMERIC = /[^a-z0-9]+/g

/**
 * Digits only, with country code, no `+` and no leading zeros.
 * A national number gets `defaultCountryCode` unless it already starts with it.
 * Safe for PL: no 9-digit national number starts with 48.
 */
function normalizePhone(value: string, defaultCountryCode = '48'): string | null {
  const isInternational = value.startsWith('+')
  let digits = value.replace(/\D/g, '')
  if (!digits) return null

  if (!isInternational) {
    if (digits.startsWith('00')) digits = digits.slice(2)
    else {
      digits = digits.replace(/^0+/, '')
      if (!digits.startsWith(defaultCountryCode)) digits = `${defaultCountryCode}${digits}`
    }
  }

  digits = digits.replace(/^0+/, '')
  return digits.length >= 6 && digits.length <= 15 ? digits : null
}

function normalize(field: MetaField, raw?: string | number | null): string | null {
  if (raw === undefined || raw === null) return null
  const value = String(raw).trim()
  if (!value) return null
  if (HASHED.test(value)) return value.toLowerCase()

  const lower = value.toLowerCase()

  switch (field) {
    case 'em': {
      // the pixel also trims a single trailing comma
      const email = (lower.endsWith(',') ? lower.slice(0, -1) : lower).trim()
      return EMAIL.test(email) ? email : null
    }
    case 'ph':
      return normalizePhone(value)
    case 'fn':
    case 'ln':
      return lower.replace(PUNCTUATION, '') || null
    case 'ct': {
      const city = lower.replace(NON_ALPHANUMERIC, '')
      return /^[a-z]/.test(city) ? city : null
    }
    case 'zp': {
      const postalCode = (lower.split('-', 1)[0] ?? '').trim()
      return postalCode.length >= 2 ? postalCode : null
    }
    case 'country': {
      // expects an ISO-3166 alpha-2 code; the pixel falls back to the first two
      // letters for anything it cannot map, so we do the same
      const iso = lower.replace(/[^a-z]/g, '').slice(0, 2)
      return iso.length === 2 ? iso : null
    }
    case 'external_id':
      return lower.replace(/\s+/g, '') || null
    default:
      return null
  }
}

export type RawUser = {
  email?: string | null
  phone?: string | number | null
  first_name?: string | null
  last_name?: string | null
  city?: string | null
  postal_code?: string | null
  country_code?: string | null
  external_id?: string | number | null
}

/** Raw user input to Meta field names, ready to be hashed. Drops anything invalid. */
export function normalizeUserFields(user?: RawUser | null): Partial<Record<MetaField, string>> {
  if (!user) return {}

  const source: Array<[MetaField, string | number | null | undefined]> = [
    ['em', user.email],
    ['ph', user.phone],
    ['fn', user.first_name],
    ['ln', user.last_name],
    ['ct', user.city],
    ['zp', user.postal_code],
    ['country', user.country_code],
    ['external_id', user.external_id],
  ]

  const out: Partial<Record<MetaField, string>> = {}
  for (const [field, raw] of source) {
    const value = normalize(field, raw)
    if (value) out[field] = value
  }
  return out
}
