<template>
  <div class="flex flex-row min-h-screen">
    <NavBar class="w-xs border-r-1 border-stone-200 bg-surface-container" />
    <div class="p-4 flex flex-1 justify-center bg-surface ">
      <router-view class="max-w-2xl" v-slot="{ Component }">
        <Transition mode="out-in">
          <component :is="Component" />
        </Transition>
      </router-view>
    </div>
  </div>
</template>

<script setup>
import NavBar from './internal/NavBar.vue'
</script>
