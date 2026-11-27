<template>
  <div class="min-h-screen bg-surface text-foreground">
    <header
      class="relative mx-auto flex max-w-[90rem] items-center gap-3 px-5 pb-9 pt-7 sm:px-8 lg:px-10"
    >
      <RouterLink
        :to="{ name: 'timeline' }"
        class="flex items-center gap-3 rounded-lg text-foreground no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        aria-label="Seymour home"
      >
        <SeymourWordmark />
      </RouterLink>
      <MastheadRule class="absolute inset-x-0 bottom-0" />
    </header>

    <div
      class="mx-auto grid max-w-[90rem] grid-cols-1 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10 lg:px-8"
    >
      <NavBar
        class="px-5 pb-3 sm:px-8 lg:sticky lg:top-0 lg:flex lg:h-[calc(100dvh-6.25rem)] lg:self-start lg:overflow-y-auto lg:border-r lg:border-rule lg:py-10 lg:pl-0 lg:pr-5"
      />
      <main class="min-w-0 px-5 pb-12 pt-4 sm:px-8 lg:px-0 lg:py-10">
        <router-view class="w-full" v-slot="{ Component }">
          <Transition mode="out-in">
            <component :is="Component" />
          </Transition>
        </router-view>
      </main>
    </div>

    <Transition><GlobalError v-if="globErr" /></Transition>
    <Transition><ForbiddenError v-if="forbiddenErr" :message="forbiddenErr" /></Transition>
  </div>
</template>

<script setup>
import SeymourWordmark from '@/components/SeymourWordmark.vue'
import MastheadRule from '@/components/MastheadRule.vue'
import NavBar from './internal/NavBar.vue'
import GlobalError from '../components/GlobalError.vue'
import ForbiddenError from '../components/ForbiddenError.vue'
import { useGlobalError } from '@/use/globalErr'
import { useForbiddenError } from '@/use/forbiddenErr'
import { RouterLink } from 'vue-router'

const globErr = useGlobalError()
const forbiddenErr = useForbiddenError()
</script>
