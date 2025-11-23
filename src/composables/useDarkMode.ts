import { ref, computed } from 'vue'

const storedTheme = localStorage.getItem('theme')
const isDark = ref(storedTheme === 'dark' ? true : storedTheme === 'light' ? false : window.matchMedia('(prefers-color-scheme: dark)').matches)

const updateTheme = () => {
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

// Apply theme immediately on load
updateTheme()

export function useDarkMode() {
  const toggleDarkMode = () => {
    isDark.value = !isDark.value
    updateTheme()
  }

  const setDarkMode = (value: boolean) => {
    isDark.value = value
    updateTheme()
  }

  const theme = computed(() => isDark.value ? 'dark' : 'light')

  return {
    isDark,
    theme,
    toggleDarkMode,
    setDarkMode,
  }
}
