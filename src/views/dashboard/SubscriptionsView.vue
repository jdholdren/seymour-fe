<template>
  <RouterLink :to="{ 'name': 'new-subscription' }">
    New Subscription
  </RouterLink>
  <SubscriptionItem v-for="subscription in data?.subscriptions"
    :key="subscription.id"
    :subscription="subscription"
  />
</template>

<script setup>
import useApiFetch from '@/api/useApiFetch';
import SubscriptionItem from './internal/SubscriptionItem.vue';

const { call: fetchSubs, data } = useApiFetch("GET", `/api/subscriptions`)

fetchSubs()
</script>


<style scoped></style>
