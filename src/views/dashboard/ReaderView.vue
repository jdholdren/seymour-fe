<template>
  <div>
    <h1 class="font-bold text-5xl text-center p-8">{{ data?.title }}</h1>
    <p class="text-center">
      <RouterLink class="text-gray-600 text-md p-16" @click="goToSource" :replace="true">
        Read on {{ host }}
      </RouterLink>
    </p>
    <div class="article-content">
      <div v-html="data?.reader_content"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import useApiFetch from '@/api/useApiFetch';

const route = useRoute()
const { articleID } = route.params

const { call, data } = useApiFetch("GET", `/api/feed-entries/${articleID}`)

const host = computed(() => {
  if (!data.value) return

  return new URL(data.value?.url).hostname
});

// Navigates the user to the source of the post.
function goToSource() {
  window.open(data.value?.url, '_blank');
}

call()
</script>

<style scoped>
:deep(h2) {
  font-size: 2rem;
}

:deep(p) {
  padding-top: 8px;
  padding-bottom: 8px;
}
</style>
