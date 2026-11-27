<template>
  <div class="reader-shell">
    <VueSpinner v-if="fetching" class="mx-auto my-16" />
    <article v-else-if="article" class="reader-document">
      <header class="reader-heading">
        <KitTextLink v-if="isDemo" :to="{ name: collection }" class="text-sm">
          ← {{ collectionLabel }}
        </KitTextLink>
        <KitProgress
          v-if="isDemo"
          class="my-6"
          :value="progress.percent"
          label="Inbox reading progress"
        />
        <p v-if="article.feed_name || host" class="reader-meta">
          {{ article.feed_name || host
          }}<span v-if="article.reading_minutes"> · {{ article.reading_minutes }} min read</span>
        </p>
        <KitPageHeader
          :title="article.title"
          :description="isDemo ? article.description : undefined"
        />
        <KitTextLink
          v-if="article.url"
          :href="article.url"
          target="_blank"
          rel="noopener noreferrer"
          class="text-sm"
        >
          Read original <span aria-hidden="true">↗</span>
        </KitTextLink>
        <div
          v-if="isDemo"
          role="group"
          aria-label="Article actions"
          class="mt-7 flex flex-wrap gap-3"
        >
          <KitButton variant="outline" @click="toggleArchived">
            <PhArchiveBox class="size-5" aria-hidden="true" />
            {{ article.archived ? 'Restore to inbox' : 'Archive' }}
          </KitButton>
          <KitButton
            :variant="article.read ? 'outline' : 'primary'"
            @click="demo.toggleRead(article.id)"
          >
            <PhCheck class="size-5" aria-hidden="true" />
            {{ article.read ? 'Mark unread' : 'Mark read' }}
          </KitButton>
          <KitButton variant="outline" @click="demo.toggleSaved(article.id)">
            <PhBookmark class="size-5" aria-hidden="true" />
            {{ article.saved ? 'Remove saved' : 'Save' }}
          </KitButton>
        </div>
      </header>

      <div class="article-content" v-html="article.reader_content"></div>

      <nav
        v-if="isDemo && neighbors.length"
        aria-label="Browse articles"
        class="mt-10 flex flex-wrap gap-3"
      >
        <KitButtonLink
          v-for="neighbor in neighbors"
          :key="neighbor.entry.entry_id"
          :to="{
            name: 'demo-article',
            params: { articleID: neighbor.entry.entry_id },
            query: { from: collection },
          }"
          size="sm"
          variant="outline"
        >
          {{ neighbor.label }}
        </KitButtonLink>
      </nav>
    </article>
    <div v-else class="reader-document">
      <KitPageHeader title="Article unavailable" />
      <KitTextLink :to="{ name: isDemo ? collection : 'timeline' }"
        >Back to {{ isDemo ? collectionLabel : 'Inbox' }}</KitTextLink
      >
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { PhArchiveBox, PhBookmark, PhCheck } from '@phosphor-icons/vue'
import { VueSpinner } from 'vue3-spinners'
import useApiFetch from '@/use/useApiFetch'
import KitButton from '@/components/kit/KitButton.vue'
import KitButtonLink from '@/components/kit/KitButtonLink.vue'
import KitPageHeader from '@/components/kit/KitPageHeader.vue'
import KitTextLink from '@/components/kit/KitTextLink.vue'
import KitProgress from '@/components/kit/KitProgress.vue'
import { useDemo } from '@/use/useDemo'

const route = useRoute()
const router = useRouter()
const isDemo = computed(() => !!route.meta.demo)
const demo = useDemo()
const { progress } = demo
const remoteArticle = ref(null)
const fetching = ref(false)

watch(
  () => route.params.articleID,
  async (id, _, onCleanup) => {
    if (route.name !== 'article' || !id) return
    let active = true
    onCleanup(() => {
      active = false
    })
    fetching.value = true
    remoteArticle.value = null
    const { data, call } = useApiFetch('GET', `/api/feed-entries/${encodeURIComponent(id)}`)
    try {
      await call()
      if (active) remoteArticle.value = data.value
    } finally {
      if (active) fetching.value = false
    }
  },
  { immediate: true },
)

const article = computed(() =>
  isDemo.value
    ? demo.entries.value.find((entry) => entry.entry_id === route.params.articleID)
    : remoteArticle.value,
)

const host = computed(() => {
  try {
    return new URL(article.value?.url).hostname
  } catch {
    return ''
  }
})

