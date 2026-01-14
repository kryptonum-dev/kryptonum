import type { Language } from './languages'

/**
 * Language indexation policy for SEO strategy 2026+
 * 
 * Controls which languages are:
 * - indexable (appear in sitemap, no noindex)
 * - archived (kept accessible but noindex, no hreflang)
 * 
 * When a language is moved from archived → indexable:
 * - Remove noindex
 * - Add to sitemap
 * - Enable hreflang
 * - Show language switcher
 */

export const LANGUAGE_POLICY = {
  /** Primary language for the site */
  primaryLanguage: 'pl' as Language,
  
  /** Languages that should be indexed and actively maintained */
  indexableLanguages: ['pl'] as Language[],
  
  /** Languages that are kept live but archived (noindex, excluded from navigation) */
  archivedLanguages: ['en'] as Language[],
} as const

/**
 * Check if a language should be indexed
 */
export function isLanguageIndexable(lang: Language): boolean {
  return LANGUAGE_POLICY.indexableLanguages.includes(lang)
}

/**
 * Check if a language is archived
 */
export function isLanguageArchived(lang: Language): boolean {
  return LANGUAGE_POLICY.archivedLanguages.includes(lang)
}

/**
 * Get all indexable languages except the current one
 * (used to determine if we should show language switcher / hreflang)
 */
export function getOtherIndexableLanguages(currentLang: Language): Language[] {
  return LANGUAGE_POLICY.indexableLanguages.filter(lang => lang !== currentLang)
}
