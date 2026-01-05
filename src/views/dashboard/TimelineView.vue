<template>
  <div class="flex flex-col gap-6 w-2xl">
    <div class="text-center p-8">
      <h1 class="text-5xl font-bold">{{ feed.name }}</h1>
      <h2 class="text-xl py-4">{{ truncatedDescription }}</h2>
    </div>
    <RouterLink v-for="entry in data?.items" :key="entry.id" :to="`/article/${entry.entry_id}`"
      class="w-full place-self-center mb-1">
      <TimelineItem :entry="entry" />
    </RouterLink>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import useApiFetch from '@/api/useApiFetch'
import { viewer } from '@/me';

import TimelineItem from './internal/TimelineItem.vue';
import { computed } from 'vue';

const data = ref(null)

const route = useRoute()
watch(route, async (_, r) => {
  getFeedEntries(r.query.feed_id)
})
const feed = computed(() => {
  const feedID = route.query.feed_id;
  if (!feedID) return { name: "All Feeds", description: "All of your subscriptions combined into a single feed" }

  return viewer.value.subscriptions[feedID]
})

const truncatedDescription = computed(() => {
  const description = feed.value?.description || '';
  const maxLength = 200; // Adjust as needed

  if (description.length <= maxLength) {
    return description;
  }

  return description.substring(0, maxLength).trim() + '...';
});

async function getFeedEntries(feedID) {
  const { call, data: resp } = useApiFetch("GET", `/api/users/${viewer.value.user_id}/timeline?feed_id=${feedID ?? ''}`)
  await call()

  data.value = resp.value
}

getFeedEntries(route.query.feed_id)
</script>
