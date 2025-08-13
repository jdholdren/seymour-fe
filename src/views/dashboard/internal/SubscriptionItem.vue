<template>
  <ListItem>
    <div class='item'>
      <div class='subscription-title'>{{ subscription.feed_name }}</div>
      <div class='subscription-description'>{{ subscription.feed_description }}</div>
      <div class='last-synced'>{{ subscription.last_synced }}</div>
    </div>
  </ListItem>
</template>

<script setup>
import ListItem from '@/components/ListItem.vue'

defineProps(['subscription'])
</script>

<style scoped>
.item {
  font-size: 1rem;
}

.subscription-title {
  font-size: 1.7rem;
  font-weight: 900;
}

.subscription-description {
  font-size: 1.5rem;
}
</style>
