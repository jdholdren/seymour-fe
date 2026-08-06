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
import { userPath } from '@/me'

const { call: fetchSubs, data } = useApiFetch('GET', userPath('/subscriptions'))

fetchSubs()
</script>
