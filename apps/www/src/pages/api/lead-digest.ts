export const prerender = false

import type { APIRoute } from 'astro'
import {
  IT_LEADS_DATABASE_ID,
  RT_LEADS_DATABASE_ID,
  getLeadSettings,
  queryLeadPages,
  readDate,
  readPhone,
  readSelect,
  readText,
  readTitle,
  type NotionPage,
} from '@repo/utils/lead-notion'
import { businessDaysBetween, warsawParts } from '@repo/utils/lead-schedule'
import { SLACK_BOGUMIL, SLACK_KUBA, SLACK_MICHAL, postToLeadsChannel, slackLink, slackSafe } from '@repo/utils/lead-slack'
import { signLeadId } from '@repo/utils/lead-sign'
import { DOMAIN } from '@repo/shared/constants'

/**
 * The morning list for whoever handles the leads, posted to Slack on weekdays.
 * It reads Notion statuses, so it is only as true as they are: a lead that
 * got an answer but still says "Nowe" comes back here every morning until
 * somebody moves it.
 */

const OPEN_STATUSES = ['Nowe', 'W trakcie', 'Rozmowa umówiona']
const HOUR = 60 * 60 * 1000
const CLOSE_AFTER_BUSINESS_DAYS = 5

const sameWarsawDay = (a: Date, b: Date) => {
  const first = warsawParts(a)
  const second = warsawParts(b)
  return first.year === second.year && first.month === second.month && first.day === second.day
}

const item = (page: NotionPage, detail: string) =>
  `• ${slackLink(page.url, readTitle(page) || 'bez nazwy')}${detail ? ` · ${slackSafe(detail)}` : ''}`

function sortLeads(pages: NotionPage[], kind: 'RT' | 'IT', now: Date) {
  const call: string[] = []
  const nudge: string[] = []
  const waiting: string[] = []
  const today: string[] = []
  const close: string[] = []

  for (const page of pages) {
    // Test submissions (+test address) stay in Notion as examples, the list skips them.
    if (readTitle(page).startsWith('[TEST]')) continue
    const status = readSelect(page, 'Status')
    const path = readSelect(page, 'Ścieżka')
    const phone = readPhone(page)

    if (status === 'Nowe') {
      const mailAt = readDate(page, 'Automat: wysyłka') ?? readDate(page, 'Data') ?? new Date(page.created_time)
      if (now.getTime() - mailAt.getTime() < 20 * HOUR) continue
      const silentFor = businessDaysBetween(mailAt, now)
      if (silentFor >= CLOSE_AFTER_BUSINESS_DAYS) {
        close.push(item(page, `${kind}, cisza od ${silentFor} dni roboczych`))
      } else if (kind === 'IT' && path === 'Telefon') {
        call.push(item(page, `IT, ${phone}, jeszcze bez rozmowy`))
      } else if (phone) {
        call.push(item(page, `${kind}, ${phone}, nie odpisał(a) na maila`))
      } else {
        nudge.push(item(page, `${kind}, bez numeru`))
      }
    }

    if (status === 'W trakcie') {
      const idleFor = businessDaysBetween(new Date(page.last_edited_time), now)
      if (idleFor >= 1) waiting.push(item(page, `${kind}, bez ruchu od ${idleFor} ${idleFor === 1 ? 'dnia roboczego' : 'dni roboczych'}`))
    }

    if (status === 'Rozmowa umówiona') {
      const meeting = readDate(page, 'Rozmowa')
      if (meeting && sameWarsawDay(meeting, now)) {
        const time = warsawParts(meeting)
        today.push(item(page, `${kind}, ${time.hour}:${String(time.minute).padStart(2, '0')}${phone ? `, ${phone}` : ''}`))
      }
    }
  }
  return { call, nudge, waiting, today, close }
}

/**
 * Automatic declines that go out later today. They are listed with a link
 * that holds them back, so nobody is turned down only because the Slack
 * message about them came in the evening.
 */
