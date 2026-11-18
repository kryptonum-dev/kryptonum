/**
 * Notion side of the campaign leads: the two lead databases of the 11.2026
 * campaign and the one-row settings database that sits next to them.
 *
 * Kept apart from `notion.ts`, which still serves the older forms and their
 * databases. Property names here must match the databases exactly.
 */

declare const process: { env: Record<string, string | undefined> }

const NOTION_API_KEY = process.env.NOTION_API_KEY || import.meta.env.NOTION_API_KEY
const NOTION_API_URL = 'https://api.notion.com/v1'
const NOTION_VERSION = '2022-06-28'

export const RT_LEADS_DATABASE_ID = '41c8947e8c3e81f5a361e592cfe788b2'
export const IT_LEADS_DATABASE_ID = '41c8947e8c3e81aa90a9de72930ad65d'
const SETTINGS_DATABASE_ID = '41c8947e8c3e817ba96ed0e5fea0a822'

export type NotionPage = {
  id: string
  url: string
  created_time: string
  last_edited_time: string
  properties: Record<string, any>
}

async function notionRequest<T>(path: string, method: 'GET' | 'POST' | 'PATCH', body?: unknown): Promise<T | null> {
  if (!NOTION_API_KEY) {
    console.error('[Leads] Missing NOTION_API_KEY')
    return null
  }
  try {
    const response = await fetch(`${NOTION_API_URL}${path}`, {
      method,
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json',
      },
      ...(body !== undefined && { body: JSON.stringify(body) }),
    })
    if (!response.ok) {
      console.error('[Leads] Notion error:', method, path, response.status, await response.text())
      return null
    }
    return (await response.json()) as T
  } catch (error) {
    console.error('[Leads] Notion request failed:', method, path, error)
    return null
  }
}

/* Property builders. Empty values are skipped by `compact`, so a missing answer never breaks the write. */
export const title = (value: string) => ({ title: [{ text: { content: value.slice(0, 200) } }] })
export const text = (value?: string) => (value ? { rich_text: [{ text: { content: value.slice(0, 2000) } }] } : undefined)
export const select = (value?: string) => (value ? { select: { name: value.replace(/,/g, ' ').trim().slice(0, 100) } } : undefined)
export const multiSelect = (values?: string[]) =>
  values?.length ? { multi_select: values.map((value) => ({ name: value.replace(/,/g, ' ').trim().slice(0, 100) })) } : undefined
export const dateTime = (value?: Date | null) => (value ? { date: { start: value.toISOString() } } : undefined)
export const email = (value?: string) => (value ? { email: value } : undefined)
export const phone = (value?: string) => (value ? { phone_number: value } : undefined)
export const url = (value?: string | null) => (value ? { url: value.startsWith('http') ? value : `https://${value}` } : undefined)

function compact(properties: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(properties).filter(([, value]) => value !== undefined))
}

export async function createLeadPage(databaseId: string, properties: Record<string, unknown>): Promise<NotionPage | null> {
  return notionRequest<NotionPage>('/pages', 'POST', {
    parent: { database_id: databaseId },
    properties: compact(properties),
  })
}

export async function getLeadPage(pageId: string): Promise<NotionPage | null> {
  return notionRequest<NotionPage>(`/pages/${pageId}`, 'GET')
}

export async function updateLeadPage(pageId: string, properties: Record<string, unknown>): Promise<boolean> {
  return (await notionRequest<NotionPage>(`/pages/${pageId}`, 'PATCH', { properties })) !== null
}

/** All pages matching a filter; the lead databases are small, so a few pages of results is the ceiling. */
export async function queryLeadPages(databaseId: string, filter: unknown): Promise<NotionPage[]> {
  const pages: NotionPage[] = []
  let cursor: string | undefined
  for (let round = 0; round < 5; round++) {
    const result = await notionRequest<{ results: NotionPage[]; has_more: boolean; next_cursor: string | null }>(
      `/databases/${databaseId}/query`,
      'POST',
      { filter, page_size: 100, ...(cursor && { start_cursor: cursor }) },
    )
    if (!result) break
    pages.push(...result.results)
    if (!result.has_more || !result.next_cursor) break
    cursor = result.next_cursor
  }
  return pages
}

/* Readers for the properties the reminders and the hold link need. */
export const readTitle = (page: NotionPage) => page.properties?.Name?.title?.map((part: any) => part.plain_text).join('') || ''
export const readText = (page: NotionPage, name: string) =>
  page.properties?.[name]?.rich_text?.map((part: any) => part.plain_text).join('') || ''
export const readSelect = (page: NotionPage, name: string): string => page.properties?.[name]?.select?.name || ''
export const readDate = (page: NotionPage, name: string): Date | null => {
  const start = page.properties?.[name]?.date?.start
  return start ? new Date(start) : null
}
export const readPhone = (page: NotionPage) => page.properties?.['Numer telefonu']?.phone_number || ''

export type LeadSettings = {
  /** Unchecked in Notion stops the mails to leads; records and Slack keep working */
  enabled: boolean
  /** ISO date of Michał's return, or null when he is in */
  absentUntil: string | null
}

let settingsCache: { data: LeadSettings; at: number } | null = null

/** Reads the switches from Notion. Falls back to "on, nobody away" so a Notion hiccup never silences the mails. */
export async function getLeadSettings(): Promise<LeadSettings> {
  if (settingsCache && Date.now() - settingsCache.at < 60_000) return settingsCache.data
  const fallback: LeadSettings = { enabled: true, absentUntil: null }
  const result = await notionRequest<{ results: NotionPage[] }>(`/databases/${SETTINGS_DATABASE_ID}/query`, 'POST', { page_size: 1 })
  const row = result?.results?.[0]
  if (!row) return fallback
  const data: LeadSettings = {
    enabled: row.properties?.['Automat włączony']?.checkbox !== false,
    absentUntil: row.properties?.['Michał wraca']?.date?.start ?? null,
  }
  settingsCache = { data, at: Date.now() }
  return data
}
