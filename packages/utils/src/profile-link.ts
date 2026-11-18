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
  const stripped = v.replace(/^https?:\/\//i, '').replace(/^www\./i, '')
  if (!stripped.includes('.')) return false
  return /^[a-z0-9-]+(\.[a-z0-9-]+)+(\/[^\s]*)?$/i.test(stripped)
}

const SOCIAL_PROFILE_URL: Record<string, (handle: string) => string> = {
  Instagram: (handle) => `https://www.instagram.com/${handle}`,
  TikTok: (handle) => `https://www.tiktok.com/@${handle}`,
  YouTube: (handle) => `https://www.youtube.com/@${handle}`,
  Facebook: (handle) => `https://www.facebook.com/${handle}`,
}

/**
 * Builds a working profile link from what a creator types into the form.
 *
 * She picks the platform and gives either the profile name (`fitania`,
 * `@fitania`, `ania.fit`) or a pasted link. A pasted link wins as it is. A bare
 * name becomes that platform's address, so the handle never has to match
 * across platforms and the link in Notion always opens. With "Inna strona"
 * only a real address passes. Returns null when nothing usable was given.
 */
export function buildProfileLink(platform: string, raw: string): string | null {
  const value = raw.trim()
  if (!value || /\s/.test(value)) return null

  const withoutProtocol = value.replace(/^https?:\/\//i, '').replace(/^www\./i, '')
  const looksLikeLink = /^https?:\/\//i.test(value) || /^[a-z0-9-]+(\.[a-z0-9-]+)+\/.+/i.test(withoutProtocol)
  if (looksLikeLink) return isValidProfileLink(value) ? `https://${withoutProtocol.replace(/\/+$/, '')}` : null

  const toSocialUrl = SOCIAL_PROFILE_URL[platform]
  if (!toSocialUrl) return isValidProfileLink(value) ? `https://${withoutProtocol}` : null

  const handle = value.replace(/^@+/, '')
  if (!/^[a-z0-9._-]{2,60}$/i.test(handle)) return null
  return toSocialUrl(handle)
}
