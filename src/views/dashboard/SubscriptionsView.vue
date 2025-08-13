<template>
  <div id="subscriptions-container">
    <div class="actions">
      <RouterLink class="action" to="/subscriptions/new">
        <StyledButton label="+ New Subscription" />
      </RouterLink>
      <RouterLink class="action" to="/subscriptions/new">
        <StyledButton label="Manage Prompt" />
      </RouterLink>
    </div>
    <div id="subscription-items-container">
      <SubscriptionItem v-for="subscription in data?.subscriptions" :key="subscription.id" :subscription="subscription"
        class="subscription-item" />
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

<style scoped>
#subscriptions-container {
  display: grid;
  grid-template-columns: subgrid;
  row-gap: 1em;

  grid-column: 1 / -1;
}

#subscription-items-container {
  display: grid;
  grid-template-columns: subgrid;
  row-gap: 1em;

  grid-column: 1 / -1;
}

.subscription-item {
  grid-column: 1 / -1;
}

.actions {
  display: grid;
  grid-template-columns: subgrid;
  grid-column: 1 / -1;
  align-content: end;
}

.action {
  grid-column: span 3;
}
</style>
