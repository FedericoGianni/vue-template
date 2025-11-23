<template>
  <div class="flex min-h-screen bg-background">
    <Sidebar />
    <TokenDebug />

    <main class="flex-1 p-8 transition-all duration-300" :class="isCollapsed ? 'ml-16' : 'ml-64'">
      <div class="mb-8">
        <h1 class="text-3xl font-bold">{{ t('nav.settings') }}</h1>
        <p class="text-muted-foreground">{{ t('pages.settings.subtitle') }}</p>
      </div>

      <div class="grid gap-6">
        <!-- Profile Settings -->
        <Card>
          <CardHeader>
            <CardTitle>{{ t('pages.settings.profile') }}</CardTitle>
            <CardDescription>{{ t('pages.settings.profileDescription') }}</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid gap-4 md:grid-cols-2">
              <div class="space-y-2">
                <label class="text-sm font-medium">{{ t('pages.settings.firstName') }}</label>
                <input
                  type="text"
                  :value="authStore.user?.firstName || ''"
                  class="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  disabled
                />
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium">{{ t('pages.settings.lastName') }}</label>
                <input
                  type="text"
                  :value="authStore.user?.lastName || ''"
                  class="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  disabled
                />
              </div>
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium">{{ t('pages.settings.email') }}</label>
              <input
                type="email"
                :value="authStore.user?.email || ''"
                class="w-full rounded-md border bg-background px-3 py-2 text-sm"
                disabled
              />
              <p class="text-xs text-muted-foreground">{{ t('pages.settings.managedByKeycloak') }}</p>
            </div>
          </CardContent>
        </Card>

        <!-- Appearance Settings -->
        <Card>
          <CardHeader>
            <CardTitle>{{ t('pages.settings.appearance') }}</CardTitle>
            <CardDescription>{{ t('pages.settings.appearanceDescription') }}</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium">{{ t('pages.settings.darkMode') }}</p>
                <p class="text-sm text-muted-foreground">{{ t('pages.settings.darkModeDescription') }}</p>
              </div>
              <Button variant="outline" @click="toggleDarkMode">
                <component :is="isDark ? Sun : Moon" class="mr-2 h-4 w-4" />
                {{ isDark ? t('theme.light') : t('theme.dark') }}
              </Button>
            </div>
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium">{{ t('pages.settings.language') }}</p>
                <p class="text-sm text-muted-foreground">{{ t('pages.settings.languageDescription') }}</p>
              </div>
              <Button variant="outline" @click="toggleLanguage">
                <Globe class="mr-2 h-4 w-4" />
                {{ currentLocale.toUpperCase() }}
              </Button>
            </div>
          </CardContent>
        </Card>

        <!-- Notifications -->
        <Card>
          <CardHeader>
            <CardTitle>{{ t('pages.settings.notifications') }}</CardTitle>
            <CardDescription>{{ t('pages.settings.notificationsDescription') }}</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div v-for="notif in notifications" :key="notif.id" class="flex items-center justify-between">
              <div>
                <p class="font-medium">{{ t(`pages.settings.${notif.key}`) }}</p>
                <p class="text-sm text-muted-foreground">{{ t(`pages.settings.${notif.key}Description`) }}</p>
              </div>
              <label class="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" v-model="notif.enabled" class="peer sr-only" />
                <div class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700"></div>
              </label>
            </div>
          </CardContent>
        </Card>

        <!-- Danger Zone -->
        <Card class="border-destructive">
          <CardHeader>
            <CardTitle class="text-destructive">{{ t('pages.settings.dangerZone') }}</CardTitle>
            <CardDescription>{{ t('pages.settings.dangerZoneDescription') }}</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium">{{ t('pages.settings.deleteAccount') }}</p>
                <p class="text-sm text-muted-foreground">{{ t('pages.settings.deleteAccountDescription') }}</p>
              </div>
              <Button variant="destructive">{{ t('pages.settings.deleteAccount') }}</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Sun, Moon, Globe } from 'lucide-vue-next'
import Sidebar from '@/components/layout/Sidebar.vue'
import TokenDebug from '@/components/TokenDebug.vue'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth'
import { useDarkMode } from '@/composables/useDarkMode'
import { useLanguage } from '@/composables/useLanguage'
import { useSidebar } from '@/composables/useSidebar'

const { t } = useI18n()
const authStore = useAuthStore()
const { isDark, toggleDarkMode } = useDarkMode()
const { currentLocale, toggleLanguage } = useLanguage()
const { isCollapsed } = useSidebar()

const notifications = ref([
  { id: 1, key: 'emailNotifications', enabled: true },
  { id: 2, key: 'pushNotifications', enabled: false },
  { id: 3, key: 'weeklyDigest', enabled: true },
  { id: 4, key: 'marketingEmails', enabled: false },
])
</script>
