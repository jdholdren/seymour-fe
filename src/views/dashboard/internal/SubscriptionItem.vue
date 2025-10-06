<template>
  <div class="w-auto bg-gray-300/30 rounded-md p-4 outline-1 outline-gray-300/70">
    <div class="text-lg font-bold">{{ subscription.feed_name }}</div>
    <div class="text-base">{{ subscription.feed_description }}</div>
    <div class="text-base">Last synced: {{ subscription.last_synced }}</div>
  </div>
</template>

<script setup>
defineProps(['subscription'])
</script>
