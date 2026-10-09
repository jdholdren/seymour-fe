<template>
  <KitEmptyState
    title="No posts yet"
    description="New articles will appear here as the feed updates."
  >
    <template #icon><PhPlant :size="48" weight="duotone" /></template>
  </KitEmptyState>
</template>

<script setup>
import { PhPlant } from '@phosphor-icons/vue'
import KitEmptyState from '@/components/kit/KitEmptyState.vue'
</script>
