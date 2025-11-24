<template>
  <div v-if="isDebugMode && isVisible" class="fixed bottom-12 right-4 rounded-lg border bg-card p-4 text-xs shadow-lg">
    <div class="mb-2 flex items-center justify-between">
      <h3 class="font-bold">Token Debug</h3>
      <button
        @click="isVisible = false"
        class="rounded p-1 transition-colors hover:bg-accent"
        title="Hide (resets on page reload)"
      >
        <X class="h-3 w-3" />
      </button>
    </div>

    <div class="space-y-1">
      <div>
        <span class="font-semibold">Authenticated: </span>
        <span :class="isAuthenticated ? 'text-green-600' : 'text-red-600'">
          {{ isAuthenticated ? 'Yes' : 'No' }}
        </span>
      </div>

      <div v-if="isAuthenticated">
        <span class="font-semibold">Has Refresh Token: </span>
        <span :class="hasRefreshToken ? 'text-green-600' : 'text-red-600'">
          {{ hasRefreshToken ? 'Yes' : 'No' }}
        </span>
      </div>

      <div v-if="isAuthenticated">
        <span class="font-semibold">Token Expires In: </span>
        <span :class="tokenExpiresIn < 30 ? 'text-orange-600' : 'text-green-600'">
          {{ tokenExpiresIn }}s
        </span>
      </div>

      <div v-if="lastRefresh" class="text-muted-foreground">
        Last refresh: {{ lastRefresh }}
      </div>
    </div>

    <div class="mt-3 space-x-2">
      <Button size="sm" variant="outline" @click="checkToken">
        Check
      </Button>
      <Button size="sm" variant="outline" @click="forceRefresh">
        Force Refresh
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { X } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { getKeycloakInstance } from '@/services/keycloak'
import { logger } from '@/utils/logger'

const isDebugMode = import.meta.env.VITE_APP_DEBUG === 'true'
const isVisible = ref(true)

const isAuthenticated = ref(false)
const tokenExpiresIn = ref(0)
const hasRefreshToken = ref(false)
const lastRefresh = ref('')

let interval: number | null = null

const updateTokenInfo = () => {
  const kc = getKeycloakInstance()
  isAuthenticated.value = kc.authenticated ?? false
  // Check if in-memory refresh token exists
  hasRefreshToken.value = !!kc.refreshToken

  if (kc.tokenParsed?.exp) {
    const expiresAt = kc.tokenParsed.exp * 1000
    tokenExpiresIn.value = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000))
  } else {
    tokenExpiresIn.value = 0
  }
}

const checkToken = () => {
  updateTokenInfo()
  const kc = getKeycloakInstance()
  logger.log('📊 Token Info:', {
    authenticated: isAuthenticated.value,
    expiresIn: tokenExpiresIn.value + 's',
    hasRefreshToken: hasRefreshToken.value,
    tokenPreview: kc.token?.substring(0, 20) + '...',
    refreshTokenPreview: kc.refreshToken?.substring(0, 20) + '...',
    issuedAt: kc.tokenParsed?.iat ? new Date(kc.tokenParsed.iat * 1000).toLocaleTimeString() : 'unknown',
    expiresAt: kc.tokenParsed?.exp ? new Date(kc.tokenParsed.exp * 1000).toLocaleTimeString() : 'unknown',
  })
}

const forceRefresh = async () => {
  try {
    logger.log('🔧 Force refreshing token (bypassing time check)...')
    const kc = getKeycloakInstance()

    const oldExpiry = kc.tokenParsed?.exp
    logger.log('Before refresh:', {
      expiresAt: oldExpiry ? new Date(oldExpiry * 1000).toLocaleTimeString() : 'unknown',
      expiresIn: oldExpiry ? Math.floor((oldExpiry * 1000 - Date.now()) / 1000) : 0
    })

    const refreshed = await kc.updateToken(9999)

    await new Promise(resolve => setTimeout(resolve, 100))

    const newExpiry = kc.tokenParsed?.exp
    logger.log('After refresh:', {
      refreshed,
      expiresAt: newExpiry ? new Date(newExpiry * 1000).toLocaleTimeString() : 'unknown',
      expiresIn: newExpiry ? Math.floor((newExpiry * 1000 - Date.now()) / 1000) : 0
    })

    lastRefresh.value = new Date().toLocaleTimeString()
    updateTokenInfo()

    if (!refreshed) {
      logger.warn('⚠️ Token was not refreshed. It might still be valid.')
    }
  } catch (error) {
    console.error('❌ Failed to refresh token:', error)
  }
}

onMounted(() => {
  updateTokenInfo()
  interval = window.setInterval(updateTokenInfo, 1000)
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})
</script>
