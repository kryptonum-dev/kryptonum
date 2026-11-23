/**
 * RT lead automation: instant replies to Richer Together applications.
 *
 * Mail copy lives in a private Sanity document (`_id: rtLeadAutomation`), not
 * in this public repository. The document also acts as the kill switch: with
 * `enabled != true` nothing is ever sent and lead statuses stay untouched.
 */

import { client } from './sanity.fetch'

declare const process: { env: Record<string, string | undefined> }

const RESEND_API_KEY = process.env.RESEND_API_KEY || import.meta.env.RESEND_API_KEY

export type RtMailKind = 'mail1' | 'mail2'

type RtMailTemplate = {
  subject?: string
  body?: string
}

type RtAutomationConfig = {
  enabled?: boolean
  senderName?: string
  senderEmail?: string
  replyTo?: string[]
  bcc?: string[]
  mail1?: RtMailTemplate
  mail2?: RtMailTemplate
}

// Replies from the lead reach the whole trio, and the BCC copy lets the whole
// trio see that the automated mail actually went out.
const DEFAULT_REPLY_TO = ['michal@kryptonum.eu', 'kuba@kryptonum.eu', 'bogumil@kryptonum.eu']
const DEFAULT_BCC = ['michal@kryptonum.eu', 'kuba@kryptonum.eu', 'bogumil@kryptonum.eu']

/**
 * Short identification of the lead for the mail subject: `@handle` for a
 * profile on a social platform, the bare domain for an own-brand site. Share
 * links, video links, numeric ids and a platform's front page carry no name,
 * so those give null and the caller decides what to put in the subject.
 */
const GENERIC_SEGMENTS = new Set([
  'share', 'profile.php', 'people', 'groups', 'pages', 'p', 'reel', 'reels',
  'stories', 'story.php', 'watch', 'channel', 'c', 'user', 'shorts', 'video',
  'videos', 'posts', 'photo.php', 'permalink.php', 'events', 'live', 'hashtag',
  'instagram', 'facebook', 'tiktok', 'youtube', 'home', 'explore', 'feed',
])

/** Short links, redirects and shared documents: the address says nothing about who the person is. */
const NAMELESS_HOSTS =
  /^(?:youtu\.be|fb\.me|fb\.watch|v[mt]\.tiktok\.com|lm?\.facebook\.com|l\.instagram\.com|bit\.ly|tinyurl\.com|t\.co|wa\.me|t\.me|linkedin\.com|(?:[a-z0-9-]+\.)*google\.[a-z.]+)$/i

/**
 * Places where the first part of the path is the person's name. The big
 * platforms are matched whatever ending was typed (youtube.pl, instagram.pl,
 * pl-pl.facebook.com), because people type them from memory.
 */
const HANDLE_HOSTS =
  /(?:^|\.)(?:instagram|facebook|fb|tiktok|youtube|threads|twitter|twitch|pinterest|patreon)\.[a-z.]+$|^(?:x\.com|linktr\.ee|beacons\.ai|naffy\.io)$/i

export function profileTagFromLink(profileLink?: string): string | null {
  const raw = (profileLink || '')
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/[?#].*$/, '')
    .replace(/\/+$/, '')
  if (!raw) return null
  if (raw.startsWith('@')) return raw.slice(0, 32)
  const [host, ...segments] = raw.split('/')
  const domain = host.toLowerCase()
  if (NAMELESS_HOSTS.test(domain)) return null
  if (HANDLE_HOSTS.test(domain)) {
    // youtube.com/c/Name and /user/Name keep the name one step further
    const first = segments[0] || ''
    const named = /^(?:c|user)$/i.test(first) && segments[1] ? segments[1] : first
    const handle = named.replace(/^@/, '')
    const carriesNoName =
      GENERIC_SEGMENTS.has(handle.toLowerCase()) || /^[\d.-]+$/.test(handle) || handle.length < 3 || !/^[\p{L}\p{N}._-]+$/u.test(handle)
    return carriesNoName ? null : `@${handle}`.slice(0, 32)
  }
  return domain.replace(/^m\./, '').slice(0, 32)
}

/**
 * The same tag with the old fallback: the part of the e-mail before the @.
 * Only the mails of the earlier automation use it; the campaign mails fall
 * back to the first name, because "info" or "praca" in a subject reads badly.
 */
export function deriveProfileTag(profileLink?: string, fallbackEmail?: string): string {
  return profileTagFromLink(profileLink) ?? (fallbackEmail || '').split('@')[0].slice(0, 32)
}

let configCache: { data: RtAutomationConfig | null; ts: number } | null = null
const CACHE_TTL_MS = 60_000

export async function getRtAutomationConfig(): Promise<RtAutomationConfig | null> {
  if (configCache && Date.now() - configCache.ts < CACHE_TTL_MS) return configCache.data
  try {
    const doc = await client.fetch<RtAutomationConfig | null>(
      `*[_id == "rtLeadAutomation"][0]{enabled, senderName, senderEmail, replyTo, bcc, mail1{subject, body}, mail2{subject, body}}`,
    )
    configCache = { data: doc, ts: Date.now() }
    return doc
  } catch (error) {
    console.error('[RT Automation] Config fetch failed:', error)
    return null
  }
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function bodyToHtml(body: string): string {
  return body
    .split(/\n{2,}/)
    .map((paragraph) => {
      const withLinks = escapeHtml(paragraph.trim()).replace(
        /https?:\/\/[^\s<]+/g,
        (url) => `<a href="${url}">${url}</a>`,
      )
      return `<p>${withLinks.replace(/\n/g, '<br />')}</p>`
    })
    .join('\n')
}

/**
 * Sends one of the two automation mails. Returns true only when Resend
 * accepted the message, so the caller can record what actually happened.
 */
export async function sendRtAutomationMail(kind: RtMailKind, to: string, profileLink?: string): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.error('[RT Automation] Missing RESEND_API_KEY')
    return false
  }

  const config = await getRtAutomationConfig()
  if (!config?.enabled) return false

  const template = config[kind]
  if (!template?.subject || !template?.body) {
    console.error(`[RT Automation] Template ${kind} is incomplete`)
    return false
  }

  // Per-lead subject: the template carries a {{profil}} placeholder, replaced
  // with the lead's handle or domain. Easy to tell leads apart in the inbox,
  // and it stops Gmail from collapsing every BCC copy into one thread.
  const tag = deriveProfileTag(profileLink, to)
  const subject = template.subject.includes('{{profil}}')
    ? tag
      ? template.subject.replace('{{profil}}', tag)
      : template.subject.replace(/\{\{profil\}\},?\s*/, '')
    : template.subject

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: `${config.senderName || 'Michał Chrapek z Kryptonum'} <${config.senderEmail || 'michal@send.kryptonum.eu'}>`,
        to,
        reply_to: config.replyTo?.length ? config.replyTo : DEFAULT_REPLY_TO,
        bcc: config.bcc?.length ? config.bcc : DEFAULT_BCC,
        subject,
        html: bodyToHtml(template.body),
        text: template.body,
        headers: {
          'X-Entity-Ref-ID': crypto.randomUUID(),
        },
      }),
    })

    if (!response.ok) {
      console.error('[RT Automation] Resend error:', response.status, await response.text())
      return false
    }

    return true
  } catch (error) {
    console.error('[RT Automation] Send failed:', error)
    return false
  }
}
