<template>
  <div class="flex flex-col">
    <div class="p-4 text-4xl font-bold">Seymour</div>
    <ul>
      <RouterLink :to="{ name: 'timeline' }">
        <li :class="{ 'bg-primary': $route.name === 'timeline' }" class="p-4 py-2">Timeline</li>
      </RouterLink>
      <RouterLink :to="{ name: 'subscriptions' }">
        <li :class="{ 'bg-primary': $route.name === 'subscriptions' }" class="p-4 py-2">
          Subscriptions
        </li>
      </RouterLink>
    </ul>

    <!-- Alpha disclaimer -->
    <div class="mt-auto p-4 border-t border-stone-200">
      <button
        class="block text-xs text-gray-500 hover:text-gray-700 transition-colors mb-2"
        @click="logout"
      >
        Log out
      </button>
      <router-link to="/alpha" class="text-xs text-gray-500 hover:text-gray-700 transition-colors">
        Alpha v{{ version }} • Report Issues
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { computed } from 'vue'

import { getViewer } from '@/me'
import useApiFetch from '@/use/useApiFetch'

// Get version info from build-time constants and package.json
const version = computed(() => {
  const gitHash = import.meta.env.VITE_GIT_HASH || 'unknown'
  return `0.1.0-alpha (${gitHash})`
})

getViewer()

// Logs the user out, then returns to the landing page.
async function logout() {
  const { call } = useApiFetch('POST', '/api/logout')
  await call()
  window.location.href = '/landing'
}
</script>
