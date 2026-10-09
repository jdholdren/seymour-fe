<template>
  <KitEmptyState title="No matching entries" description="Try adjusting or clearing your filters.">
    <template #icon><PhFunnel :size="48" weight="duotone" /></template>
  </KitEmptyState>
</template>

<script setup>
import { PhFunnel } from '@phosphor-icons/vue'
import KitEmptyState from '@/components/kit/KitEmptyState.vue'
</script>
