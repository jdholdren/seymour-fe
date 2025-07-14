<template>
  <div class="actions">
    <h2>Configuration</h2>
    <RouterLink :to="{ 'name': 'new-subscription' }">
      New Subscription
    </RouterLink>
  </div>
  <h2>Subscribed</h2>
  <SubscriptionItem v-for="subscription in data?.subscriptions" :key="subscription.id" :subscription="subscription" />
</template>

<script setup>
import useApiFetch from '@/api/useApiFetch';
import SubscriptionItem from './internal/SubscriptionItem.vue';

const { call: fetchSubs, data } = useApiFetch("GET", `/api/subscriptions`)

fetchSubs()
</script>


<style scoped>
.actions {
  margin-bottom: 2rem;
}
</style>
