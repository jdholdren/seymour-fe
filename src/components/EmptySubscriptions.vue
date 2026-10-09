<template>
  <KitEmptyState title="No subscriptions yet" description="Get started by adding your first feed.">
    <template #icon><PhPlant :size="48" weight="duotone" /></template>
    <template #action>
      <KitButtonLink to="/subscriptions/new">Add a Subscription</KitButtonLink>
    </template>
  </KitEmptyState>
</template>

<script setup>
import { PhPlant } from '@phosphor-icons/vue'
import KitEmptyState from '@/components/kit/KitEmptyState.vue'
import KitButtonLink from '@/components/kit/KitButtonLink.vue'
</script>
