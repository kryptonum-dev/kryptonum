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
