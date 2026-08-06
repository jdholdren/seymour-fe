<template>
  <div class="flex flex-col gap-6">
    <div class="py-8">
      <h1 class="text-5xl font-bold">Your Subscriptions</h1>
    </div>
    <EmptySubscriptions v-if="data?.subscriptions?.length === 0" />
    <template v-else>
      <RouterLink to="/subscriptions/new" class="w-fit">
        <StyledButton label="+ New Subscription" />
      </RouterLink>
      <div v-if="data?.subscriptions?.length > 0" class="flex flex-col gap-3">
        <SubscriptionItem
          v-for="subscription in data?.subscriptions"
          :key="subscription.id"
          :subscription="subscription"
          :on-unsubscribe="() => unsubscribe(subscription.id)"
        />
      </div>
    </template>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'

import StyledButton from '@/components/StyledButton.vue'

import useApiFetch from '@/use/useApiFetch'
import SubscriptionItem from './internal/SubscriptionItem.vue'
import EmptySubscriptions from '@/components/EmptySubscriptions.vue'
import { getViewer, userPath } from '@/me'

const { call: fetchSubs, data } = useApiFetch('GET', userPath('/subscriptions'))

fetchSubs()

// Curried per-subscription so each SubscriptionItem just gets a bound
// function to call — it owns no fetch state of its own. After the mutation,
// we don't touch local state directly; we re-fetch from the server so this
// page (and the shared viewer, e.g. for the Timeline feed filter) reflect
// truth rather than an assumed local edit.
async function unsubscribe(subscriptionId) {
  const { call } = useApiFetch('DELETE', `/api/subscriptions/${subscriptionId}`)

  await call()
  await Promise.all([fetchSubs(), getViewer()])
}
</script>
