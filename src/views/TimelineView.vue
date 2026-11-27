<template>
  <div class="mx-auto flex w-full max-w-6xl flex-col gap-7 px-4 pb-12 sm:px-6">
    <header class="pt-3 sm:pt-6">
      <div class="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <h1 class="font-serif text-4xl leading-tight text-foreground sm:text-5xl">{{ title }}</h1>
        <p v-if="demoInbox" class="font-serif text-xl text-muted">
          <span aria-hidden="true" class="mr-2">·</span>{{ demoProgress.remaining }} to go
        </p>
      </div>
      <p v-if="!demoRoute && truncatedDescription" class="mt-2 max-w-xl text-sm text-muted">
        {{ truncatedDescription }}
      </p>
      <KitProgress
        v-if="demoInbox"
        class="mt-5"
        :value="demoProgress.percent"
        label="Inbox progress"
      />
    </header>

    <div
      v-if="demoRoute"
      class="grid items-start gap-8 xl:gap-12"
      :class="{ 'lg:grid-cols-[minmax(0,1fr)_17rem]': demoInbox }"
    >
      <section :aria-label="title + ' stories'" class="min-w-0">
        <template v-if="entries.length">
          <RouterLink
            v-for="entry in entries"
            :key="entry.id"
            :aria-label="entry.title"
            :to="{
              name: 'demo-article',
              params: { articleID: entry.entry_id },
              query: { from: route.name },
            }"
            :class="[
              'block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
              focusClasses,
            ]"
          >
            <TimelineItem :entry="entry" />
          </RouterLink>
        </template>
        <p v-else class="border-y border-rule py-10 font-serif text-xl text-muted">
          {{ emptyMessage }}
        </p>
        <div v-if="demoInbox && demoProgress.total" class="mt-10 flex justify-center">
          <KitButton :disabled="demoProgress.remaining === 0" @click="demo.completeInbox()">
            <PhAnchor class="size-5" aria-hidden="true" />
            {{ demoProgress.remaining ? 'Complete inbox' : 'Inbox complete' }}
          </KitButton>
        </div>
      </section>

      <aside
        v-if="demoInbox"
        class="h-fit rounded-2xl border border-rule p-6"
        aria-label="Reading progress"
      >
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Inbox zero</p>
        <p class="mt-4 font-serif text-4xl text-foreground">
          {{ demoProgress.percent }}<span class="text-2xl">%</span>
        </p>
        <KitProgress
          class="mt-3"
          :value="demoProgress.percent"
          label="Inbox completed"
          :caption="`${demoProgress.read} of ${demoProgress.total} stories read`"
        />
      </aside>
    </div>

    <template v-if="!demoRoute">
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
import KitSelect from '@/components/kit/KitSelect.vue'
import KitButton from '@/components/kit/KitButton.vue'
import { PhAnchor } from '@phosphor-icons/vue'
import KitProgress from '@/components/kit/KitProgress.vue'
import { focusClasses } from '@/components/kit/styles'
import { useDemo } from '@/use/useDemo'

const data = ref(null)

const route = useRoute()
const router = useRouter()
const demo = useDemo()
const demoRoute = computed(() => !!route.meta.demo)
const demoInbox = computed(() => route.name === 'demo-inbox')
const { progress: demoProgress } = demo
const title = computed(() => {
  if (route.name === 'demo-saved') return 'Saved'
  if (route.name === 'demo-archive') return 'Archive'
  return demoRoute.value ? 'Inbox' : feed.value.name
})
const emptyMessage = computed(() => {
  if (route.name === 'demo-saved') return 'No saved stories yet.'
  if (route.name === 'demo-archive') return 'No archived stories yet.'
  return 'Nothing waiting in your inbox.'
})
const entries = computed(() => demo.list(route.name))

const currentPage = computed(() => {
  return parseInt(route.query.page) || 1
})

watch(
  () => route.query,
  (query) => {
    if (route.name === 'timeline') getFeedEntries(query)
  },
)

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

if (!demoRoute.value) getFeedEntries(route.query)
</script>
