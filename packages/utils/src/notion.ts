/**
 * Notion Integration Service
 *
 * Appends contact form submissions to a Notion database via REST API.
 *
 * Environment Variables Required:
 * - NOTION_API_KEY: Internal integration token (starts with ntn_)
 * - NOTION_LEADS_DATABASE_ID: The ID of the Notion database
 *
 * Database Properties:
 * | Name (title) | Status | Komentarz | Data | Email | Numer telefonu | Branża | Wiadomość | UTM | Źródło |
 */

import { isValidProfileLink } from './profile-link'

declare const process: { env: Record<string, string | undefined> }

const NOTION_API_KEY = process.env.NOTION_API_KEY || import.meta.env.NOTION_API_KEY
const NOTION_LEADS_DATABASE_ID = process.env.NOTION_LEADS_DATABASE_ID || import.meta.env.NOTION_LEADS_DATABASE_ID

const NOTION_API_URL = 'https://api.notion.com/v1'
const NOTION_VERSION = '2022-06-28'

export type ContactLeadData = {
  email: string
  message?: string
  utm?: string
  source?: string
  phone?: string
  dropdown?: string
  fullName?: string
  totalFollowers?: string
  salesRange?: string
  socialMediaLinks?: string
  publishedVideos?: string
  exampleVideo?: string
  metaIds?: string
  status?: string
  notionDatabaseId?: string
}

export type AppendLeadResult = {
  success: boolean
  error?: string
}

const LEADS_RT_DATABASE_ID = '033d2d0a22d94a1d8ada8d8593ab8ec5'

const LANDING_PAGES: Record<string, string> = {
  '/pl/richer-together': 'RT Globalny',
  '/pl/richer-together-za-granica': 'LP Polka w dolarach',
  '/pl/richer-together-bez-produktu': 'LP Zasięgi bez produktu',
  '/pl/richer-together-sprzedajesz': 'LP Sprzedajesz za mało',
}

function parseUtm(raw?: string): Record<string, string> {
  if (!raw) return {}
  const result: Record<string, string> = {}
  for (const line of raw.split('\n')) {
    const separator = line.indexOf('=')
    if (separator === -1) continue
    const key = line.slice(0, separator).trim()
    const value = line.slice(separator + 1).trim()
    if (key && value) result[key] = value
  }
  return result
}

function selectOption(name: string) {
  return { name: name.replace(/,/g, ' ').trim().slice(0, 100) }
}

