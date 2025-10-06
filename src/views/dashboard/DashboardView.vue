<template>
  <div class="grid grid-cols-8 gap-4 h-screen">
    <NavBar class="col-span-1 mt-8" />
    <div class="col-span-5">
      <div id="page-header">
        <PageHeader :title="route.meta.title" />
      </div>
      <router-view />
    </div>
  </div>
</template>

<script setup>
import PageHeader from '@/components/PageHeader.vue'
import NavBar from './internal/NavBar.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>
