import { type Language } from "@repo/shared/languages";

export const formatDate = (date: Date, lang: Language = 'pl') =>
  new Intl.DateTimeFormat(lang, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
