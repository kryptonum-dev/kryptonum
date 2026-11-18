/**
 * Slack side of the campaign leads: every message about a lead goes to one
 * channel (#krypto-leady) and carries the link to the lead's Notion record.
 *
 * Every message opens with an icon, so the channel can be read by eye:
 * 📞 call this lead, ✉️ questions went out by mail, ⭐ big profile without
 * sales, 🚫 a decline is on its way, 🗑️ spam, 📋 the morning list,
 * ⏸️ a decline was held back, ⚠️ something failed, 🧪 a test submission.
 */

declare const process: { env: Record<string, string | undefined> }

const SLACK_LEADS_WEBHOOK_URL = process.env.SLACK_LEADS_WEBHOOK_URL || import.meta.env.SLACK_LEADS_WEBHOOK_URL

export const SLACK_MICHAL = '<@U04CMLMQNM7>'
export const SLACK_KUBA = '<@U02CMFAPYQ4>'
export const SLACK_BOGUMIL = '<@U04FHCHV7QV>'

/** Escapes what a lead typed, so it cannot break Slack formatting or forge a mention. */
export const slackSafe = (value?: string) => (value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export const slackLink = (href: string, label: string) => `<${href}|${slackSafe(label)}>`

/**
 * A link to an address the lead typed, shown without "https://www." so it reads
 * at a glance. Anything that is not a plain web address is shown as text.
 */
export const slackUserLink = (href: string | undefined) => {
  if (!href) return ''
  try {
    const url = new URL(href)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return slackSafe(href)
    const label = `${url.hostname.replace(/^www\./, '')}${url.pathname.replace(/\/$/, '')}`
    return `<${url.href.replace(/[<>|]/g, (char) => encodeURIComponent(char))}|${slackSafe(label)}>`
  } catch {
    return slackSafe(href)
  }
}

/** Posts plain mrkdwn to the leads channel. Quietly does nothing until the webhook address is set. */
export async function postToLeadsChannel(message: string): Promise<boolean> {
  if (!SLACK_LEADS_WEBHOOK_URL) {
    console.warn('[Leads] SLACK_LEADS_WEBHOOK_URL is not set, Slack message skipped')
    return false
  }
  try {
    const response = await fetch(SLACK_LEADS_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message, unfurl_links: false, unfurl_media: false }),
    })
    if (!response.ok) console.error('[Leads] Slack error:', response.status, await response.text())
    return response.ok
  } catch (error) {
    console.error('[Leads] Slack post failed:', error)
    return false
  }
}
