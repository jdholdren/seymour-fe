<template>
  <nav class="flex min-w-0 flex-col" aria-label="Main navigation">
    <ul class="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:gap-1.5 lg:overflow-visible lg:pb-0">
      <li v-for="item in navItems" :key="item.label" class="shrink-0 lg:w-full">
        <RouterLink
          :to="item.to"
          :aria-current="isActive(item) ? 'page' : undefined"
          :class="[
            'group flex items-center gap-3 rounded-xl px-3.5 py-2.5 font-serif text-base transition-colors',
            isActive(item)
              ? 'bg-surface-container text-foreground'
              : 'text-muted hover:bg-surface-container hover:text-foreground',
            focusClasses,
          ]"
        >
          <svg
            viewBox="0 0 24 24"
            class="size-[1.15rem] shrink-0"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path v-if="item.icon === 'inbox'" d="M4 5.5h16v13H4zM4 14h4l1.5 2h5L16 14h4" />
            <path
              v-else-if="item.icon === 'feeds'"
              d="M5 19a2 2 0 0 0-2-2M3 12a9 9 0 0 1 9 9M3 5a16 16 0 0 1 16 16M5 5h14v14"
            />
            <path v-else-if="item.icon === 'saved'" d="M6 4.5h12v16l-6-4-6 4z" />
            <path v-else d="M4 7h16M6 7V4.5h12V7m-12 0v13h12V7m-8 4h4" />
          </svg>
          <span>{{ item.label }}</span>
        </RouterLink>
      </li>
    </ul>

    <section class="mt-5 border-t border-rule pt-4 lg:mt-auto" aria-labelledby="settings-heading">
      <h2
        id="settings-heading"
        class="mb-2 px-3.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-subtle"
      >
        Settings
      </h2>
      <ThemeSelector class="px-3.5" />
      <div class="mt-4 border-t border-rule px-3.5 pt-4">
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
        <p v-if="logoutError" role="alert" class="mb-2 text-xs text-danger">{{ logoutError }}</p>
        <a
          href="https://github.com/jdholdren/seymour/issues"
          target="_blank"
          rel="noopener noreferrer"
          :class="['text-xs text-muted transition-colors hover:text-foreground', focusClasses]"
        >
          Report issues on GitHub
        </a>
      </div>
    </section>
  </nav>
</template>

<script setup>
import { RouterLink, useRoute } from 'vue-router'
import { ref } from 'vue'
import ThemeSelector from '@/components/ThemeSelector.vue'
import KitButton from '@/components/kit/KitButton.vue'
import { focusClasses } from '@/components/kit/styles'
import useApiFetch from '@/use/useApiFetch'

const route = useRoute()
const navItems = [
  {
    label: 'Inbox',
    icon: 'inbox',
    to: { name: 'timeline', query: { status: 'approved' } },
    route: 'timeline',
  },
  { label: 'Feeds', icon: 'feeds', to: { name: 'subscriptions' }, route: 'subscriptions' },
]

function isActive(item) {
  if (route.name === item.route) return true
  if (route.name === 'article') return item.route === 'timeline'
  return route.name === 'new-subscription' && item.route === 'subscriptions'
}

const gitHash = import.meta.env.VITE_GIT_HASH || 'unknown'
const version = `0.1.0-alpha (${gitHash})`

const loggingOut = ref(false)
const logoutError = ref('')

async function logout() {
  if (loggingOut.value) return
  loggingOut.value = true
  logoutError.value = ''
  const { call, statusCode } = useApiFetch('POST', '/api/logout')
  await call()
  if ((statusCode.value >= 200 && statusCode.value < 300) || statusCode.value === 401) {
    window.location.href = '/'
  } else {
    logoutError.value = 'Could not log out. Please try again.'
  }
  loggingOut.value = false
}
</script>
