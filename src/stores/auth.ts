import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types/auth'
import {
  initKeycloak,
  login as keycloakLogin,
  logout as keycloakLogout,
  getToken,
  getRefreshToken,
  isAuthenticated as keycloakIsAuthenticated,
  getUserProfile,
  getKeycloakInstance,
  ensureTokenValid,
} from '@/services/keycloak'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const accessToken = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const isLoading = ref(false)

  const isAuthenticated = computed(() => keycloakIsAuthenticated())

  const initialize = async (): Promise<boolean> => {
    isLoading.value = true
    try {
      const authenticated = await initKeycloak()

      if (authenticated) {
        await loadUserData()
      }

      return authenticated
    } catch (error) {
      console.error('Failed to initialize auth:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const loadUserData = async (): Promise<void> => {
    const keycloak = getKeycloakInstance()
    const profile = await getUserProfile()

    if (profile && keycloak.tokenParsed) {
      user.value = {
        id: profile.id || keycloak.tokenParsed.sub || '',
        username: profile.username || '',
        email: profile.email || '',
        firstName: profile.firstName,
        lastName: profile.lastName,
        roles: keycloak.tokenParsed.realm_access?.roles || [],
      }

      accessToken.value = getToken() || null
      refreshToken.value = getRefreshToken()
    }
  }

  const login = async (): Promise<void> => {
    await keycloakLogin()
  }

  const logout = async (): Promise<void> => {
    user.value = null
    accessToken.value = null
    refreshToken.value = null
    await keycloakLogout()
  }

  const updateTokens = (): void => {
    accessToken.value = getToken() || null
    refreshToken.value = getRefreshToken()
  }

  return {
    user,
    accessToken,
    refreshToken,
    isLoading,
    isAuthenticated,
    initialize,
    login,
    logout,
    updateTokens,
    loadUserData,
    ensureTokenValid,
  }
})
