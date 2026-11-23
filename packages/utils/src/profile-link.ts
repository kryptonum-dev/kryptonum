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

/**
 * The four platforms from the form, whatever ending or prefix was typed:
 * `youtube.pl`, `m.facebook.com`, `pl-pl.facebook.com`. Short links and
 * redirects (`fb.me`, `vm.tiktok.com`) are a different address and stay as they are.
 */
const SHORT_LINK_HOSTS = /^(?:youtu\.be|fb\.me|fb\.watch|v[mt]\.tiktok\.com|lm?\.facebook\.com|l\.instagram\.com)$/i
const PLATFORM_HOSTS: Array<[RegExp, string]> = [
  [/(^|\.)instagram\.[a-z.]+$/i, 'www.instagram.com'],
  [/(^|\.)(?:facebook|fb)\.[a-z.]+$/i, 'www.facebook.com'],
  [/(^|\.)tiktok\.[a-z.]+$/i, 'www.tiktok.com'],
  [/(^|\.)youtube\.[a-z.]+$/i, 'www.youtube.com'],
]

/** The proper address of a social platform for a host somebody typed, or null when it is not one of them. */
export function canonicalSocialHost(host: string): string | null {
  if (SHORT_LINK_HOSTS.test(host)) return null
  return PLATFORM_HOSTS.find(([pattern]) => pattern.test(host))?.[1] ?? null
}

/**
 * Things typed into the profile field that name a platform, not a profile:
 * "fb", "instagram", "youtube.pl". Accepting them produced links such as
 * instagram.com/fb, so the form asks again.
 */
const NOT_A_PROFILE = /^(?:www\.)?(?:instagram|insta|ig|facebook|face|fb|tiktok|tik-tok|tt|youtube|you-tube|yt|google|brak|niemam|nie|none)(?:\.(?:com|pl|eu|net|org|me|co|io|com\.pl))?$/i

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
  if (looksLikeLink) {
    if (!isValidProfileLink(value)) return null
    const [host, ...path] = withoutProtocol.replace(/\/+$/, '').split('/')
    // a platform's front page alone is not a profile
    if (!path.length && canonicalSocialHost(host)) return null
    // youtube.pl/@anna opens nothing useful, www.youtube.com/@anna does
    return `https://${[canonicalSocialHost(host) ?? host, ...path].join('/')}`
  }

  if (NOT_A_PROFILE.test(value.replace(/^@+/, ''))) return null

  const toSocialUrl = SOCIAL_PROFILE_URL[platform]
  if (!toSocialUrl) return isValidProfileLink(value) ? `https://${withoutProtocol}` : null

  const handle = value.replace(/^@+/, '')
  if (!/^[a-z0-9._-]{2,60}$/i.test(handle)) return null
  return toSocialUrl(handle)
}
