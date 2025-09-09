<template>
  <div>
    <div class="flex gap-4">
      <RouterLink to="/subscriptions/new">
        <StyledButton label="+ New Subscription" />
      </RouterLink>
      <RouterLink to="/subscriptions/new">
        <StyledButton label="Manage Prompt" />
      </RouterLink>
    </div>
    <div class="flex flex-col gap-4 w-xl mt-[3rem]">
      <SubscriptionItem v-for="subscription in data?.subscriptions" :key="subscription.id"
        :subscription="subscription" />
    </div>
  </div>
</template>

<script setup>
import StyledButton from '@/components/StyledButton.vue';

import useApiFetch from '@/api/useApiFetch';
import SubscriptionItem from './internal/SubscriptionItem.vue';

const { call: fetchSubs, data } = useApiFetch("GET", `/api/subscriptions`)

fetchSubs()
</script>
