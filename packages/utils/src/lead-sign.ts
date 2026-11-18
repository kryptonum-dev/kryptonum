/**
 * Signature for links that act on a lead from Slack (holding a decline back).
 * Derived from a secret the server already has, so no extra key is needed.
 */

declare const process: { env: Record<string, string | undefined> }

const SECRET = process.env.NOTION_API_KEY || import.meta.env.NOTION_API_KEY || ''

export async function signLeadId(pageId: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', encoder.encode(SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(`lead-hold:${pageId}`))
  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, '0')).join('').slice(0, 40)
}

export async function verifyLeadSignature(pageId: string, signature: string): Promise<boolean> {
  if (!SECRET || !pageId || !signature) return false
  const expected = await signLeadId(pageId)
  if (expected.length !== signature.length) return false
  let diff = 0
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i)
  return diff === 0
}
