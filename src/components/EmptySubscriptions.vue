<template>
  <div
    class="flex flex-col items-center justify-center py-16 text-center bg-surface-container rounded-lg"
  >
    <PhPlant :size="48" weight="duotone" class="text-subtle mb-4" />
    <h2 class="text-2xl font-semibold text-foreground mb-2">No subscriptions yet</h2>
    <p class="text-muted mb-6">Get started by adding your first feed.</p>
    <RouterLink to="/subscriptions/new">
      <StyledButton label="Add a Subscription" />
    </RouterLink>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { PhPlant } from '@phosphor-icons/vue'
import StyledButton from '@/components/StyledButton.vue'
</script>
