<template>
  <div class="flex min-h-screen items-center justify-center bg-background">
    <div class="fixed right-4 top-4">
      <div class="flex gap-2">
        <Button variant="ghost" size="icon" @click="toggleLanguage" :title="t('language.select')">
          <span class="text-xs font-semibold">{{ currentLocale.toUpperCase() }}</span>
        </Button>
        <Button variant="ghost" size="icon" @click="toggleDarkMode" :title="t('theme.toggleDark')">
          <Sun v-if="isDark" class="h-5 w-5" />
          <Moon v-else class="h-5 w-5" />
        </Button>
      </div>
    </div>
    <Card class="w-full max-w-md">
      <CardHeader class="text-center">
        <CardTitle class="text-2xl">{{ t('auth.welcome') }}</CardTitle>
        <CardDescription>{{ t('auth.signInMessage') }}</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <Button class="w-full" @click="handleLogin" :disabled="isLoading">
          {{ isLoading ? t('auth.redirecting') : t('auth.login') }}
        </Button>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Moon, Sun } from 'lucide-vue-next'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth'
import { useDarkMode } from '@/composables/useDarkMode'
import { useLanguage } from '@/composables/useLanguage'
import { logger } from '@/utils/logger'

const authStore = useAuthStore()
const { isDark, toggleDarkMode } = useDarkMode()
const { currentLocale, toggleLanguage } = useLanguage()
const { t } = useI18n()
const isLoading = ref(false)

const handleLogin = async () => {
  logger.log('Login button clicked')
  isLoading.value = true
  try {
    logger.log('Calling authStore.login()...')
    await authStore.login()
    logger.log('Login call completed (this may not log if redirect happens)')
  } catch (error) {
    console.error('Login failed:', error)
    isLoading.value = false
  }
  // Note: isLoading will stay true if Keycloak redirects (which is expected)
}
</script>
