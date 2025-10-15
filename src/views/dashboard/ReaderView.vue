<template>
  <div>
    <h1 class="font-bold text-5xl text-center p-8">{{ data?.title }}</h1>
    <div class="article-content">
      <div v-html="data?.reader_content"></div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import useApiFetch from '@/api/useApiFetch';

const route = useRoute()
const { articleID } = route.params

const { call, data } = useApiFetch("GET", `/api/feed-entries/${articleID}`)
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
