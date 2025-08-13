<template>
  <div id="main">
    <div id="nav">
      <NavBar />
    </div>
    <div id="content">
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

<style scoped>
#main {
  display: grid;
  grid-template-columns: repeat(16, 64px);
  grid-auto-rows: auto;
  grid-column-gap: 16px;
  max-width: 1000px;
}

#page-header {
  grid-column: 1 / -1;
}

#nav {
  padding-top: 16px;
  grid-row: 2 / 3;
  grid-column: 1 / 3;
}

#content {
  grid-row: 2 / 3;
  grid-column: 5 / -1;
  display: grid;
  grid-template-columns: subgrid;
}

@media (prefers-color-scheme: dark) {
  #sidebar {
    background-color: var(--color-background-soft);
  }

  #logo {
    color: var(--c-green);
  }
}
</style>
