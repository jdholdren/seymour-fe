<template>
  <div>
    <div class="p-4 text-4xl font-bold">Seymour</div>
    <ul>
      <RouterLink :to="{ name: 'account' }">
        <li :class="{ 'bg-primary': $route.name === 'account' }" class="p-4 py-2">Account</li>
      </RouterLink>
      <RouterLink :to="{ name: 'subscriptions' }">
        <li :class="{ 'bg-primary': $route.name === 'subscriptions' }" class="p-4 py-2">Subscriptions</li>
      </RouterLink>
    </ul>
    <h1 class="p-4 py-2 font-bold">Timeline</h1>
    <ul>
      <RouterLink :to="{ name: 'timeline' }">
        <li :class="{ 'bg-primary': $route.name === 'timeline' && !$route.query.feed_id }" class="p-4 py-2">All Feeds
        </li>
      </RouterLink>
      <RouterLink v-for="feed in viewer.subscriptions" :key="feed.feed_id"
        :to="{ name: 'timeline', query: { feed_id: feed.feed_id } }">
        <li :class="{ 'bg-primary': $route.name === 'timeline' && $route.query.feed_id === feed.feed_id }"
          class="p-4 py-2">
          {{
            capFirst(feed.name) }}</li>
      </RouterLink>
    </ul>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'

import { getViewer, viewer } from "@/me"

// Capitalize the first letter of the string
function capFirst(s) {
  if (!s) return ""
  return String(s).charAt(0).toUpperCase() + String(s).slice(1)
}

getViewer()
</script>
