<template>
  <div class="flex flex-col">
    <div class="p-4 pb-6 text-4xl font-bold">Seymour</div>
    <ul class="flex flex-col gap-1">
      <li>
        <RouterLink
          :to="{ name: 'timeline' }"
          :class="[
            $route.name === 'timeline' && 'outline-2 outline-primary text-primary-faded',
            focusClasses,
          ]"
          class="block px-4 py-2 rounded-md"
        >
          Timeline
        </RouterLink>
      </li>
      <li>
        <RouterLink
          :to="{ name: 'subscriptions' }"
          :class="[
            $route.name === 'subscriptions' && 'outline-2 outline-primary text-primary-faded',
            focusClasses,
          ]"
          class="block px-4 py-2 rounded-md"
        >
          Subscriptions
        </RouterLink>
      </li>
      <li>
        <RouterLink
          :to="{ name: 'feed-preferences' }"
          :class="[
            $route.name === 'feed-preferences' && 'outline-2 outline-primary text-primary-faded',
            focusClasses,
          ]"
          class="block px-4 py-2 rounded-md"
        >
          Feed preferences
        </RouterLink>
      </li>
    </ul>

    <!-- Alpha disclaimer -->
    <div class="mt-auto p-4 border-t border-border">
      <ThemeSelector class="mb-4" />
      <KitButton
        variant="ghost"
        size="sm"
        class="mb-2"
        :disabled="loggingOut"
        :loading="loggingOut"
        @click="logout"
      >
        {{ loggingOut ? 'Logging out…' : 'Log out' }}
      </KitButton>
      <p v-if="logoutError" role="alert" class="text-xs text-danger mb-2">{{ logoutError }}</p>
      <router-link
        to="/alpha"
        :class="['text-xs text-muted hover:text-foreground transition-colors', focusClasses]"
      >
        Alpha v{{ version }} • Report Issues
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { computed, ref } from 'vue'
import ThemeSelector from '@/components/ThemeSelector.vue'
import KitButton from '@/components/kit/KitButton.vue'
import { focusClasses } from '@/components/kit/styles'

import { getViewer } from '@/me'
import useApiFetch from '@/use/useApiFetch'

// Get version info from build-time constants and package.json
const version = computed(() => {
  const gitHash = import.meta.env.VITE_GIT_HASH || 'unknown'
  return `0.1.0-alpha (${gitHash})`
})

getViewer()

const loggingOut = ref(false)
const logoutError = ref('')

// Logs the user out, then returns to the landing page.
async function logout() {
  if (loggingOut.value) return
  loggingOut.value = true
  logoutError.value = ''
  const { call, statusCode } = useApiFetch('POST', '/api/logout')
  await call()
  if ((statusCode.value >= 200 && statusCode.value < 300) || statusCode.value === 401) {
    window.location.href = '/landing'
  } else {
    logoutError.value = 'Could not log out. Please try again.'
  }
  loggingOut.value = false
}
</script>
