/**
 * Catches the address typos that cost a lead: a mail sent to `gmial.com`
 * never arrives and nobody finds out. Returns the corrected address to offer
 * as a suggestion, or null when the domain looks fine. Never corrects on its
 * own, the person decides.
 */
const DOMAIN_FIXES: Record<string, string> = {
  'gmial.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gmal.com': 'gmail.com',
  'gamil.com': 'gmail.com',
  'gnail.com': 'gmail.com',
  'gmail.con': 'gmail.com',
  'gmail.co': 'gmail.com',
  'gmail.cm': 'gmail.com',
  'gmail.om': 'gmail.com',
  'gmail.comm': 'gmail.com',
  'gmail.pl': 'gmail.com',
  'gmail.c': 'gmail.com',
  'wp.p': 'wp.pl',
  'wp.pll': 'wp.pl',
  'wp.ol': 'wp.pl',
  'o2.p': 'o2.pl',
  'o2.ol': 'o2.pl',
  'onet.p': 'onet.pl',
  'onet.ol': 'onet.pl',
  'interia.p': 'interia.pl',
  'interia.ol': 'interia.pl',
  'hotmail.con': 'hotmail.com',
  'hotmai.com': 'hotmail.com',
  'outlook.con': 'outlook.com',
  'outlok.com': 'outlook.com',
  'icloud.con': 'icloud.com',
  'iclud.com': 'icloud.com',
  'yahoo.con': 'yahoo.com',
  'yaho.com': 'yahoo.com',
}

export function suggestEmailFix(email?: string): string | null {
  const value = (email || '').trim()
  const at = value.lastIndexOf('@')
  if (at < 1) return null
  const fixed = DOMAIN_FIXES[value.slice(at + 1).toLowerCase()]
  return fixed ? `${value.slice(0, at + 1)}${fixed}` : null
}
