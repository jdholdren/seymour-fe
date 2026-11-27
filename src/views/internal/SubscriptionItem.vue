<template>
  <KitSurface class="subscription-item flex items-center gap-3" padding="md">
    <RouterLink
      :to="{ name: 'feed-posts', params: { feedID: subscription.feed_id } }"
      class="group flex min-w-0 flex-1 items-center justify-between gap-4 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
    >
      <span class="flex min-w-0 flex-col gap-0.5">
        <KitHeading as="h2" size="card" class="feed-title line-clamp-1 group-hover:text-primary">
          {{ subscription.feed_name }}
        </KitHeading>
        <KitText size="small" tone="muted" class="line-clamp-1">
          {{ subscription.feed_description }}
        </KitText>
      </span>
      <span class="shrink-0 text-sm font-semibold text-primary group-hover:underline">
        View posts <span aria-hidden="true">→</span>
      </span>
    </RouterLink>
    <KitButton variant="danger" size="sm" class="shrink-0" @click="onUnsubscribeClick">
      Unsubscribe
    </KitButton>
  </KitSurface>
</template>

<script setup>
// This component is a dumb, presentational view of subscription state owned
// by the parent. It doesn't fetch or mutate anything itself — `onUnsubscribe`
// is a function curried by the parent for this specific subscription, and the
// parent is responsible for re-syncing state with the server afterward.
import KitSurface from '@/components/kit/KitSurface.vue'
import KitHeading from '@/components/kit/KitHeading.vue'
import KitText from '@/components/kit/KitText.vue'
import KitButton from '@/components/kit/KitButton.vue'
import { RouterLink } from 'vue-router'

const props = defineProps(['subscription', 'onUnsubscribe'])

function onUnsubscribeClick() {
  if (!confirm(`Unsubscribe from "${props.subscription.feed_name}"?`)) return

  props.onUnsubscribe()
}
</script>

<style scoped>
.subscription-item {
  border-radius: 0;
  border-width: 0 0 1px;
  box-shadow: none;
}
.feed-title {
  font-family: Georgia, 'Times New Roman', serif;
}
</style>