const collection = computed(() => {
  const from = route.query.from
  return from === 'demo-saved' || from === 'demo-archive' ? from : 'demo-inbox'
})
const collectionLabel = computed(
  () =>
    ({ 'demo-saved': 'Saved', 'demo-archive': 'Archive', 'demo-inbox': 'Inbox' })[collection.value],
)
const neighbors = computed(() => {
  const list = demo.list(collection.value)
  const index = list.findIndex((entry) => entry.entry_id === route.params.articleID)
  if (index < 0) return []
  return [
    { entry: list[index - 1], label: '← Previous' },
    { entry: list[index + 1], label: 'Next →' },
  ].filter(({ entry }) => entry)
})

function toggleArchived() {
  const wasArchived = article.value.archived
  demo.toggleArchived(article.value.id)
  if (!wasArchived || collection.value === 'demo-archive') router.push({ name: collection.value })
}
</script>

<style scoped>
.reader-shell {
  padding: clamp(1rem, 4vw, 3rem) 0 4rem;
}

.reader-document {
  width: min(100%, 49rem);
  margin-inline: auto;
}

.reader-heading {
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--color-rule);
}

.reader-heading :deep(h1) {
  max-width: 22ch;
  font-size: clamp(2.4rem, 5vw, 4rem);
  line-height: 1.08;
}

.reader-meta {
  margin-block: 0 0.75rem;
  color: var(--color-muted);
}

.article-content {
  padding-top: clamp(1.75rem, 4vw, 3rem);
  color: var(--color-foreground);
  font-family: var(--font-serif);
  font-size: clamp(1.08rem, 1.5vw, 1.2rem);
  line-height: 1.85;
  overflow-wrap: anywhere;
}

.article-content :deep(h1),
.article-content :deep(h2),
.article-content :deep(h3),
.article-content :deep(h4),
.article-content :deep(h5),
.article-content :deep(h6) {
  color: var(--color-foreground) !important;
  font-family: var(--font-serif);
  font-weight: 600;
  line-height: 1.25;
  margin: 1.8em 0 0.6em;
}

.article-content :deep(h1) {
  font-size: 2.1rem;
}
.article-content :deep(h2) {
  font-size: 1.8rem;
}
.article-content :deep(p),
.article-content :deep(li) {
  color: var(--color-foreground) !important;
  padding-block: 0.4rem;
}

.article-content :deep(a) {
  color: var(--color-muted) !important;
  text-decoration: underline;
  text-decoration-color: currentColor;
  text-underline-offset: 0.2em;
}

.article-content :deep(a:focus-visible) {
  border-radius: 2px;
  outline: 3px solid var(--color-primary-faded);
  outline-offset: 3px;
}

.article-content :deep(pre),
.article-content :deep(code) {
  background-color: color-mix(in srgb, var(--color-foreground) 8%, var(--color-surface)) !important;
  color: var(--color-foreground) !important;
  border-radius: 0.25rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}

.article-content :deep(pre) {
  padding: 1rem;
  overflow-x: auto;
}

.article-content :deep(blockquote) {
  color: var(--color-muted) !important;
  border-left: 3px solid var(--color-primary-faded);
  padding-left: 1.25rem;
  margin: 1.5rem 0;
}

.article-content :deep(table) {
  border-collapse: collapse;
  width: 100%;
}
.article-content :deep(th),
.article-content :deep(td) {
  color: var(--color-foreground) !important;
  border: 1px solid var(--color-rule);
  padding: 0.5rem;
}
.article-content :deep(th) {
  background: color-mix(in srgb, var(--color-foreground) 6%, var(--color-surface));
}
.article-content :deep(ul) {
  list-style: disc;
  padding-left: 1.5rem;
}
.article-content :deep(ol) {
  list-style: decimal;
  padding-left: 1.5rem;
}

/* Keep source-site text readable while preserving its media and structure. */
.article-content :deep(p[style]),
.article-content :deep(span[style]),
.article-content :deep(div[style]),
.article-content :deep(li[style]),
.article-content :deep(td[style]),
.article-content :deep(th[style]),
.article-content :deep(h1[style]),
.article-content :deep(h2[style]),
.article-content :deep(h3[style]),
.article-content :deep(h4[style]),
.article-content :deep(h5[style]),
.article-content :deep(h6[style]) {
  color: var(--color-foreground) !important;
}

.article-content :deep(div[style*='background']),
.article-content :deep(p[style*='background']),
.article-content :deep(span[style*='background']),
.article-content :deep(li[style*='background']),
.article-content :deep(td[style*='background']),
.article-content :deep(th[style*='background']),
.article-content :deep(blockquote[style*='background']),
.article-content :deep(a[style*='background']) {
  background-color: color-mix(in srgb, var(--color-foreground) 7%, var(--color-surface)) !important;
}
</style>
