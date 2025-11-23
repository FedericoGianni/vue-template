import { createI18n } from 'vue-i18n'
import en from '@/locales/en.json'
import it from '@/locales/it.json'

const LOCALE_KEY = 'app_locale'

// Get saved locale or default to browser language
const getSavedLocale = (): string => {
  try {
    const saved = localStorage.getItem(LOCALE_KEY)
    if (saved && ['en', 'it'].includes(saved)) {
      return saved
    }
  } catch {
    // Ignore localStorage errors
  }

  // Default to browser language or 'en'
  const browserLang = navigator.language.split('-')[0]
  return ['en', 'it'].includes(browserLang) ? browserLang : 'en'
}

export const i18n = createI18n({
  legacy: false,
  locale: getSavedLocale(),
  fallbackLocale: 'en',
  messages: {
    en,
    it,
  },
})

export const saveLocale = (locale: string) => {
  try {
    localStorage.setItem(LOCALE_KEY, locale)
  } catch (error) {
    console.error('Failed to save locale:', error)
  }
}
