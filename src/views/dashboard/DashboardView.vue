<template>
  <div class="flex flex-row min-h-screen">
    <NavBar class="w-xs border-r-1 border-stone-200 bg-surface-container" />
    <div class="p-4 flex flex-1 justify-center bg-surface ">
      <Transition name="slide-fade">
        <router-view class="max-w-2xl" />
      </Transition>
    </div>
  </div>
</template>

<script setup>
import NavBar from './internal/NavBar.vue'
</script>
