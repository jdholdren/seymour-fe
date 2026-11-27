<template>
  <div class="reader-shell mx-auto w-full max-w-6xl px-4 sm:px-6">
    <VueSpinner v-if="fetching" class="mx-auto my-16" />
    <article v-else-if="article" class="reader-document">
      <KitTextLink
        v-if="article.feed_id"
        :to="{ name: 'feed-posts', params: { feedID: article.feed_id } }"
        class="mb-6 inline-flex"
      >
        ← Back to {{ feedName }}
      </KitTextLink>
      <header class="reader-heading">
        <p v-if="host" class="reader-meta">{{ host }}</p>
        <KitPageHeader :title="article.title" />
        <KitTextLink
          v-if="article.url"
          :href="article.url"
          target="_blank"
          rel="noopener noreferrer"
          class="text-sm"
        >
          Read original <span aria-hidden="true">↗</span>
        </KitTextLink>
      </header>

      <div class="article-content" v-html="article.reader_content"></div>
    </article>
    <div v-else class="reader-document">
      <KitPageHeader title="Article unavailable" />
      <KitTextLink :to="{ name: 'timeline' }">Back to Inbox</KitTextLink>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { VueSpinner } from 'vue3-spinners'
import useApiFetch from '@/use/useApiFetch'
import { viewer } from '@/me'
import KitPageHeader from '@/components/kit/KitPageHeader.vue'
import KitTextLink from '@/components/kit/KitTextLink.vue'

const route = useRoute()
const article = ref(null)
const fetching = ref(false)
const feedName = computed(() => {
  return viewer.value?.subscriptions?.[article.value?.feed_id]?.name || 'feed'
})

watch(
  () => route.params.articleID,
  async (id, _, onCleanup) => {
    if (route.name !== 'article' || !id) return
    let active = true
    onCleanup(() => {
      active = false
    })
    fetching.value = true
    article.value = null
    const { data, call } = useApiFetch('GET', `/api/feed-entries/${encodeURIComponent(id)}`)
    try {
      await call()
      if (active) article.value = data.value
    } finally {
      if (active) fetching.value = false
    }
  },
  { immediate: true },
)

const host = computed(() => {
  try {
    return new URL(article.value?.url).hostname
  } catch {
    return ''
  }
})
</script>

<style scoped>
.reader-shell {
  padding: 0 0 4rem;
}

.reader-document {
  width: 100%;
}

.reader-heading {
  max-width: 76ch;
  padding: 0 0 clamp(1.75rem, 4vw, 2.5rem);
  border-bottom: 1px solid var(--color-rule);
}

.reader-heading :deep(header) {
  padding: 0;
}

.reader-heading :deep(h1) {
  max-width: 24ch;
  margin: 0;
  font-size: clamp(2.25rem, 4.8vw, 3.75rem);
  font-weight: 600;
  letter-spacing: -0.035em;
  line-height: 1.1;
}

.reader-meta {
  margin-block: 0 1rem;
  color: var(--color-muted);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.article-content {
  max-width: 76ch;
  padding-top: clamp(1.75rem, 4vw, 2.75rem);
  color: var(--color-foreground);
  font-family: var(--font-serif);
  font-size: clamp(1.125rem, 1.4vw, 1.25rem);
  line-height: 1.8;
  overflow-wrap: anywhere;
}

.article-content :deep(p) {
  margin: 0 0 1.35em;
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
  letter-spacing: -0.02em;
  line-height: 1.3;
  margin: 1.8em 0 0.55em;
}

.article-content :deep(h1) {
  font-size: 2.25rem;
}
.article-content :deep(h2) {
  font-size: 1.8rem;
}
.article-content :deep(h3) {
  font-size: 1.45rem;
}
.article-content :deep(p),
.article-content :deep(li) {
  color: var(--color-foreground) !important;
}

.article-content :deep(ul),
.article-content :deep(ol) {
  margin: 0 0 1.5em;
  padding-left: 1.6em;
}

.article-content :deep(li + li) {
  margin-top: 0.4em;
}

.article-content :deep(a) {
  color: var(--color-primary) !important;
  text-decoration: underline;
  text-decoration-color: currentColor;
  text-decoration-thickness: 0.07em;
  text-underline-offset: 0.18em;
  transition: color 150ms ease;
}

.article-content :deep(a:hover) {
  color: var(--color-primary-dark) !important;
}

.article-content :deep(a:focus-visible) {
  border-radius: 2px;
  outline: 3px solid var(--color-primary-faded);
  outline-offset: 3px;
}

.article-content :deep(pre),
.article-content :deep(code) {
  background-color: color-mix(in srgb, var(--color-foreground) 7%, var(--color-surface)) !important;
  color: var(--color-foreground) !important;
  border-radius: 0.35rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}

.article-content :deep(code) {
  padding: 0.12em 0.32em;
  font-size: 0.82em;
}

.article-content :deep(pre) {
  margin: 1.5rem 0;
  padding: 1.1rem 1.25rem;
  overflow-x: auto;
  line-height: 1.6;
}

.article-content :deep(pre code) {
  padding: 0;
  background: transparent !important;
}

.article-content :deep(blockquote) {
  color: var(--color-muted) !important;
  border-left: 3px solid var(--color-primary);
  border-radius: 0 0.4rem 0.4rem 0;
  margin: 1.75rem 0;
  padding: 0.8rem 1.25rem;
  background: color-mix(in srgb, var(--color-foreground) 4%, var(--color-surface));
}

.article-content :deep(figure) {
  margin: 2rem 0;
}

.article-content :deep(img),
.article-content :deep(video),
.article-content :deep(iframe) {
  display: block;
  max-width: 100%;
  height: auto;
  margin-inline: auto;
  border-radius: 0.5rem;
}

.article-content :deep(figcaption) {
  margin-top: 0.7rem;
  color: var(--color-muted);
  font-family: var(--font-sans);
  font-size: 0.9rem;
  line-height: 1.5;
  text-align: center;
}

.article-content :deep(table) {
  display: block;
  max-width: 100%;
  overflow-x: auto;
  border-collapse: collapse;
  font-family: var(--font-sans);
  font-size: 0.95rem;
}
.article-content :deep(th),
.article-content :deep(td) {
  color: var(--color-foreground) !important;
  border: 1px solid var(--color-rule);
  padding: 0.5rem;
}
.article-content :deep(th) {
  background: color-mix(in srgb, var(--color-foreground) 6%, var(--color-surface));
  font-weight: 600;
}

.article-content :deep(hr) {
  margin: 2.5rem 0;
  border: 0;
  border-top: 1px solid var(--color-rule);
}

.article-content :deep(iframe) {
  width: 100%;
  aspect-ratio: 16 / 9;
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
