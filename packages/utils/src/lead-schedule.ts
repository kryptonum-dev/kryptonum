/**
 * When the automatic lead mails go out, counted in Warsaw time.
 *
 * A reply that lands a second after the form looks like a robot, and so does
 * one that lands at half past midnight. All helpers take `now` and a random
 * source as arguments so they can be checked without waiting for the clock.
 */

const TIME_ZONE = 'Europe/Warsaw'

export type WarsawParts = {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  /** 1 = Monday … 7 = Sunday */
  weekday: number
}

const WEEKDAY_INDEX: Record<string, number> = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 }

const partsFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  weekday: 'short',
  hourCycle: 'h23',
})

export function warsawParts(date: Date): WarsawParts {
  const map: Record<string, string> = {}
  for (const part of partsFormatter.formatToParts(date)) map[part.type] = part.value
  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    hour: Number(map.hour),
    minute: Number(map.minute),
    weekday: WEEKDAY_INDEX[map.weekday] ?? 1,
  }
}

/** Turns a Warsaw wall-clock time into the matching instant. */
export function warsawToDate(year: number, month: number, day: number, hour: number, minute: number): Date {
  const guess = Date.UTC(year, month - 1, day, hour, minute)
  const seen = warsawParts(new Date(guess))
  const seenAsUtc = Date.UTC(seen.year, seen.month - 1, seen.day, seen.hour, seen.minute)
  return new Date(guess - (seenAsUtc - guess))
}

const MINUTE = 60_000
const isBusinessDay = (weekday: number) => weekday <= 5

/** Moves a Warsaw calendar day forward and returns it with its weekday. */
function shiftDay(parts: WarsawParts, days: number): WarsawParts {
  const noon = warsawToDate(parts.year, parts.month, parts.day, 12, 0)
  return warsawParts(new Date(noon.getTime() + days * 24 * 60 * MINUTE))
}

/**
 * The questions mail: 6 to 14 minutes after the form. Between 23:00 and 6:30
 * it waits for the morning and goes out between 6:40 and 7:10.
 */
export function pickMailTime(now: Date = new Date(), random: () => number = Math.random): Date {
  const candidate = new Date(now.getTime() + (6 + random() * 8) * MINUTE)
  const parts = warsawParts(candidate)
  const minutesOfDay = parts.hour * 60 + parts.minute
  const isNight = minutesOfDay >= 23 * 60 || minutesOfDay < 6 * 60 + 30
  if (!isNight) return candidate
  const morning = minutesOfDay >= 23 * 60 ? shiftDay(parts, 1) : parts
  const start = warsawToDate(morning.year, morning.month, morning.day, 6, 40)
  return new Date(start.getTime() + random() * 30 * MINUTE)
}

/**
 * The decline mail: the next business day between 14:00 and 14:30. It reads
 * as a decision, and a decline announced on Slack in the evening can still be
 * held back the next morning, when the 9:00 list shows it again.
 */
export function pickDeclineTime(now: Date = new Date(), random: () => number = Math.random): Date {
  let day = shiftDay(warsawParts(now), 1)
  while (!isBusinessDay(day.weekday)) day = shiftDay(day, 1)
  // Early afternoon, so the team has the whole working morning (and the 9:00 list) to hold it back.
  const start = warsawToDate(day.year, day.month, day.day, 14, 0)
  return new Date(start.getTime() + random() * 30 * MINUTE)
}

const DAY_PHRASE: Record<number, string> = {
  1: 'w poniedziałek',
  2: 'we wtorek',
  3: 'w środę',
  4: 'w czwartek',
  5: 'w piątek',
}

/**
 * The two business days after the mail goes out, as a ready phrase for
 * "kiedy masz czas …": Michał answers within a business day, so the call
 * can happen on either of them.
 */
export function nextTwoBusinessDays(sendAt: Date): string {
  const names: string[] = []
  let day = warsawParts(sendAt)
  while (names.length < 2) {
    day = shiftDay(day, 1)
    if (isBusinessDay(day.weekday)) names.push(DAY_PHRASE[day.weekday])
  }
  return `${names[0]} albo ${names[1]}`
}

const CLOSING: Record<number, string> = {
  1: 'Udanego poniedziałku',
  2: 'Udanego wtorku',
  3: 'Udanej środy',
  4: 'Udanego czwarteczku',
  5: 'Udanego piąteczku',
  6: 'Udanego weekendu',
  7: 'Udanego weekendu',
}

/** Michał signs off with the day of the week. */
export function weekdayClosing(sendAt: Date): string {
  return CLOSING[warsawParts(sendAt).weekday]
}

/** "14:42" or "jutro o 8:41" style time for the Slack message. */
export function describeSendTime(sendAt: Date, now: Date = new Date()): string {
  const target = warsawParts(sendAt)
  const today = warsawParts(now)
  const time = `${target.hour}:${String(target.minute).padStart(2, '0')}`
  if (target.day === today.day && target.month === today.month) return `dziś o ${time}`
  const tomorrow = shiftDay(today, 1)
  if (target.day === tomorrow.day && target.month === tomorrow.month) return `jutro o ${time}`
  return `${DAY_PHRASE[target.weekday] ?? 'w weekend'} o ${time}`
}

/** Whole business days that passed between two instants. */
export function businessDaysBetween(from: Date, to: Date): number {
  let count = 0
  let day = warsawParts(from)
  const end = warsawParts(to)
  const endKey = end.year * 10000 + end.month * 100 + end.day
  for (let guard = 0; guard < 60; guard++) {
    day = shiftDay(day, 1)
    const key = day.year * 10000 + day.month * 100 + day.day
    if (key > endKey) break
    if (isBusinessDay(day.weekday)) count++
  }
  return count
}
