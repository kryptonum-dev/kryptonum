/**
 * Lead routing for the campaign forms (RT creators and IT companies).
 *
 * Pure functions shared by the form (which Meta event fires, which end screen
 * shows) and by the API (which mail goes out, where the record lands). The
 * option strings are the single source of truth for the form tiles and must
 * match the select options in the Notion lead databases.
 */
import { isValidProfileLink } from './profile-link'

export const RT_PRODUCTS = ['E-book', 'Kurs', 'Program albo wyzwanie', 'Subskrypcja', 'Konsultacje', 'Coś innego', 'Jeszcze nic'] as const
export const RT_NO_PRODUCT = 'Jeszcze nic'
export const RT_SALES = ['do 5 000 zł', '5 000 do 20 000 zł', '20 000 do 50 000 zł', 'ponad 50 000 zł'] as const
export const RT_NO_SALES = 'Jeszcze nie sprzedaję'
export const RT_PLATFORMS = ['Instagram', 'TikTok', 'YouTube', 'Facebook', 'Inna strona'] as const
export const RT_FOLLOWERS = ['do 10 tys.', '10 do 50 tys.', '50 do 100 tys.', '100 do 300 tys.', 'ponad 300 tys.'] as const

export const IT_GOALS = ['Przynosić zapytania', 'Sprzedawać w sklepie', 'Sprzedawać firmom', 'Jeszcze nie wiem'] as const
export const IT_BUDGETS = ['mniej niż 30 tys. zł', '30 do 80 tys. zł', '80 do 150 tys. zł', 'ponad 150 tys. zł', 'Jeszcze nie wiem'] as const
export const IT_BUDGET_TOO_LOW = 'mniej niż 30 tys. zł'

/**
 * questions — sells at least 5 000 zł a month, or sells anything with a big audience;
 * big-reach — 100k+ followers and no sales yet, never rejected automatically;
 * reject — no sales (or under 5 000 zł) and a small audience;
 * junk — no usable profile link, only possible by bypassing the form.
 */
export type RtRoute = 'questions' | 'big-reach' | 'reject' | 'junk'

/**
 * phone — left a number, Michał calls first;
 * questions — no number, the first contact is a mail with questions;
 * reject — budget under 30k, gets a polite decline;
 * junk — incomplete payload, only possible by bypassing the form.
 */
export type ItRoute = 'phone' | 'questions' | 'reject' | 'junk'

const SELLS_ENOUGH: ReadonlySet<string> = new Set(['5 000 do 20 000 zł', '20 000 do 50 000 zł', 'ponad 50 000 zł'])
const BIG_REACH: ReadonlySet<string> = new Set(['100 do 300 tys.', 'ponad 300 tys.'])

export type RtRoutingInput = {
  socialMediaLinks?: string
  totalFollowers?: string
  salesRange?: string
}

export function routeRtLead(data: RtRoutingInput): RtRoute {
  if (!data.socialMediaLinks || !isValidProfileLink(data.socialMediaLinks)) return 'junk'
  if (data.salesRange && SELLS_ENOUGH.has(data.salesRange)) return 'questions'
  const hasBigReach = !!data.totalFollowers && BIG_REACH.has(data.totalFollowers)
  if (!hasBigReach) return 'reject'
  return data.salesRange && data.salesRange !== RT_NO_SALES ? 'questions' : 'big-reach'
}

export type ItRoutingInput = {
  siteGoal?: string
  budget?: string
  phone?: string
}

export function routeItLead(data: ItRoutingInput): ItRoute {
  if (!data.siteGoal || !data.budget) return 'junk'
  if (data.budget === IT_BUDGET_TOO_LOW) return 'reject'
  return data.phone?.trim() ? 'phone' : 'questions'
}

/** The Meta `Lead` event fires only for leads we actually want to talk to. */
export function firesLeadEvent(route: RtRoute | ItRoute): boolean {
  return route === 'questions' || route === 'big-reach' || route === 'phone'
}

/**
 * Submissions used to check the whole path on production without bothering
 * the team: a `+test` address keeps the mails away from Michał and Kuba and
 * marks the Notion record and the Slack message.
 */
export function isTestLead(email?: string): boolean {
  return !!email && /\+test[^@]*@/i.test(email)
}
