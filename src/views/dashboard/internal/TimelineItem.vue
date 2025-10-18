<template>
  <div class="w-full p-5 border border-stone-300 rounded-lg cursor-pointer hover:border-primary bg-white">
    <h2 class="text-neutral-500">{{ props.entry.feed_name }}</h2>
    <h1 class="text-neutral-800 font-bold">{{ props.entry.title }}</h1>
    <p class="text-neutral-500 line-clamp-2">{{ props.entry.description }}</p>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  entry: {
    type: Object,
    required: true,
  },
})
</script>
