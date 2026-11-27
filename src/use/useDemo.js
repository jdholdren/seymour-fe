import { computed, ref, watch } from 'vue'
import { sampleEntries, sampleFeeds } from '../demo/fixtures.js'

const storageKey = 'seymour-demo-v1'

function initialState() {
  const defaults = { feeds: sampleFeeds, marks: { 'entry-6': { read: true, saved: true } } }
  try {
    const stored = JSON.parse(globalThis.localStorage?.getItem(storageKey) ?? 'null')
    if (Array.isArray(stored?.feeds) && stored.marks && typeof stored.marks === 'object') {
      return stored
    }
  } catch {
    // Demo remains usable when browser storage is unavailable.
  }
  return defaults
}

const state = ref(initialState())
const feeds = computed(() => state.value.feeds)
const entries = computed(() => {
  const feedIDs = new Set(feeds.value.map(({ feed_id }) => feed_id))
  return sampleEntries
    .filter((entry) => feedIDs.has(entry.feed_id))
    .map((entry) => ({ ...entry, ...state.value.marks[entry.id] }))
})
const progress = computed(() => {
  const inbox = entries.value.filter((entry) => !entry.archived)
  const total = inbox.length
  const read = inbox.filter((entry) => entry.read).length
  return {
    total,
    read,
    remaining: total - read,
    percent: total ? Math.round((read / total) * 100) : 0,
  }
})

watch(
  state,
  (value) => {
    try {
      globalThis.localStorage?.setItem(storageKey, JSON.stringify(value))
    } catch {
      // Keep local changes in memory when storage is unavailable.
    }
  },
  { deep: true },
)

function toggleMark(id, key) {
  if (!entries.value.some((entry) => entry.id === id)) return
  const mark = state.value.marks[id] ?? {}
  state.value.marks[id] = { ...mark, [key]: !mark[key] }
}

function completeInbox() {
  for (const entry of entries.value.filter((item) => !item.archived && !item.read)) {
    state.value.marks[entry.id] = { ...state.value.marks[entry.id], read: true }
  }
}

function addFeed({ url }) {
  let address
  try {
    address = new URL(url)
  } catch {
    return false
  }
  if (!['http:', 'https:'].includes(address.protocol) || address.username || address.password) {
    return false
  }
  address.hash = ''
  if (feeds.value.some((feed) => feed.feed_url === address.href)) return false

  const id = `local-${address.href}`
  const label = address.hostname
  state.value.feeds.push({
    id,
    feed_id: id,
    name: label,
    feed_name: label,
    feed_url: address.href,
    last_synced: null,
  })
  return true
}

function removeFeed(id) {
  state.value.feeds = feeds.value.filter((feed) => feed.id !== id)
}

function list(collection) {
  if (collection === 'demo-archive') return entries.value.filter((entry) => entry.archived)
  if (collection === 'demo-saved')
    return entries.value.filter((entry) => entry.saved && !entry.archived)
  return entries.value.filter((entry) => !entry.archived)
}

export function useDemo() {
  return {
    feeds,
    entries,
    list,
    progress,
    toggleRead: (id) => toggleMark(id, 'read'),
    toggleSaved: (id) => toggleMark(id, 'saved'),
    toggleArchived: (id) => toggleMark(id, 'archived'),
    completeInbox,
    addFeed,
    removeFeed,
  }
}
