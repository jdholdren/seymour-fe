<template>
  <div class="flex flex-col gap-6">
    <KitPageHeader title="Feeds" description="The publications that make up your daily reading." />
    <p v-if="fetching" role="status" class="text-muted">Loading feeds…</p>
    <EmptySubscriptions v-else-if="subscriptions.length === 0" />
    <template v-else>
      <KitButtonLink :to="newFeedRoute" class="w-fit">+ Add a feed</KitButtonLink>
      <div v-if="subscriptions.length > 0" class="subscription-list flex flex-col">
        <SubscriptionItem
          v-for="subscription in subscriptions"
          :key="subscription.id"
          :subscription="subscription"
          :on-unsubscribe="() => unsubscribe(subscription.id)"
        />
      </div>
    </template>
  </div>
</template>

<script setup>
import KitPageHeader from '@/components/kit/KitPageHeader.vue'
import KitButtonLink from '@/components/kit/KitButtonLink.vue'

import useApiFetch from '@/use/useApiFetch'
import SubscriptionItem from './internal/SubscriptionItem.vue'
import EmptySubscriptions from '@/components/EmptySubscriptions.vue'
import { getViewer, userPath } from '@/me'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useDemo } from '@/use/useDemo'

const route = useRoute()
const {
  call: fetchSubs,
  data,
  fetching,
} = useApiFetch('GET', route.meta.demo ? '' : userPath('/subscriptions'))
const demo = useDemo()

if (!route.meta.demo) fetchSubs()
const subscriptions = computed(() =>
  route.meta.demo ? demo.feeds.value : data.value?.subscriptions || [],
)
const newFeedRoute = computed(() =>
  route.meta.demo ? { name: 'demo-new-feed' } : '/subscriptions/new',
)

// Curried per-subscription so each SubscriptionItem just gets a bound
// function to call — it owns no fetch state of its own. After the mutation,
// we don't touch local state directly; we re-fetch from the server so this
// page (and the shared viewer, e.g. for the Timeline feed filter) reflect
// truth rather than an assumed local edit.
async function unsubscribe(subscriptionId) {
  if (route.meta.demo) {
    demo.removeFeed(subscriptionId)
    return
  }
  const { call } = useApiFetch('DELETE', `/api/subscriptions/${subscriptionId}`)

  await call()
  await Promise.all([fetchSubs(), getViewer()])
}
</script>
