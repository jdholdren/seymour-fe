<template>
  <KitEmptyState title="No subscriptions yet" description="Get started by adding your first feed.">
    <template #icon><PhPlant :size="48" weight="duotone" /></template>
    <template #action>
      <KitButtonLink :to="newFeedRoute">Add a feed</KitButtonLink>
    </template>
  </KitEmptyState>
</template>

<script setup>
import { PhPlant } from '@phosphor-icons/vue'
import KitEmptyState from '@/components/kit/KitEmptyState.vue'
import KitButtonLink from '@/components/kit/KitButtonLink.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const newFeedRoute = computed(() =>
  route.meta.demo ? { name: 'demo-new-feed' } : '/subscriptions/new',
)
</script>
