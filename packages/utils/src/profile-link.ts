/**
 * Turns a social media profile value into a usable href.
 *
 * Accepts what people actually type: `@anna`, `anna`, `instagram.com/anna`,
 * `facebook.com/anna` or a full URL. Returns `null` when the value is a bare
 * handle without a domain, so the caller can render it as plain text instead
 * of a link that leads nowhere.
 */
export function profileLinkToHref(value: string): string | null {
  const handle = value.trim().replace(/^@+/, '')
  if (!handle) return null
  if (/^https?:\/\//i.test(handle)) return handle
  if (!handle.includes('.')) return null
  return `https://${handle}`
}

/**
 * Checks whether the value points at an actual social profile: a URL with a
 * domain (instagram.com/anna, own domain) or an `@handle`. Rejects what spam
 * submissions actually contain: email addresses, bare names with spaces,
 * phone numbers and random strings. Gates the Meta `Lead` event, so keep it
 * strict rather than forgiving.
 */
export function isValidProfileLink(value: string): boolean {
  const v = value.trim()
  if (!v || /\s/.test(v)) return false
  if (/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(v)) return false
  if (/^@[a-z0-9._-]{2,}$/i.test(v)) return true
  const stripped = v.replace(/^https?:\/\//i, '').replace(/^www\./i, '')
  if (!stripped.includes('.')) return false
  return /^[a-z0-9-]+(\.[a-z0-9-]+)+(\/[^\s]*)?$/i.test(stripped)
}
