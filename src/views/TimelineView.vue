<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-wrap items-end gap-4 pt-8">
      <KitFormField id="feed-filter" label="Feed" v-slot="{ control }">
        <KitSelect
          v-bind="control"
          :model-value="route.query.feed_id || ''"
          @change="handleFeedChange($event.target.value)"
        >
          <option value="">All Feeds</option>
          <option v-for="feed in viewer.subscriptions" :key="feed.feed_id" :value="feed.feed_id">
            {{ feed.name }}
          </option>
        </KitSelect>
      </KitFormField>

      <KitFormField id="status-filter" label="Status" v-slot="{ control }">
        <KitSelect
          v-bind="control"
          :model-value="route.query.status || 'approved'"
          @change="updateFilter('status', $event.target.value)"
        >
          <option value="approved">Approved</option>
          <option value="requires_judgement">Requires judgement</option>
          <option value="rejected">Rejected</option>
          <option value="all">All</option>
        </KitSelect>
      </KitFormField>

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

    <KitPageHeader :title="feed.name" :description="truncatedDescription" />

    <EmptyFeed v-if="data && data.items?.length === 0 && route.query.feed_id" />
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
        :key="entry.id"
        :to="`/article/${entry.entry_id}`"
        :class="[
          'w-full place-self-center mb-1 rounded-lg [&>*]:hover:border-primary',
          focusClasses,
        ]"
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
import EmptyFilteredResults from '@/components/EmptyFilteredResults.vue'
import { computed } from 'vue'
import KitFormField from '@/components/kit/KitFormField.vue'
import KitInput from '@/components/kit/KitInput.vue'
import KitSelect from '@/components/kit/KitSelect.vue'
import KitButton from '@/components/kit/KitButton.vue'
import KitPageHeader from '@/components/kit/KitPageHeader.vue'
import { focusClasses } from '@/components/kit/styles'

const data = ref(null)

const route = useRoute()
const router = useRouter()

const currentPage = computed(() => {
  return parseInt(route.query.page) || 1
})

watch(route, async (to) => {
  getFeedEntries(to.query)
})

const hasSubscriptions = computed(() => {
  return Object.keys(viewer.value?.subscriptions || {}).length > 0
})
const hasActiveFilters = computed(() => {
  return !!(
    (route.query.status && route.query.status !== 'approved') ||
    route.query.from ||
    route.query.to
  )
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
  // Default to "approved" to preserve the curated-timeline view, unless the
  // user explicitly asked for all statuses.
  const status = query.status || 'approved'

  const queryParams = new URLSearchParams({
    ...(query.feed_id && { feed_id: query.feed_id }),
    ...(status !== 'all' && { status }),
    ...(query.from && { from: query.from }),
    ...(query.to && { to: query.to }),
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
