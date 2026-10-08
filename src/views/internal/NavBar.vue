<template>
  <div class="flex flex-col">
    <div class="p-4 pb-6 text-4xl font-bold">Seymour</div>
    <ul class="flex flex-col gap-1">
      <RouterLink :to="{ name: 'timeline', query: { status: 'approved' } }">
        <li
          :class="{ 'outline-2 outline-primary text-primary-faded': $route.name === 'timeline' }"
          class="px-4 py-2 rounded-md"
        >
          Timeline
        </li>
      </RouterLink>
      <RouterLink :to="{ name: 'subscriptions' }">
        <li
          :class="{
            'outline-2 outline-primary text-primary-faded': $route.name === 'subscriptions',
          }"
          class="px-4 py-2 rounded-md"
        >
          Subscriptions
        </li>
      </RouterLink>
    </ul>

    <!-- Alpha disclaimer -->
    <div class="mt-auto p-4 border-t border-border">
      <ThemeSelector class="mb-4" />
      <button
        class="block text-xs text-muted hover:text-foreground transition-colors mb-2"
        @click="logout"
      >
        Log out
      </button>
      <router-link to="/alpha" class="text-xs text-muted hover:text-foreground transition-colors">
        Alpha v{{ version }} • Report Issues
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { computed } from 'vue'
import ThemeSelector from '@/components/ThemeSelector.vue'

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
