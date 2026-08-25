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
 * Short identification of the lead for the mail subject: `@handle` for social
 * profiles, the bare domain for own-brand sites. Share links, video links and
 * numeric profile ids carry no name, so those fall back to the lead's email
 * local part, which always exists and identifies the person.
 */
const GENERIC_SEGMENTS = new Set([
  'share', 'profile.php', 'people', 'groups', 'pages', 'p', 'reel', 'reels',
  'stories', 'story.php', 'watch', 'channel', 'c', 'user', 'shorts', 'video',
  'videos', 'posts', 'photo.php', 'permalink.php', 'events', 'live', 'hashtag',
])

const LINK_ONLY_DOMAINS = /^(?:youtu\.be|fb\.me|vm\.tiktok\.com|vt\.tiktok\.com|l\.facebook\.com|lm\.facebook\.com)$/i

export function deriveProfileTag(profileLink?: string, fallbackEmail?: string): string {
  const emailTag = (fallbackEmail || '').split('@')[0].slice(0, 32)
  const raw = (profileLink || '')
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/^m\./i, '')
    .replace(/[?#].*$/, '')
    .replace(/\/+$/, '')
  if (!raw) return emailTag
  if (raw.startsWith('@')) return raw.slice(0, 32)
  const domain = raw.split('/')[0].toLowerCase()
  if (LINK_ONLY_DOMAINS.test(domain)) return emailTag
  const social = raw.match(/^(?:instagram\.com|facebook\.com|fb\.com|tiktok\.com|youtube\.com)\/(.+)$/i)
  if (social) {
    const handle = social[1].split('/')[0].replace(/^@/, '')
    const isGeneric = GENERIC_SEGMENTS.has(handle.toLowerCase()) || /^[\d.-]+$/.test(handle) || handle.length < 3
    return isGeneric ? emailTag : `@${handle}`.slice(0, 32)
  }
  return domain.slice(0, 32)
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
