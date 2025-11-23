<script setup lang="ts">
import { DropdownMenuRoot } from 'radix-vue'
import type { DropdownMenuRootProps } from 'radix-vue'

defineProps<DropdownMenuRootProps>()
</script>

<template>
  <DropdownMenuRoot v-bind="$props">
    <slot />
  </DropdownMenuRoot>
</template>
