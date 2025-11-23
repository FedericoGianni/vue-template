<template>
  <div class="flex min-h-screen bg-background">
    <Sidebar />
    <TokenDebug />
    <VersionDisplay />

    <main class="flex-1 p-8 transition-all duration-300" :class="isCollapsed ? 'ml-16' : 'ml-64'">
      <div class="mb-8">
        <h1 class="text-3xl font-bold">{{ t('nav.dashboard') }}</h1>
        <p class="text-muted-foreground">{{ t('pages.dashboard.welcome', { name: userName }) }}</p>
      </div>

      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">{{ t('pages.dashboard.totalRevenue') }}</CardTitle>
            <DollarSign class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">$45,231.89</div>
            <p class="text-xs text-muted-foreground">{{ t('pages.dashboard.revenueChange') }}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">{{ t('pages.dashboard.subscriptions') }}</CardTitle>
            <Users class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">+2,350</div>
            <p class="text-xs text-muted-foreground">{{ t('pages.dashboard.subscriptionsChange') }}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">{{ t('pages.dashboard.sales') }}</CardTitle>
            <CreditCard class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">+12,234</div>
            <p class="text-xs text-muted-foreground">{{ t('pages.dashboard.salesChange') }}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">{{ t('pages.dashboard.activeNow') }}</CardTitle>
            <Activity class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">+573</div>
            <p class="text-xs text-muted-foreground">{{ t('pages.dashboard.activeChange') }}</p>
          </CardContent>
        </Card>
      </div>

      <div class="mt-6 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{{ t('pages.dashboard.recentActivity') }}</CardTitle>
            <CardDescription>{{ t('pages.dashboard.recentActivityDescription') }}</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div v-for="activity in recentActivities" :key="activity.id" class="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback>{{ activity.initials }}</AvatarFallback>
                </Avatar>
                <div class="flex-1 space-y-1">
                  <p class="text-sm font-medium leading-none">{{ activity.title }}</p>
                  <p class="text-sm text-muted-foreground">{{ activity.description }}</p>
                </div>
                <span class="text-sm text-muted-foreground">{{ activity.time }}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{{ t('pages.dashboard.quickActions') }}</CardTitle>
            <CardDescription>{{ t('pages.dashboard.quickActionsDescription') }}</CardDescription>
          </CardHeader>
          <CardContent class="space-y-2">
            <Button variant="outline" class="w-full justify-start" @click="$router.push('/documents')">
              <FileText class="mr-2 h-4 w-4" />
              {{ t('pages.dashboard.createNewDocument') }}
            </Button>
            <Button variant="outline" class="w-full justify-start" @click="$router.push('/users')">
              <Users class="mr-2 h-4 w-4" />
              {{ t('pages.dashboard.inviteTeamMember') }}
            </Button>
            <Button variant="outline" class="w-full justify-start" @click="$router.push('/settings')">
              <Settings class="mr-2 h-4 w-4" />
              {{ t('pages.dashboard.configureSettings') }}
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { DollarSign, Users, CreditCard, Activity, FileText, Settings } from 'lucide-vue-next'
import Sidebar from '@/components/layout/Sidebar.vue'
import TokenDebug from '@/components/TokenDebug.vue'
import VersionDisplay from '@/components/VersionDisplay.vue'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuthStore } from '@/stores/auth'
import { useSidebar } from '@/composables/useSidebar'

const { t } = useI18n()
const authStore = useAuthStore()
const { isCollapsed } = useSidebar()

const userName = computed(() => {
  const user = authStore.user
  if (user?.firstName) {
    return user.firstName
  }
  return user?.username || 'User'
})

const recentActivities = ref([
  {
    id: 1,
    initials: 'JD',
    title: 'John Doe',
    description: 'Completed a new project milestone',
    time: '2m ago',
  },
  {
    id: 2,
    initials: 'AS',
    title: 'Alice Smith',
    description: 'Updated the documentation',
    time: '1h ago',
  },
  {
    id: 3,
    initials: 'BJ',
    title: 'Bob Johnson',
    description: 'Submitted a pull request',
    time: '3h ago',
  },
])
</script>