function resolveLandingPage(source?: string): string {
  if (!source) return 'Inny'
  const path = source
    .replace(/^https?:\/\//, '')
    .replace(/^[^/]*/, '')
    .replace(/[?#].*$/, '')
    .replace(/\/+$/, '')
  return LANDING_PAGES[path] || 'Inny'
}

function resolvePlatforms(links?: string): string[] {
  if (!links) return []
  const value = links.toLowerCase()
  const found: string[] = []
  if (value.includes('instagram.com')) found.push('Instagram')
  if (/facebook\.com|fb\.com|fb\.me/.test(value)) found.push('Facebook')
  if (value.includes('tiktok.com')) found.push('TikTok')
  if (/youtube\.com|youtu\.be/.test(value)) found.push('YouTube')
  return found.length ? found : ['Inna']
}

export async function appendLeadToNotion(data: ContactLeadData): Promise<AppendLeadResult> {
  const databaseId = data.notionDatabaseId || NOTION_LEADS_DATABASE_ID

  console.log('[Notion] Starting append for:', data.email)

  if (!NOTION_API_KEY || !databaseId) {
    console.error('[Notion] Missing credentials.', {
      hasApiKey: !!NOTION_API_KEY,
      hasDatabaseId: !!databaseId,
    })
    return { success: false, error: 'Missing Notion credentials' }
  }

  try {
    const titleContent = data.fullName || data.email
    const isLeadsRt = databaseId.replace(/-/g, '') === LEADS_RT_DATABASE_ID
    const utm = parseUtm(data.utm)
    const properties: Record<string, unknown> = {
      'Name': { title: [{ text: { content: titleContent } }] },
      'Status': { select: { name: data.status || 'Nowy' } },
      'Data': { date: { start: new Date().toISOString() } },
      'Email': { email: data.email },
    }

    if (isLeadsRt) {
      properties['Landing page'] = { select: selectOption(resolveLandingPage(data.source)) }
      if (utm.utm_source || utm.referrer) {
        properties['UTM źródło'] = { select: selectOption(utm.utm_source || utm.referrer) }
      }
      if (utm.utm_medium) properties['UTM medium'] = { select: selectOption(utm.utm_medium) }
      if (utm.utm_campaign) properties['Kampania'] = { select: selectOption(utm.utm_campaign) }
      if (utm.utm_term) properties['Adset'] = { select: selectOption(utm.utm_term) }
      if (utm.utm_content) properties['Kreacja'] = { select: selectOption(utm.utm_content) }
    }

    if (data.phone) {
      properties['Numer telefonu'] = { phone_number: data.phone }
    }
    if (data.dropdown && !isLeadsRt) {
      properties['Branża'] = { select: { name: data.dropdown } }
    }
    if (data.message) {
      properties[isLeadsRt ? 'Komentarz' : 'Wiadomość'] = { rich_text: [{ text: { content: data.message.slice(0, 2000) } }] }
    }
    if (data.utm) {
      properties['UTM'] = { rich_text: [{ text: { content: data.utm.slice(0, 2000) } }] }
    }
    if (data.source) {
      properties['Źródło'] = {
        url: data.source.startsWith('http') ? data.source : `https://${data.source}`,
      }
    }
    if (data.totalFollowers) {
      properties['Obserwujący'] = isLeadsRt
        ? { select: selectOption(data.totalFollowers) }
        : { rich_text: [{ text: { content: data.totalFollowers.slice(0, 2000) } }] }
    }
    if (data.salesRange && isLeadsRt) {
      properties['Sprzedaż online'] = { select: selectOption(data.salesRange) }
    }
    if (isLeadsRt && (data.totalFollowers || data.salesRange || data.socialMediaLinks)) {
      // Mirrors the client-side gate for the Meta Lead event: a real profile
      // link plus either any sales or 300k+ reach.
      const sellsAlready = !!data.salesRange && data.salesRange !== 'Jeszcze nie sprzedaję'
      const hasBigReach = data.totalFollowers === '300 000 – 500 000' || data.totalFollowers === '500 000+'
      const hasValidLink = !!data.socialMediaLinks && isValidProfileLink(data.socialMediaLinks)
      properties['Bramka Lead'] = { checkbox: hasValidLink && (sellsAlready || hasBigReach) }
    }
    if (data.metaIds && isLeadsRt) {
      properties['Meta ID'] = { rich_text: [{ text: { content: data.metaIds.slice(0, 2000) } }] }
    }
    if (data.socialMediaLinks) {
      properties['Social Media'] = { rich_text: [{ text: { content: data.socialMediaLinks.slice(0, 2000) } }] }
      if (isLeadsRt) {
        properties['Platforma'] = { multi_select: resolvePlatforms(data.socialMediaLinks).map(selectOption) }
      }
    }
    if (data.publishedVideos && !isLeadsRt) {
      properties['Opublikowane wideo'] = { select: { name: data.publishedVideos } }
    }
    if (data.exampleVideo && !isLeadsRt) {
      properties['Przykładowy film'] = { url: data.exampleVideo }
    }

    const response = await fetch(`${NOTION_API_URL}/pages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parent: { database_id: databaseId },
        properties,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('[Notion] API error:', response.status, error)
      return { success: false, error: `API ${response.status}: ${error}` }
    }

    console.log('[Notion] Successfully appended lead:', data.email)
    return { success: true }
  } catch (error) {
    console.error('[Notion] Error appending lead:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, error: errorMessage }
  }
}

/**
 * Finds the newest lead with the given email. Used to attach a Cal.com
 * booking to the form submission that preceded it instead of creating a
 * duplicate record.
 */
export async function findLeadByEmail(databaseId: string, email: string): Promise<string | null> {
  if (!NOTION_API_KEY || !databaseId) return null

  try {
    const response = await fetch(`${NOTION_API_URL}/databases/${databaseId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filter: { property: 'Email', email: { equals: email } },
        sorts: [{ timestamp: 'created_time', direction: 'descending' }],
        page_size: 1,
      }),
    })

    if (!response.ok) {
      console.error('[Notion] findLeadByEmail API error:', response.status, await response.text())
      return null
    }

    const result = await response.json() as { results?: Array<{ id: string }> }
    return result.results?.[0]?.id ?? null
  } catch (error) {
    console.error('[Notion] findLeadByEmail error:', error)
    return null
  }
}

export async function updateLeadStatus(pageId: string, status: string): Promise<AppendLeadResult> {
  if (!NOTION_API_KEY) return { success: false, error: 'Missing Notion credentials' }

  try {
    const response = await fetch(`${NOTION_API_URL}/pages/${pageId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: { 'Status': { select: { name: status } } },
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('[Notion] updateLeadStatus API error:', response.status, error)
      return { success: false, error: `API ${response.status}: ${error}` }
    }

    return { success: true }
  } catch (error) {
    console.error('[Notion] updateLeadStatus error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
