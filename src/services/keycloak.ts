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

// Store refresh token in localStorage for persistent sessions
const REFRESH_TOKEN_KEY = 'kc_refresh_token'

const getStoredRefreshToken = (): string | null => {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  } catch {
    return null
  }
}

const storeRefreshToken = (token: string | null): void => {
  try {
    if (token) {
      localStorage.setItem(REFRESH_TOKEN_KEY, token)
    } else {
      localStorage.removeItem(REFRESH_TOKEN_KEY)
    }
  } catch (error) {
    console.error('Failed to store refresh token:', error)
  }
}

// Check if we're in an OAuth callback (code/state in URL)
const isOAuthCallback = () => {
  const params = new URLSearchParams(window.location.search)
  return params.has('code') || params.has('state') || params.has('session_state')
}

const initOptions: KeycloakInitOptions = {
  onLoad: 'check-sso',
  silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
  pkceMethod: 'S256',
  checkLoginIframe: false, // Disable iframe to avoid CSP issues
  // Only use stored refresh token if we're NOT in an OAuth callback
  refreshToken: !isOAuthCallback() ? getStoredRefreshToken() || undefined : undefined,
}

export const initKeycloak = async (): Promise<boolean> => {
  // If already initializing, return the existing promise
  if (initPromise) {
    logger.log('⏳ Keycloak initialization already in progress, waiting...')
    return initPromise
  }

  // Start initialization and cache the promise
  initPromise = (async () => {
    try {
      logger.log('🚀 Initializing Keycloak...', {
        isCallback: isOAuthCallback(),
        hasStoredRefreshToken: !!getStoredRefreshToken(),
        url: window.location.href
      })

      const authenticated = await keycloak.init(initOptions)

      logger.log('✅ Keycloak initialized successfully', { authenticated })

      if (authenticated && keycloak.refreshToken) {
        storeRefreshToken(keycloak.refreshToken)

        // Set up automatic token refresh
        keycloak.onTokenExpired = async () => {
          logger.log('⏰ Token expired, refreshing...')
          await refreshToken()
        }

        // Proactively refresh token every 60 seconds if it's about to expire
        setInterval(async () => {
          try {
            await keycloak.updateToken(70) // Refresh if expires in < 70 seconds
            if (keycloak.refreshToken) {
              storeRefreshToken(keycloak.refreshToken)
            }
          } catch (error) {
            console.error('Failed to refresh token in background:', error)
          }
        }, 60000) // Check every 60 seconds
      }

      return authenticated
    } catch (error) {
      console.error('Failed to initialize Keycloak:', error)
      initPromise = null // Reset on error so it can be retried
      throw error
    }
  })()

  return initPromise
}

export const login = async (): Promise<void> => {
  logger.log('Keycloak login called, authenticated:', keycloak.authenticated)
  logger.log('Redirect URI:', window.location.origin + '/dashboard')

  try {
    await keycloak.login({
      redirectUri: window.location.origin + '/dashboard',
    })
  } catch (error) {
    console.error('Keycloak login error:', error)
    throw error
  }
}

export const logout = async (): Promise<void> => {
  storeRefreshToken(null)
  await keycloak.logout({
    redirectUri: window.location.origin + '/login',
  })
}

export const refreshToken = async (): Promise<boolean> => {
  try {
    logger.log('🔄 Attempting to refresh token...')
    const oldExpiry = keycloak.tokenParsed?.exp

    const refreshed = await keycloak.updateToken(30)

    if (refreshed && keycloak.refreshToken) {
      storeRefreshToken(keycloak.refreshToken)
      const newExpiry = keycloak.tokenParsed?.exp
      logger.log('✅ Token refreshed successfully!', {
        oldExpiry: oldExpiry ? new Date(oldExpiry * 1000).toLocaleTimeString() : 'none',
        newExpiry: newExpiry ? new Date(newExpiry * 1000).toLocaleTimeString() : 'none',
        expiresIn: newExpiry ? Math.floor((newExpiry * 1000 - Date.now()) / 1000) : 0
      })
    } else {
      logger.log('ℹ️ Token still valid, no refresh needed')
    }

    return refreshed
  } catch (error) {
    console.error('❌ Failed to refresh token:', error)
    storeRefreshToken(null)
    return false
  }
}

export const getToken = (): string | undefined => {
  return keycloak.token
}

export const getRefreshToken = (): string | null => {
  return keycloak.refreshToken || getStoredRefreshToken()
}

export const isAuthenticated = (): boolean => {
  return keycloak.authenticated ?? false
}

export const getUserProfile = async () => {
  if (keycloak.authenticated) {
    return await keycloak.loadUserProfile()
  }
  return null
}

export const getKeycloakInstance = () => keycloak

export const ensureTokenValid = async (minValidity: number = 30): Promise<boolean> => {
  try {
    const refreshed = await keycloak.updateToken(minValidity)
    if (refreshed && keycloak.refreshToken) {
      storeRefreshToken(keycloak.refreshToken)
    }
    return true
  } catch (error) {
    console.error('Failed to ensure token is valid:', error)
    return false
  }
}

export default keycloak
