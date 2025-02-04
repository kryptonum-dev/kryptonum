export const LANGUAGES = ['pl', 'en'] as const
export type Language = typeof LANGUAGES[number]

const translations = {
  pl: {
    'breadcrumbsName': 'Strona główna',
    'skipLink': 'Przejdź do treści głównej',
    'header.services': 'Usługi',
    'header.caseStudies': 'Zobacz projekty',
    'header.about': 'Dowiedz się o nas',
  },
  en: {
    'breadcrumbsName': 'Homepage',
    'skipLink': 'Skip to main content',
    'header.services': 'Services',
    'header.caseStudies': 'See projects',
    'header.about': 'Learn more about us',
  },
}

export function useTranslations(lang: Language) {
  return function t(key: keyof (typeof translations)['pl']) {
    return translations[lang][key]
  }
}

export const getLocaleFromPath = (pathname: string) => {
  const [, locale] = pathname.split('/');
  return locale === "en" ? "en" : "pl";
}
