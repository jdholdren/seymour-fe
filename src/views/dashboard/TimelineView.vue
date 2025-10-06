<template>
  <div class="flex flex-col gap-6 max-w-2xl">
      <TimelineItem v-for="entry in data?.items" :key="entry.id" :entry="entry" />
  </div>
</template>

<script setup>
import useApiFetch from '@/api/useApiFetch';
import { viewer } from '@/me';

import TimelineItem from './internal/TimelineItem.vue';

const { call: fetchTimeline, data } = useApiFetch("GET", `/api/users/${viewer.value.user_id}/timeline`)

fetchTimeline()

</script>
