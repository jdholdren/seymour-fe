<template>
  <div id="main">
    <div id="sidebar">
      <p id="logo">Seymour</p>
      <NavBar />
    </div>
    <div id="content">
      <PageHeader :title="route.meta.title" />
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
  display: flex;
  flex-direction: row;
}

#sidebar {
  width: 300px;
  min-height: 100vh;
  margin-right: 32px;

  padding: 16px;
  background-color: var(--c-green);
}

#logo {
  padding-left: 16px;
  line-height: 6rem;

  font-size: 2.3rem;
  font-weight: 800;
}

#content {
  width: 1024px;
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
