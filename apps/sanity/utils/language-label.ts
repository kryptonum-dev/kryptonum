type Props = {
  language: 'pl' | 'en'
}

export const languageLabel = (language: Props['language']) => {
  return language == 'pl' ? '🇵🇱 Polski (Polish)' : '🇬🇧 English (English)'
}
