import Keycloak, { type KeycloakConfig, type KeycloakInitOptions } from 'keycloak-js'
import { logger } from '@/utils/logger'

const keycloakConfig: KeycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
}

const keycloak = new Keycloak(keycloakConfig)

// Track initialization promise to prevent concurrent initializations
let initPromise: Promise<boolean> | null = null

// Check if we're in an OAuth callback (code/state in URL)
const isOAuthCallback = () => {
  const params = new URLSearchParams(window.location.search)
  return params.has('code') || params.has('state') || params.has('session_state')
}

const initOptions: KeycloakInitOptions = {
  onLoad: 'check-sso',
  silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
  pkceMethod: 'S256',
  checkLoginIframe: false,
}

export const initKeycloak = async (): Promise<boolean> => {
  if (initPromise) return initPromise

  initPromise = (async () => {
    try {
      logger.log('🚀 Initializing Keycloak...', { isCallback: isOAuthCallback() })

      const authenticated = await keycloak.init(initOptions)
      logger.log('✅ Keycloak initialized', { authenticated })

      if (authenticated) {
        // Set up automatic token refresh
        keycloak.onTokenExpired = async () => {
          logger.log('⏰ Token expired, refreshing...')
          await refreshToken()
        }

        // Proactively refresh token every 60 seconds if it's about to expire
        setInterval(async () => {
          try {
            await keycloak.updateToken(70) // Refresh if expires in < 70s
          } catch (error) {
            console.error('Failed to refresh token in background:', error)
          }
        }, 60000)
      }

      return authenticated
    } catch (error) {
      console.error('Failed to initialize Keycloak:', error)
      initPromise = null
      throw error
    }
  })()

  return initPromise
}

export const login = async (): Promise<void> => {
  await keycloak.login({ redirectUri: window.location.origin + '/dashboard' })
}

export const logout = async (): Promise<void> => {
  await keycloak.logout({ redirectUri: window.location.origin + '/login' })
}

export const refreshToken = async (): Promise<boolean> => {
  try {
    const refreshed = await keycloak.updateToken(30)
    if (refreshed) logger.log('✅ Token refreshed')
    return refreshed
  } catch (error) {
    console.error('❌ Failed to refresh token:', error)
    return false
  }
}

export const getToken = (): string | undefined => keycloak.token
export const isAuthenticated = (): boolean => keycloak.authenticated ?? false
export const getUserProfile = async () =>
  keycloak.authenticated ? await keycloak.loadUserProfile() : null
export const getKeycloakInstance = () => keycloak
export const ensureTokenValid = async (minValidity: number = 30): Promise<boolean> => {
  try {
    return !!(await keycloak.updateToken(minValidity))
  } catch {
    return false
  }
}

export default keycloak
