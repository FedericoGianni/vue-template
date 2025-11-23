<script setup lang="ts">
import { DropdownMenuTrigger } from 'radix-vue'
import type { DropdownMenuTriggerProps } from 'radix-vue'

defineProps<DropdownMenuTriggerProps>()
</script>

<template>
  <DropdownMenuTrigger v-bind="$props">
    <slot />
  </DropdownMenuTrigger>
</template>
