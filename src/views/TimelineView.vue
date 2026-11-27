<template>
  <div class="mx-auto flex w-full max-w-6xl flex-col gap-7 px-4 pb-12 sm:px-6">
    <header class="pt-3 sm:pt-6">
      <KitTextLink v-if="selectedFeedID" :to="{ name: 'subscriptions' }" class="mb-4 inline-flex">
        ← Back to feeds
      </KitTextLink>
      <h1 class="font-serif text-4xl leading-tight text-foreground sm:text-5xl">{{ feed.name }}</h1>
      <p v-if="truncatedDescription" class="mt-2 max-w-xl text-sm text-muted">
        {{ truncatedDescription }}
      </p>
    </header>

    <div v-if="selectedFeedID" class="flex flex-wrap items-end gap-4 pt-8">
      <KitFormField id="date-from" label="From" v-slot="{ control }">
        <KitInput
          v-bind="control"
          type="date"
          :model-value="route.query.from || ''"
          @change="updateFilter('from', $event.target.value)"
        />
      </KitFormField>

      <KitFormField id="date-to" label="To" v-slot="{ control }">
        <KitInput
          v-bind="control"
          type="date"
          :model-value="route.query.to || ''"
          @change="updateFilter('to', $event.target.value)"
        />
      </KitFormField>

      <KitButton v-if="hasActiveFilters" variant="ghost" size="sm" @click="clearFilters">
        Clear filters
      </KitButton>
    </div>

    <EmptyFeed v-if="data && data.items?.length === 0 && selectedFeedID" />
    <EmptySubscriptions v-else-if="data && data.items?.length === 0 && !hasSubscriptions" />
    <EmptyFilteredResults v-else-if="data && data.items?.length === 0" />

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
        :key="entry.entry_id"
        :aria-label="entry.title"
        :to="`/article/${entry.entry_id}`"
        :class="[
          'w-full place-self-center mb-1 rounded-lg [&>*]:hover:border-primary',
          focusClasses,
        ]"
      >
        <TimelineItem :entry="entry" show-description />
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
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useApiFetch from '@/use/useApiFetch'
import { viewer, userPath } from '@/me'

import TimelineItem from './internal/TimelineItem.vue'
import PaginationControls from './internal/PaginationControls.vue'
import EmptySubscriptions from '@/components/EmptySubscriptions.vue'
import EmptyFeed from '@/components/EmptyFeed.vue'
import EmptyFilteredResults from '@/components/EmptyFilteredResults.vue'
import KitFormField from '@/components/kit/KitFormField.vue'
import KitInput from '@/components/kit/KitInput.vue'
import KitButton from '@/components/kit/KitButton.vue'
import KitTextLink from '@/components/kit/KitTextLink.vue'
import { focusClasses } from '@/components/kit/styles'

const data = ref(null)

const route = useRoute()
const router = useRouter()
const currentPage = computed(() => {
  return parseInt(route.query.page) || 1
})
const selectedFeedID = computed(() => route.params.feedID || route.query.feed_id)

watch(
  () => [route.name, selectedFeedID.value, route.query],
  ([name, feedID, query], _, onCleanup) => {
    if (name !== 'timeline' && name !== 'feed-posts') return

    let active = true
    onCleanup(() => {
      active = false
    })
    getFeedEntries(query, feedID, () => active)
  },
  { immediate: true },
)

const hasSubscriptions = computed(() => {
  return Object.keys(viewer.value?.subscriptions || {}).length > 0
})
const hasActiveFilters = computed(() => {
  return !!(route.query.from || route.query.to)
})
const feed = computed(() => {
  const feedID = selectedFeedID.value
  if (!feedID)
    return {
      name: 'Inbox',
    }

  return viewer.value?.subscriptions?.[feedID] ?? { name: 'Inbox' }
})

const truncatedDescription = computed(() => {
  const description = feed.value?.description || ''
  const maxLength = 200 // Adjust as needed

  if (description.length <= maxLength) {
    return description
  }

  return description.substring(0, maxLength).trim() + '...'
})

async function getFeedEntries(query = {}, feedID = selectedFeedID.value, isActive = () => true) {
  const page = parseInt(query.page) || 1
  const offset = (page - 1) * 20 // Assuming 20 items per page
  const queryParams = new URLSearchParams({
    ...(feedID && { feed_id: feedID }),
    status: 'approved',
    ...(query.from && { from: query.from }),
    ...(query.to && { to: query.to }),
    limit: '20',
    offset: offset.toString(),
  })

  const { call, data: resp } = useApiFetch('GET', userPath(`/timeline?${queryParams}`))
  await call()

  if (isActive()) data.value = resp.value
}

// Updates a single filter in the query string, resetting pagination
// since the result set is changing.
function updateFilter(key, value) {
  const query = { ...route.query }
  delete query.page
  delete query.feed_id

  if (value) {
    query[key] = value
  } else {
    delete query[key]
  }

  router.push({ name: route.name, params: route.params, query })
}

function clearFilters() {
  router.push({ name: route.name, params: route.params, query: {} })
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
    params: route.params,
    query,
  })
}
</script>
