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
}

export type AppendLeadResult = {
  success: boolean
  error?: string
}

export async function appendLeadToNotion(data: ContactLeadData): Promise<AppendLeadResult> {
  console.log('[Notion] Starting append for:', data.email)

  if (!NOTION_API_KEY || !NOTION_LEADS_DATABASE_ID) {
    console.error('[Notion] Missing credentials.', {
      hasApiKey: !!NOTION_API_KEY,
      hasDatabaseId: !!NOTION_LEADS_DATABASE_ID,
    })
    return { success: false, error: 'Missing Notion credentials' }
  }

  try {
    const properties: Record<string, unknown> = {
      'Name': { title: [{ text: { content: data.email } }] },
      'Status': { select: { name: 'Nowy' } },
      'Data': { date: { start: new Date().toISOString() } },
      'Email': { email: data.email },
    }

    if (data.phone) {
      properties['Numer telefonu'] = { phone_number: data.phone }
    }
    if (data.dropdown) {
      properties['Branża'] = { select: { name: data.dropdown } }
    }
    if (data.message) {
      properties['Wiadomość'] = { rich_text: [{ text: { content: data.message.slice(0, 2000) } }] }
    }
    if (data.utm) {
      properties['UTM'] = { rich_text: [{ text: { content: data.utm.slice(0, 2000) } }] }
    }
    if (data.source) {
      properties['Źródło'] = {
        url: data.source.startsWith('http') ? data.source : `https://${data.source}`,
      }
    }

    const response = await fetch(`${NOTION_API_URL}/pages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parent: { database_id: NOTION_LEADS_DATABASE_ID },
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
