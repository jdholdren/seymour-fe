<template>
  <div class="">
    <div class="flex flex-col gap-6 max-w-2xl">
      <div class="text-center p-8">
        <h1 class="text-5xl font-bold">All Feeds</h1>
        <h2 class="text-xl py-4">All of your subscriptions combined into a single feed</h2>
      </div>
      <TimelineItem v-for="entry in data?.items" :key="entry.id" :entry="entry" />
    </div>
  </div>
</template>

<script setup>
import useApiFetch from '@/api/useApiFetch';
import { viewer } from '@/me';

import TimelineItem from './internal/TimelineItem.vue';

const { call: fetchTimeline, data } = useApiFetch("GET", `/api/users/${viewer.value.user_id}/timeline`)

fetchTimeline()

</script>
