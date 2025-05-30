<template>
  <SiteHeader />
  <div :style="{ marginLeft: 'var(--size-gutter)' }">
    <PageHeader :title="route.meta.title" />
  </div>
  <div id="main">
    <NavBar />
    <div id="content">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import PageHeader from '@/components/PageHeader.vue'
import SiteHeader from '@/components/SiteHeader.vue'
import NavBar from './internal/NavBar.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<style scoped>
#main {
  display: flex;
  flex-direction: row;

  margin-left: var(--size-gutter);
}

#sidebar {
  width: 300px;
  min-height: 100vh;
  margin-right: 32px;

  padding: 16px;
}

#content {
  padding-left: 64px;
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
