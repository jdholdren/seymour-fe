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
            <path
              v-else-if="item.icon === 'settings'"
              d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7ZM19 12a7.1 7.1 0 0 0-.1-1.2l1.5-1.2-1.5-2.6-1.8.7a7 7 0 0 0-2-1.2L14.8 4h-3.1l-.3 2.5a7 7 0 0 0-2 1.2l-1.8-.7-1.5 2.6 1.5 1.2a7.1 7.1 0 0 0 0 2.4l-1.5 1.2 1.5 2.6 1.8-.7a7 7 0 0 0 2 1.2l.3 2.5h3.1l.3-2.5a7 7 0 0 0 2-1.2l1.8.7 1.5-2.6-1.5-1.2A7.1 7.1 0 0 0 19 12Z"
            />
            <path v-else d="M4 7h16M6 7V4.5h12V7m-12 0v13h12V7m-8 4h4" />
          </svg>
          <span>{{ item.label }}</span>
        </RouterLink>
      </li>
      <li class="shrink-0 lg:w-full">
        <KitButton
          variant="ghost"
          size="md"
          class="w-full !justify-start !gap-3 !rounded-xl !px-3.5 !py-2.5 font-serif text-base"
          :disabled="loggingOut"
          :loading="loggingOut"
          @click="logout"
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
            <path d="M10 17l5-5-5-5m5 5H3m9-9h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />
          </svg>
          {{ loggingOut ? 'Logging out…' : 'Log out' }}
        </KitButton>
        <p v-if="logoutError" role="alert" class="px-3.5 text-xs text-danger">{{ logoutError }}</p>
      </li>
    </ul>

    <section class="mt-5 border-t border-rule px-3.5 pt-4 lg:mt-auto">
      <div class="px-3.5">
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
  { label: 'Settings', icon: 'settings', to: { name: 'settings' }, route: 'settings' },
]

function isActive(item) {
  if (route.name === item.route) return true
  if (route.name === 'article') return item.route === 'timeline'
  return route.name === 'new-subscription' && item.route === 'subscriptions'
}

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
