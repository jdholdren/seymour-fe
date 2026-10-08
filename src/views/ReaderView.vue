<template>
  <div>
    <VueSpinner v-if="fetching" class="my-8" />
    <template v-else>
      <h1 class="font-bold text-5xl py-8 text-foreground">{{ data?.title }}</h1>
      <p>
        <RouterLink
          class="text-primary-faded text-md py-16"
          :to="{}"
          @click="goToSource"
          :replace="true"
        >
          Read on {{ host }}
        </RouterLink>
      </p>
      <div class="article-content">
        <div v-html="data?.reader_content"></div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { VueSpinner } from 'vue3-spinners'
import useApiFetch from '@/use/useApiFetch'

const route = useRoute()
const { articleID } = route.params

const { call, data, fetching } = useApiFetch('GET', `/api/feed-entries/${articleID}`)

const host = computed(() => {
  if (!data.value) return

  return new URL(data.value?.url).hostname
})

// Navigates the user to the source of the post.
function goToSource() {
  window.open(data.value?.url, '_blank')
}

call()
</script>

<style scoped>
.article-content {
  color: var(--color-foreground);
  line-height: 1.7;
}

.article-content :deep(h1),
.article-content :deep(h2),
.article-content :deep(h3),
.article-content :deep(h4),
.article-content :deep(h5),
.article-content :deep(h6) {
  color: var(--color-foreground) !important;
  font-weight: 700;
  line-height: 1.25;
  margin: 1.5em 0 0.6em;
}

.article-content :deep(h1) {
  font-size: 2.25rem;
}
.article-content :deep(h2) {
  font-size: 2rem;
}

.article-content :deep(p),
.article-content :deep(li) {
  color: var(--color-foreground) !important;
  padding-top: 8px;
  padding-bottom: 8px;
}

.article-content :deep(a) {
  color: var(--color-primary-faded) !important;
  text-decoration: underline;
}

.article-content :deep(pre),
.article-content :deep(code) {
  background-color: var(--color-surface-container) !important;
  color: var(--color-foreground) !important;
  border-radius: 0.25rem;
}

.article-content :deep(pre) {
  padding: 1rem;
  overflow-x: auto;
}
.article-content :deep(blockquote) {
  color: var(--color-muted) !important;
  border-left: 4px solid var(--color-border);
  padding-left: 1rem;
  margin: 1rem 0;
}
.article-content :deep(table) {
  border-collapse: collapse;
  width: 100%;
}
.article-content :deep(th),
.article-content :deep(td) {
  color: var(--color-foreground) !important;
  border: 1px solid var(--color-border);
  padding: 0.5rem;
}
.article-content :deep(th) {
  background: var(--color-surface-container);
}
.article-content :deep(ul) {
  list-style: disc;
  padding-left: 1.5rem;
}
.article-content :deep(ol) {
  list-style: decimal;
  padding-left: 1.5rem;
}

/* Keep source-site text readable without filtering or recoloring media. */
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

/* Preserve callout backgrounds, but map their colors to the active palette. */
.article-content :deep(div[style*='background']),
.article-content :deep(p[style*='background']),
.article-content :deep(span[style*='background']),
.article-content :deep(li[style*='background']),
.article-content :deep(td[style*='background']),
.article-content :deep(th[style*='background']),
.article-content :deep(blockquote[style*='background']),
.article-content :deep(a[style*='background']) {
  background-color: var(--color-surface-container) !important;
}
</style>
