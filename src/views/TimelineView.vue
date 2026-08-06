<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-wrap items-end gap-4 pt-8">
      <div class="flex flex-col gap-2">
        <label for="feed-filter" class="text-sm font-medium text-gray-600">Feed</label>
        <select
          id="feed-filter"
          class="rounded-md bg-white px-3 py-2 text-sm outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-primary"
          :value="route.query.feed_id || ''"
          @change="handleFeedChange($event.target.value)"
        >
          <option value="">All Feeds</option>
          <option v-for="feed in viewer.subscriptions" :key="feed.feed_id" :value="feed.feed_id">
            {{ feed.name }}
          </option>
        </select>
      </div>

      <div class="flex flex-col gap-2">
        <label for="status-filter" class="text-sm font-medium text-gray-600">Status</label>
        <select
          id="status-filter"
          class="rounded-md bg-white px-3 py-2 text-sm outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-primary"
          :value="route.query.filtered || ''"
          @change="updateFilter('filtered', $event.target.value)"
        >
          <option value="">All</option>
          <option value="true">Filtered</option>
          <option value="false">Unfiltered</option>
        </select>
      </div>

      <div class="flex flex-col gap-2">
        <label for="date-from" class="text-sm font-medium text-gray-600">From</label>
        <input
          id="date-from"
          type="date"
          class="rounded-md bg-white px-3 py-2 text-sm outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-primary"
          :value="route.query.date_from || ''"
          @change="updateFilter('date_from', $event.target.value)"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label for="date-to" class="text-sm font-medium text-gray-600">To</label>
        <input
          id="date-to"
          type="date"
          class="rounded-md bg-white px-3 py-2 text-sm outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-primary"
          :value="route.query.date_to || ''"
          @change="updateFilter('date_to', $event.target.value)"
        />
      </div>

      <button
        v-if="hasActiveFilters"
        type="button"
        class="text-sm text-gray-500 hover:text-gray-700 transition-colors py-2"
        @click="clearFilters"
      >
        Clear filters
      </button>
    </div>

    <div>
      <h1 class="text-5xl font-bold">{{ feed.name }}</h1>
      <h2 class="text-xl py-4">{{ truncatedDescription }}</h2>
    </div>

    <EmptyFeed v-if="data && data.items?.length === 0 && route.query.feed_id" />
    <EmptySubscriptions v-else-if="data && data.items?.length === 0" />

    <template v-else>
      <!-- Top pagination -->
      <PaginationControls
        v-if="data?.pagination && data.pagination.total > data.pagination.limit"
        :current-page="currentPage"
        :total-items="data.pagination.total"
        :items-per-page="data.pagination.limit"
        @page-changed="handlePageChange"
      />

      <RouterLink
        v-for="entry in data?.items"
        :key="entry.id"
        :to="`/article/${entry.entry_id}`"
        class="w-full place-self-center mb-1"
      >
        <TimelineItem :entry="entry" />
      </RouterLink>

      <!-- Bottom pagination -->
      <PaginationControls
        v-if="
          data?.pagination &&
          data.pagination.total > data.pagination.limit &&
          data?.items?.length >= 5
        "
        :current-page="currentPage"
        :total-items="data.pagination.total"
        :items-per-page="data.pagination.limit"
        @page-changed="handlePageChange"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useApiFetch from '@/use/useApiFetch'
import { viewer, userPath } from '@/me'

import TimelineItem from './internal/TimelineItem.vue'
import PaginationControls from './internal/PaginationControls.vue'
import EmptySubscriptions from '@/components/EmptySubscriptions.vue'
import EmptyFeed from '@/components/EmptyFeed.vue'
import { computed } from 'vue'

const data = ref(null)

const route = useRoute()
const router = useRouter()

const currentPage = computed(() => {
  return parseInt(route.query.page) || 1
})

watch(route, async (_, r) => {
  getFeedEntries(r.query)
})

const hasActiveFilters = computed(() => {
  return !!(route.query.filtered || route.query.date_from || route.query.date_to)
})
const feed = computed(() => {
  const feedID = route.query.feed_id
  if (!feedID)
    return {
      name: 'All Feeds',
      description: 'All of your subscriptions combined into a single feed',
    }

  return viewer.value.subscriptions[feedID]
})

const truncatedDescription = computed(() => {
  const description = feed.value?.description || ''
  const maxLength = 200 // Adjust as needed

  if (description.length <= maxLength) {
    return description
  }

  return description.substring(0, maxLength).trim() + '...'
})

async function getFeedEntries(query = {}) {
  const page = parseInt(query.page) || 1
  const offset = (page - 1) * 20 // Assuming 20 items per page
  const queryParams = new URLSearchParams({
    ...(query.feed_id && { feed_id: query.feed_id }),
    ...(query.filtered && { filtered: query.filtered }),
    ...(query.date_from && { date_from: query.date_from }),
    ...(query.date_to && { date_to: query.date_to }),
    limit: '20',
    offset: offset.toString(),
  })

  const { call, data: resp } = useApiFetch('GET', userPath(`/timeline?${queryParams}`))
  await call()

  data.value = resp.value
}

function handleFeedChange(feedID) {
  updateFilter('feed_id', feedID)
}

// Updates a single filter in the query string, resetting pagination
// since the result set is changing.
function updateFilter(key, value) {
  const query = { ...route.query }
  delete query.page

  if (value) {
    query[key] = value
  } else {
    delete query[key]
  }

  router.push({ name: route.name, query })
}

function clearFilters() {
  router.push({ name: route.name, query: {} })
}

function handlePageChange(page) {
  const query = { ...route.query }
  if (page === 1) {
    delete query.page
  } else {
    query.page = page.toString()
  }

  router.push({
    name: route.name,
    query,
  })
}

getFeedEntries(route.query)
</script>
