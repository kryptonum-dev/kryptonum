/**
 * What happens to a lead from the campaign forms, in one place:
 * pick the route, schedule the mail in Michał's name, write the record to
 * Notion and tell the team on Slack, always with the link to that record.
 */
import { routeItLead, routeRtLead, isTestLead, type ItRoute, type RtRoute } from './lead-routing'
import { describeSendTime, pickDeclineTime, pickMailTime } from './lead-schedule'
import {
  cleanFirstName,
  companySiteFromEmail,
  itDeclineMail,
  itHeadsUpMail,
  itQuestionsMail,
  rtBigReachMail,
  rtDeclineMail,
  rtQuestionsMail,
  sendLeadMail,
  type MailContent,
} from './lead-mails'
import {
  IT_LEADS_DATABASE_ID,
  RT_LEADS_DATABASE_ID,
  createLeadPage,
  dateTime,
  email as emailProperty,
  getLeadSettings,
  multiSelect,
  phone as phoneProperty,
  select,
  text,
  title,
  url,
  type NotionPage,
} from './lead-notion'
import { SLACK_BOGUMIL, SLACK_KUBA, SLACK_MICHAL, postToLeadsChannel, slackLink, slackSafe } from './lead-slack'
import { signLeadId } from './lead-sign'
import { deriveProfileTag } from './rt-automation'
import { LEADS_RT_DATABASE_ID, appendLeadToNotion } from './notion'

export type CampaignLead = {
  formKind: 'rt' | 'it'
  email: string
  phone?: string
  firstName?: string
  source?: string
  utm?: string
  metaIds?: string
  // RT
  productType?: string[] | string
  salesRange?: string
  totalFollowers?: string
  socialMediaLinks?: string
  // IT
  siteGoal?: string
  budget?: string
}

const RT_LANDING_PAGES: Record<string, string> = {
  '/pl/wspolnik-na-zapleczu': 'Wspólnik na zapleczu (Polska)',
  '/pl/wspolnik-za-granica': 'Wspólnik za granicą (diaspora)',
  '/pl/richer-together': 'RT Globalny',
}
const IT_LANDING_PAGES: Record<string, string> = {
  '/pl/co-ma-robic-twoja-strona': 'Co ma robić Twoja strona',
}

