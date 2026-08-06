<template>
  <div
    class="flex flex-col items-center justify-center py-16 text-center bg-surface-container rounded-lg"
  >
    <PhFunnel :size="48" weight="duotone" class="text-gray-400 mb-4" />
    <h2 class="text-2xl font-semibold text-gray-300 mb-2">No matching entries</h2>
    <p class="text-gray-400">Try adjusting or clearing your filters.</p>
  </div>
</template>

<script setup>
import { PhFunnel } from '@phosphor-icons/vue'
</script>
