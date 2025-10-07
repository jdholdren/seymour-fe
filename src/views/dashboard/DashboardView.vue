<template>
  <div class="flex flex-row min-h-screen">
    <NavBar class="w-xs border-r-1 border-stone-200 bg-surface-container" />
    <router-view class="flex-auto p-4" />
  </div>
</template>

<script setup>
import NavBar from './internal/NavBar.vue'
</script>