function sourcePath(source?: string): string {
  return (source || '')
    .replace(/^https?:\/\//, '')
    .replace(/^[^/]*/, '')
    .replace(/[?#].*$/, '')
    .replace(/\/+$/, '')
}

/**
 * Creators abroad get one more line in the mail (which country, so the call
 * lands at a sane hour). There is one RT landing now, so the signal comes
 * from the ad set name in the UTM or from a foreign phone number; the old
 * diaspora path still counts.
 */
function livesAbroad(lead: CampaignLead, path: string): boolean {
  const phone = (lead.phone || '').replace(/[\s-]/g, '')
  const foreignPhone = /^(\+|00)\d/.test(phone) && !/^(\+48|0048)/.test(phone)
  return path.includes('za-granica') || /diaspor|za[-_ ]?granic/i.test(lead.utm || '') || foreignPhone
}

function parseUtm(raw?: string): Record<string, string> {
  const result: Record<string, string> = {}
  for (const line of (raw || '').split('\n')) {
    const separator = line.indexOf('=')
    if (separator === -1) continue
    const key = line.slice(0, separator).trim()
    const value = line.slice(separator + 1).trim()
    if (key && value) result[key] = value
  }
  return result
}

function sharedProperties(lead: CampaignLead, name: string, isTest: boolean) {
  const utm = parseUtm(lead.utm)
  return {
    'Name': title(`${isTest ? '[TEST] ' : ''}${name}`),
    'Data': dateTime(new Date()),
    'Email': emailProperty(lead.email),
    'Numer telefonu': phoneProperty(lead.phone?.trim()),
    'Kampania': select(utm.utm_campaign),
    'Adset': select(utm.utm_term),
    'Kreacja': select(utm.utm_content),
    'UTM': text(lead.utm),
    'Źródło': url(lead.source),
    'Meta ID': text(lead.metaIds),
  }
}

type Outcome = {
  status: 'Nowe' | 'Odrzucone'
  path: string
  mail: MailContent | null
  sendAt: Date | null
  /** What the Slack message says about the automatic mail; `{when}` is the send time */
  slackNote: string
  canHold: boolean
}

async function deliver(lead: CampaignLead, outcome: Outcome, enabled: boolean, isTest: boolean) {
  if (!outcome.mail || !outcome.sendAt) return { mailId: null as string | null, note: outcome.slackNote.trim() }
  if (!enabled) return { mailId: null, note: 'Automat jest wyłączony w Notion, mail nie wyszedł. Napisz ręcznie.' }
  const mailId = await sendLeadMail({ to: lead.email, mail: outcome.mail, sendAt: outcome.sendAt, test: isTest })
  if (!mailId) return { mailId: null, note: 'Mail automatu nie wyszedł, wysyłka zwróciła błąd. Napisz ręcznie.' }
  return { mailId, note: outcome.slackNote.replace('{when}', describeSendTime(outcome.sendAt)).trim() }
}

/**
 * Safety net: when the campaign database cannot be written (most likely the
 * integration lost its connection to it), the lead still lands in the old
 * database, so nobody who wrote to us disappears.
 */
async function saveToOldDatabase(lead: CampaignLead, name: string, path: string, isTest: boolean): Promise<boolean> {
  const products = [lead.productType].flat().filter(Boolean).join(' + ')
  const result = await appendLeadToNotion({
    email: lead.email,
    fullName: `${isTest ? '[TEST] ' : ''}${name}`,
    phone: lead.phone?.trim() || undefined,
    message: [
      `Zapis awaryjny z kampanii 11.2026, baza kampanii była niedostępna. Ścieżka: ${path}.`,
      lead.siteGoal && `Cel strony: ${lead.siteGoal}.`,
      lead.budget && `Budżet: ${lead.budget}.`,
    ].filter(Boolean).join(' '),
    utm: lead.utm,
    source: lead.source,
    metaIds: lead.metaIds,
    totalFollowers: lead.totalFollowers,
    salesRange: lead.salesRange,
    productType: products || undefined,
    socialMediaLinks: lead.socialMediaLinks,
    ...(lead.formKind === 'rt' && { notionDatabaseId: LEADS_RT_DATABASE_ID }),
  })
  return result.success
}

async function announce(lines: string[], page: NotionPage | null, name: string, kind: 'RT' | 'IT', isTest: boolean, savedElsewhere = false) {
  const record = page
    ? slackLink(page.url, 'otwórz w Notion')
    : savedElsewhere
      ? 'zapisany awaryjnie w starej bazie, bo baza kampanii jest niedostępna'
      : 'nie udało się zapisać w Notion, sprawdź połączenie bazy'
  const header = `${isTest ? 'TEST · ' : ''}*Nowy lead ${kind}* · ${slackSafe(name)} · ${record}`
  await postToLeadsChannel([header, ...lines.filter(Boolean)].join('\n'))
}

async function holdLine(page: NotionPage | null, mailId: string | null, canHold: boolean, baseUrl: string): Promise<string> {
  if (!page || !mailId || !canHold) return ''
  const signature = await signLeadId(page.id)
  return slackLink(`${baseUrl}/api/lead-hold?p=${page.id}&s=${signature}`, 'Wstrzymaj odmowę')
}

async function handleRtLead(lead: CampaignLead, baseUrl: string) {
  const isTest = isTestLead(lead.email)
  const settings = await getLeadSettings()
  const now = new Date()
  const route: RtRoute = routeRtLead(lead)
  const firstName = cleanFirstName(lead.firstName)
  const profileTag = deriveProfileTag(lead.socialMediaLinks, lead.email)
  const path = sourcePath(lead.source)
  const products = (Array.isArray(lead.productType) ? lead.productType : lead.productType ? [lead.productType] : []).filter(Boolean)
  const mailTime = pickMailTime(now)
  const mailInput = {
    firstName,
    profileTag,
    sendAt: mailTime,
    hasPhone: !!lead.phone?.trim(),
    isDiaspora: livesAbroad(lead, path),
    absentUntil: settings.absentUntil,
  }
  // A test submission should not ping anybody on Slack.
  const who = isTest ? '' : settings.absentUntil ? `${SLACK_KUBA} ${SLACK_BOGUMIL}` : SLACK_MICHAL

  const outcomes: Record<RtRoute, Outcome> = {
    'questions': {
      status: 'Nowe', path: 'Pytania', mail: rtQuestionsMail(mailInput), sendAt: mailTime, canHold: false,
      slackNote: `Mail z pytaniami wyjdzie {when}. ${who}`,
    },
    'big-reach': {
      status: 'Nowe', path: 'Duży profil bez sprzedaży', mail: rtBigReachMail(mailInput), sendAt: mailTime, canHold: false,
      slackNote: `Duży profil bez sprzedaży, obejrzyj go przed rozmową. Mail z pytaniami wyjdzie {when}. ${who}`,
    },
    'reject': {
      status: 'Odrzucone', path: 'Odmowa', mail: rtDeclineMail({ firstName, profileTag }), sendAt: pickDeclineTime(now), canHold: true,
      slackNote: 'Mała sprzedaż i mały zasięg. Odmowa wyjdzie {when}.',
    },
    'junk': {
      status: 'Odrzucone', path: 'Spam', mail: null, sendAt: null, canHold: false,
      slackNote: 'Bez działającego linku do profilu, wygląda na spam. Nic nie wysyłam.',
    },
  }
  const outcome = outcomes[route]
  const { mailId, note } = await deliver(lead, outcome, settings.enabled, isTest)
  const name = [firstName || lead.email, profileTag.startsWith('@') ? profileTag : ''].filter(Boolean).join(' · ')

  const page = await createLeadPage(RT_LEADS_DATABASE_ID, {
    ...sharedProperties(lead, name, isTest),
    'Status': select(outcome.status),
    'Landing page': select(RT_LANDING_PAGES[path] || 'Inny'),
    'Ścieżka': select(outcome.path),
    'Profil': url(lead.socialMediaLinks),
    'Obserwujący': select(lead.totalFollowers),
    'Sprzedaż online': select(lead.salesRange),
    'Produkt': multiSelect(products),
    'Automat: wysyłka': mailId ? dateTime(outcome.sendAt) : undefined,
    'Automat: ID': text(mailId ?? undefined),
    'Etap odrzucenia': outcome.status === 'Odrzucone' ? select('Automat') : undefined,
    'Następny krok': outcome.status === 'Nowe' ? select('Czeka na odpowiedź') : undefined,
  })
  const savedElsewhere = page ? false : await saveToOldDatabase(lead, name, outcome.path, isTest)

  await announce(
    [
      slackSafe(RT_LANDING_PAGES[path] || path || 'nieznana strona'),
      `Sprzedaje: ${slackSafe(products.join(', ') || 'brak danych')} · ${slackSafe(lead.salesRange || 'brak danych')} · obserwujący: ${slackSafe(lead.totalFollowers || 'brak danych')}`,
      lead.socialMediaLinks ? `Profil: ${slackSafe(lead.socialMediaLinks)}` : '',
      `Telefon: ${slackSafe(lead.phone?.trim() || 'brak')} · e-mail: ${slackSafe(lead.email)}`,
      [note, await holdLine(page, mailId, outcome.canHold, baseUrl)].filter(Boolean).join(' '),
    ],
    page, name, 'RT', isTest, savedElsewhere,
  )
}

async function handleItLead(lead: CampaignLead, baseUrl: string) {
  const isTest = isTestLead(lead.email)
  const settings = await getLeadSettings()
  const now = new Date()
  const route: ItRoute = routeItLead(lead)
  const firstName = cleanFirstName(lead.firstName)
  const site = companySiteFromEmail(lead.email)
  const path = sourcePath(lead.source)
  const mailTime = pickMailTime(now)
  const mailInput = { email: lead.email, siteGoal: lead.siteGoal, sendAt: mailTime, absentUntil: settings.absentUntil }
  // A test submission should not ping anybody on Slack.
  const who = isTest ? '' : settings.absentUntil ? `${SLACK_KUBA} ${SLACK_BOGUMIL}` : SLACK_MICHAL

  const outcomes: Record<ItRoute, Outcome> = {
    'phone': {
      status: 'Nowe', path: 'Telefon', mail: itHeadsUpMail(mailInput), sendAt: mailTime, canHold: false,
      slackNote: `Jest numer, dzwoń. Zapowiedź telefonu wyjdzie {when}. ${who}`,
    },
    'questions': {
      status: 'Nowe', path: 'Pytania mailem', mail: itQuestionsMail(mailInput), sendAt: mailTime, canHold: false,
      slackNote: `Bez numeru. Mail z pytaniami wyjdzie {when}. ${who}`,
    },
    'reject': {
      status: 'Odrzucone', path: 'Odmowa', mail: itDeclineMail({ email: lead.email }), sendAt: pickDeclineTime(now), canHold: true,
      slackNote: 'Budżet poniżej 30 tys. zł. Odmowa wyjdzie {when}.',
    },
    'junk': {
      status: 'Odrzucone', path: 'Spam', mail: null, sendAt: null, canHold: false,
      slackNote: 'Niepełne zgłoszenie, wygląda na spam. Nic nie wysyłam.',
    },
  }
  const outcome = outcomes[route]
  const { mailId, note } = await deliver(lead, outcome, settings.enabled, isTest)
  const name = [firstName || lead.email, site || ''].filter(Boolean).join(' · ')

  const page = await createLeadPage(IT_LEADS_DATABASE_ID, {
    ...sharedProperties(lead, name, isTest),
    'Status': select(outcome.status),
    'Landing page': select(IT_LANDING_PAGES[path] || 'Inny'),
    'Ścieżka': select(outcome.path),
    'Cel strony': select(lead.siteGoal),
    'Budżet': select(lead.budget),
    'Strona': url(site),
    'Automat: wysyłka': mailId ? dateTime(outcome.sendAt) : undefined,
    'Automat: ID': text(mailId ?? undefined),
    'Etap odrzucenia': outcome.status === 'Odrzucone' ? select('Automat') : undefined,
    'Następny krok': outcome.status === 'Nowe' ? select(route === 'phone' ? 'Pierwszy kontakt' : 'Czeka na odpowiedź') : undefined,
  })
  const savedElsewhere = page ? false : await saveToOldDatabase(lead, name, outcome.path, isTest)

  await announce(
    [
      `Cel: ${slackSafe(lead.siteGoal || 'brak danych')} · budżet: ${slackSafe(lead.budget || 'brak danych')}`,
      `Strona: ${slackSafe(site || 'brak, adres e-mail nie jest firmowy')}`,
      `Telefon: ${slackSafe(lead.phone?.trim() || 'brak')} · e-mail: ${slackSafe(lead.email)}`,
      [note, await holdLine(page, mailId, outcome.canHold, baseUrl)].filter(Boolean).join(' '),
    ],
    page, name, 'IT', isTest, savedElsewhere,
  )
}

/** Entry point for `/api/s3d`. Never throws: a failed step is logged and the next one still runs. */
export async function handleCampaignLead(lead: CampaignLead, baseUrl: string): Promise<void> {
  try {
    if (lead.formKind === 'rt') await handleRtLead(lead, baseUrl)
    else await handleItLead(lead, baseUrl)
  } catch (error) {
    console.error('[Leads] Pipeline failed:', error)
  }
}
