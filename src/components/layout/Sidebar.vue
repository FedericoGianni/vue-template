<template>
  <aside
    class="fixed left-0 top-0 z-40 h-screen border-r bg-background transition-all duration-300"
    :class="isCollapsed ? 'w-16' : 'w-64'"
  >
    <div class="flex h-full flex-col">
      <div class="flex h-16 items-center border-b" :class="isCollapsed ? 'justify-center' : 'px-6'">
        <h1 v-if="!isCollapsed" class="text-xl font-bold">Vue Template</h1>
        <span v-else class="text-xl font-bold">VT</span>
      </div>

      <nav class="flex-1 space-y-1 px-3 py-4">
        <RouterLink
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          :class="isCollapsed ? 'justify-center' : 'gap-3'"
          active-class="bg-accent text-accent-foreground"
          :title="isCollapsed ? t(item.labelKey) : ''"
        >
          <component :is="item.icon" class="h-5 w-5" :class="isCollapsed ? '' : 'shrink-0'" />
          <span v-if="!isCollapsed">{{ t(item.labelKey) }}</span>
        </RouterLink>
      </nav>

      <div class="border-t p-4">
        <!-- User Section with Settings Icon -->
        <div v-if="!isCollapsed" class="mb-3 flex items-stretch gap-2">
          <button
            @click="isUserMenuOpen = !isUserMenuOpen"
            class="flex flex-1 cursor-pointer items-center gap-3 rounded-lg p-2 text-left outline-none transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Avatar>
              <AvatarFallback>{{ userInitials }}</AvatarFallback>
            </Avatar>
            <div class="flex-1 overflow-hidden">
              <p class="truncate text-sm font-medium">{{ userName }}</p>
              <p class="truncate text-xs text-muted-foreground">{{ userEmail }}</p>
            </div>
          </button>

          <button
            @click="goToSettings"
            class="flex items-center justify-center rounded-lg px-3 transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:ring-2 focus-visible:ring-ring outline-none"
            :title="t('nav.settings')"
          >
            <Settings class="h-5 w-5" />
          </button>

          <!-- Dropdown menu -->
          <Teleport to="body">
            <div
              v-if="isUserMenuOpen"
              @click="isUserMenuOpen = false"
              class="fixed inset-0 z-50"
            >
              <div
                @click.stop
                class="absolute bottom-20 left-4 w-56 rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
              >
                <button
                  @click="goToSettings"
                  class="flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent focus:bg-accent"
                >
                  <Settings class="mr-2 h-4 w-4" />
                  {{ t('nav.settings') }}
                </button>
                <button
                  @click="handleLogout"
                  class="flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm text-destructive outline-none transition-colors hover:bg-accent focus:bg-accent"
                >
                  <LogOut class="mr-2 h-4 w-4" />
                  {{ t('auth.logout') }}
                </button>
              </div>
            </div>
          </Teleport>
        </div>

        <div v-else class="mb-3 flex flex-col items-center gap-2">
          <button
            @click="isUserMenuOpen = !isUserMenuOpen"
            class="flex cursor-pointer items-center justify-center rounded-lg p-2 outline-none transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
            :title="userName"
          >
            <Avatar class="h-8 w-8">
              <AvatarFallback>{{ userInitials }}</AvatarFallback>
            </Avatar>
          </button>

          <button
            @click="goToSettings"
            class="flex cursor-pointer items-center justify-center rounded-lg p-2 outline-none transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
            :title="t('nav.settings')"
          >
            <Settings class="h-5 w-5" />
          </button>

          <!-- Dropdown menu for collapsed state -->
          <Teleport to="body">
            <div
              v-if="isUserMenuOpen"
              @click="isUserMenuOpen = false"
              class="fixed inset-0 z-50"
            >
              <div
                @click.stop
                class="absolute bottom-20 left-4 w-56 rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
              >
                <button
                  @click="goToSettings"
                  class="flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent focus:bg-accent"
                >
                  <Settings class="mr-2 h-4 w-4" />
                  {{ t('nav.settings') }}
                </button>
                <button
                  @click="handleLogout"
                  class="flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm text-destructive outline-none transition-colors hover:bg-accent focus:bg-accent"
                >
                  <LogOut class="mr-2 h-4 w-4" />
                  {{ t('auth.logout') }}
                </button>
              </div>
            </div>
          </Teleport>
        </div>

        <!-- Collapse Button -->
        <button
          v-if="!isCollapsed"
          @click="toggleSidebar"
          class="flex w-full items-center justify-start gap-3 rounded-lg p-2 text-sm transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:ring-2 focus-visible:ring-ring outline-none"
        >
          <PanelLeftClose class="h-5 w-5" />
          <span>{{ t('sidebar.collapse') }}</span>
        </button>

        <button
          v-else
          @click="toggleSidebar"
          class="flex w-full items-center justify-center rounded-lg p-2 transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:ring-2 focus-visible:ring-ring outline-none"
          :title="t('sidebar.expand')"
        >
          <PanelLeftOpen class="h-5 w-5" />
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { LayoutDashboard, Users, Settings, FileText, LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-vue-next'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuthStore } from '@/stores/auth'
import { useSidebar } from '@/composables/useSidebar'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const { isCollapsed, toggleSidebar } = useSidebar()
const { t } = useI18n()
const isUserMenuOpen = ref(false)

const menuItems = [
  { path: '/dashboard', labelKey: 'nav.dashboard', icon: LayoutDashboard },
  { path: '/users', labelKey: 'nav.users', icon: Users },
  { path: '/documents', labelKey: 'nav.documents', icon: FileText },
]

const userName = computed(() => {
  const user = authStore.user
  if (user?.firstName && user?.lastName) {
    return `${user.firstName} ${user.lastName}`
  }
  return user?.username || 'User'
})

const userEmail = computed(() => authStore.user?.email || '')

const userInitials = computed(() => {
  const user = authStore.user
  if (user?.firstName && user?.lastName) {
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
  }
  if (user?.username) {
    return user.username.substring(0, 2).toUpperCase()
  }
  return 'U'
})

const handleLogout = async () => {
  isUserMenuOpen.value = false
  await authStore.logout()
}

const goToSettings = () => {
  isUserMenuOpen.value = false
  router.push('/settings')
}
</script>
