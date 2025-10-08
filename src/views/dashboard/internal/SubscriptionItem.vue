<template>
  <div class="w-auto bg-white rounded-md p-4 outline-1 outline-surface-container">
    <div class="text-lg font-bold">{{ subscription.feed_name }}</div>
    <div class="text-base">{{ subscription.feed_description }}</div>
    <div class="text-base">Last synced: {{ subscription.last_synced }}</div>
  </div>
</template>

<script setup>
defineProps(['subscription'])
</script>
