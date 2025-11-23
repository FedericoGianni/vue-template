<template>
  <div class="flex min-h-screen bg-background">
    <Sidebar />
    <TokenDebug />

    <main class="flex-1 p-8 transition-all duration-300" :class="isCollapsed ? 'ml-16' : 'ml-64'">
      <div class="mb-8">
        <h1 class="text-3xl font-bold">{{ t('nav.users') }}</h1>
        <p class="text-muted-foreground">{{ t('pages.users.subtitle') }}</p>
      </div>

      <div class="mb-4 flex items-center justify-between">
        <div class="flex gap-2">
          <Button>
            <UserPlus class="mr-2 h-4 w-4" />
            {{ t('pages.users.addUser') }}
          </Button>
          <Button variant="outline">
            <Download class="mr-2 h-4 w-4" />
            {{ t('pages.users.export') }}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{{ t('pages.users.teamMembers') }}</CardTitle>
          <CardDescription>{{ t('pages.users.teamDescription') }}</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b">
                  <th class="pb-3 text-left text-sm font-medium">{{ t('pages.users.name') }}</th>
                  <th class="pb-3 text-left text-sm font-medium">{{ t('pages.users.email') }}</th>
                  <th class="pb-3 text-left text-sm font-medium">{{ t('pages.users.role') }}</th>
                  <th class="pb-3 text-left text-sm font-medium">{{ t('pages.users.status') }}</th>
                  <th class="pb-3 text-right text-sm font-medium">{{ t('pages.users.actions') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.id" class="border-b">
                  <td class="py-4">
                    <div class="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{{ user.initials }}</AvatarFallback>
                      </Avatar>
                      <span class="font-medium">{{ user.name }}</span>
                    </div>
                  </td>
                  <td class="py-4 text-sm text-muted-foreground">{{ user.email }}</td>
                  <td class="py-4">
                    <span class="rounded-full bg-secondary px-2 py-1 text-xs font-medium">{{ user.role }}</span>
                  </td>
                  <td class="py-4">
                    <span
                      :class="user.status === 'Active' ? 'text-green-600' : 'text-gray-400'"
                      class="flex items-center gap-1 text-sm"
                    >
                      <span class="h-2 w-2 rounded-full" :class="user.status === 'Active' ? 'bg-green-600' : 'bg-gray-400'"></span>
                      {{ t(`pages.users.${user.status.toLowerCase()}`) }}
                    </span>
                  </td>
                  <td class="py-4 text-right">
                    <Button variant="ghost" size="sm">{{ t('pages.users.edit') }}</Button>
                    <Button variant="ghost" size="sm" class="text-destructive">{{ t('pages.users.remove') }}</Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { UserPlus, Download } from 'lucide-vue-next'
import Sidebar from '@/components/layout/Sidebar.vue'
import TokenDebug from '@/components/TokenDebug.vue'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useSidebar } from '@/composables/useSidebar'

const { t } = useI18n()
const { isCollapsed } = useSidebar()

const users = ref([
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', initials: 'JD' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', status: 'Active', initials: 'JS' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Viewer', status: 'Active', initials: 'BJ' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Editor', status: 'Inactive', initials: 'AB' },
])
</script>
