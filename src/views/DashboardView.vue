<template>
  <div class="relative grid grid-cols-[1fr_42rem_1fr] min-h-screen bg-surface">
    <NavBar class="sticky top-0 h-screen w-xs justify-self-end p-4" />
    <div class="p-4 px-8 w-full">
      <router-view class="w-full" v-slot="{ Component }">
        <Transition mode="out-in">
          <component :is="Component" />
        </Transition>
      </router-view>
    </div>
    <Transition>
      <GlobalError v-if="globErr" />
    </Transition>
    <Transition>
      <ForbiddenError v-if="forbiddenErr" />
    </Transition>
  </div>
</template>

<script setup>
import NavBar from './internal/NavBar.vue'
import GlobalError from '../components/GlobalError.vue'
import ForbiddenError from '../components/ForbiddenError.vue'
import { useGlobalError } from '@/use/globalErr'
import { useForbiddenError } from '@/use/forbiddenErr'

const globErr = useGlobalError()
const forbiddenErr = useForbiddenError()
</script>
