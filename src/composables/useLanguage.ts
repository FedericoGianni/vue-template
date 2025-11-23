import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { saveLocale } from '@/i18n'

export function useLanguage() {
  const { locale, availableLocales } = useI18n()

  const currentLocale = computed({
    get: () => locale.value,
    set: (value: string) => {
      locale.value = value
      saveLocale(value)
    },
  })

  const languages = computed(() => [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  ])

  const setLanguage = (lang: string) => {
    if (availableLocales.includes(lang)) {
      currentLocale.value = lang
    }
  }

  const toggleLanguage = () => {
    currentLocale.value = currentLocale.value === 'en' ? 'it' : 'en'
  }

  return {
    currentLocale,
    languages,
    setLanguage,
    toggleLanguage,
  }
}
