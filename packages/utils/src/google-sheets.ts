/**
 * Google Sheets Integration Service
 *
 * Appends contact form submissions to a Google Sheet using Service Account authentication.
 *
 * Environment Variables Required:
 * - GOOGLE_SHEET_ID: The ID of the Google Sheet
 * - GOOGLE_SERVICE_ACCOUNT_EMAIL: Service account email
 * - GOOGLE_PRIVATE_KEY: Service account private key (with \n escaped as \\n)
 * - GOOGLE_SHEET_NAME: (optional) Sheet name, defaults to "Sheet1"
 *
 * Sheet Structure:
 * | Status | Komentarz | Data | Email | Wiadomość | UTM |
 */

import { google } from 'googleapis'

// --- Environment Variables ---

const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID || import.meta.env.GOOGLE_SHEET_ID
const GOOGLE_SHEET_NAME = process.env.GOOGLE_SHEET_NAME || import.meta.env.GOOGLE_SHEET_NAME || 'Sheet1'
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || import.meta.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
const GOOGLE_PRIVATE_KEY = (process.env.GOOGLE_PRIVATE_KEY || import.meta.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n')

// --- Types ---

export type ContactLeadData = {
  email: string
  message: string
  utm?: string // All UTM params as formatted multiline text
}

export type AppendLeadResult = {
  success: boolean
  error?: string
}

// --- Helper Functions ---

/**
 * Format date to YYYY-MM-DD HH:mm (Warsaw timezone)
 */
function formatDate(date: Date): string {
  try {
    const formatter = new Intl.DateTimeFormat('pl-PL', {
      timeZone: 'Europe/Warsaw',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })

    const parts = formatter.formatToParts(date)
    const get = (type: string) => parts.find((p) => p.type === type)?.value || ''

    return `${get('year')}-${get('month')}-${get('day')} ${get('hour')}:${get('minute')}`
  } catch {
    // Fallback to ISO string if Intl fails
    return date.toISOString().slice(0, 16).replace('T', ' ')
  }
}

/**
 * Safely convert value to string, handling undefined/null
 */
function safeString(value: unknown): string {
  if (value === undefined || value === null) return ''
  return String(value)
}

/**
 * Build a row array matching the Google Sheet column order:
 * 0: Status, 1: Komentarz, 2: Data, 3: Email, 4: Wiadomość, 5: UTM
 */
function buildRow(data: ContactLeadData): string[] {
  return [
    'NOWY', // 0: Status
    '', // 1: Komentarz (empty for manual input)
    formatDate(new Date()), // 2: Data
    safeString(data.email), // 3: Email
    safeString(data.message), // 4: Wiadomość
    safeString(data.utm), // 5: UTM
  ]
}

// --- Main Export ---

/**
 * Append a contact form submission to the Google Sheet.
 *
 * IMPORTANT: This function uses graceful failure - it will never throw.
 * If the Google Sheets API fails, it logs the error and returns { success: false }.
 * This ensures the main application flow (e.g., sending email) continues.
 */
export async function appendLeadToSheet(data: ContactLeadData): Promise<AppendLeadResult> {
  console.log('[Google Sheets] Starting append for:', data.email)

  // Check for required environment variables
  if (!GOOGLE_SHEET_ID || !GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY) {
    console.error('[Google Sheets] Missing credentials in environment variables.', {
      hasSheetId: !!GOOGLE_SHEET_ID,
      hasEmail: !!GOOGLE_SERVICE_ACCOUNT_EMAIL,
      hasKey: !!GOOGLE_PRIVATE_KEY,
      keyLength: GOOGLE_PRIVATE_KEY?.length || 0,
    })
    return { success: false, error: 'Missing Google Sheets credentials' }
  }

  try {
    console.log('[Google Sheets] Creating auth client...')

    // Create auth client with Service Account
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: GOOGLE_PRIVATE_KEY,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    const sheets = google.sheets({ version: 'v4', auth })

    // Build the row data
    const row = buildRow(data)
    console.log('[Google Sheets] Appending row to sheet:', GOOGLE_SHEET_NAME)

    // Append row to sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: GOOGLE_SHEET_ID,
      range: `${GOOGLE_SHEET_NAME}!A1`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [row],
      },
    })

    console.log('[Google Sheets] Successfully appended lead:', data.email)
    return { success: true }
  } catch (error) {
    // Log the error but don't throw - graceful failure
    console.error('[Google Sheets] Error appending lead:', error)

    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, error: errorMessage }
  }
}
