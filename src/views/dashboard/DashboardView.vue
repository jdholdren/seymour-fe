<template>
  <SiteHeader />
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
import SiteHeader from '@/components/SiteHeader.vue'
import PageHeader from '@/components/PageHeader.vue'
import NavBar from './internal/NavBar.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<style scoped>
#main {
  display: grid;
  grid-template-columns: min-content 1fr 1fr;
  margin-left: var(--size-gutter);
  margin-right: var(--size-gutter);
  grid-auto-rows: auto;
  grid-column-gap: 64px;
  max-width: 1000px;
}

#page-header {
  grid-row: 1 / 1;
  grid-column: 2 / 4;
}

#nav {
  padding-top: 16px;
  grid-row: 2 / 3;
  grid-column: 1 / 2;
}

#content {
  grid-row: 2 / 3;
  grid-column: 2 / 4;
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
