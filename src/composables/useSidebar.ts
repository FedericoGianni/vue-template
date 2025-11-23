import { ref, onMounted } from 'vue'

const SIDEBAR_KEY = 'sidebar_collapsed'
const isCollapsed = ref(false)

export function useSidebar() {
  const toggleSidebar = () => {
    isCollapsed.value = !isCollapsed.value
    saveSidebarState()
  }

  const setSidebarCollapsed = (value: boolean) => {
    isCollapsed.value = value
    saveSidebarState()
  }

  const saveSidebarState = () => {
    try {
      localStorage.setItem(SIDEBAR_KEY, isCollapsed.value ? 'true' : 'false')
    } catch (error) {
      console.error('Failed to save sidebar state:', error)
    }
  }

  const loadSidebarState = () => {
    try {
      const saved = localStorage.getItem(SIDEBAR_KEY)
      if (saved !== null) {
        isCollapsed.value = saved === 'true'
      }
    } catch (error) {
      console.error('Failed to load sidebar state:', error)
    }
  }

  onMounted(() => {
    loadSidebarState()
  })

  return {
    isCollapsed,
    toggleSidebar,
    setSidebarCollapsed,
  }
}
