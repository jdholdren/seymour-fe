<template>
  <div
    class="flex flex-col items-center justify-center py-16 text-center bg-surface-container rounded-lg"
  >
    <PhPlant :size="48" weight="duotone" class="text-subtle mb-4" />
    <h2 class="text-2xl font-semibold text-foreground mb-2">No posts yet</h2>
    <p class="text-muted">New articles will appear here as the feed updates.</p>
  </div>
</template>

<script setup>
import { PhPlant } from '@phosphor-icons/vue'
</script>
