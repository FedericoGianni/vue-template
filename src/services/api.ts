import { ensureTokenValid, getToken, logout } from './keycloak'
import { logger } from '@/utils/logger'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

interface RequestOptions extends RequestInit {
  skipAuth?: boolean
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { skipAuth = false, ...fetchOptions } = options

  // Ensure token is valid before making the request (refresh if needed)
  if (!skipAuth) {
    const tokenValid = await ensureTokenValid(30)
    if (!tokenValid) {
      console.error('Token refresh failed, redirecting to login...')
      await logout()
      throw new Error('Authentication failed')
    }
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  }

  // Add authorization header if not skipping auth
  if (!skipAuth) {
    const token = getToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    })

    // Handle 401 - token might have expired between refresh check and request
    if (response.status === 401) {
      logger.log('🔄 Received 401, attempting token refresh and retry...')

      // Try to refresh token one more time
      const retryTokenValid = await ensureTokenValid(0)
      if (retryTokenValid) {
        // Retry the request with new token
        const token = getToken()
        if (token) {
          headers.Authorization = `Bearer ${token}`
        }

        const retryResponse = await fetch(url, {
          ...fetchOptions,
          headers,
        })

        if (!retryResponse.ok) {
          throw new Error(`HTTP error! status: ${retryResponse.status}`)
        }

        return retryResponse.json()
      } else {
        // Refresh failed, logout user
        console.error('Token refresh failed after 401, logging out...')
        await logout()
        throw new Error('Session expired')
      }
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Handle empty responses
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      return response.json()
    }

    return response.text() as T
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    }),

  put: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  patch: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
}

export default api