async function declinesToday(pages: NotionPage[], kind: 'RT' | 'IT', now: Date): Promise<string[]> {
  const lines: string[] = []
  for (const page of pages) {
    if (readTitle(page).startsWith('[TEST]')) continue
    const sendAt = readDate(page, 'Automat: wysyłka')
    if (!sendAt || sendAt <= now || !sameWarsawDay(sendAt, now) || !readText(page, 'Automat: ID')) continue
    const time = warsawParts(sendAt)
    const hold = slackLink(`${DOMAIN}/api/lead-hold?p=${page.id}&s=${await signLeadId(page.id)}`, 'wstrzymaj')
    lines.push(`${item(page, `${kind}, odmowa o ${time.hour}:${String(time.minute).padStart(2, '0')}`)} · ${hold}`)
  }
  return lines
}

export const GET: APIRoute = async ({ request }) => {
  const secret = process.env.CRON_SECRET || import.meta.env.CRON_SECRET
  if (!secret) return new Response('CRON_SECRET is not set', { status: 503 })
  if (request.headers.get('authorization') !== `Bearer ${secret}`) return new Response('Unauthorized', { status: 401 })

  const now = new Date()
  if (warsawParts(now).weekday > 5) return new Response('Weekend, no list', { status: 200 })

  const filter = { or: OPEN_STATUSES.map((name) => ({ property: 'Status', select: { equals: name } })) }
  const declineFilter = {
    and: [
      { property: 'Status', select: { equals: 'Odrzucone' } },
      { property: 'Etap odrzucenia', select: { equals: 'Automat' } },
      { property: 'Automat: wysyłka', date: { on_or_after: now.toISOString() } },
    ],
  }
  const [rtPages, itPages, rtDeclines, itDeclines, settings] = await Promise.all([
    queryLeadPages(RT_LEADS_DATABASE_ID, filter),
    queryLeadPages(IT_LEADS_DATABASE_ID, filter),
    queryLeadPages(RT_LEADS_DATABASE_ID, declineFilter),
    queryLeadPages(IT_LEADS_DATABASE_ID, declineFilter),
    getLeadSettings(),
  ])
  const rt = sortLeads(rtPages, 'RT', now)
  const it = sortLeads(itPages, 'IT', now)
  const declines = [...(await declinesToday(rtDeclines, 'RT', now)), ...(await declinesToday(itDeclines, 'IT', now))]

  const sections: Array<[string, string[]]> = [
    ['Rozmowy dziś, potwierdź rano', [...rt.today, ...it.today]],
    ['Dziś wyjdą odmowy, wstrzymaj, jeśli ktoś jest wart rozmowy', declines],
    ['Do telefonu', [...it.call, ...rt.call]],
    ['Do ponaglenia mailem', [...rt.nudge, ...it.nudge]],
    ['Czekają na Twój ruch', [...rt.waiting, ...it.waiting]],
    [`Do zamknięcia po ${CLOSE_AFTER_BUSINESS_DAYS} dniach ciszy`, [...rt.close, ...it.close]],
  ]
  const filled = sections.filter(([, lines]) => lines.length)
  if (!filled.length) return new Response('Nothing to report', { status: 200 })

  const today = warsawParts(now)
  const isAway = !!settings.absentUntil && `${today.year}-${String(today.month).padStart(2, '0')}-${String(today.day).padStart(2, '0')}` < settings.absentUntil.slice(0, 10)
  const who = isAway ? `${SLACK_KUBA} ${SLACK_BOGUMIL}` : SLACK_MICHAL
  const message = [`${who} lista leadów na dziś`, ...filled.map(([heading, lines]) => `\n*${heading}*\n${lines.join('\n')}`)].join('\n')
  const posted = await postToLeadsChannel(message)
  return new Response(posted ? 'Posted' : 'Slack is not configured', { status: posted ? 200 : 503 })
}
