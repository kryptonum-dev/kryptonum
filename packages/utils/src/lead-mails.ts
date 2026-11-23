/**
 * The automatic mails that go to leads in Michał's name, and their delivery.
 *
 * Texts follow the way Michał writes his short mails and were agreed with him
 * (Slack, #krypto-marketing, 17.11.2026). Rules that keep them from reading
 * like a robot: a first name, a day-of-week sign-off, questions the form did
 * not already ask, and no request for a phone number we already have.
 */
import { nextTwoBusinessDays, warsawParts, weekdayClosing } from './lead-schedule'

declare const process: { env: Record<string, string | undefined> }

const RESEND_API_KEY = process.env.RESEND_API_KEY || import.meta.env.RESEND_API_KEY

export type MailContent = { subject: string; text: string }

const SENDER = 'Michał Chrapek z Kryptonum <michal@send.kryptonum.eu>'
const TEAM = ['michal@kryptonum.eu', 'kuba@kryptonum.eu', 'bogumil@kryptonum.eu']
const TEST_INBOX = ['bogumil@kryptonum.eu']
const MICHAL_PHONE = '+48 793 272 020'
const SIGNATURE = `Michał Chrapek, Kryptonum\n${MICHAL_PHONE}`

/** "Ania" from whatever was typed into the name field; empty when unusable. */
export function cleanFirstName(raw?: string): string {
  const first = (raw || '').trim().split(/\s+/)[0] || ''
  if (!/^[\p{L}'-]{2,30}$/u.test(first)) return ''
  return first
    .toLocaleLowerCase('pl')
    .replace(/(^|[-'])(\p{L})/gu, (_, separator: string, letter: string) => separator + letter.toLocaleUpperCase('pl'))
}

// Mailboxes anybody can open. Their domain is not a company site, so it must
// not end up in a mail subject or in the "Strona" column.
const FREE_MAIL = new Set([
  'gmail.com', 'googlemail.com', 'wp.pl', 'wp.eu', 'o2.pl', 'go2.pl', 'onet.pl', 'onet.eu', 'onet.com.pl', 'op.pl',
  'poczta.onet.pl', 'vp.pl', 'interia.pl', 'interia.eu', 'interia.com', 'poczta.fm', 'tlen.pl', 'gazeta.pl', 'int.pl',
  'spoko.pl', 'opoczta.pl', 'autograf.pl', 'buziaczek.pl', 'prokonto.pl', 'poczta.pl',
  'icloud.com', 'me.com', 'mac.com', 'outlook.com', 'outlook.pl', 'outlook.de', 'outlook.fr', 'outlook.es', 'outlook.it',
  'hotmail.com', 'hotmail.pl', 'hotmail.co.uk', 'hotmail.de', 'hotmail.fr', 'hotmail.it', 'hotmail.es',
  'live.com', 'live.pl', 'live.co.uk', 'live.de', 'live.fr', 'live.nl', 'msn.com',
  'yahoo.com', 'yahoo.pl', 'yahoo.co.uk', 'yahoo.de', 'yahoo.fr', 'ymail.com', 'rocketmail.com', 'aol.com',
  'proton.me', 'protonmail.com', 'pm.me', 'tutanota.com', 'tuta.com', 'tutamail.com', 'mail.com', 'email.com',
  'gmx.de', 'gmx.net', 'gmx.com', 'gmx.at', 'gmx.pl', 'web.de', 't-online.de', 'zoho.com', 'fastmail.com', 'hey.com',
  'duck.com', 'yandex.com', 'yandex.ru', 'mail.ru', 'seznam.cz', 'ukr.net', 'btinternet.com', 'sky.com',
  'orange.fr', 'free.fr', 'laposte.net', 'libero.it', 'bluewin.ch',
])

/** Company address guessed from a business e-mail; null for free mailboxes. */
export function companySiteFromEmail(email?: string): string | null {
  const domain = (email || '').split('@')[1]?.trim().toLowerCase()
  if (!domain || FREE_MAIL.has(domain)) return null
  return domain
}

const formatDay = (isoDate: string) => {
  const [, month, day] = isoDate.slice(0, 10).split('-')
  return `${Number(day)}.${month}`
}

/** True when Michał is away on the day the mail goes out. */
function awayOn(sendAt: Date, absentUntil?: string | null): string | null {
  if (!absentUntil) return null
  const parts = warsawParts(sendAt)
  const sendDay = `${parts.year}-${String(parts.month).padStart(2, '0')}-${String(parts.day).padStart(2, '0')}`
  return sendDay < absentUntil.slice(0, 10) ? formatDay(absentUntil) : null
}

type RtMailInput = {
  /** Also opens the subject, so the mail reads like one written to this person */
  firstName?: string
  sendAt: Date
  hasPhone: boolean
  isDiaspora: boolean
  absentUntil?: string | null
}

const greeting = (firstName?: string) => (firstName ? `Cześć ${firstName} 😃` : 'Cześć! 😃')
const subjectWithTag = (tag: string | undefined, rest: string) =>
  tag ? `${tag}, ${rest}` : rest.charAt(0).toLocaleUpperCase('pl') + rest.slice(1)

function rtClosingBlock(input: RtMailInput): string[] {
  const backOn = awayOn(input.sendAt, input.absentUntil)
  const when = backOn
    ? `Do ${backOn} jestem poza biurem. Napisz, kiedy masz czas po tym dniu, a ja potwierdzę godzinę.`
    : `Napisz, kiedy masz czas ${nextTwoBusinessDays(input.sendAt)}, a ja potwierdzę godzinę.`
  const lines = [`Rozmowa zajmie nam 15 do 30 minut. ${when}`]
  if (input.isDiaspora) lines.push('Dopisz też, w jakim kraju mieszkasz, żebym nie zadzwonił w środku nocy.')
  lines.push(
    input.hasPhone
      ? 'Mam też Twój numer. Jeśli wolisz najpierw szybki telefon, napisz tylko, o jakiej porze.'
      : 'Wolisz najpierw szybki telefon? Zostaw numer, zadzwonię i od razu ustalimy termin.',
  )
  lines.push('Wszystko, co mi napiszesz, zostaje między mną a moim zespołem.')
  lines.push(`${weekdayClosing(input.sendAt)} ☀️\nMichał`)
  lines.push(SIGNATURE)
  return lines
}

/** RT, lead who already sells: three questions before the first call. */
export function rtQuestionsMail(input: RtMailInput): MailContent {
  return {
    subject: subjectWithTag(input.firstName, 'trzy szybkie pytania przed naszą rozmową 😉'),
    text: [
      greeting(input.firstName),
      'z tej strony klawiatury Michał Chrapek z Kryptonum. Mam Twoje zgłoszenie i chcę się dobrze przygotować do naszej rozmowy.',
      'Odpisz mi proszę na trzy pytania. Wystarczy po jednym zdaniu:',
      [
        '1. Gdzie mogę zobaczyć i kupić to, co sprzedajesz? Wklej link do sklepu albo strony.',
        '2. Co sprzedaje się u Ciebie najlepiej i ile kosztuje?',
        '3. Były już u Ciebie płatne reklamy? Wystarczy „tak”, „nie” albo „tak i wolę nie pamiętać” 😉',
      ].join('\n'),
      ...rtClosingBlock(input),
    ].join('\n\n'),
  }
}

/** RT, big audience and nothing for sale yet: different questions, never a decline. */
export function rtBigReachMail(input: RtMailInput): MailContent {
  return {
    subject: subjectWithTag(input.firstName, 'trzy szybkie pytania przed naszą rozmową 😉'),
    text: [
      greeting(input.firstName),
      'z tej strony klawiatury Michał Chrapek z Kryptonum. Mam Twoje zgłoszenie i chcę się dobrze przygotować do naszej rozmowy.',
      'Widzę, że masz dużą społeczność i jeszcze nie sprzedajesz własnego produktu. Odpisz mi proszę na trzy pytania. Wystarczy po jednym zdaniu:',
      [
        '1. Z czego dziś zarabiasz na swoich zasięgach: współprace, afiliacja, coś innego?',
        '2. Gdyby jutro miał wyjść Twój własny produkt, o czym by był?',
        '3. Ile czasu w tygodniu realnie masz na nagrywanie?',
      ].join('\n'),
      ...rtClosingBlock(input),
    ].join('\n\n'),
  }
}

/** RT, no sales to scale yet and a small audience: a short decline with the way back. */
export function rtDeclineMail(input: { firstName?: string }): MailContent {
  return {
    subject: subjectWithTag(input.firstName, 'odpowiedź na Twoje zgłoszenie'),
    text: [
      input.firstName ? `Cześć ${input.firstName},` : 'Cześć,',
      'dzięki za zgłoszenie i odpowiedzi. W tym modelu wchodzimy tam, gdzie sprzedaż online już się kręci, więc na tym etapie jest dla nas za wcześnie.',
      'Kiedy Twoje produkty cyfrowe zaczną przynosić 5 000 zł zysku miesięcznie, odezwij się. Prawdopodobnie wiemy, jak tę kwotę przemnożyć.',
      'Trzymam kciuki 🤞\nMichał',
      SIGNATURE,
    ].join('\n\n'),
  }
}

type ItMailInput = {
  email: string
  siteGoal?: string
  sendAt: Date
  absentUntil?: string | null
}

const IT_SIGN_OFF = `Pozdrawiam serdecznie 🙂\nMichał Chrapek\nKryptonum, ${MICHAL_PHONE}`
const itSubject = (email: string, rest: string) => subjectWithTag(companySiteFromEmail(email) ?? undefined, rest)

/** IT, lead left a number: Michał calls first, the mail only announces the call. */
export function itHeadsUpMail(input: ItMailInput): MailContent {
  const backOn = awayOn(input.sendAt, input.absentUntil)
  return {
    subject: itSubject(input.email, 'zadzwonię w sprawie Państwa strony'),
    text: [
      'Dzień dobry,',
      'z tej strony Michał Chrapek z Kryptonum. Mam Państwa zgłoszenie w sprawie strony.',
      backOn
        ? `Do ${backOn} jestem poza biurem, więc zadzwonię zaraz po powrocie, żeby umówić 20 minut rozmowy. Dzwonię z numeru ${MICHAL_PHONE}.`
        : `Zadzwonię pod numer z formularza, żeby umówić 20 minut rozmowy. Dzwonię z numeru ${MICHAL_PHONE}.`,
      'Jeśli jest pora, o której najłatwiej Państwa złapać, proszę o jedno zdanie w odpowiedzi.',
      IT_SIGN_OFF,
    ].join('\n\n'),
  }
}

const QUESTION_COUNT: Record<number, string> = { 2: 'dwa pytania', 3: 'trzy pytania', 4: 'cztery pytania' }

/** IT, no number: the first contact is a mail with the questions the form did not answer. */
export function itQuestionsMail(input: ItMailInput): MailContent {
  const questions: string[] = []
  if (!input.siteGoal || input.siteGoal === 'Jeszcze nie wiem') questions.push('Co nowa strona ma robić w Państwa firmie?')
  if (!companySiteFromEmail(input.email)) questions.push('Jaki jest adres obecnej strony?')
  questions.push('Co dziś najbardziej przeszkadza w obecnej stronie?')
  questions.push('Na kiedy potrzebują Państwo nowej wersji?')
  const backOn = awayOn(input.sendAt, input.absentUntil)
  return {
    subject: itSubject(input.email, 'kilka pytań przed rozmową o Państwa stronie'),
    text: [
      'Dzień dobry,',
      `z tej strony Michał Chrapek z Kryptonum. Mam Państwa zgłoszenie i przed rozmową chcę lepiej zrozumieć projekt. Proszę o odpowiedź na ${QUESTION_COUNT[questions.length]}, wystarczy kilka zdań:`,
      questions.map((question, index) => `${index + 1}. ${question}`).join('\n'),
      'Szczegóły najszybciej ustalimy przez telefon. Proszę podać numer i porę, kiedy mogę zadzwonić. Jeśli wolą Państwo mailowo, po odpowiedzi zaproponuję termin spotkania.',
      ...(backOn ? [`Do ${backOn} jestem poza biurem, więc odpowiem zaraz po powrocie.`] : []),
      IT_SIGN_OFF,
    ].join('\n\n'),
  }
}

/** IT, budget under 30k: a polite decline with the reason. */
export function itDeclineMail(input: { email: string }): MailContent {
  return {
    subject: itSubject(input.email, 'odpowiedź na Państwa zgłoszenie'),
    text: [
      'Dzień dobry,',
      'z tej strony Michał Chrapek z Kryptonum. Dziękuję za zgłoszenie.',
      'Napiszę wprost: przy budżecie poniżej 30 tys. zł nie zrobimy tego dobrze. Nasze projekty zaczynają się od warsztatu, projektu graficznego, przeniesienia treści i panelu, w którym zespół sam zmienia stronę, a za mniej nie da się tego dowieźć.',
      'Jeśli budżet się zmieni albo projekt urośnie, proszę śmiało wrócić. Chętnie wtedy porozmawiam.',
      IT_SIGN_OFF,
    ].join('\n\n'),
  }
}

const escapeHtml = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const textToHtml = (text: string) =>
  text
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${escapeHtml(paragraph.trim()).replace(/\n/g, '<br />')}</p>`)
    .join('\n')

type SendInput = {
  to: string
  mail: MailContent
  /** Leave empty to send right away */
  sendAt?: Date
  /** Test submissions stay away from Michał's and Kuba's inboxes */
  test?: boolean
}

/**
 * Hands the mail to Resend, optionally scheduled. Returns the Resend id only
 * when the message was accepted, so the caller records what really happened.
 */
export async function sendLeadMail({ to, mail, sendAt, test }: SendInput): Promise<string | null> {
  if (!RESEND_API_KEY) {
    console.error('[Leads] Missing RESEND_API_KEY')
    return null
  }
  const isScheduled = !!sendAt && sendAt.getTime() - Date.now() > 60_000
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_API_KEY}` },
      body: JSON.stringify({
        from: SENDER,
        to,
        reply_to: test ? TEST_INBOX : TEAM,
        ...(test ? {} : { bcc: TEAM }),
        subject: test ? `[TEST] ${mail.subject}` : mail.subject,
        html: textToHtml(mail.text),
        text: mail.text,
        ...(isScheduled && { scheduled_at: sendAt!.toISOString() }),
        headers: { 'X-Entity-Ref-ID': crypto.randomUUID() },
      }),
    })
    if (!response.ok) {
      console.error('[Leads] Resend error:', response.status, await response.text())
      return null
    }
    const result = (await response.json()) as { id?: string }
    return result.id ?? null
  } catch (error) {
    console.error('[Leads] Mail send failed:', error)
    return null
  }
}

/** Cancels a scheduled mail. False when it already went out or Resend refused. */
export async function cancelLeadMail(id: string): Promise<boolean> {
  if (!RESEND_API_KEY || !id) return false
  try {
    const response = await fetch(`https://api.resend.com/emails/${id}/cancel`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_API_KEY}` },
    })
    if (!response.ok) console.error('[Leads] Resend cancel error:', response.status, await response.text())
    return response.ok
  } catch (error) {
    console.error('[Leads] Mail cancel failed:', error)
    return false
  }
}
