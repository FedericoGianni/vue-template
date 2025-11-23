<template>
  <div class="flex min-h-screen items-center justify-center bg-background">
    <div class="text-center">
      <h1 class="text-6xl font-bold">404</h1>
      <p class="mt-4 text-xl text-muted-foreground">Page not found</p>
      <Button class="mt-6" @click="goHome">
        Go to Dashboard
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'

const router = useRouter()

const goHome = () => {
  router.push('/dashboard')
}
</script>
