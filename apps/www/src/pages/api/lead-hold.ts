export const prerender = false

import type { APIRoute } from 'astro'
import { cancelLeadMail } from '@repo/utils/lead-mails'
import { getLeadPage, readText, readTitle, updateLeadPage } from '@repo/utils/lead-notion'
import { postToLeadsChannel, slackLink } from '@repo/utils/lead-slack'
import { verifyLeadSignature } from '@repo/utils/lead-sign'

/**
 * Holds back an automatic decline before it goes out. The link comes from the
 * Slack message about the lead. GET only shows a confirmation, because link
 * previews fetch every address they see; the decline is cancelled on POST.
 */

const page = (heading: string, body: string) =>
  new Response(
    `<!doctype html><html lang="pl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>${heading}</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#000103;color:#f0f7f7;font:16px/1.5 system-ui,sans-serif}main{max-width:26rem;padding:2rem}h1{font-size:1.25rem;font-weight:500;margin:0 0 .75rem}p{color:#c6cdcc;margin:0 0 1.25rem}a{color:#90f4e8}button{font:inherit;color:#000103;background:linear-gradient(266deg,#2dd282,#90f4e8);border:0;border-radius:.25rem;padding:.75rem 1.25rem;cursor:pointer}</style></head><body><main><h1>${heading}</h1>${body}</main></body></html>`,
    { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } },
  )

const escapeHtml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

async function readRequest(url: URL) {
  const pageId = url.searchParams.get('p') || ''
  const signature = url.searchParams.get('s') || ''
  if (!(await verifyLeadSignature(pageId, signature))) return null
  const lead = await getLeadPage(pageId)
  return lead ? { lead, pageId, signature } : null
}

export const GET: APIRoute = async ({ url }) => {
  const request = await readRequest(url)
  if (!request) return page('Ten link nie działa', '<p>Link jest niepełny albo lead został usunięty. Otwórz rekord w Notion.</p>')
  const name = escapeHtml(readTitle(request.lead))
  return page(
    `Wstrzymać odmowę dla: ${name}?`,
    `<p>Mail z odmową nie wyjdzie, a lead wróci do statusu „W trakcie” i będzie czekał na Twoją decyzję.</p><form method="post" action="/api/lead-hold?p=${encodeURIComponent(request.pageId)}&amp;s=${encodeURIComponent(request.signature)}"><button type="submit">Wstrzymaj odmowę</button></form>`,
  )
}

export const POST: APIRoute = async ({ url }) => {
  const request = await readRequest(url)
  if (!request) return page('Ten link nie działa', '<p>Link jest niepełny albo lead został usunięty. Otwórz rekord w Notion.</p>')
  const { lead } = request
  const name = readTitle(lead)
  const record = `<p><a href="${lead.url}">Otwórz rekord w Notion</a></p>`
  const mailId = readText(lead, 'Automat: ID')
  const cancelled = mailId ? await cancelLeadMail(mailId) : false
  if (!cancelled) return page('Za późno, odmowa już wyszła', `<p>Tego maila nie da się już cofnąć. Jeśli chcesz wrócić do tej osoby, napisz do niej sam.</p>${record}`)

  await updateLeadPage(lead.id, {
    'Status': { select: { name: 'W trakcie' } },
    'Etap odrzucenia': { select: null },
    'Automat: wysyłka': { date: null },
    'Automat: ID': { rich_text: [] },
    'Następny krok': { select: { name: 'Pierwszy kontakt' } },
  })
  await postToLeadsChannel(`Odmowa wstrzymana: ${slackLink(lead.url, name)}. Mail nie wyjdzie, lead czeka na decyzję w Notion.`)
  return page('Odmowa wstrzymana', `<p>Mail nie wyjdzie. ${escapeHtml(name)} ma teraz status „W trakcie”.</p>${record}`)
}
