<template>
  <div class="flex min-h-screen bg-background">
    <Sidebar />
    <TokenDebug />

    <main class="flex-1 p-8 transition-all duration-300" :class="isCollapsed ? 'ml-16' : 'ml-64'">
      <div class="mb-8">
        <h1 class="text-3xl font-bold">{{ t('nav.documents') }}</h1>
        <p class="text-muted-foreground">{{ t('pages.documents.subtitle') }}</p>
      </div>

      <div class="mb-4 flex items-center justify-between">
        <div class="flex gap-2">
          <Button>
            <FilePlus class="mr-2 h-4 w-4" />
            {{ t('pages.documents.newDocument') }}
          </Button>
          <Button variant="outline">
            <Upload class="mr-2 h-4 w-4" />
            {{ t('pages.documents.upload') }}
          </Button>
        </div>
      </div>

      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card v-for="doc in documents" :key="doc.id" class="cursor-pointer transition-shadow hover:shadow-lg">
          <CardHeader>
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-3">
                <div class="rounded-lg bg-primary/10 p-2">
                  <component :is="getDocIcon(doc.type)" class="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle class="text-base">{{ doc.name }}</CardTitle>
                  <CardDescription class="text-xs">{{ doc.type }}</CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <MoreVertical class="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-muted-foreground">{{ t('pages.documents.size') }}</span>
                <span class="font-medium">{{ doc.size }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">{{ t('pages.documents.modified') }}</span>
                <span class="font-medium">{{ doc.modified }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">{{ t('pages.documents.sharedWith') }}</span>
                <span class="font-medium">{{ doc.shared }} {{ t('pages.documents.people') }}</span>
              </div>
            </div>
            <div class="mt-4 flex gap-2">
              <Button variant="outline" size="sm" class="flex-1">
                <Eye class="mr-1 h-3 w-3" />
                {{ t('pages.documents.view') }}
              </Button>
              <Button variant="outline" size="sm" class="flex-1">
                <Download class="mr-1 h-3 w-3" />
                {{ t('pages.documents.download') }}
              </Button>
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
import { FilePlus, Upload, FileText, FileCode, FileImage, MoreVertical, Eye, Download } from 'lucide-vue-next'
import Sidebar from '@/components/layout/Sidebar.vue'
import TokenDebug from '@/components/TokenDebug.vue'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useSidebar } from '@/composables/useSidebar'

const { t } = useI18n()
const { isCollapsed } = useSidebar()

const documents = ref([
  { id: 1, name: 'Project Proposal', type: 'PDF', size: '2.4 MB', modified: '2 days ago', shared: 5 },
  { id: 2, name: 'Design Mockups', type: 'Image', size: '8.1 MB', modified: '1 week ago', shared: 3 },
  { id: 3, name: 'Technical Spec', type: 'Document', size: '1.2 MB', modified: '3 days ago', shared: 8 },
  { id: 4, name: 'Source Code', type: 'Code', size: '456 KB', modified: '1 day ago', shared: 2 },
  { id: 5, name: 'Meeting Notes', type: 'Document', size: '128 KB', modified: '5 hours ago', shared: 12 },
  { id: 6, name: 'Budget Report', type: 'PDF', size: '3.2 MB', modified: '1 week ago', shared: 4 },
])

const getDocIcon = (type: string) => {
  switch (type) {
    case 'Code': return FileCode
    case 'Image': return FileImage
    default: return FileText
  }
}
</script>
