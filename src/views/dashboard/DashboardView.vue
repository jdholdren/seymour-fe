<template>
  <div id="main">
    <div id="sidebar">
      <p id="logo">Seymour</p>
      <NavBar />
    </div>
    <div id="content">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import NavBar from './internal/NavBar.vue';
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
  background-color: rgba(1, 1, 1, 0.3);
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
</style>
